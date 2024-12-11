#coding=utf-8
"""
异步任务
"""
import gc
import json
import os
import atexit
import time
from datetime import date
from typing import Union, List

import requests
import chromadb
from chromadb import Collection

from src.diversefile import Loader
from src.utils.sqlitedb import SqliteDB
from src.utils.tools import calculate_string_md5
from configuration import config as project_config, SERVER_PORT, AsyncTaskType, SQLITE_DB_PATH

knowledge_base_path = project_config.config.get('knowledge_base_path')
default_knowledge_base_dir = os.path.join(knowledge_base_path, "knowledge_data") # 默认联网知识的存储位置
vectordb_port = project_config.config.get("vectordb_port")


API_HOST = f"http://127.0.0.1:{SERVER_PORT}"
_sqlite_db_path = os.path.join(project_config.config.get('knowledge_base_path',), 'files_services.db')

WAITING_ASYNC_TASK_QUEUE = []


class RWKVRAGClient:

    @staticmethod
    def get_embedding(texts: Union[str, List[str]]):
        api = f'{API_HOST}/api/llm/get_embeddings'
        try:
            resp = requests.post(api, json={"text": texts}, headers={'Content-Type': 'application/json'}).json()
            return resp.get('data', [])
        except:
            return []

    @staticmethod
    def get_message_queue():
        """
        获取消息队列的值
        :return:
        """
        api = f'{API_HOST}/api/message_queue/get'
        resp = requests.get(api).json()
        return resp.get('data', [])

    @staticmethod
    def update_current_loader(base_info: list):
        """
        更新当前处理文件的进度
        :param base_info:
        :param progress:
        :return:
        """
        api = f'{API_HOST}/api/current_loader/update'
        resp = requests.post(api, json={'data': base_info},
                             headers={'Content-Type': 'application/json'}).json()
        return resp

class FileStatusManager:
    @staticmethod
    def update_filestatus(name: str, file_path: str, status: str):
        with SqliteDB(SQLITE_DB_PATH) as db:
            db.execute(
                f"update file_status set status = ?,last_updated = datetime('now', 'localtime') where collection_name = ? "
                f"and file_path = ?", (status, name, file_path))
            return db.rowcount

    @staticmethod
    def delete_filestatus(name: str, file_path: str):
        with SqliteDB(SQLITE_DB_PATH) as db:
            db.execute(f"delete from file_status where collection_name = ? and file_path = ?", (name, file_path))
            return db.rowcount


class IndexManager:
    client = None

    @classmethod
    def get_client(cls):
        if cls.client is None:
            try:
                _client = chromadb.HttpClient(host='127.0.0.1', port=vectordb_port)
                cls.client = _client
            except Exception as e:
                raise ValueError('连接Chroma服务失败')
        else:
            _client = cls.client
        return _client

    @classmethod
    def get_collection(cls, name:str):
        client = cls.get_client()
        try:
            collection = client.get_collection(name)
        except:
            raise ValueError(f'知识库{name}不存在')
        return collection

    @classmethod
    def add_texts(cls, collection: Collection,
                  texts: List[str],
                  embeddings: Union[List[List[float]]],
                  file_path: str):
        keys = [calculate_string_md5(value) for value in texts]
        new_embeddings = embeddings   #[eb for eb in embeddings] # TODO 这一步是多余的吗
        if file_path:
            metadatas = [{'source': file_path} for _ in texts]
        else:
            metadatas = None

        collection.add(
            ids=keys,
            embeddings=new_embeddings,
            documents=texts,
            metadatas=metadatas
        )
        # index the value
        return True

    @classmethod
    def delete_texts(cls, name: str, file_path: str):
        collection = cls.get_collection(name)
        collection.delete(where={'source': file_path})


def custom_do_loader(task:list):
    """
    文件知识入库
    :param name: 知识库名称
    :param file_path: 原始文件路径
    :param chunk_size: 块大小
    :param file_name: 处理后的文件名称
    :param start_idx:
    :return:
    """
    task_type, name, file_path, chunk_size, file_name, start_idx = task
    try:
        loader = Loader(file_path=file_path, chunk_size=chunk_size, filename=file_name)
    except:
        return False
    date_str = date.today().strftime("%Y%m%d")
    output_dir = os.path.join(default_knowledge_base_dir, date_str)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    FileStatusManager.update_filestatus(name, file_path, 'processing')
    chunks = loader.load_and_split_file(output_dir)
    success_num = 0
    failed_num = 0

    current_chunk_list = []
    count = 0
    batch_size = 20
    try:
        index_collection = IndexManager.get_collection(name)
    except Exception as e:
        FileStatusManager.update_filestatus(name, file_path, 'failed')
        return False
    idx = -1
    for chunk in chunks:
        idx += 1
        if idx < start_idx:
            continue
    print(idx)
    del chunks
    del loader
    gc.collect()
    #
    #     count += 1
    #     current_chunk_list.append(chunk)
    #     # 一次处理20个
    #     time.sleep(2)
    #     if count % batch_size == 0:
            # try:
            #     embeddings = RWKVRAGClient.get_embedding(current_chunk_list)
            # except:
            #     failed_num += batch_size
            #     continue
            # try:
            #     IndexManager.add_texts(index_collection,current_chunk_list,embeddings, file_path)
            #     success_num += batch_size
            # except Exception as e:
            #     failed_num += batch_size
            # current_chunk_list = []
            # task[-1] += batch_size
    #
    # if current_chunk_list:
    #     try:
    #         embeddings = RWKVRAGClient.get_embedding(current_chunk_list)
    #         IndexManager.add_texts(index_collection, current_chunk_list, embeddings, file_path)
    #         success_num += len(current_chunk_list)
    #     except:
    #         failed_num += len(current_chunk_list)
    #     task[-1] += len(current_chunk_list)
    #
    # # # 记录文件入库状态
    # if failed_num > 1.5 * success_num:
    #     FileStatusManager.update_filestatus(name, file_path, 'failed')
    # else:
    #     FileStatusManager.update_filestatus(name, file_path, 'processed')
    del current_chunk_list

def custom_delete_data_by_file_path(name: str, file_path: str):
    """
    根据文件删除知识库
    :param name:
    :param file_path:
    :return:
    """
    # 删除向量数据库里的数据
    try:
        IndexManager.delete_texts(name, file_path)
        FileStatusManager.delete_filestatus(name, file_path)
    except:
        # 删除失败
        FileStatusManager.update_filestatus(name, file_path, 'delete_failed')


def custom_server():
    """
    :return:
    """
    global WAITING_ASYNC_TASK_QUEUE
    print('rrrrrrrr   ', WAITING_ASYNC_TASK_QUEUE)
    while 1:
        try:
            tasks = RWKVRAGClient.get_message_queue()
            WAITING_ASYNC_TASK_QUEUE.extend(tasks)
            print('tttttttttt  ', WAITING_ASYNC_TASK_QUEUE)
            for i in range(len(WAITING_ASYNC_TASK_QUEUE)):
                task = WAITING_ASYNC_TASK_QUEUE[i]
                #task_type, name, file_path, chunk_size, file_name, idx = task
                task_type = task[0]
                if task_type == AsyncTaskType.LOADER_DATA_BY_FILE.value:
                    custom_do_loader(task)
                elif task_type == AsyncTaskType.DELETE_DATA_BY_FILE.value:
                    name = task[1]
                    file_path = task[2]
                    custom_delete_data_by_file_path(name,file_path)
                WAITING_ASYNC_TASK_QUEUE[i] = None
            WAITING_ASYNC_TASK_QUEUE = []
        except:
            pass
        time.sleep(3000)


def save_message_dequeues():
    """
    持久化消息队列
    :return:
    """
    global WAITING_ASYNC_TASK_QUEUE
    data = []
    for item in WAITING_ASYNC_TASK_QUEUE:
        if item is None:
            continue
        data.append(item)
    with open('cache/message_queue0.json', 'w') as f:
        json.dump(data, f, ensure_ascii=False)




def load_message_dequeues():
    """
    加载消息队列
    :return:
    """
    global WAITING_ASYNC_TASK_QUEUE
    print('xxxxxxx   ', WAITING_ASYNC_TASK_QUEUE)
    all_data = []
    if os.path.exists('cache/message_queue0.json'):
        with open('cache/message_queue0.json', 'r') as rf:
            try:
                data = json.load(rf)
            except:
                return
            if isinstance(data, list):
                all_data.extend(data)
        os.remove('cache/message_queue0.json')
    if os.path.exists('cache/message_queue.json'):
        with open('cache/message_queue.json', 'r') as rf:
            try:
                data = json.load(rf)
            except:
                return
            if isinstance(data, list):
                all_data.extend(data)
        os.remove('cache/message_queue.json')

    WAITING_ASYNC_TASK_QUEUE.extend(all_data)
    print('yyyyyy   ', WAITING_ASYNC_TASK_QUEUE)






atexit.register(save_message_dequeues)

if __name__ == "__main__":
    #custom_server()

   # bgem3 = BGEM3FlagModel('/home/liulonghua/RWKV-RAG-models/bge-m31', use_fp16=True)
    #a = bgem3.encode(['2222', '4444'], max_length=512)['dense_vecs']
   # print(type(a))
    load_message_dequeues()
    custom_server()