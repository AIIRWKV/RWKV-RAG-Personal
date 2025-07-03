# coding=utf-8
import json
from typing import IO
from datetime import datetime

from .abc import AbstractLoader, HtmlCommonLoader
from .docx_loader import DocxLoader
from .excel_loader import ExcelLoader
from .html_loader import HtmlLoader
from .markdown_loader import MarkdownLoader
from .txt_loader import TxtLoader
from .pdf_loader import PDFLoader
from .internet_search import search_internet


import os

class Loader:
    """
    加载器，用来分割本地文件
    """
    def __init__(self, file_path: str, chunk_size:int, wf: IO, filename: str=None):
        """
        :param file_path: 文件路径或者目录地址
        :param chunk_size: 块大小
        """
        self.file_path = file_path
        self.chunk_size = chunk_size
        self.output_path = ''
        self.filename = filename # 用户自定义文件名
        self.wf = wf # 日志句柄

        if not os.path.exists(file_path):
            self.wf.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  原文件{file_path}不存在， 任务终止\n")
            raise FileNotFoundError(f"File or Directory not found: {file_path}")
        if os.path.isdir(file_path):
            self.wf.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  {file_path}是目录，暂时不支持，任务终止\n")
            raise NotImplementedError("Directory is not supported yet")

    def load_txt(self):
        loader = TxtLoader(self.file_path, chunk_size=self.chunk_size)
        return loader.load()

    def load_pdf(self):
        loader = PDFLoader(self.file_path, chunk_size=self.chunk_size)
        return loader.load()


    def load_excel(self):
        loader = ExcelLoader(self.file_path, chunk_size=self.chunk_size)
        return loader.load()

    def load_docx(self):
        loader = DocxLoader(self.file_path, chunk_size=self.chunk_size)
        return loader.load()

    def load_html(self):
        loader = HtmlLoader(self.file_path, chunk_size=self.chunk_size)
        return loader.load()

    def load_markdown(self):
        loader = MarkdownLoader(self.file_path, chunk_size=self.chunk_size)
        return loader.load()


    def load_and_split_file(self, output_dir: str):
        # TODO  后续会支持多模态，应该要智能切割
        base_filename, file_ext = os.path.splitext(os.path.basename(self.file_path))
        if self.filename:
            base_filename = self.filename

        file_ext = file_ext.lstrip('.')
        file_ext = file_ext.lower()
        if file_ext == 'docx':
            func = self.load_docx
        elif file_ext == 'pdf':
            func = self.load_pdf
        elif file_ext == 'xlsx' or file_ext == 'xls':
            func = self.load_excel
        elif file_ext in ('txt', 'py', 'js', 'java', 'c', 'cpp', 'h', 'php', 'go', 'ts', 'sh', 'cs', 'kt', 'sql'):
            func = self.load_txt
        elif file_ext == 'md' or file_ext == 'markdown':
            func = self.load_markdown
        elif file_ext == 'html' or file_ext == 'htm':
            func = self.load_html
        else:
            raise NotImplementedError(
                "file type not supported yet(pdf, xlsx, docx, txt, markdown, html supported)")
        if func and callable(func):
            output_file = os.path.join(output_dir, f"{base_filename}_chunked.jsonl")
            self.output_path = output_file
            # with open(output_file, 'w', encoding='utf-8') as f:
            for item in func():
                if item:
                        # key = calculate_string_md5(item)
                        #yield (key, item)
                        yield item
                        # json_data = json.dumps({'key': key, 'text': item}, ensure_ascii=False)
                        # f.write(json_data)
                        # f.write("\n")


