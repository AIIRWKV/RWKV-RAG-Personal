#coding=utf-8
"""
异步任务
"""
import copy
import sys
import json
import os
import atexit
import time
from datetime import date, datetime
from typing import Union, List, Tuple
from multiprocessing import Process

import requests
from pybloom_live import BloomFilter

from src.utils.sqlitedb import SqliteDB
from src.utils.tools import get_random_string
from configuration import (
    config as project_config,
    SERVER_PORT, AsyncTaskType,
    SQLITE_DB_PATH)
from src.services.index_service import ServiceWorker as IndexServiceWorker
from src.utils.tools import calculate_string_md5


local_project_config = copy.deepcopy(project_config.config)
local_project_config['just_need_client'] =  True

knowledge_base_path = local_project_config.get('knowledge_base_path')
default_knowledge_base_dir = os.path.join(knowledge_base_path, "knowledge_data") # 默认分块后存储数据的位置
default_log_base_dir = os.path.join(knowledge_base_path, 'logs') # 默认分割数据时日志存储位置
index_client_worker = IndexServiceWorker(local_project_config)


API_HOST = f"http://127.0.0.1:{SERVER_PORT}"
_sqlite_db_path = os.path.join(local_project_config.get('knowledge_base_path',), 'files_services.db')

WAITING_ASYNC_TASK_QUEUE = []
NOW_LOADER_DATA = None  # 当前正在切片的文件信息


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
        try:
            api = f'{API_HOST}/api/message_queue/get'
            resp = requests.get(api).json()
        except:
            return False, []
        return True, resp.get('data', [])

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

    @staticmethod
    def check_main_process_running():
        """
        检查主进程任务是否ok
        :return:
        """
        api = f'{API_HOST}/api/ok'
        try:
            requests.get(api)
        except:
            return False
        return True

class FileStatusManager:
    @staticmethod
    def update_filestatus(name: str, file_path: str, fields: dict):
        fields_sql = []
        fields_params = []
        for k, v in fields.items():
            fields_sql.append(f"{k} = ?")
            fields_params.append(v)
        sql = (f"update file_status set {','.join(fields_sql)} ,last_updated = datetime('now', 'localtime') "
               f"where collection_name = ? and file_path = ?")
        with SqliteDB(SQLITE_DB_PATH) as db:
           db.execute(sql, (*fields_params, name, file_path))

    @staticmethod
    def delete_filestatus(name: str, file_path: str):
        with SqliteDB(SQLITE_DB_PATH) as db:
            db.execute(f"delete from file_status where collection_name = ? and file_path = ?", (name, file_path))
            return db.rowcount

    @staticmethod
    def get_file_status(name: str, file_path: str):
        with SqliteDB(SQLITE_DB_PATH) as db:
            db.execute(f"select status from file_status where collection_name = ? "
                       f"and file_path = ?", (name, file_path))
            result = db.fetchone()
            if result:
                return 1, result[0]
            else:
                return 0, None

    @staticmethod
    def get_chunk_info(name: str, file_path: str):
        """
        获取分片数据基本信息
        :param name:
        :param file_path:
        :return:
        """
        with SqliteDB(SQLITE_DB_PATH) as db:
            db.execute(f"select chunked_file_path,chunked_log_file_path from file_status where collection_name = ? "
                       f"and file_path = ?", (name, file_path))
            result = db.fetchone()
            if result:
                return 1, {'chunked_file_path': result[0], 'chunked_log_file_path': result[1]}
            else:
                return 0, {}



class IndexManager:

    @classmethod
    def add_texts(cls, name: str,
                  texts: List[Tuple[str, str]],
                  embeddings: Union[List[List[float]]],
                  file_path: str
                  ):
        """

        :param name: 数据集名称
        :param texts: 文本[(id1, txt1), (id2, text2)]
        :param embeddings: 嵌入向量
        :param file_path: 文件的路径
        :return:
        """
        keys = [value[0] for value in texts]
        new_texts = [value[1] for value in texts]
        new_embeddings = embeddings   #[eb for eb in embeddings] # TODO 这一步是多余的吗
        cmd = {"keys": keys,
               "texts": new_texts,
               "embeddings": new_embeddings,
               'collection_name': name,
               'file_path': file_path
               }
        index_client_worker.index_texts(cmd)
        return True

    @classmethod
    def delete_texts(cls, name: str,
                     keys: List[str] = None,
                     file_path: str = None
                     ):
        cmd = {
            "keys": keys,
            "collection_name": name,
            "metadatas": {"source": file_path}

        }
        index_client_worker.delete(cmd)
        return True

def record_loader_info(name, file_path, output_file_path, log_file_path):
    """
    记录入库状态
    :param name:
    :param file_path:
    :param output_file_path:
    :param log_file_path:
    :return:
    """
    # 对output_file_path进行去重，保证数据的唯一性和准确性
    total = 0
    new_output_file_path = output_file_path + '.done'
    with open(output_file_path, 'r', encoding='utf-8') as rf, open(new_output_file_path, 'w', encoding='utf-8') as wf:
        bf = BloomFilter(capacity=20000000, error_rate=0.0001)
        for line in rf:
            try:
                obj = json.loads(line)
                key = obj['key']
                if key not in bf:
                    wf.write(line)
                    bf.add(key)
                    total += 1
            except:
                continue

    if total == 0:
        FileStatusManager.update_filestatus(name, file_path, {'status': 'failed',
                                                              'chunk_num': total,
                                                              'chunked_file_path': new_output_file_path,
                                                              'chunked_log_file_path': log_file_path
                                                              })
    else:
        FileStatusManager.update_filestatus(name, file_path, {'status': 'processed',
                                                              'chunk_num': total,
                                                              'chunked_file_path': new_output_file_path,
                                                              'chunked_log_file_path': log_file_path
                                                              })
    os.remove(output_file_path)

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
    from src.diversefile import Loader
    global NOW_LOADER_DATA
    task_type, name, file_path, chunk_size, file_name, start_idx, output_dir, log_file_path = task

    date_str = date.today().strftime("%Y%m%d")
    if not output_dir:
        output_dir = os.path.join(default_knowledge_base_dir, date_str)
        task[6] = output_dir

    log_output_dir = os.path.join(default_log_base_dir, date_str)
    if not log_file_path:
        log_file_path = os.path.join(log_output_dir, f'{get_random_string(10)}.log')
        task[7] = log_file_path



    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    if not os.path.exists(log_output_dir):
        os.makedirs(log_output_dir)
    code, current_status = FileStatusManager.get_file_status(name, file_path)
    if code == 0:
        return
    if current_status == 'cancel':
        return

    with open(log_file_path, 'a', encoding='utf-8') as wf:
        wf.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  开始处理文件：{file_path}\n")
        FileStatusManager.update_filestatus(name, file_path, {'status': 'processing'})
        wf.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  检查向量数据库{name}集合是否存在\n")
        try:

            wf.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  向量数据库{name}集合存在， 任务继续\n")
        except Exception as e:
            FileStatusManager.update_filestatus(name, file_path, {'status': 'failed'})
            wf.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  向量数据库{name}集合不存在， 任务终止\n")
            return False
        try:
            loader = Loader(file_path=file_path, chunk_size=chunk_size, wf=wf, filename=file_name)
        except:
            FileStatusManager.update_filestatus(name, file_path, {'status': 'failed'})
            return False

        chunks = loader.load_and_split_file(output_dir)

        current_chunk_list :List[str] = []
        count = 0
        batch_size = 20

        output_file_path = loader.output_path
        if not output_file_path:
            base_filename, file_ext = os.path.splitext(os.path.basename(file_path))
            if file_name:
                base_filename = file_name
            output_file_path = os.path.join(output_dir, f"{base_filename}_chunked.jsonl")
        NOW_LOADER_DATA = (name, file_name, output_file_path, log_file_path)
        with open(output_file_path, 'a', encoding='utf-8') as chunk_wf:

            for idx, chunk in enumerate(chunks):
                if idx < start_idx:
                    continue
                count += 1
                current_chunk_list.append(chunk)
                # 一次处理20个
                if count % batch_size == 0:
                    wf.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  获取{batch_size}个块数据块\n")
                    try:
                        embeddings = RWKVRAGClient.get_embedding(current_chunk_list)
                        wf.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  Embedding chunks successfully\n")
                    except:
                        wf.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  Embedding chunks failed\n")
                        continue
                    try:
                        new_current_chunk_list = [(calculate_string_md5(line), line) for line in current_chunk_list]
                        IndexManager.add_texts(name, new_current_chunk_list, embeddings, file_path)
                        wf.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  Indexing chunks successfully\n")
                        for key, line in new_current_chunk_list:
                            json_data = json.dumps({'key': key, 'text': line}, ensure_ascii=False)
                            chunk_wf.write(json_data + '\n')

                    except Exception as e:
                        wf.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  Indexing chunks failed\n")
                    current_chunk_list = []
                    task[5] += batch_size

            if current_chunk_list:
                try:
                    embeddings = RWKVRAGClient.get_embedding(current_chunk_list)
                    wf.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  Embedding chunks successfully\n")
                    new_current_chunk_list = [(calculate_string_md5(line), line) for line in current_chunk_list]
                    IndexManager.add_texts(name, new_current_chunk_list, embeddings, file_path)
                    wf.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  Indexing chunks successfully\n")
                    for key, line in new_current_chunk_list:
                        json_data = json.dumps({'key': key, 'text': line}, ensure_ascii=False)
                        chunk_wf.write(json_data + '\n')
                except:
                    pass
                task[5] += len(current_chunk_list)

    # 记录文件入库状态
    record_loader_info(name, file_path, output_file_path, log_file_path)
    NOW_LOADER_DATA = None

def custom_delete_data_by_file_path(name: str, file_path: str, delete_filestatus: bool = True):
    """
    根据文件删除知识库
    :param delete_filestatus:
    :param name:
    :param file_path:
    :return:
    """
    # 删除向量数据库里的数据
    is_delete_ok = False
    try:
        IndexManager.delete_texts(name, file_path=file_path)
        if delete_filestatus: # 当是重新入库的时候，只需删除向量数据库里数据，无需删除文件状态信息
            FileStatusManager.delete_filestatus(name, file_path)
        is_delete_ok = True
    except:
        if delete_filestatus:
            # 删除失败
            FileStatusManager.update_filestatus(name, file_path, {'status': 'delete_failed'})
        else:
            FileStatusManager.update_filestatus(name, file_path, {'status': 'failed'})

    if is_delete_ok:

        # 删除切片文件路径和日志路径
        _, chunk_file_info = FileStatusManager.get_chunk_info(name, file_path)
        if chunk_file_info:
            chunked_file_path = chunk_file_info['chunked_file_path']
            if chunked_file_path and os.path.exists(chunked_file_path):
                os.remove(chunked_file_path)
            chunked_log_file_path = chunk_file_info['chunked_log_file_path']
            if chunked_log_file_path and os.path.exists(chunked_log_file_path):
                os.remove(chunked_log_file_path)

        # 更新块相关数据
        FileStatusManager.update_filestatus(name, file_path,
                                            {'chunked_file_path': '',
                                                    'chunked_log_file_path': '',
                                                    'chunk_num': 0}
                                            )

def custom_server():
    """
    :return:
    """
    global WAITING_ASYNC_TASK_QUEUE
    continuous_null_times = 0
    continuous_not_runnig_times = 0
    while 1:
        is_running, tasks = RWKVRAGClient.get_message_queue()
        if is_running:
            continuous_not_runnig_times = 0
        else:
            continuous_not_runnig_times += 1
        if continuous_not_runnig_times > 2:
            print('Main process is not running, exit ')
            # 多进程/线程中终止
            sys.exit(1)
            return

        if not tasks:
            continuous_null_times += 1
        else:
            continuous_null_times = 0
        try:
            WAITING_ASYNC_TASK_QUEUE.extend(tasks)
            for i in range(len(WAITING_ASYNC_TASK_QUEUE)):
                task = WAITING_ASYNC_TASK_QUEUE[i]
                #task_type, name, file_path, chunk_size, file_name, idx, output_dir, log_file_path = task
                task_type = task[0]
                if task_type == AsyncTaskType.LOADER_DATA_BY_FILE.value:
                     # 这里用多进程的原因是处理文件时会加载各自第三方包，而有的包的会非常占用内存，但是任务处理完后，又不释放包的内存，
                     # 所以想到用多进程，处理完后，释放内存，避免出现有些包用的次数不多，但是用一次后又会长期占用内存的情况
                     p = Process(target=custom_do_loader, args=(task,))
                     p.start()
                     p.join()
                elif task_type == AsyncTaskType.DELETE_DATA_BY_FILE.value:
                    name = task[1]
                    file_path = task[2]
                    p = Process(target=custom_delete_data_by_file_path, args=(name,file_path, True))
                    p.start()
                    p.join()
                elif task_type == AsyncTaskType.DELETE_DATA_BY_FILE_FROM_VB.value:
                    name = task[1]
                    file_path = task[2]
                    p = Process(target=custom_delete_data_by_file_path, args=(name,file_path, False))
                    p.start()
                    p.join()

                WAITING_ASYNC_TASK_QUEUE[i] = None
            WAITING_ASYNC_TASK_QUEUE = []
        except:
            pass
        if continuous_null_times < 3:
            time.sleep(10)
        elif continuous_null_times >= 300:
            time.sleep(60)
        else:
            time.sleep(10 + int(continuous_null_times // 25 * 5))

def save_message_dequeues():
    """
    持久化消息队列
    :return:
    """
    global WAITING_ASYNC_TASK_QUEUE
    global NOW_LOADER_DATA
    data = []
    for item in WAITING_ASYNC_TASK_QUEUE:
        if item is None:
            continue
        data.append(item)
    if data:
        with open('cache/message_queue0.json', 'w',  encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False)

    if NOW_LOADER_DATA and isinstance(NOW_LOADER_DATA, list) and len(NOW_LOADER_DATA) > 3:
        record_loader_info(NOW_LOADER_DATA[0], NOW_LOADER_DATA[1], NOW_LOADER_DATA[2], NOW_LOADER_DATA[3])



def load_message_dequeues():
    """
    加载消息队列
    :return:
    """
    global WAITING_ASYNC_TASK_QUEUE
    all_data = []
    if os.path.exists('cache/message_queue0.json'):
        with open('cache/message_queue0.json', 'r', encoding='utf-8') as rf:
            try:
                data = json.load(rf)
                if isinstance(data, list):
                    all_data.extend(data)
            except Exception as e:
                print('解析cache/message_queue0.json 失败：' + str(e))
        os.remove('cache/message_queue0.json')
    if os.path.exists('cache/message_queue.json'):
        with open('cache/message_queue.json', 'r', encoding='utf-8') as rf:
            try:
                data = json.load(rf)
                if isinstance(data, list):
                    all_data.extend(data)
            except Exception as e:
                print('解析cache/message_queue.json 失败：' + str(e))
        os.remove('cache/message_queue.json')
    WAITING_ASYNC_TASK_QUEUE.extend(all_data)



atexit.register(save_message_dequeues)

if __name__ == "__main__":
    is_running = False
    for i in range(10):
        is_running = RWKVRAGClient.check_main_process_running()
        if is_running:
            break
        time.sleep(10)
    if not is_running:
        print("Main process is not running, exit")
        sys.exit(1)
    load_message_dequeues()
    custom_server()