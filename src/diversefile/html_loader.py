# coding=utf-8
import readability
import html_text

from src.diversefile.abc import AbstractLoader

class HtmlLoader(AbstractLoader):

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


    @classmethod
    def parser_txt(cls, txt):
        if type(txt) != str:
            raise TypeError("txt type should be str!")
        html_doc = readability.Document(txt)
        title = html_doc.title()
        content = html_text.extract_text(html_doc.summary(html_partial=True))
        txt = f"{title}\n{content}"
        sections = txt.split("\n")
        return sections