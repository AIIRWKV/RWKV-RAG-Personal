#coding=utf-8
from pydantic import BaseModel, Field

class AddCollectionFrom(BaseModel):
    name: str = Field(..., description="知识库名称", pattern=r'^[a-zA-Z0-9][a-zA-Z0-9_]{1,31}[a-zA-Z0-9]$')
