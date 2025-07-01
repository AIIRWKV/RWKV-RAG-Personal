#coding=utf-8
"""
跟大模型有关的操作
"""
import json
from typing import List
from datetime import datetime

from fastapi import APIRouter

from src.services import (index_service_worker,
                          files_status_manager)
from configuration import config as project_config


router = APIRouter(tags=["大模型接口"])


@router.post('/llm/get_embeddings')
async def get_embeddings(body: dict):
    """
    获取embedding
    """
    text = body.get('text')
    if not text:
        return {"code": 400, "msg": '文本不能为空'}
    if isinstance(text, str):
        text = [text]
    embeddings = llm_service_worker.get_embeddings({'texts':text, "bgem3_path": project_config.default_embedding_path})
    return {"code": 200, "msg": 'ok', "data": embeddings.tolist()}


@router.post('/llm/cross_score')
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


@router.post('/llm/batch_cross_score')
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


@router.post('/llm/generate')
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