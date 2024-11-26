# coding=utf-8
from .abc import AbstractLoader, HtmlCommonLoader
from .docx_loader import DocxLoader
from .excel_loader import ExcelLoader
from .html_loader import HtmlLoader
from .markdown_loader import MarkdownLoader
from .txt_loader import TxtLoader


import os
import io
import subprocess
from typing import Literal


import fitz

class Loader:
    """
    加载器，用来分割本地文件
    """
    def __init__(self, file_path: str, chunk_size:int):
        """
        :param file_path: 文件路径或者目录地址
        :param chunk_size: 块大小
        """
        self.file_path = file_path
        self.chunk_size = chunk_size
        self._files = []
        self.output_files = []
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File or Directory not found: {file_path}")
        if os.path.isdir(file_path):
            for _file in os.listdir(file_path):
                _file_path = os.path.join(file_path, _file)
                if os.path.isfile(_file_path):
                    self._files.append(_file_path)
        else:
            self._files = [self.file_path]

    def load_txt(self, file_path: str):
        chunk_size = self.chunk_size




    def load_pdf(self, file_path: str, split_type=None, lang='中文'):
        pass


    def load_xlsx(self, file_path: str):
        """
        Load excel
        :param file_path: excel file path
        :param split_type: 'cell', 'row'
                           cell: 按excel的单元格来分割，此时chunk_size, chunk_overlap参数无效
                           row: 按行读取，并用chunk_size, chunk_overlap的方式分割
        """
        pass
    load_xls = load_xlsx

    def load_and_split_file(self, output_dir: str,  split_type='cell', lang='中文'):
        for path in self._files:
            base_filename, file_ext = os.path.splitext(os.path.basename(path))
            file_ext = file_ext.lstrip('.')
            func = getattr(self, f'load_{file_ext}', None)
            lang = lang
            if func and callable(func):
                output_file = os.path.join(output_dir, f"{base_filename}_chunks.txt")
                self.output_files.append(output_file)
                with open(output_file, 'w', encoding='utf-8') as f:
                    for item in func(path, split_type=split_type, lang=lang):
                        if item:
                            yield (item, output_file)
                            f.write(item)
                            f.write('\n')


