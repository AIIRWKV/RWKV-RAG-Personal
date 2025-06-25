#coding=utf-8
"""
联网搜索
"""
import time
import random
import asyncio

from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

from .utils import text_summary
from src.diversefile import HtmlCommonLoader




class BaseSearch(object):
    """
    抽象搜索
    """

    def __init__(self):
        self.browser = None

    async def setup(self):  # 异步初始化
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch()

    async def close(self):
        await self.browser.close()

    async def scrape_url_content(self, url, sleep_time_max=0):
        context = await self.browser.new_context()  # 复用浏览器，创建轻量级上下文
        page = await context.new_page()
        if sleep_time_max > 0:
            t = random.random() * sleep_time_max
            time.sleep(round( t, 1))

        await page.goto(url, timeout=30000, wait_until="networkidle")
        html_doc = await page.content()
        await context.close()
        return html_doc

    async def batch_scrape_url_content(self, urls, sleep_time_max=0):
        tasks = [self.scrape_url_content(url, sleep_time_max) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

    def search(self, query, need_html=True):
        """
        搜索
        :return [{
        "title": "xxxx",
        "url": "xxxxx",
        "summary": "xxxxx",
        "snippet": "xxxx"
        }]
        """
        pass




class BaiduSearch(BaseSearch):
    """
    百度搜索
    """

    async def search(self, query, deepsearch=False):
        # 主要爬取咨询和笔记两个部分的联网搜索
        result1 = await self._search_note(query)
        result2 = await self._search_news(query)
        yield result1 + result2

        urls1 = [line['url'] for line in result1] # 百度笔记，百度站内搜索，太频繁会限频
        html_texts1 = await self.batch_scrape_url_content(urls1, sleep_time_max=2)
        new_result = []
        for i, html_tex in enumerate(html_texts1):
            if html_tex:
                texts = HtmlCommonLoader.parser_txt(html_tex)
                if texts:
                    text = '\n'.join(texts)
                    if deepsearch:
                        result1[i]['summary'] = text
                        new_result.append(result1[i])
                    else:
                        text = text_summary(text)
                        if text:
                            result1[i]['summary'] = text
                            new_result.append(result1[i])

        urls2 = [line['url'] for line in result2]
        html_texts2 = await self.batch_scrape_url_content(urls2)
        for i, html_tex in enumerate(html_texts2):
            if html_tex:
                texts = HtmlCommonLoader.parser_txt(html_tex)
                if texts:
                    text = '\n'.join(texts)
                    if deepsearch:
                        result2[i]['summary'] = text
                        new_result.append(result2[i])
                    else:
                        text = text_summary(text)
                        if text:
                            result2[i]['summary'] = text
                            new_result.append(result2[i])

        yield new_result

    async def _search_note(self, query):
        note_url = f'https://www.baidu.com/s?pd=note&rpf=pc&word={query}'
        count = 0

        html_doc = await self.scrape_url_content(note_url)
        soup = BeautifulSoup(html_doc, 'html.parser')
        article_list = soup.find_all('article')
        data = []
        for article in article_list:
            h3 = article.find('h3')
            if h3:
                title = h3.text
                if title:
                    rl_link_href = article.get('rl-link-href')
                    rl_link_data_url = article.get('rl-link-data-url')
                    href = rl_link_href or rl_link_data_url
                    if href:
                        count += 1
                        data.append({'title': title, 'url': href, 'snippet': ''})
                        if count >= 10:
                            break
        return data


    async def _search_news(self, query):
        news_url = f'https://www.baidu.com/s?rtt=1&bsst=1&cl=2&tn=news&ie=utf-8&word={query}'
        html_doc = await self.scrape_url_content(news_url)

        soup = BeautifulSoup(html_doc, 'html.parser')
        content_left = soup.find('div', id='content_left')
        data = []
        count = 0
        if content_left:
            result_list = content_left.find_all('div', id=True)

            for result in result_list:
                id_ = result.get('id')
                if id_ and id_.isdigit():
                    h3 = result.find('h3')
                    if h3:
                        title = h3.text
                        if title:
                            mu = result.get('mu')
                            a = result.find('a')
                            if a:
                                a_href = a.get('href')
                            else:
                                a_href = ''
                            href = a_href or mu
                            if href:
                                body = ''
                                span = result.find('span', class_="c-font-normal c-color-text")
                                if span:
                                    body = span.text
                                data.append({'title': title, 'url': href, 'snippet': body})
                                count += 1
                                if count >= 10:
                                    break
        return data



class SogouSearch(BaseSearch):
    """
    搜狗搜索， 搜狗搜索基本没有广告， 不需要做复杂的广告过滤
    """
    @staticmethod
    def _search(query, max_results=20):
        """
        爬取搜索引擎
        :param query:
        :param max_results:
        :return:
        """
    def search(self, query, max_results=20):
        pass



class DuckDuckGoSearch(BaseSearch):
    """
    DuckDuckGo 搜索
    """
    async def search(self, query, deepsearch=False):
        from duckduckgo_search import DDGS

        with DDGS() as ddgs:
            result = ddgs.text(query, max_results=20, region='cn-zh')
            urls = []
            for item in result:
                url = item.pop('href')
                body = item.pop('body')
                urls.append(url)
                item['url'] = url
                item['snippet'] = body

            html_texts = await self.batch_scrape_url_content(urls)
            new_result = []
            for i, html_tex in enumerate(html_texts):
                if html_tex:
                    texts = HtmlCommonLoader.parser_txt(html_tex)
                    if texts:
                        text = '\n'.join(texts)
                        if deepsearch:
                            result[i]['summary'] = text
                            new_result.append(result[i])
                        else:
                            text = text_summary(text)
                            if text:
                                result[i]['summary'] = text_summary(text)
                                new_result.append(result[i])
            return new_result


async def search_internet(query, deepsearch=False, search_engine_name='baidu'):
    if search_engine_name == 'baidu':
        b = BaiduSearch()
        await b.setup()
        result =  b.search(query, deepsearch)
        return result
    return []


