import requests
from bs4 import BeautifulSoup
import re
import time
import json

def getPostData(soup, m, page):
    ret = {}
    form = soup.find("form")
    for inp in form.find_all("input"):
        name = inp.get("name")
        value = inp.get("value")
        if name != None and value != None:
            ret[name] = value
    for sel in form.find_all("select"):
        name = sel.get("name")
        value = ""
        if name != None:
            ret[name] = value
    ret["m"] = m
    ret["page"] = page
    return ret

def fetchData(m):
    req = requests.Session()
    req.cookies.set("JSESSIONID", "<...>")

    url = "https://zhjwxk.cic.tsinghua.edu.cn/xkBks.xkBksZytjb.do"
    res = req.get(url, params = {
        "m": m,
        "p_xnxq": "2024-2025-2"
    })

    soup = BeautifulSoup(res.text, "lxml")
    maxPage = int(re.match(r"javascript:turn\s*\((\d+)\)", soup.find(id = "endpage")["href"]).group(1))

    if m == "tbzySearchBR":
        assert(maxPage == 157)
    elif m == "tbzySearchTy":
        assert(maxPage == 19)

    result = []

    for page in range(1, maxPage + 1):
        print("page", page)
        time.sleep(1)
        data = getPostData(soup, m, str(page))
        res = req.post(url, data = data)

        soup = BeautifulSoup(res.text, "lxml")
        table = soup.find("table")

        result.append(json.loads(re.search(r"var gridData = (\[[^;]*\]);", res.text).group(1)))

    return result

with open("result", "w") as f:
    print(fetchData("tbzySearchBR"), file = f)
    print(fetchData("tbzySearchTy"), file = f)

