#coding=utf-8
"""
知识库里的单个数据集相关操作
"""
import os
from datetime import date, datetime

from Cython.Shadow import returns
from fastapi import APIRouter

from api import default_knowledge_base_dir
from api import (index_service_worker,
                #llm_service_worker,
                files_status_manager)
from src.utils.tools import (get_random_string,
                             )
from configuration import (config as project_config,
                           AsyncTaskType,
                           MESSAGE_QUEUE)


router = APIRouter(tags=["数据集"])

@router.post('/knowledgebase/archive_text')
async def archive_text_knowledgebase(body: dict):
    """
    手动输入知识
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
        # TODO 手动输入目前文本长度有限制，不会出现大文本情况，暂时不移到异步处理逻辑里，后续看情况确定
        for idx, chunk in enumerate(payload_texts):
            tmp = [chunk]
            embeddings = llm_service_worker.get_embeddings(
                {'texts': tmp, "bgem3_path": project_config.default_embedding_path})
            try:
                index_service_worker.index_texts(
                    {"keys": None, "texts": tmp, "embeddings": embeddings, 'collection_name': name,
                     'file_path': output_file})
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


@router.post('/knowledgebase/archive_file')
async def archive_file_knowledgebase(body: dict):
    """
    文件入库
    """
    name: str = body.get('name')
    file_path: str = body.get('file_path')
    file_name : str = body.get('file_name')
    chunk_size: int = 256 #body.get('chunk_size', 256)

    if not (name and file_path and isinstance(file_path, str) and isinstance(name, str)):
        return {"code": 400, "msg": '知识库名称和文件路径不能为空', "data": {}}

    if not (isinstance(chunk_size, int) and 100<chunk_size<=1024):
        return {"code": 400, "msg": '分词长度不合法，请输入100-1024的整数', "data": {}}
    file_path = file_path.strip()
    if not os.path.exists(file_path):
        return {"code": 400, "msg": f'文件{file_path}不存在', "data": {}}

    if os.path.isdir(file_path):
        return {"code": 400, "msg": '请输入文件路径，而不是文件夹路径', "data": {}}

    code = files_status_manager.add_file(file_path, name, 'waitinglist')
    if code == 0:
        return {"code": 400, "msg": '该文库已经入库过', "data": {}}
    MESSAGE_QUEUE.put((AsyncTaskType.LOADER_DATA_BY_FILE.value,
                       name, # 知识库名称
                       file_path,  # 文件路径
                       chunk_size,  # 分块大小
                       file_name,  # 文件名称
                       -1,         # 起始位置
                       '',        # 分块数据存储路径
                       ''         # 日志位置
                       ))
    return {"code": 200, "msg": 'ok', "data": {}}

@router.post('/knowledgebase/archive_file_reload')
async def archive_file_knowledgebase_again(body: dict):
    """
    文件重新入库，状态为切片完成或者切片失败的文件，都可以重新入数据集

    """
    name: str = body.get('name')
    file_path: str = body.get('file_path')
    chunk_size: int = 256 #body.get('chunk_size', 256)

    if not (name and file_path and isinstance(file_path, str) and isinstance(name, str)):
        return {"code": 400, "msg": '知识库名称和文件路径不能为空', "data": {}}

    if not (isinstance(chunk_size, int) and 100<chunk_size<=1024):
        return {"code": 400, "msg": '分词长度不合法，请输入100-1024的整数', "data": {}}
    file_path = file_path.strip()
    if not os.path.exists(file_path):
        return {"code": 400, "msg": f'文件{file_path}不存在，无法再重新入库', "data": {}}

    code, status = files_status_manager.get_file_status_info(file_path, name)
    if code == 0:
        return {"code": 400, "msg": '该文库已经入库过', "data": {}}

    if status not in ('processed', 'failed'):
        return {'code': 400, 'msg': '只有处理完成或者处理失败的文件才能重新入库', 'data': {}}
    else:
        # 删除向量数据库里旧数据
        MESSAGE_QUEUE.put((AsyncTaskType.DELETE_DATA_BY_FILE_FROM_VB.value,
                           name, file_path, chunk_size, None, -1, '', ''))
        # 重新切片
        MESSAGE_QUEUE.put((AsyncTaskType.LOADER_DATA_BY_FILE.value,
                           name, file_path, chunk_size, None, -1, '', '',))
        files_status_manager.update_file_status(file_path, name, 'waitinglist')
        return {"code": 200, "msg": 'ok', "data": {}}


@router.post('/knowledge/delete_by_file')
async def delete_by_file(body: dict):
    """
    删除数据集某个文件
    :param body:
    :return:
    """
    name: str = body.get('name')
    file_path: str = body.get('file_path')
    if not (name and file_path and isinstance(file_path, str) and isinstance(name, str)):
        return {"code": 400, "msg": '知识库名称和文件路径不能为空', "data": {}}
    code, status = files_status_manager.get_file_status_info(file_path, name)
    if code == 0:
        return {'code': 400, 'msg': '知识库里没有这个文件信息'}
    if status == 'deleting':
        return {'code': 400, 'msg': '正在删除中，不能重复删除'}
    if status in ('processed','failed', 'delete_failed'):
        files_status_manager.update_file_status(file_path, name, 'deleting')
        MESSAGE_QUEUE.put((AsyncTaskType.DELETE_DATA_BY_FILE.value,
                           name, file_path, 0, None, -1, '', ''))
        return {"code": 200, "msg": 'ok', "data": {}}
    else:
        return {'code': 400, 'msg': '正在入库的文件不能删除'}


@router.post('/knowledge/batch_delete_by_file')
async def batch_delete_by_file(body: dict):
    """
    删除数据集里多个文件
    :param body:
    :return:
    """

    name: str = body.get('name')
    file_path_list: str = body.get('file_path_list')
    if not (name and file_path_list and isinstance(file_path_list, list) and isinstance(name, str)):
        return {"code": 400, "msg": '知识库名称和文件路径参数不合法', "data": {}}
    code, file_status_list = files_status_manager.get_file_status_list(file_path_list, name)
    if code == 0:
        return {'code': 400, 'msg': '知识库里没有这些文件信息'}
    update_file_path_list = []
    for file_path, status in file_status_list:
        if status in ('processed', 'failed', 'delete_failed'):
            update_file_path_list.append(file_path)
            MESSAGE_QUEUE.put((AsyncTaskType.DELETE_DATA_BY_FILE.value,
                               name, file_path, 0, None, -1, '', ''))
    if update_file_path_list:
        files_status_manager.batch_update_file_status(update_file_path_list, name, 'deleting')
        return {"code": 200, "msg": 'ok', "data": {}}
    else:
        return {'code': 400, 'msg': '正在入库的文件不能删除'}



@router.post('/knowledge/active_file')
async def active_file(body: dict):
    """
    启用数据集里某个文件
    :param body:
    :return:
    """
    name: str = body.get('name')
    file_path: str = body.get('file_path')

    if not (name and file_path and isinstance(file_path, str) and isinstance(name, str)):
        return {"code": 400, "msg": '知识库名称和文件路径不能为空', "data": {}}
    files_status_manager.update_file_used_status(file_path, name, 1)
    return {"code": 200, "msg": 'ok', "data": {}}


@router.post('/knowledge/batch_active_file')
async def batch_active_file(body: dict):
    """
    启用数据集里多个文件
    :param body:
    :return:
    """
    name: str = body.get('name')
    file_path_list: str = body.get('file_path_list')
    if not (name and file_path_list and isinstance(file_path_list, list) and isinstance(name, str)):
        return {"code": 400, "msg": '知识库名称和文件路径参数不合法', "data": {}}
    files_status_manager.batch_update_file_used_status(file_path_list, name, 1)
    return {"code": 200, "msg": 'ok', "data": {}}


@router.post('/knowledge/disable_file')
async def disable_file(body: dict):
    """
    禁用数据集里某个文件
    :param body:
    :return:
    """
    name: str = body.get('name')
    file_path: str = body.get('file_path')

    if not (name and file_path and isinstance(file_path, str) and isinstance(name, str)):
        return {"code": 400, "msg": '知识库名称和文件路径不能为空', "data": {}}
    files_status_manager.update_file_used_status(file_path, name, 0)
    return {"code": 200, "msg": 'ok', "data": {}}


@router.post('/knowledge/batch_disable_file')
async def batch_disable_file(body: dict):
    """
    禁用数据集里多个文件
    :param body:
    :return:
    """
    name: str = body.get('name')
    file_path_list: str = body.get('file_path_list')
    if not (name and file_path_list and isinstance(file_path_list, list) and isinstance(name, str)):
        return {"code": 400, "msg": '知识库名称和文件路径参数不合法', "data": {}}
    files_status_manager.batch_update_file_used_status(file_path_list, name, 0)
    return {"code": 200, "msg": 'ok', "data": {}}


@router.post('/knowledge/cancel_file')
async def cancel_file(body: dict):
    """
    取消数据集里某个waitinglist状态的文件chunking的入库
    :param body:
    :return:
    """
    name: str = body.get('name')
    file_path: str = body.get('file_path')


@router.post('/knowledge/batch_cancel_file')
async def batch_cancel_file(body: dict):
    """
    取消数据集里多个waitinglist状态的文件chunking的入库
    :param body:
    :return:
    """
    name: str = body.get('name')
    file_path_list: str = body.get('file_path_list')
