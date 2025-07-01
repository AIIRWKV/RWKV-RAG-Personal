#coding=utf-8
"""
配置有关的操作
"""

import os

from fastapi import APIRouter

from configuration import config as project_config


router = APIRouter(tags=["配置操作"])

@router.post('/config/modify')
async def modify_config(body: dict):
    """
    修改配置文件, 修改配置文件后需要重启服务才能生效
    """
    model_path: str = body.get('model_path')
    embedding_path: str = body.get('embedding_path')
    reranker_path: str = body.get('reranker_path')
    new_knowledge_base_path: str = body.get('knowledge_base_path')
    vectordb_path: str = body.get('vectordb_path')
    vectordb_port: str = body.get('vectordb_port')
    vectordb_name: str = body.get('vectordb_name')

    if model_path and not os.path.exists(model_path):
        return {"code": 400, "msg": '基底模型路径不存在', "data": {}}
    if embedding_path:
        if not os.path.exists(embedding_path):
            return {"code": 400, "msg": 'Embedding模型路径不存在', "data": {}}
        if not os.path.isdir(embedding_path):
            return {"code": 400, "msg": 'Embedding模型路径必须是目录', "data": {}}
    if reranker_path:
        if not os.path.exists(reranker_path):
            return {"code": 400, "msg": 'Reranker模型路径不存在', "data": {}}
        if not os.path.isdir(reranker_path):
            return {"code": 400, "msg": 'Reranker模型路径必须是目录', "data": {}}
    if new_knowledge_base_path:
        if not os.path.exists(new_knowledge_base_path):
            return {"code": 400, "msg": '知识库文件存储目录不存在', "data": {}}
        if not os.path.isdir(new_knowledge_base_path):
            return {"code": 400, "msg": '知识库文件存储目录必须是目录', "data": {}}
    if vectordb_port:
        if not ((isinstance(vectordb_port, str) and vectordb_port.isdigit()) or isinstance(vectordb_port, int)):
            return {"code": 400, "msg": 'vectordb_port 必须是数字', "data": {}}

    project_config.set_config(model_path, embedding_path, reranker_path, new_knowledge_base_path,
                                  vectordb_path, vectordb_port, vectordb_name=vectordb_name)

    return {"code": 200, "msg": 'ok', "data": {}}