# coding=utf-8

from abc import ABC, abstractmethod

import readability
import html_text

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


class HtmlCommonLoader(AbstractLoader):
    """
    html 解析，用的是非AI方式
    """

    def load(self):
        if self.is_filepath:
            with open(self.file_path, 'r', encoding='utf-8', errors='ignore') as f:
                txt = f.read()
        else:
            txt = self.file_path
        sections = self.parser_txt(txt)
        current_txt = ''
        for line in sections:
            if len(current_txt) >= self.chunk_size:
                yield current_txt
                current_txt = ''
            current_txt +=  line.strip()
        if current_txt:
            yield current_txt

    @classmethod
    def parser_txt(cls, txt):
        html_doc = readability.Document(txt)
        content = html_text.extract_text(html_doc.summary(html_partial=True))
        sections = content.split("\n")
        sections = [section for section in sections if section.strip()]
        return sections


