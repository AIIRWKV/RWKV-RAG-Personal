# coding=utf-8

from abc import ABC, abstractmethod

TEXT_CHUNK_SIZE = 256  # 默认分词块大小
TEXT_DELIMITER = {'\n','!','?',';','。','；','！','？'}  # 默认一句话的终止符


class AbstractLoader(ABC):

    def __init__(self, file_path: str, chunk_size:int=TEXT_CHUNK_SIZE, delimiter=None):
        if delimiter is None:
            delimiter = TEXT_DELIMITER
        self.file_path = file_path
        self.chunk_size = chunk_size
        self.delimiter = delimiter

    @abstractmethod
    def load(self):
        pass


if __name__ == '__main__':
    import re

    delimiter = "\n!?;。；！？"
    dels = []
    s = 0
    for m in re.finditer(r"`([^`]+)`", delimiter, re.I):
        f, t = m.span()
        print(f, t)
        dels.append(m.group(1))
        dels.extend(list(delimiter[s: f]))
        s = t
    if s < len(delimiter):
        dels.extend(list(delimiter[s:]))
    dels = [re.escape(d) for d in delimiter if d]
    dels = [d for d in dels if d]
    dels = "|".join(dels)
    print(dels)
