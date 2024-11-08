# coding=utf-8
"""
API Service
"""
import os
import asyncio
import re
import string
import random
from collections import OrderedDict

import pandas as pd
import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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

@app.get('/api/collection/list')
async def get_collection_list():
    collection_list = index_service_worker.show_collections({})
    return {'code': 200, 'data': [{'name': i[0], 'meta': i[1]} for i in collection_list], 'msg': 'ok'}


@app.post('/api/collection/add')
async def add_collection(name: str):
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


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8080)