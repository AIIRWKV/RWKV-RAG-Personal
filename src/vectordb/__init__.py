#coding: utf-8
"""
向量数据库适配层
"""
from .abc import AbstractVectorDBManager
from .abc import VECTOR_DB_DIMENSION
from .abc import VECTORDB_USED_LIMIT
from .abc import RECALL_NUMBER
from .abc import INIT_VECTORDB_COLLECTION_NAME
from .abc import TEXT_MAX_LENGTH
from .milvus_lite import MilvusLiteManager
from .chroma import ChromaDBManager
from .errors import VectorDBError, VectorDBCollectionNotExistError, VectorDBCollectionExistError


def get_vectordb_manager(vectordb_name: str):
    if vectordb_name == 'chromadb':
        vectordb_manager = ChromaDBManager
    elif vectordb_name == 'milvus_lite':
        vectordb_manager = MilvusLiteManager
    else:
        return None
    return vectordb_manager