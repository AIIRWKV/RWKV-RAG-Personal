#coding=utf-8
"""
跟知识库操作接口
"""
from fastapi import APIRouter, Query

from api import (index_service_worker,
                 files_status_manager)
from api.schema.kb_schema import AddCollectionFrom
from api.response import BaseResponse
from api.response.kb_response import (CollectionListResponse,
                                      CollectionFileListResponse,
                                      CollectionFileListCountResponse)


router = APIRouter(tags=["知识库"])


@router.get('/knowledgebase/list', summary='获取知识库列表',
            response_model=CollectionListResponse)
async def get_collection_list(keyword: str = Query(default=None, description='搜索关键字'),
                              need_count: bool = Query(default=False, description='是否需要返回文件数量')):
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


@router.post('/knowledgebase/add', summary='添加知识库', response_model=BaseResponse)
async def add_collection(body: AddCollectionFrom):
    """
    添加知识库
    """
    name = body.name

    if index_service_worker.has_collection({'collection_name': name}):
        return {"code": 400, "msg": '知识库已存在', "data": {}}
    try:
        index_service_worker.create_collection({'collection_name': name})
    except Exception as e:
        return {"code": 400, "msg": "创建知识库失败:%s" % str(e), "data": {}}
    return {"code": 200, "msg": 'ok', "data": {}}


@router.get('/knowledgebase/delete', summary='删除知识库', response_model=BaseResponse)
async def delete_collection(name: str = Query(description='知识库名称')):
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


@router.get('/knowledgebase/file_list', summary='获取知识库文件列表', response_model=CollectionFileListResponse)
async def get_collection_file_list(name: str = Query(description='知识库名称'),
                                   page: int= Query(default=1, description='页码'),
                                   page_size: int= Query(default=100, description='页大小'),
                                   keyword: str= Query(default=None, description='搜索关键字')):
    """
    获取知识库下所有知识文件列表
    """
    file_list = files_status_manager.get_collection_files(name, page=page, page_size=page_size, keyword=keyword)
    if file_list:
        result = [{'file_path': item[0], 'create_time': item[1], 'status': item[2] if item[2] else 'processed'} for item in file_list]
    else:
        result = []
    return {"code": 200, "msg": 'ok', "data": result}


@router.get('/knowledgebase/file_list_count', summary='获取知识库文件数量', response_model=CollectionFileListCountResponse)
async def get_collection_file_list_count(name: str = Query(description='知识库名称'),
                                         keyword: str= Query(default=None, description='搜索关键字')):
    """
    获取知识库下所有知识文件数量
    """
    count = files_status_manager.get_collection_files_count(name, keyword=keyword)
    return {"code": 200, "msg": 'ok', "data": count}