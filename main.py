# coding=utf-8
"""
API Service
"""
import os
import asyncio
import re
from datetime import date
from typing import List

import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from src.utils.loader import Loader
from src.utils.internet import search_on_baike
from src.utils.tools import quote_filename, get_random_string
from configuration import config as project_config
from src.services import index_service_worker, llm_service_worker, files_status_manager


knowledge_base_path = project_config.config.get('knowledge_base_path')
default_knowledge_base_dir = os.path.join(knowledge_base_path, "knowledge_data") # 默认联网知识的存储位置
if not os.path.exists(default_knowledge_base_dir):
    os.makedirs(default_knowledge_base_dir)


app = FastAPI()

# 假设前端文件在 "frontend/" 目录下
app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")


@app.get("/", response_class=FileResponse)
async def read_root():
    return FileResponse(path="frontend/index.html")

@app.get('/api/knowledgebase/list')
async def get_collection_list():
    """
    获取知识库列表
    """
    collection_list = index_service_worker.show_collections({})
    return {'code': 200, 'data': [{'name': i[0], 'meta': i[1]} for i in collection_list], 'msg': 'ok'}


@app.post('/api/knowledgebase/add')
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


@app.get('/api/knowledgebase/delete')
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


@app.get('/api/knowledgebase/file_list')
async def get_collection_file_list(name: str, page: int=1, page_size: int=100):
    """
    获取知识库下所有知识文件列表
    """
    file_list = files_status_manager.get_collection_files(name, page=page, page_size=page_size)
    if file_list:
        result = [{'file_path': item[0], 'create_time': item[1]} for item in file_list]
    else:
        result = []
    return {"code": 200, "msg": 'ok', "data": result}


async def search_and_notify(search_query, output_dir, output_filename):
    # Run the async search function
    msg = await search_on_baike(search_query, output_dir, output_filename)
    return os.path.join(output_dir, output_filename), msg

@app.get('/api/knowledgebase/internet_search')
async def internet_search(query: str):
    """
    联网搜索
    """
    if not query:
        return {"code": 400, "msg": '请输入搜索关键词', "data": {}}
    output_filename = '%s.txt' % quote_filename(query)
    date_str = date.today().strftime("%Y%m%d")
    output_dir = os.path.join(default_knowledge_base_dir, date_str)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    try:
        filepath, msg = asyncio.run(search_and_notify(query, output_dir, output_filename))
        if not msg:
            return {'code': 200, 'data': {'file_path': filepath}, 'msg': 'ok'}
        else:
            return {'code': 400, 'data': {}, 'msg': msg}
    except Exception as e:
        return {"code": 400, "msg": "发生错误: %s" % str(e), "data": {}}


@app.post('/api/knowledgebase/archive_text')
async def archive_text_knowledgebase(name: str, text: str):
    """
    手动输入知识入库
    """
    payload_texts = text.split("\n")
    success_num = 0
    failed_num = 0
    output_filename = 'manual_input_%s.txt' % get_random_string(6)
    date_str = date.today().strftime("%Y%m%d")
    output_dir = os.path.join(default_knowledge_base_dir, date_str)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    output_file = os.path.join(output_dir, output_filename)
    with open(output_file, 'w', encoding='utf-8') as wf:
        for idx, chunk in enumerate(payload_texts):
            tmp = [chunk]
            embeddings = llm_service_worker.get_embeddings(
                {'texts': tmp, "bgem3_path": project_config.default_embedding_path})
            try:
                index_service_worker.index_texts(
                    {"keys": None, "texts": tmp, "embeddings": embeddings, 'collection_name': name})
                success_num += 1
            except Exception as e:
                failed_num += 1
                continue
            wf.write(chunk)
            wf.write('\n')
    files_status_manager.add_file(output_file, name)
    return {"code": 200, "msg": 'ok', "data": {'success_num': success_num, 'failed_num': failed_num,
                                               'file_path': output_file}}


@app.post('/api/knowledgebase/archive_file')
async def archive_file_knowledgebase(name: str, file_path: str, chunk_size: int=512, chunk_overlap: int=0):
    """
    文件入库
    """
    if not (isinstance(chunk_size, int) and 100<chunk_size<=1024):
        return {"code": 400, "msg": '分词长度不合法，请输入100-1024的整数', "data": {}}
    max_chunk_overlap = int(chunk_size * 0.1)
    if not (isinstance(chunk_overlap, int) and 0 <= max_chunk_overlap):
        return {"code": 400, "msg": '分词重叠长度不合法，请输入0-%d的整数' % max_chunk_overlap, "data": {}}

    # 加载按钮
    file_path = file_path.strip()
    if not os.path.exists(file_path):
        return {"code": 400, "msg": f'文件{file_path}不存在', "data": {}}


    try:
        loader = Loader(file_path, chunk_size, chunk_overlap)
    except Exception as e:
        return {"code": 400, "msg": "文件加载和分割过程中出现错误: %s" % str(e), "data": {}}

    date_str = date.today().strftime("%Y%m%d")
    output_dir = os.path.join(default_knowledge_base_dir, date_str)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    chunks = loader.load_and_split_file(output_dir)
    success_num = 0
    failed_num = 0
    for idx, chunk in enumerate(chunks):
        tmp = [chunk]
        embeddings = llm_service_worker.get_embeddings(
            {'texts': tmp, "bgem3_path": project_config.default_embedding_path})
        try:
            index_service_worker.index_texts({"keys": None, "texts": tmp, "embeddings": embeddings,
                                              'collection_name': name})
            success_num += 1
        except Exception as e:
            failed_num += 1

    # 记录文件入库状态
    for path in loader.output_files:
        files_status_manager.add_file(path,name)
    return {"code": 200, "msg": 'ok', "data": {'success_num': success_num, 'failed_num': failed_num,
                                               'file_path': loader.output_files[:500]}}



@app.get('/api/knowledgebase/recall')
async def search_nearby(name: str, query: str):
    """
    知识检索召回
    """
    if not query:
        return {"code": 400, "msg": '请输入检索内容', "data": {}}
    embeddings = llm_service_worker.get_embeddings(
        {'texts': [query], "bgem3_path": project_config.default_embedding_path}) # List[numpy.ndarray[numpy.float16]]
    try:
        documents = index_service_worker.search_nearby(
            {'collection_name': name, "embeddings": embeddings})
    except Exception as e:
       return {"code": 400, "msg": "召回数据失败:%s" % str(e), "data": {}}
    return {"code": 200, "msg": 'ok', "data": documents}


@app.get('/api/llm/get_embeddings')
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
    return {"code": 200, "msg": 'ok', "data": cross_scores[0] if cross_scores else None}


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
    """
    LLM 生成答案
    """
    cmd = {
        "instruction": instruction_input,
        "input_text": best_match,
        "state_file": '',
        "template_prompt": None,
        "base_model_path": None

    }
    sampling_results = llm_service_worker.sampling_generate(cmd)
    return {"code": 200, "msg": 'ok', "data": sampling_results}


@app.get('/api/llm/current_usage')
async def current_usage():
    """
    当前使用模型等信息
    :return:
    """
    default_base_model_path = project_config.default_base_model_path
    default_base_model_name = files_status_manager.get_base_model_name_by_path(default_base_model_path) or 'default'
    current_strategy = project_config.config.get('strategy') or 'cuda fp16'
    return {"code": 200, "msg": 'ok', "data": {'base_model_name': default_base_model_name,
                                                 'strategy': current_strategy}}

@app.get('/api/llm/reload_base_model')
async def reload_base_model(model_name: str, strategy: str=None):
    """
    重启模型
    """
    base_model_info = files_status_manager.get_base_model_path_by_name(model_name)
    if not base_model_info:
        return {"code": 400, "msg": '模型不存在', "data": {}}
    model_path, status = base_model_info
    if status != 1:
        return {"code": 400, "msg": '模型未上线', "data": {}}
    if not (os.path.isfile(model_path) and os.path.exists(model_path)):
        return {"code": 400, "msg": '模型文件不存在', "data": {}}
    if not strategy:
        strategy = project_config.config.get('strategy')
    try:
        llm_service_worker.reload_base_model({'base_model_path': model_path, 'strategy': strategy})
        project_config.set_config(base_model_path=model_path, strategy=strategy)
        files_status_manager.create_or_update_using_base_model(model_name)
    except Exception as e:
        return {"code": 400, "msg": '重启模型失败: %s' % str(e), "data": {}}
    return {"code": 200, "msg": 'ok', "data": {}}


@app.get('/api/llm/base_model_list')
async def get_base_model_list(just_name: bool=False):
    """
    获取基底模型列表
    """
    base_model_list = files_status_manager.get_base_model_list(just_name)
    if just_name:
        data = base_model_list
    else:
        data = [{'name': line[0], 'path': line[1], 'status': line[2], 'create_time': line[3]} for line in base_model_list]
    return {"code": 200, "msg": 'ok', "data": data}


@app.post('/api/llm/add_base_model')
async def add_base_model(model_name: str, model_path: str):
    """
    新增基底模型
    """
    if not model_name:
        return {"code": 400, "msg": '请输入模型名称', "data": {}}

    if not 3 <= len(model_name) <= 64:
        return {"code": 400, "msg": '模型名称长度必须在3到64个字符之间', "data": {}}
    if not model_path:
        return {"code": 400, "msg": '请输入模型路径', "data": {}}
    if not os.path.exists(model_path):
        return {"code": 400, "msg": '模型路径不存在', "data": {}}

    code = files_status_manager.add_base_model(model_name, model_path)
    if code == 0:
        return {"code": 400, "msg": '基底模型已存在', "data": {}}
    return {"code": 200, "msg": 'ok', "data": {}}

@app.post('/api/llm/modify_base_model')
async def modify_base_model(model_name: str, model_path: str):
    """
    修改基底模型，只能修改模型路径，不能修改模型名称
    """
    if not model_name:
        return {"code": 400, "msg": '请输入模型名称'}
    if not model_path:
        return {"code": 400, "msg": '请输入模型路径'}
    files_status_manager.change_base_model(model_name, model_path)
    return {"code": 200, "msg": 'ok', "data": {}}


@app.get('/api/llm/offline_base_model')
async def offline_base_model(model_name: str):
    """
    下线基底模型
    """
    if not model_name:
        return {"code": 400, "msg": '请输入模型名称', "data": {}}
    if model_name == 'default':
        return {"code": 400, "msg": 'default 模型不能下线，可以通过修改default模型的路径来实现你的需求。', "data": {}}
    files_status_manager.offline_base_model(model_name)
    return {"code": 200, "msg": 'ok', "data": {}}

@app.get('/api/llm/active_base_model')
async def active_base_model(model_name: str):
    """
    上线基底模型
    """
    if not model_name:
       return {"code": 400, "msg": '请输入模型名称', "data": {}}
    files_status_manager.active_base_model(model_name)
    return {"code": 200, "msg": 'ok', "data": {}}


@app.post('/api/config/modify')
async def modify_config(model_path: str, embedding_path: str, reranker_path: str, knowledge_base_path: str,
                                  vectordb_path: str, vectordb_port: str, vectordb_name: str):
    """
    修改配置文件, 修改配置文件后需要重启服务才能生效
    """
    if model_path and not os.path.exists(model_path):
        return {"code": 400, "msg": '基底模型路径不存在', "data": {}}
    if embedding_path and not os.path.exists(embedding_path):
        return {"code": 400, "msg": 'Embedding模型路径不存在', "data": {}}
    if not os.path.isdir(embedding_path):
        return {"code": 400, "msg": 'Embedding模型路径必须是目录', "data": {}}
    if reranker_path and not os.path.exists(reranker_path):
        return {"code": 400, "msg": 'Reranker模型路径不存在', "data": {}}
    if not os.path.isdir(reranker_path):
        return {"code": 400, "msg": 'Reranker模型路径必须是目录', "data": {}}
    if knowledge_base_path and not os.path.exists(knowledge_base_path):
        return {"code": 400, "msg": '知识库文件存储目录不存在', "data": {}}
    if not os.path.isdir(knowledge_base_path):
        return {"code": 400, "msg": '知识库文件存储目录必须是目录', "data": {}}
    if not ((isinstance(vectordb_port, str) and vectordb_port.isdigit()) or isinstance(vectordb_port, int)):
        return {"code": 400, "msg": 'vectordb_port 必须是数字', "data": {}}
    if project_config.config.get('is_init') is True:
        project_config.set_config(model_path, embedding_path, reranker_path, knowledge_base_path,
                              vectordb_path, vectordb_port)
    else:
        project_config.set_config(model_path, embedding_path, reranker_path, knowledge_base_path,
                                  vectordb_path, vectordb_port, vectordb_name=vectordb_name)

    return {"code": 200, "msg": 'ok', "data": {}}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8080)