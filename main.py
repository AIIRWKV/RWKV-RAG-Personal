# coding=utf-8
"""
API Service
"""
import os
import asyncio
import re
from typing import List

import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import numpy as np

from src.utils.loader import Loader
from src.utils.internet import search_on_baike
from src.vectordb import VECTORDB_USED_LIMIT, VectorDBError
from configuration import config as project_config
from configuration import OS_NAME
from src.services import index_service_worker, llm_service_worker, files_status_manager


app = FastAPI()

# 假设前端文件在 "frontend/" 目录下
app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")


@app.get("/", response_class=FileResponse)
async def read_root():
    return FileResponse(path="frontend/index.html")

@app.get('/api/vectordb/collection/list')
async def get_collection_list():
    """
    获取知识库列表
    """
    collection_list = index_service_worker.show_collections({})
    return {'code': 200, 'data': [{'name': i[0], 'meta': i[1]} for i in collection_list], 'msg': 'ok'}


@app.post('/api/vectordb/collection/add')
async def add_collection(name: str):
    """
    添加知识库
    """
    if name:
        collection_name_rule = r'^[a-zA-Z0-9][a-zA-Z0-9_]{1,31}[a-zA-Z0-9]$'
        if not re.match(collection_name_rule, name):
            return {"code": 400, "msg": '知识库名称不合法,长度3-32的英文字符串', "data": {}}

        if index_service_worker.has_collection({'collection_name': name}):
            return {"code": 400, "msg": '知识库已存在', "data": {}}
        try:
            index_service_worker.create_collection({'collection_name': name})
        except Exception as e:
            return {"code": 400, "msg": "创建知识库失败:%s" % str(e), "data": {}}
        return {"code": 200, "msg": 'ok', "data": {}}


@app.get('/api/vectordb/collection/delete')
async def delete_collection(name: str):
    """
    删除知识库
    """
    if not name:
        return {"code": 400, "msg": '知识库名称不能为空', "data": {}}
    try:
        index_service_worker.delete_collection({'collection_name': name})
    except Exception as e:
        return {"code": 400, "msg": "删除知识库失败:%s" % str(e), "data": {}}
    return {"code": 200, "msg": 'ok', "data": {}}



@app.post('/api/vectordb/embeddings/add')
async def add_embeddings(collection_name: str, chunk: str, embeddings: List[float]=None, key: str=None):
    """
    将embedding数据添加到向量数据库
    """
    # numpy.ndarray[numpy.float16]
    tmp = [chunk]
    if key:
        keys = [key]
    else:
        keys = None
    if not embeddings:
        new_embeddings = llm_service_worker.get_embeddings({'texts': tmp, "bgem3_path": project_config.default_embedding_path})
    else:
        new_embeddings = [np.array(embeddings, dtype=np.float16)] # TODO 是否需要转换类型，看测试情况
    try:
        index_service_worker.index_texts(
            {"keys": keys, "texts": tmp, "embeddings": new_embeddings, 'collection_name': collection_name})
    except Exception as e:
        return {"code": 400, "msg": "添加embedding数据失败:%s" % str(e), "data": {}}
    return {"code": 200, "msg": 'ok', "data": {}}


@app.post('/api/vectordb/embeddings/batch_add')
async def batch_add_embeddings(collection_name: str, chunks: List[str], embeddings: List[List[float]]=None, keys: List[str]=None):
    """
    将embedding数据批量添加到向量数据库
    """
    if embeddings and len(chunks) != len(embeddings):
        return {"code": 400, "msg": 'chunks数量与embeddings数量不一致', "data": {}}
    if keys and len(keys) != len(chunks) or len(keys):
        return {"code": 400, "msg": 'keys数量与chunks数量不一致', "data": {}}
    if embeddings:
        new_embeddings = [np.array(eb, dtype=np.float16) for eb in embeddings]
    else:
        new_embeddings = llm_service_worker.get_embeddings({'texts': chunks, "bgem3_path": project_config.default_embedding_path})
    try:
        index_service_worker.index_texts(
            {"keys": None, "texts": chunks, "embeddings": new_embeddings, 'collection_name': collection_name})
    except Exception as e:
        return {"code": 400, "msg": "批量添加embedding数据失败:%s" % str(e), "data": {}}
    return {"code": 200, "msg": 'ok', "data": {}}


@app.get('/api/vectordb/embeddings/search')
async def search_nearby(collection_name: str, query: str):
    """
    向量搜索
    """
    embeddings = llm_service_worker.get_embeddings(
        {'texts': [query], "bgem3_path": project_config.default_embedding_path}) # List[numpy.ndarray[numpy.float16]]
    try:
        documents = index_service_worker.search_nearby(
            {'collection_name': collection_name, "embeddings": embeddings})
    except Exception as e:
       return {"code": 400, "msg": "召回数据失败:%s" % str(e), "data": {}}
    return {"code": 200, "msg": 'ok', "data": documents}


@app.get('/api/llm/get_embedings')
async def get_embeddings(text: str):
    """
    获取embedding
    """
    embeddings = llm_service_worker.get_embeddings({'texts':[text], "bgem3_path": project_config.default_embedding_path})
    return {"code": 200, "msg": 'ok', "data": embeddings.tolist()}


@app.get('/api/llm/cross_score')
async def get_cross_scores(atext: str, btext: str):
    """
    文本相似度计算
    """
    cross_scores = llm_service_worker.get_cross_scores({"texts_0": [atext],
                                                        "texts_1": [btext],
                                                        "rerank_path": project_config.default_rerank_path})
    return {"code": 200, "msg": 'ok', "data": cross_scores}


@app.get('/api/llm/batch_cross_score')
async def batch_get_cross_scores(atexts: List[str], btexts: List[str]):
    """
    文本相似度计算
    """
    if not atexts or not btexts:
        return {"code": 400, "msg": '参数不能为空', "data": []}
    if not isinstance(atexts, list) or not isinstance(btexts, list):
        return {"code": 400, "msg": '参数类型不正确', "data": []}
    if len(atexts) != len(btexts):
        return {"code": 400, "msg": '参数长度不一致', "data": []}
    cross_scores = llm_service_worker.get_cross_scores({"texts_0": atexts,
                                                        "texts_1": btexts,
                                                        "rerank_path": project_config.default_rerank_path})
    return {"code": 200, "msg": 'ok', "data": cross_scores}


@app.get('/api/llm/generate')
async def generate(instruction_input: str, best_match: str):
    cmd = {
        "instruction": instruction_input,
        "input_text": best_match,
        # "token_count": 50,
        # "top_p": 0,
        "state_file": '',
        # "temperature": 1.0,
        "template_prompt": None,
        "base_model_path": None

    }
    sampling_results = llm_service_worker.sampling_generate(cmd)


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8080)