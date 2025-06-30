#coding=utf-8
from abc import ABC, abstractmethod
from typing import List

VECTOR_DB_DIMENSION = 1024  # 向量维度

TEXT_MAX_LENGTH = 512  # 单个文本Embedding最大长度

RECALL_NUMBER = 3  # 召回数量
INIT_VECTORDB_COLLECTION_NAME = 'initial'
VECTORDB_USED_LIMIT = {'linux': ['chromadb'],
                       'windows': ['chromadb']
                       }



class AbstractVectorDBManager(ABC):

    def __init__(self, db_path: str, db_port: int, db_host: str= '127.0.0.1'):
        self.db_path = db_path
        self.db_port = db_port
        self.db_host = db_host
        self._client = None

    @abstractmethod
    def client(self):
        """
        初始化数据库连接
        :return:
        """
        pass

    @abstractmethod
    def run(self):
        """
        start process
        :return:
        """
        pass

    @abstractmethod
    def show_collections(self, page: int=None, page_size: int=None):
        """
        集合列表
        :param page:
        :param page_size:
        :return:
        """
        pass

    @abstractmethod
    def has_collection(self, collection_name: str) -> bool:
        """
        判断集合是否存在
        :param collection_name:
        :return:
        """
        pass

    @abstractmethod
    def create_collection(self, collection_name: str):
        """
        创建集合
        :param collection_name:
        :return:
        """
        pass

    @abstractmethod
    def delete_collection(self, collection_name: str):
        """
        删除集合
        :param collection_name:
        :return:
        """
        pass

    @abstractmethod
    def add(self, kwargs: dict):
        """
        添加向量
        :param kwargs:必须有如下键
            keys： List[(str)]
            texts： List[(str)]
            collection_name： str
            embeddings: List[numpy.ndarray[numpy.float16]]
        :return:
        """
        pass

    def delete(self, keys: List[str], collection_name: str):
        """
        删除向量
        :param kwargs:
        :return:
        """
        pass

    @abstractmethod
    def update(self, kwargs: dict):
        """
        更新数据，批量更新
        :param kwargs:需要有以下值
            collection_name： str， 集合名称
            keys： List[str]，需要修改值的id
            以下参数至少要有一个有：
            embeddings: List[numpy.ndarray[numpy.float16]]，嵌入向量
            texts： List[str]，文档
            metadatas: List[dict], 元数据

        :return:
        """

    @abstractmethod
    def search_nearby(self, kwargs: dict) -> list[str]:
        """
        搜索向量
        :param kwargs:必须有如下键：
            collection_name: str
            embeddings: List[numpy.ndarray[numpy.float16]]
            metadata_field： dict, 元数据查找，元数据不是很多，且都是等于和不等于居多，这些格式是参照chromadb演化而来,以它的运算符为主
                            {"name": ('$nin', [1,2,3]) # not in
                             "price": ('$eq', 1)  # 等于1，
                            }
        :return:
        """
        pass

    @staticmethod
    def padding_vectors(vector: list):
        if len(vector) < VECTOR_DB_DIMENSION:
            vector += [0] * (VECTOR_DB_DIMENSION - len(vector))
        elif len(vector) > VECTOR_DB_DIMENSION:
            vector = vector[:VECTOR_DB_DIMENSION]
        return vector