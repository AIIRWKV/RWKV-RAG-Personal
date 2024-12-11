# coding=utf-8
"""
Windows  Linux都支持
"""
import os
import subprocess
import sys
from abc import ABC
from datetime import datetime
from typing import List

import psutil

from configuration import config as project_config
from configuration import OS_NAME
from src.vectordb import RECALL_NUMBER
from src.vectordb import AbstractVectorDBManager
from src.utils.tools import calculate_string_md5
from .errors import VectorDBCollectionNotExistError, VectorDBError


class ChromaDBManager(AbstractVectorDBManager, ABC):

    def client(self):
        import chromadb
        if self._client is None:
            try:
                self._client = chromadb.HttpClient(host=self.db_host,
                                            port=self.db_port)
                return self._client
            except Exception as e:
                raise VectorDBError('连接Chroma服务失败')
        return self._client
    def run(self):
        python_pids = [] # python进程
        for proc in psutil.process_iter(['pid', 'name']):
            process_name = proc.info['name'].lower()
            if 'chroma' == process_name or 'chroma.exe' == process_name:
                return True
            # 如果是/a/bc/python3 /a/bc/bin/chroma run 这种启动命令的话，通过下面方式检测
            if process_name == 'python' or process_name == 'python.exe':
                python_pids.append(proc.info['pid'])
        for pid in python_pids:
            try:
                _process = psutil.Process(pid)
                _cmd = _process.cmdline()
                if len(_cmd) > 2 and _cmd[1].lower().endswith(('chroma', 'chroma.exe')):\
                    return True
            except psutil.NoSuchProcess:
                pass
        print(f"Start chroma db")
        # spawn a process "chroma run --path chroma_path --port chroma_port --host chroma_host"
        #是否使用自己集成的python环境，而不是操作系统环境变量自带的Python环境，默认不使用
        if 'RWKV_RAG_USE_CUSTOM_PYTHON_ENV' in os.environ:
            use_custom_python_env = os.environ.get('RWKV_RAG_USE_CUSTOM_PYTHON_ENV', '0')
        elif 'rwkv_rag_use_custom_python_env' in project_config.config:
            use_custom_python_env = project_config.config['rwkv_rag_use_custom_python_env']
        else:
            use_custom_python_env = '0'
        if use_custom_python_env == 1 or use_custom_python_env == '1':
            py_exc = sys.executable
            py_base_path = sys.exec_prefix
            if OS_NAME == 'linux':
                chroma_exc = os.path.join(py_base_path, 'bin', 'chroma')
            elif OS_NAME == 'windows':
                chroma_exc = os.path.join(py_base_path, 'Scripts', 'chroma.exe')
            else:
                raise NotImplementedError(f"chroma not installed")
            command = f"{py_exc} {chroma_exc} run --path {self.db_path} --port {self.db_port} --host {self.db_host}"
        else:
            command = f"chroma run --path {self.db_path} --port {self.db_port} --host {self.db_host}"
        process = subprocess.Popen(command, shell=True)
        print(f"Started indexing service with command {command}, pid is {process.pid}")

    def has_collection(self, collection_name: str) -> bool:
        chroma_client = self.client()
        try:
            collection = chroma_client.get_collection(collection_name)
        except:
            return False
        if collection:
            return True
        return False

    def show_collections(self, page: int=None, page_size: int=None):
        chroma_client = self.client()
        offset = (page - 1) * page_size if page is not None and page_size is not None else None
        collections = chroma_client.list_collections(page_size, offset)
        return [(i.name, i.metadata) for i in collections] if collections else []

    def create_collection(self, collection_name: str):
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        client = self.client()
        client.get_or_create_collection(collection_name,
                                        metadata={"hnsw:space": "cosine",
                                            "create_time": now})
        return True

    def delete_collection(self, collection_name: str):

        client = self.client()
        try:
            client.delete_collection(collection_name)
        except:
            raise VectorDBCollectionNotExistError()
        return True

    def add(self, kwargs:dict):
        keys = kwargs.get("keys")
        values = kwargs["texts"]
        collection_name = kwargs.get('collection_name')
        embeddings = kwargs.get('embeddings')
        file_path = kwargs.get('file_path')

        if keys is None or isinstance(keys, list) is False or len(keys) != len(values):
            keys = [calculate_string_md5(value) for value in values]
        client = self.client()
        new_embeddings = [eb for eb in embeddings] # TODO 这一步是多余的吗
        if file_path:
            metadatas = [{'source': file_path} for _ in values]
        else:
            metadatas = None
        try:
            collection = client.get_collection(collection_name)
        except:
            raise VectorDBCollectionNotExistError()
        collection.add(
            ids=keys,
            embeddings=new_embeddings,
            documents=values,
            metadatas=metadatas
        )
        # index the value
        return True

    def delete(self, keys: List[str], collection_name: str):
        if not keys:
            return True
        client = self.client()
        try:
            collection = client.get_collection(collection_name)
        except:
            raise VectorDBCollectionNotExistError()
        try:
            collection.delete(ids=keys)
        except:
            pass
        return True

    def search_nearby(self, kwargs: dict):
        collection_name = kwargs.get('collection_name')
        embeddings = kwargs.get('embeddings')
        client = self.client()
        try:
            collection = client.get_collection(collection_name)
        except:
            raise VectorDBCollectionNotExistError()
        search_result = collection.query(
            query_embeddings=embeddings,
            n_results=RECALL_NUMBER,
            include=['documents', 'metadatas'])
        return search_result

    def get_ids_by_metadatas(self, collection_name: str, where: dict, limit: int = 500, offset: int = 0):
        client = self.client()
        try:
            collection = client.get_collection(collection_name)
        except:
            raise VectorDBCollectionNotExistError()
        data = collection.get(where=where, limit=limit, offset=offset, include=[])
        return data

