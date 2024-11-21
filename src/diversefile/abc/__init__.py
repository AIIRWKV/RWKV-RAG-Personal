# coding=utf-8

from abc import ABC, abstractmethod

TEXT_CHUNK_SIZE = 256  # 默认分词块大小
TEXT_DELIMITER = {'\n','!','?',';','。','；','！','？'}  # 默认一句话的终止符


class AbstractLoader(ABC):

    def __init__(self, file_path: str, chunk_size:int=TEXT_CHUNK_SIZE, delimiter=None, is_filepath: bool=True):
        if delimiter is None:
            delimiter = TEXT_DELIMITER
        self.file_path = file_path
        self.chunk_size = chunk_size
        self.delimiter = delimiter
        self.is_filepath = is_filepath

    @abstractmethod
    def load(self):
        pass
