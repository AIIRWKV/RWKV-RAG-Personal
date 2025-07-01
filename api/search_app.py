#coding=utf-8
"""
联网搜索
"""
import json

from fastapi import APIRouter


from configuration import config as project_config
from src.diversefile import search_internet


router = APIRouter(tags=["联网搜索"])

async def _internet_search(query: str, deepsearch=False, search_engine_name='baidu'):
    results = await search_internet(query, deepsearch, search_engine_name)
    summary = []
    i = 0
    async for msg in results:
        summary = msg
        json_msg = json.dumps(msg, ensure_ascii=False)
        if i == 0:
            yield f"data: {json_msg}\n\n"  # 封装为SSE格式[1](@ref)
        i += 1
        # print(json_msg)

    # 重排序
    if summary and isinstance(summary[0], dict) and 'summary' in summary[0]:
        summary_list = [i['summary'] for i in summary]
        # print(summary_list)
        # print(len(summary_list))
        cross_scores = llm_service_worker.get_cross_scores({"texts_0": [query] * len(summary_list),
                                                            "texts_1": summary_list,
                                                            "rerank_path": project_config.default_rerank_path})
        cross_scores = [(i, item) for i, item in enumerate(cross_scores)]
        cross_scores.sort(key=lambda x: x[1], reverse=True)
        cross_scores = cross_scores[:10]
        summaries = [summary_list[i[0]] for i in cross_scores]
        txt = '\n'.join(summaries)
        cmd = {
            "instruction": query,
            "input_text": txt,
            "state_file": '',
            "template_prompt": None,
            "base_model_path": None

        }
        sampling_results = llm_service_worker.sampling_generate(cmd)
        yield f'data: {sampling_results}\n\n'


@router.get("/internet_search")
async def internet_search(query: str, deepsearch=False, search_engine_name='baidu'):
    from fastapi.responses import StreamingResponse
    async def event_stream():
        try:
            async for msg in _internet_search(query, deepsearch, search_engine_name):
                yield msg
        except Exception as e:
            yield f"event: error\ndata: {json.dumps({'msg': str(e)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # 禁用代理缓冲[2](@ref)
        }
    )
