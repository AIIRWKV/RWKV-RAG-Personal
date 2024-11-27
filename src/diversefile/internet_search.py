#coding=utf-8
"""
联网搜索
"""
import os

import requests

from src.diversefile import HtmlLoader
def search_on_baike(query, output_dir, filename=None):
    if filename is None:
        filename = f'{query}.txt'
    filepath = os.path.join(output_dir, filename)

    headers = {'user-agent': 'Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
               'referer': 'https://baike.baidu.com'}
    try:
        response = requests.get(f'https://baike.baidu.com/item/{query}', headers=headers, timeout=8, allow_redirects=False)
    except:
        raise Exception("网络错误")
    if 200 <=response.status_code <400:
        html_content = response.text
        html_content = html_content.strip()
        if not html_content:
            raise ValueError("百度百科没有该词条简介，请重新输入关键词")
        content_text = HtmlLoader.parser_txt(html_content, just_need_content=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content_text)
        return content_text, filepath