# coding=utf-8
"""
API Service
"""
import asyncio
import webbrowser
import json
import os
import re
from datetime import date, datetime
from typing import List

import aiohttp
import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from src.diversefile import Loader
from src.diversefile import search_on_baike
from src.utils.tools import quote_filename, get_random_string, number_list_max
from configuration import config as project_config
from src.services import index_service_worker, llm_service_worker, files_status_manager


knowledge_base_path = project_config.config.get('knowledge_base_path')
default_knowledge_base_dir = os.path.join(knowledge_base_path, "knowledge_data") # 默认联网知识的存储位置
if not os.path.exists(default_knowledge_base_dir):
    os.makedirs(default_knowledge_base_dir)


app = FastAPI()

# 假设前端文件在 "frontend/" 目录下
app.mount("/frontend", StaticFiles(directory="frontend", html=True), name="frontend")


@app.get("/", response_class=FileResponse)
async def read_root():
    return FileResponse(path="frontend/index.html")


@app.get('/api/ok')
async def ok():
    return {"code": 200, "msg": "ok", "data": {}}

@app.get('/api/knowledgebase/list')
async def get_collection_list(keyword: str=None, need_count: bool=False):
    """
    获取知识库列表
    """
    collection_list = index_service_worker.show_collections({})
    if need_count:
        collection_counts = files_status_manager.collection_files_count()
        collection_counts_dict = {i[0]: i[1] for i in collection_counts}
    else:
        collection_counts_dict = {}
    if keyword:
        return {'code': 200, 'data': [{'name': i[0], 'meta': i[1], 'count': collection_counts_dict.get(i[0], 0)} for i in collection_list if keyword in i[0]], 'msg': 'ok'}
    return {'code': 200, 'data': [{'name': i[0], 'meta': i[1], 'count': collection_counts_dict.get(i[0], 0)} for i in collection_list], 'msg': 'ok'}


@app.post('/api/knowledgebase/add')
async def add_collection(body: dict):
    """
    添加知识库
    """
    name = body.get('name')
    if not name:
        return {"code": 400, "msg": '知识库名称不能为空', "data": {}}
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
async def get_collection_file_list(name: str, page: int=1, page_size: int=100, keyword: str=None):
    """
    获取知识库下所有知识文件列表
    """
    file_list = files_status_manager.get_collection_files(name, page=page, page_size=page_size, keyword=keyword)
    if file_list:
        result = [{'file_path': item[0], 'create_time': item[1], 'status': item[2] if item[2] else 'processed'} for item in file_list]
    else:
        result = []
    return {"code": 200, "msg": 'ok', "data": result}


@app.get('/api/knowledgebase/file_list_count')
async def get_collection_file_list_count(name: str, keyword: str=None):
    """
    获取知识库下所有知识文件数量
    """
    count = files_status_manager.get_collection_files_count(name, keyword=keyword)
    return {"code": 200, "msg": 'ok', "data": count}


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
        txt, filepath = search_on_baike(query, output_dir, output_filename)
        return {'code': 200, 'data': {'file_path': filepath, 'text': txt}, 'msg': 'ok'}
    except Exception as e:
        return {"code": 400, "msg": "发生错误: %s" % str(e), "data": {}}


@app.post('/api/knowledgebase/archive_text')
async def archive_text_knowledgebase(body: dict):
    """
    手动输入知识入库
    """
    name = body.get('name')
    text = body.get('text')
    file_name = body.get('file_name')
    if not (name and isinstance(text, str) and text and isinstance(name, str)):
        return {"code": 400, "msg": '知识库名称和文本内容不能为空', "data": {}}
    payload_texts = text.split("\n")
    success_num = 0
    failed_num = 0
    if not file_name:
        output_filename = 'manual_input_%s.txt' % get_random_string(6)
    else:
        if not isinstance(file_name, str):
            return {"code": 400, "msg": '文件名必须是字符串', "data": {}}
        output_filename = '%s_%s.txt' % (file_name, get_random_string(6))
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
    if failed_num > 1.5 * success_num:
         files_status_manager.add_file(output_file, name, 'failed')
    else:
        files_status_manager.add_file(output_file, name)
    return {"code": 200, "msg": 'ok', "data": {'success_num': success_num, 'failed_num': failed_num,
                                               'file_path': output_file}}


@app.post('/api/knowledgebase/archive_file')
async def archive_file_knowledgebase(body: dict):
    """
    文件入库
    """
    name: str = body.get('name')
    file_path: str = body.get('file_path')
    chunk_size: int = body.get('chunk_size', 256)

    if not (name and file_path and isinstance(file_path, str) and isinstance(name, str)):
        return {"code": 400, "msg": '知识库名称和文件路径不能为空', "data": {}}

    if not (isinstance(chunk_size, int) and 100<chunk_size<=1024):
        return {"code": 400, "msg": '分词长度不合法，请输入100-1024的整数', "data": {}}
    file_path = file_path.strip()
    if not os.path.exists(file_path):
        return {"code": 400, "msg": f'文件{file_path}不存在', "data": {}}


    try:
        loader = Loader(file_path, chunk_size)
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
    if failed_num > 1.5 * success_num:
        files_status_manager.add_file(file_path,name, 'failed')
    else:
        files_status_manager.add_file(file_path , name)
    return {"code": 200, "msg": 'ok', "data": {'success_num': success_num, 'failed_num': failed_num,
                                               'file_path': [loader.output_path]}}



@app.get('/api/knowledgebase/recall')
async def search_nearby(name: str, query: str, is_new:bool = False):
    """
    知识检索召回
    """
    query = query.strip()
    name = name.strip()
    if not query:
        return {"code": 400, "msg": '请输入检索内容', "data": {}}
    if not name:
        return {"code": 400, "msg": '请选择知识库', "data": {}}
    embeddings = llm_service_worker.get_embeddings(
        {'texts': [query], "bgem3_path": project_config.default_embedding_path}) # List[numpy.ndarray[numpy.float16]]
    try:
        documents = index_service_worker.search_nearby(
            {'collection_name': name, "embeddings": embeddings})
    except Exception as e:
       return {"code": 400, "msg": "召回数据失败:%s" % str(e), "data": {}}

    if documents:
        # 计算最佳匹配值
        cross_scores = llm_service_worker.get_cross_scores({"texts_0": documents,
                                                            "texts_1": [query for i in documents],
                                                            "rerank_path": project_config.default_rerank_path})
        max_value, max_index = number_list_max(cross_scores)
        if is_new:
            # 重新召回删除所有的记录
            search_id = files_status_manager.delete_search_history(name, query, delete_search=False)
            files_status_manager.update_search_history(search_id,
                                                       recall_msg=json.dumps(documents,ensure_ascii=False),
                                                       match_best=documents[max_index])
        else:
            search_id = files_status_manager.add_search_history(name, query, documents, documents[max_index])
    else:
       return {"code": 400, "msg": '相关问题找回失败，换一个问题试试！', }

    return {"code": 200, "msg": 'ok', "data": {'search_id': search_id}}

@app.post('/api/knowledgebase/search_history_delete')
async def search_history_delete(body: dict):
    """
    删除检索历史
    """
    name: str = body.get('name') or ''
    query: str = body.get('query') or ''
    name = name.strip()
    query = query.strip()
    if name and query:
        files_status_manager.delete_search_history(name, query)
        return {"code": 200, "msg": 'ok', "data": {}}
    else:
        return {"code": 400, "msg": '知识库名称和检索内容不能为空', "data": {}}

@app.get('/api/knowledgebase/search_history_list')
async def knowledge_search_history(name: str):
    """
    获取检索历史
    """
    data = files_status_manager.get_collection_search_history(name)
    result = [{'search_id': line[0], 'collection_name': line[1], 'query': line[2], 'create_time': line[3] } for line in data]
    return {"code": 200, "msg": 'ok', "data": result}


@app.get('/api/knowledgebase/history_chat_list')
async def knowledge_history_chat_list(search_id: int = None, page:int=1, page_size:int=20):
    """
    获取检索历史详情
    """
    lines = files_status_manager.get_chat_list(search_id, page, page_size)
    data = []
    for line in reversed(lines):
        try:
            chat = json.loads(line[1])
        except:
            continue
        data.append({'chat_id': line[0], 'chat': chat})
    return {"code": 200, "msg": 'ok', "data": data}


@app.get('/api/knowledgebase/search_history_detail')
async def knowledge_search_history_detail(search_id: int):
    """
    获取检索历史详情
    """
    item = files_status_manager.get_collection_search_history_info(search_id)
    if not item:
        return {"code": 400, "msg": '检索历史不存在', "data": {}}
    try:
        tmp = json.loads(item[3])
    except:
        tmp = item[3]
    return {"code": 200, "msg": 'ok', "data": {'search_id': item[0], 'collection_name': item[1], 'query': item[2],
                                               'recall_msg': tmp, 'match_best': item[4], 'create_time': item[5]}}


@app.post('/api/llm/get_embeddings')
async def get_embeddings(body: dict):
    """
    获取embedding
    """
    text = body.get('text')
    if not (text and isinstance(text, str)):
        return {"code": 400, "msg": '文本不能为空',}
    embeddings = llm_service_worker.get_embeddings({'texts':[text], "bgem3_path": project_config.default_embedding_path})
    return {"code": 200, "msg": 'ok', "data": embeddings.tolist()}


@app.post('/api/llm/cross_score')
async def get_cross_scores(body: dict):
    """
    文本相似度计算
    """
    atext = body.get("atext")
    btext = body.get("btext")
    if not (atext and btext and isinstance(atext, str) and isinstance(btext, str)):
        return {"code": 400, "msg": '参数不能为空', "data": []}
    cross_scores = llm_service_worker.get_cross_scores({"texts_0": [atext],
                                                        "texts_1": [btext],
                                                        "rerank_path": project_config.default_rerank_path})
    return {"code": 200, "msg": 'ok', "data": cross_scores[0] if cross_scores else None}


@app.post('/api/llm/batch_cross_score')
async def batch_get_cross_scores(body: dict):
    """
    文本相似度计算
    """
    atexts: List[str] = body.get("atexts")
    btexts: List[str] = body.get("btexts")
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


@app.post('/api/llm/generate')
async def generate(body: dict):
    """
    LLM 生成答案
    """
    instruction_input: str = body.get('instruction')
    time1 = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    best_match: str = body.get('text')
    search_id :int = body.get('search_id', 0)
    if not (instruction_input and best_match and isinstance(instruction_input, str) and isinstance(best_match, str)):
        return {"code": 400, "msg": '指令和参考文本不能为空', "data": {}}
    cmd = {
        "instruction": instruction_input,
        "input_text": best_match,
        "state_file": '',
        "template_prompt": None,
        "base_model_path": None

    }
    sampling_results = llm_service_worker.sampling_generate(cmd)
    if isinstance(search_id, str) and search_id.isdigit():
        search_id = int(search_id)
    if isinstance(search_id, int):
        time2 = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        chat_text = json.dumps([{"role":"user","content":instruction_input, 'time': time1},
                                {"role":"assistant","content":sampling_results, 'time': time2}],
                               ensure_ascii=False)
        files_status_manager.add_chat(search_id, chat_text)
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

@app.post('/api/llm/reload_base_model')
async def reload_base_model(body: dict):
    """
    重启模型
    """
    model_name: str = body.get('model_name')
    strategy: str = body.get('strategy')
    if not (model_name and isinstance(model_name, str)):
        return {"code": 400, "msg": '请输入模型名称', "data": {}}
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
async def add_base_model(body: dict):
    """
    新增基底模型
    """
    model_name: str = body.get('model_name')
    model_path: str = body.get('model_path')
    if not (model_name and isinstance(model_name, str)):
        return {"code": 400, "msg": '请输入模型名称', "data": {}}

    if not 3 <= len(model_name) <= 64:
        return {"code": 400, "msg": '模型名称长度必须在3到64个字符之间', "data": {}}
    if not (model_path and isinstance(model_path, str)):
        return {"code": 400, "msg": '请输入模型路径', "data": {}}
    if not os.path.exists(model_path):
        return {"code": 400, "msg": '模型路径不存在', "data": {}}

    code = files_status_manager.add_base_model(model_name, model_path)
    if code == 0:
        return {"code": 400, "msg": '基底模型已存在', "data": {}}
    return {"code": 200, "msg": 'ok', "data": {}}

@app.post('/api/llm/modify_base_model')
async def modify_base_model(body: dict):
    """
    修改基底模型，只能修改模型路径，不能修改模型名称
    """
    model_name: str = body.get('model_name')
    model_path: str = body.get('model_path')
    if not (model_name and isinstance(model_name, str)):
        return {"code": 400, "msg": '请输入模型名称'}
    if not (model_path and isinstance(model_path, str)):
        return {"code": 400, "msg": '请输入模型路径'}
    files_status_manager.change_base_model(model_name, model_path)
    return {"code": 200, "msg": 'ok', "data": {}}


@app.post('/api/llm/offline_base_model')
async def offline_base_model(body: dict):
    """
    下线基底模型
    """
    model_name: str = body.get('model_name')
    if not model_name:
        return {"code": 400, "msg": '请输入模型名称', "data": {}}
    if model_name == 'default':
        return {"code": 400, "msg": 'default 模型不能下线，可以通过修改default模型的路径来实现你的需求。', "data": {}}
    files_status_manager.offline_base_model(model_name)
    return {"code": 200, "msg": 'ok', "data": {}}

@app.post('/api/llm/active_base_model')
async def active_base_model(body: dict):
    """
    上线基底模型
    """
    model_name: str = body.get('model_name')
    if not model_name:
       return {"code": 400, "msg": '请输入模型名称', "data": {}}
    files_status_manager.active_base_model(model_name)
    return {"code": 200, "msg": 'ok', "data": {}}


@app.post('/api/config/modify')
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



SERVER_PORT = 8080

async def start_server():
    config = uvicorn.Config(app, host="0.0.0.0", port=SERVER_PORT, )
    server = uvicorn.Server(config)
    logo = r"""
                 ____  __        __ _  ____     __  ____      _      ____
                |  _ \ \ \      / /| |/ /\ \   / / |  _ \    / \    / ___|
                | |_) | \ \ /\ / / | ' /  \ \ / /  | |_) |  / _ \  | |  _
                |  _ <   \ V  V /  | . \   \ V /   |  _ <  / ___ \ | |_| |
                |_| \_\   \_/\_/   |_|\_\   \_/    |_| \_\/_/   \_\ \____|

        """
    print(logo)
    await server.serve()

async def check_server_started():
    url = f"http://127.0.0.1:{SERVER_PORT}/api/ok"
    timeout = aiohttp.ClientTimeout(total=1)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        while True:
            try:
                async with session.get(url) as response:
                    if response.status > 0:
                        return True
            except (aiohttp.ClientConnectionError, asyncio.TimeoutError):
                await asyncio.sleep(0.8)
async def open_browser():
    await check_server_started()
    webbrowser.open(f"http://127.0.0.1:{SERVER_PORT}")

async def main():
    await asyncio.gather(start_server(), open_browser())


if __name__ == "__main__":
    asyncio.run(main())