#coding=utf-8
"""
模型选择 下线等基础操作
"""
import os

from fastapi import APIRouter

from api import (index_service_worker,
                 files_status_manager)
from configuration import config as project_config


router = APIRouter(tags=["模型操作"])



@router.get('/llm/current_usage')
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

@router.post('/llm/reload_base_model')
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


@router.get('/llm/base_model_list')
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


@router.post('/llm/add_base_model')
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

@router.post('/llm/modify_base_model')
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


@router.post('/llm/offline_base_model')
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

@router.post('/llm/active_base_model')
async def active_base_model(body: dict):
    """
    上线基底模型
    """
    model_name: str = body.get('model_name')
    if not model_name:
       return {"code": 400, "msg": '请输入模型名称', "data": {}}
    files_status_manager.active_base_model(model_name)
    return {"code": 200, "msg": 'ok', "data": {}}
