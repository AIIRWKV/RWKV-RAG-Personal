import os
from naotool.httpn import AutoCloseAsyncClient
from lxml import etree


async def search_on_baike(q, output_directory=".", filename=None):
    if filename is None:
        filename = f"{q}.txt"
    path = os.path.join(output_directory, filename)
    async with AutoCloseAsyncClient() as client:
        res = await client.get(f"https://baike.baidu.com/item/{q}")
        if res.status_code == 302:
            new_url = res.headers.get("Location")
            new_url = f"https://baike.baidu.com{new_url}"
            print(f"重定向到: {new_url}")
            res = await client.get(new_url)  # 重新请求新 URL
        if res.is_error:
            return ""
        dom = etree.HTML(res.text)
        div = dom.xpath('//div[@id="J-lemma-main-wrapper"]')[0]
        text_list = div.xpath(".//text()")
        text = "\n".join(str(item).strip() for item in text_list)
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
