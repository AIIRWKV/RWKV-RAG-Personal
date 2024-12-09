#coding=utf-8
"""
异步任务
"""
import json
import os
import requests
import atexit
from datetime import date
from src.diversefile import Loader
from configuration import config as project_config, MESSAGE_QUEUE, SERVER_PORT

knowledge_base_path = project_config.config.get('knowledge_base_path')
default_knowledge_base_dir = os.path.join(knowledge_base_path, "knowledge_data") # 默认联网知识的存储位置


API_HOST = f"http://127.0.0.1:{SERVER_PORT}"
MESSAGE_QUEUE_JSON_FILE_NAME = 'message_queue.json'

CURRENT_DO_LOADER_INFO = {}  # 记录当前正在加载的文档处理进度信息，程序退出后，这个信息需要本地持久化


def _req_llm_server_get_embeddings(texts):
    api = f'{API_HOST}/api/llm/get_embeddings'
    resp = requests.post(api, json={"text": texts}, headers={'Content-Type': 'application/json'})
    data = resp.json().get('data', [])
    return data


def _req_index_server_index_texts(texts, embeddings, name, file_path):
    api = f'{API_HOST}/api/index/add'
    resp = requests.post(api, json={"text": texts, 'embeddings': embeddings, 'name': name, 'file_path': file_path},
                         headers={'Content-Type': 'application/json'})
    return resp.json().get('code', '200')

def _req_filestatus_update_status(file_path, name, status):
    api = f'{API_HOST}/api/filestatus/update'
    requests.post(api, json={"file_path": file_path, 'name': name, 'status': status},
                         headers={'Content-Type': 'application/json'})



def custom_do_loader(loader: Loader, name: str, file_path: str, start_idx:int=-1):
    global CURRENT_DO_LOADER_INFO
    CURRENT_DO_LOADER_INFO = {'loader': loader.all_properties(), 'name': name, 'file_path': file_path}
    date_str = date.today().strftime("%Y%m%d")
    output_dir = os.path.join(default_knowledge_base_dir, date_str)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    _req_filestatus_update_status(file_path, name, 'processing')
    chunks = loader.load_and_split_file(output_dir)
    success_num = 0
    failed_num = 0
    for idx, chunk in enumerate(chunks):
        if idx < start_idx:
            continue
        #loader.current_idx = idx
        CURRENT_DO_LOADER_INFO['loader']['current_idx'] = idx
        try:
            embeddings = _req_llm_server_get_embeddings(chunk)
        except Exception as e:
            failed_num += 1
            continue
        try:
            _req_index_server_index_texts(chunk, embeddings, name, file_path)
            success_num += 1
        except Exception as e:
            failed_num += 1
    CURRENT_DO_LOADER_INFO = {}
    # # 记录文件入库状态
    if failed_num > 1.5 * success_num:
        _req_filestatus_update_status(file_path, name, 'failed')
    else:
        _req_filestatus_update_status(file_path, name, 'processed')


def custom_server():
    """
    消费者:异步消费消息队列内容，主要是文档chunking
    :return:
    """
    while 1:
        try:
            item = MESSAGE_QUEUE.get()
            loader , name, file_path = item
            print(loader, name, file_path)
            if isinstance(loader, Loader):
                custom_do_loader(loader, name, file_path)
        except:
            pass


def save_message_dequeues():
    """
    持久化消息队列
    :return:
    """
    data = []
    if CURRENT_DO_LOADER_INFO: # 当前正在处理的文档
        data.append(CURRENT_DO_LOADER_INFO)
    while 1:
        if MESSAGE_QUEUE.empty():
            break
        item = MESSAGE_QUEUE.get(timeout=2)
        loader, name, file_path = item
        if isinstance(loader, Loader):
            tmp = {'loader': loader.all_properties(), 'name': name, 'file_path': file_path}
            data.append(tmp)
    with open(MESSAGE_QUEUE_JSON_FILE_NAME, 'w') as wf:
        json.dump(data, wf)



def load_message_dequeues():
    """
    加载消息队列
    :return:
    """
    if not os.path.exists(MESSAGE_QUEUE_JSON_FILE_NAME):
        return
    with open(MESSAGE_QUEUE_JSON_FILE_NAME, 'r') as rf:
        try:
            data = json.load(rf)
        except:
            return
        for item in data:
            try:
                loader_params = item['loader']
                name = item['name']
                file_path = item['file_path']
                loader = Loader(file_path=loader_params['file_path'], chunk_size=loader_params['chunk_size'],
                                filename=loader_params['filename'])
                loader.current_idx = loader_params['current_idx']
                loader.output_path = loader_params['output_path']
                MESSAGE_QUEUE.put((loader, name, file_path))
            except:
                continue
    try:
        os.remove(MESSAGE_QUEUE_JSON_FILE_NAME)
    except:
        pass



def on_exit():
    """
    关闭服务时需要执行的任务
    :return:
    """
    save_message_dequeues()


atexit.register(on_exit)