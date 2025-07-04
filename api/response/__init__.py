#coding=utf-8

from pydantic import BaseModel

class BaseResponse(BaseModel):
    code: int = 200  # 默认状态码
    msg: str = "ok"  # 默认消息