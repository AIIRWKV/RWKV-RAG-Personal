# coding=utf-8
"""
API Service
"""
import asyncio
import webbrowser
import json
import os
import sys
import subprocess
import atexit


import aiohttp
import uvicorn
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from configuration import (SERVER_PORT,
                           MESSAGE_QUEUE
                           )
from api.chat_app import router as chat_router
from api.config_app import router as config_router
from api.kb_app import router as kb_router
from api.kb_dataset_app import router as kb_dataset_router
from api.llm_app import router as llm_router
from api.model_app import router as model_router
from api.search_app import router as search_router

app = FastAPI()

# 假设前端文件在 "frontend/" 目录下
app.mount("/frontend_out", StaticFiles(directory="frontend_out", html=True), name="frontend_out")
app.include_router(chat_router, prefix='/api')
app.include_router(config_router, prefix='/api')
app.include_router(kb_router, prefix='/api')
app.include_router(kb_dataset_router, prefix='/api')
app.include_router(llm_router, prefix='/api')
app.include_router(model_router, prefix='/api')
app.include_router(search_router, prefix='/api')


@app.get('/api/ok')
async def ok():
    return {"code": 200, "msg": "ok", "data": {}}



@app.get('/api/message_queue/get')
async def get_message_queue():
    if MESSAGE_QUEUE.empty():
        return {"code": 200, "msg": '消息队列为空', "data": []}
    data = []
    while len(data) < 5 and not MESSAGE_QUEUE.empty():
        # 每次取五个
        item = MESSAGE_QUEUE.get(timeout=2)
        data.append(item)
    return {"code": 200, "msg": 'ok', "data": data}



# 据路径匹配的先后顺序，将静态文件放在最后
@app.get("/", response_class=FileResponse)
async def read_root():
    return FileResponse(path="frontend_out/index.html")


@app.get("/{full_path:path}")
async def serve_static_file(request: Request, full_path: str):
    # 构建文件路径
    _, ext = os.path.splitext(full_path)
    if ext:
        file_path = os.path.join("frontend_out", full_path)
    else:
        file_path = os.path.join("frontend_out", full_path + ".html")
    # 检查文件是否存在
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        # 如果文件不存在，返回 index.html
        return FileResponse("frontend_out/404.html")



def save_message_dequeues():
    """
    持久化消息队列
    :return:
    """
    data = []
    if MESSAGE_QUEUE.empty():
        return
    while not MESSAGE_QUEUE.empty():
        item = MESSAGE_QUEUE.get(timeout=2)
        data.append(item)
    if data:
        with open('cache/message_queue.json', 'w', encoding='utf8') as f:
            json.dump(data, f, ensure_ascii=False)


async def start_server():
    config = uvicorn.Config(app, host="0.0.0.0", port=SERVER_PORT)
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
    timeout = aiohttp.ClientTimeout(total=2)
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
    try:
        webbrowser.open(f"http://127.0.0.1:{SERVER_PORT}")
    except:
        pass

async def main():
    await asyncio.gather(start_server(), open_browser())

def run():
    asyncio.run(main())

atexit.register(save_message_dequeues)

if __name__ == "__main__":
    command = f'{sys.executable} async_task.py'
    subprocess.Popen(command, shell=True)
    run()

