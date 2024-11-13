# coding=utf-8
"""
Milvus Lite
支持Linux 非docker部署方式   Ubuntu >= 20.04（x86_64 和 arm64）
"""
import os.path
import itertools
from abc import ABC

from websockets.http11 import MAX_LINE_LENGTH

from src.vectordb import VECTOR_DB_DIMENSION
from src.vectordb import RECALL_NUMBER
from src.vectordb import AbstractVectorDBManager
from src.utils.tools import calculate_string_md5
from .errors import VectorDBCollectionNotExistError, VectorDBError, VectorDBCollectionExistError


class MilvusLiteManager(AbstractVectorDBManager, ABC):

    def client(self):
        import pymilvus
        if self._client is None:
            if not self.db_path.endswith('.db'):
                self.db_path = os.path.join(self.db_path, 'milvus_lite.db')
            try:
                self._client = pymilvus.MilvusClient(self.db_path)
                return self._client
            except Exception as e:
                raise VectorDBError('连接MilvusLite服务失败')
        return self._client
    def run(self):
        # 本地服务文件，不需要启动服务
        pass

    def show_collections(self, page: int=None, page_size: int=None):
        client = self.client()
        collections = client.list_collections()
        return [(i, None) for i in collections] if collections else []

    def has_collection(self, collection_name: str) -> bool:
        client = self.client()
        return client.has_collection(collection_name)

    def create_collection(self, collection_name: str):
        from pymilvus import FieldSchema, CollectionSchema, DataType
        client = self.client()
        if client.has_collection(collection_name):
            raise VectorDBCollectionExistError()
        fields = [FieldSchema(name='id', dtype=DataType.VARCHAR, descrition='id', is_primary=True, max_length=64),
                  FieldSchema(name='vector', dtype=DataType.FLOAT16_VECTOR, descrition='vector', dim=VECTOR_DB_DIMENSION),
                  FieldSchema(name='text', dtype=DataType.VARCHAR, descrition='text', max_length=MAX_LINE_LENGTH)
                  ]
        index_params = client.prepare_index_params()
        index_params.add_index(field_name='vector', metric_type='COSINE',index_type='FLAT',
                               index_name=f'{collection_name}_vector_index')
        schema = CollectionSchema(fields, description="RWKV-RAG Collection")
        client.create_collection(collection_name, schema=schema, index_params=index_params)
        client.get_load_state(collection_name)
        return True

    def delete_collection(self, collection_name: str):

        client = self.client()
        if not client.has_collection(collection_name):
            raise VectorDBCollectionNotExistError()
        client.drop_collection(collection_name)
        return True


    def add(self,kwargs:dict):
        keys = kwargs.get("keys")
        values = kwargs["texts"]
        collection_name = kwargs.get('collection_name')
        embeddings = kwargs.get('embeddings')

        if keys is None or isinstance(keys, list) is False or len(keys) != len(values):
            keys = [calculate_string_md5(value) for value in values]
        client = self.client()
        new_embeddings = [self.padding_vectors(eb) for eb in embeddings]
        # TODO 有一个subject参数，可以加快向量查询速度， 在产品设计上，是否也可以加该字段
        data = [ {"id": i, "vector": v, "text": doc} for i, v, doc in itertools.zip_longest(keys, new_embeddings, values)]
        try:
            client.insert(collection_name, data=data)
        except:
            raise VectorDBError('数据添加失败')
        return True

    def search_nearby(self, kwargs: dict):
        collection_name = kwargs.get('collection_name')
        embeddings = kwargs.get('embeddings')
        client = self.client()
        if not client.has_collection(collection_name):
            raise VectorDBCollectionNotExistError()
        search_result = client.search(collection_name=collection_name, data=embeddings,
                                      limit=RECALL_NUMBER,
                                      search_params={"metric_type": "COSINE", "params": {}},
                                      output_fields=['text'])
        if search_result:
            return [i['entity']['text'] for i in search_result[0]]
        return []