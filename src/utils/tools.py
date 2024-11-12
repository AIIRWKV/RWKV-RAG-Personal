# coding=utf-8
import random
import string


def quote_filename(name: str):
    """
    对于一些含有特殊字符串的进行转义，操作系统文件名不支持这些特殊字符串
    """
    if not name:
        return name
    special_chars = {
        '<': '%3C',
        '>': '%3E',
        ':': '%3A',
        '"': '%22',
        '/': '%2F',
        '\\': '%5C',
        '|': '%7C',
        '?': '%3F',
        '*': '%2A',
        ' ': ''
    }

    return ''.join([special_chars.get(n, n) for n in name])


def get_random_string(length):
    """
    获取指定长度的随机字符串
    """
    haracters = string.ascii_uppercase + string.digits
    return ''.join(random.choices(haracters, k=length))
