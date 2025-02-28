# coding=utf-8
"""
Milvus 单机模式或者集群模型
由于 Milvus 单机服务模式只支持Linux和Docker部署，所以该服务只能另外运行，不能像chromadb那样，放在整个包里一起启动
后续做成docker的话，可以一起启动
"""
import os.path
import itertools
from abc import ABC
from typing import List

from src.vectordb import VECTOR_DB_DIMENSION
from src.vectordb import RECALL_NUMBER
from src.vectordb import TEXT_MAX_LENGTH
from src.vectordb import AbstractVectorDBManager
from src.utils.tools import calculate_string_md5
from .errors import VectorDBCollectionNotExistError, VectorDBError, VectorDBCollectionExistError


class MilvusManager(AbstractVectorDBManager, ABC):

    def client(self):
        from pymilvus import MilvusClient
        if self._client is None:
            url = f"http://{self.db_host}:{self.db_port}"
            try:
                self._client = MilvusClient(uri=url, token="root:Milvus")
                return self._client
            except Exception as e:
                raise VectorDBError('连接Milvus服务失败，请确保Milvus服务已经启动')
        return self._client
    def run(self):
        pass

    def has_collection(self, collection_name: str) -> bool:
        client = self.client()
        try:
            return client.has_collection(collection_name)
        except:
            return False

    def show_collections(self, page: int=None, page_size: int=None):
        client = self.client()
        collections = client.list_collections()
        return [(i, {"create_time": ""}) for i in collections] if collections else []

    def create_collection(self, collection_name: str):
        from pymilvus import FieldSchema, CollectionSchema, DataType
        client = self.client()
        if client.has_collection(collection_name):
            raise VectorDBCollectionExistError()
        fields = [FieldSchema(name='id', dtype=DataType.VARCHAR, descrition='id', is_primary=True, max_length=64),
                  FieldSchema(name='vector', dtype=DataType.FLOAT16_VECTOR, descrition='vector',
                              dim=VECTOR_DB_DIMENSION),
                  FieldSchema(name='text', dtype=DataType.VARCHAR, descrition='text', max_length=TEXT_MAX_LENGTH * 4)
                  ]
        index_params = client.prepare_index_params()
        index_params.add_index(field_name='vector', metric_type='COSINE', index_type='FLAT',
                               index_name=f'{collection_name}_vector_index')
        schema = CollectionSchema(fields, description="RWKV-RAG Collection")
        client.create_collection(collection_name, schema=schema, index_params=index_params)
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
        documents = search_result['documents']
        if documents:
            document = documents[0]
        else:
            document = []
        metadatas = search_result['metadatas']
        if metadatas:
            metadata = metadatas[0]
        else:
            metadata = []
        return {'documents': document, 'metadatas': metadata}

    def get_ids_by_metadatas(self, collection_name: str, where: dict, limit: int = 500, offset: int = 0):
        client = self.client()
        try:
            collection = client.get_collection(collection_name)
        except:
            raise VectorDBCollectionNotExistError()
        data = collection.get(where=where, limit=limit, offset=offset, include=[])
        return data
