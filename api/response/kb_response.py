#coding=utf-8
from typing import List

from pydantic import BaseModel, Field
from api.response import BaseResponse

class CollectionListItemMeta(BaseModel):
    create_time: str = Field(..., description="创建时间")


class CollectionListItem(BaseModel):
    name: str = Field(..., description="知识库名称")
    count: int = Field(..., description="文件数量")
    meta: CollectionListItemMeta = Field(..., description="元数据")


class CollectionListResponse(BaseResponse):
    data: List[CollectionListItem]


class CollectionFileListItem(BaseModel):
    file_path: str = Field(..., description="文件路径")
    create_time: str = Field(..., description="创建时间")
    status: str = Field(..., description="处理状态")


class CollectionFileListResponse(BaseResponse):
    data: List[CollectionFileListItem]


class CollectionFileListCountResponse(BaseResponse):
    data: int