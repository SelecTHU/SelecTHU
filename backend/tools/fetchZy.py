# 获取课程志愿数据
from bs4 import BeautifulSoup
from copy import deepcopy
from faker import Faker

import httpx
import json
import re
import time


class ZyFetcher:
    base_url = "https://zhjwxk.cic.tsinghua.edu.cn"
    search_url = "/xkBks.xkBksZytjb.do"

    def __init__(self, p_xnxq, cookies, logger):
        self.headers = httpx.Headers(
            {
                "User-Agent": Faker().user_agent(),
            }
        )
        self.cookies = cookies
        self.p_xnxq = p_xnxq

        self.client = httpx.Client(
            cookies=self.cookies, headers=self.headers, base_url=self.base_url
        )

        self.logger = logger

    def __del__(self):
        self.logger.info("关闭httpx客户端")
        if self.client is not None:
            self.client.close()

    def _get_post_data(self, soup, m, page):
        ret = {}
        form = soup.find("form")
        for inp in form.find_all("input"):
            name = inp.get("name")
            value = inp.get("value")
            if name is not None and value is not None:
                ret[name] = value
        for sel in form.find_all("select"):
            name = sel.get("name")
            if name is not None:
                ret[name] = ""
        ret["m"] = m
        ret["page"] = page
        return ret

    def _fetch_data(self, m):
        try:
            self.logger.info(f"开始获取{m}数据")

            res = self.client.get(
                self.search_url, params={"m": m, "p_xnxq": self.p_xnxq}
            )

            soup = BeautifulSoup(res.text, "html.parser")
            max_page = int(
                re.match(
                    r"javascript:turn\s*\((\d+)\)", soup.find(id="endpage")["href"]
                ).group(1)
            )

            self.logger.info(f"共{max_page}页")
            result = []

            for page in range(1, max_page + 1):
                self.logger.info(f"正在获取第{page}页")
                data = self._get_post_data(soup, m, str(page))
                res = self.client.post(self.search_url, data=data)
                soup = BeautifulSoup(res.text, "html.parser")

                page_data = json.loads(
                    re.search(r"var gridData = (\[[^;]*\]);", res.text).group(1)
                )
                result.append(page_data)

                time.sleep(0.3)

            self.logger.info(f"成功获取{m}数据")
            return deepcopy(result)

        except Exception as e:
            self.logger.error(f"获取数据失败: {e}")
            return None

    def fetch_data(self):
        result = {}
        for m in ["tbzySearchBR", "tbzySearchTy"]:
            result[m] = self._fetch_data(m)
        return result
