# coding=utf-8
import re

from markdown import markdown

from src.diversefile.abc import AbstractLoader, HtmlCommonLoader

class MarkdownLoader(AbstractLoader):

    def load(self):
        if self.is_filepath:
            with open(self.file_path, 'r', encoding='utf-8', errors='ignore') as f:
                txt = f.read()
        else:
            txt = self.file_path

        html_str = markdown(txt)
        lines = HtmlCommonLoader(html_str, is_filepath=False).load()
        for line in lines:
            yield line