#coding=utf-8
"""
问答聊天相关的接口
"""
import json

from fastapi import APIRouter

from api import (index_service_worker,
                 files_status_manager)
from src.utils.tools import number_list_max
from configuration import config as project_config


router = APIRouter(tags=["问答聊天"])

@router.get('/knowledgebase/recall')
async def search_nearby(name: str, query: str, is_new:bool = False):
    """
    创建对话
    """
    query = query.strip()
    name = name.strip()
    if not query:
        return {"code": 400, "msg": '请输入检索内容', "data": {}}
    if not name:
        return {"code": 400, "msg": '请选择知识库', "data": {}}
    embeddings = llm_service_worker.get_embeddings(
        {'texts': [query], "bgem3_path": project_config.default_embedding_path}) # List[numpy.ndarray[numpy.float16]]
    not_used_sources = files_status_manager.get_not_used_source(name)
    if not_used_sources:
        cmd = {'collection_name': name, "embeddings": embeddings,
               'metadata_field': {'source': ('$nin', not_used_sources)} }
    else:
        cmd = {'collection_name': name, "embeddings": embeddings, }
    try:
        recall_data = index_service_worker.search_nearby(cmd)
    except Exception as e:
       return {"code": 400, "msg": "召回数据失败:%s" % str(e), "data": {}}
    documents = recall_data.get('documents', [])
    metadatas = recall_data.get('metadatas', []) or []
    ids = recall_data.get('ids', [])
    if not metadatas:
        metadatas = [None] * len(documents)
    elif len(metadatas) < len(documents):
        metadatas.extend([None] * (len(documents) - len(metadatas)))
    if not ids:
        ids = [None] * len(documents)
    if documents:
        # 计算最佳匹配值
        cross_scores = llm_service_worker.get_cross_scores({"texts_0": documents,
                                                            "texts_1": [query for i in documents],
                                                            "rerank_path": project_config.default_rerank_path})
        # TODO 优化，不应该是搞最佳匹配，而是重排序，然后选取几个资料做为上下文资料
        max_value, max_index = number_list_max(cross_scores)
        documents_metadata = [(documents[i], metadatas[i].get('source') if metadatas[i] and
                                                                           isinstance(metadatas[i], dict) else '')
                              for i in range(len(documents))]
        if is_new:
            # 重新召回删除所有的记录
            search_id = files_status_manager.delete_search_history(name, query, delete_search=False)
            files_status_manager.update_search_history(search_id,
                                                       recall_msg=json.dumps(documents_metadata, ensure_ascii=False),
                                                       match_best=documents[max_index])
        else:
            search_id = files_status_manager.add_search_history(name, query, documents_metadata, documents[max_index])
    else:
        return {"code": 400, "msg": '相关问题召回失败，换一个问题试试！', }

    return {"code": 200, "msg": 'ok', "data": {'search_id': search_id}}

@router.post('/knowledgebase/search_history_delete')
async def search_history_delete(body: dict):
    """
    删除历史对话
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

@router.get('/knowledgebase/search_history_list')
async def knowledge_search_history(name: str):
    """
    获取历史对话
    """
    data = files_status_manager.get_collection_search_history(name)
    result = [{'search_id': line[0], 'collection_name': line[1], 'query': line[2], 'create_time': line[3] } for line in data]
    return {"code": 200, "msg": 'ok', "data": result}


@router.get('/knowledgebase/history_chat_list')
async def knowledge_history_chat_list(search_id: int = None, page:int=1, page_size:int=20):
    """
    获取对话内容详情
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


@router.get('/knowledgebase/search_history_detail')
async def knowledge_search_history_detail(search_id: int):
    """
    获取对话基本信息
    """
    item = files_status_manager.get_collection_search_history_info(search_id)
    if not item:
        return {"code": 400, "msg": '检索历史不存在', "data": {}}
    try:
        tmp = json.loads(item[3])
        if isinstance(tmp, list):
            tmp = [(line[0], line[1]) if isinstance(line, (list, tuple))  else (line, '') for line in tmp]
    except:
        tmp = item[3]
    return {"code": 200, "msg": 'ok', "data": {'search_id': item[0], 'collection_name': item[1], 'query': item[2],
                                               'recall_msg': tmp, 'match_best': item[4], 'create_time': item[5]}}
