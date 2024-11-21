# coding=utf-8
import re

from markdown import markdown
from triton.compiler.compiler import ptx_prototype_pattern

from src.diversefile.abc import AbstractLoader

class MarkdownLoader(AbstractLoader):

    def load(self):
        if self.is_filepath:
            with open(self.file_path, 'r', encoding='utf-8', errors='ignore') as f:
                txt = f.read()
        else:
            txt = self.file_path

        remainder, tables = self.extract_tables_and_remainder(f'{txt}\n')
        sections = []
        tbls = []
        for sec in remainder.split("\n"):
            if len(sec) > 10 * self.chunk_size:
                sections.append((sec[:int(len(sec) / 2)], ""))
                sections.append((sec[int(len(sec) / 2):], ""))
            else:
                if sections and sections[-1][0].strip().find("#") == 0:
                    sec_, _ = sections.pop(-1)
                    sections.append((sec_+"\n"+sec, ""))
                else:
                    sections.append((sec, ""))

        for table in tables:
            tbls.append(((None, markdown(table, extensions=['markdown.extensions.tables'])), ""))
        return sections, tbls

    @staticmethod
    def extract_tables_and_remainder(markdown_text):
        table_pattern = re.compile(
            r'''
            (?:\n|^)                     
            (?:\|.*?\|.*?\|.*?\n)        
            (?:\|(?:\s*[:-]+[-| :]*\s*)\|.*?\n) 
            (?:\|.*?\|.*?\|.*?\n)+
            ''', re.VERBOSE)
        tables = table_pattern.findall(markdown_text)
        remainder = table_pattern.sub('', markdown_text)

        no_border_table_pattern = re.compile(
            r'''
            (?:\n|^)                 
            (?:\S.*?\|.*?\n)
            (?:(?:\s*[:-]+[-| :]*\s*).*?\n)
            (?:\S.*?\|.*?\n)+
            ''', re.VERBOSE)
        no_border_tables = no_border_table_pattern.findall(remainder)
        tables.extend(no_border_tables)
        remainder = no_border_table_pattern.sub('', remainder)
        return remainder, tables