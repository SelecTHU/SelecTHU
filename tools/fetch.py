import requests
from bs4 import BeautifulSoup
import re
import time

def getPostData(soup, page):
    ret = {}
    form = soup.find("form")
    for inp in form.find_all("input"):
        name = inp.get("name")
        value = inp.get("value")
        if name != None and value != None:
            ret[name] = value
    for sel in form.find_all("select"):
        name = inp.get("name")
        value = ""
        if name != None:
            ret[name] = value
    ret["m"] = "kkxxSearch"
    ret["page"] = page
    return ret

def getText(span):
    if span.get("title") != None:
        return span["title"]
    else:
        return span.get_text()

req = requests.Session()
req.cookies.set("JSESSIONID", "<Your JSESSIONID here>")

url = "https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksJxjhBs.do"
res = req.get(url, params = {
    "m": "kkxxSearch",
    "p_xnxq": "2024-2025-2"
})

soup = BeautifulSoup(res.text, "lxml")
maxPage = int(re.match(r"javascript:turn\((\d+)\)", soup.find(id = "endpage")["href"]).group(1))

assert(maxPage == 253)

maxPage = 1

result = []

for page in range(1, maxPage + 1):
    time.sleep(1)
    data = getPostData(soup, str(page))
    res = req.post(url, data = data)

    soup = BeautifulSoup(res.text, "lxml")
    table = soup.find("table")

    keys = []
    tr1 = table.find("tr", class_ = "trr1")
    for span in tr1.find_all("span"):
        keys.append(getText(span))

    for tr in table.find_all("tr", class_ = "trr2"):
        spans = tr.find_all("span")
        item = {}
        for i in range(len(spans)):
            item[keys[i]] = getText(spans[i])
        result.append(item)

print(result)
