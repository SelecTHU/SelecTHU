# 用于在登录后获取培养方案
from faker import Faker

import bs4
import httpx
import logging


class Curriculum:
    base_url = r"https://zhjwxk.cic.tsinghua.edu.cn"

    curr_url = "jhBks.vjhBksPyfakcbBs.do"

    def __init__(self, p_xnxq, cookies, logger):
        # 学年学期
        self.p_xnxq = p_xnxq

        self.params = {
            "m": "showBksZxZdxjxjhXmxqkclist",
            "p_xnxq": p_xnxq,
            "pathContent": "本学期教学计划",
        }

        # 使用登录cookies
        self.cookies = cookies

        # 伪造请求头
        self.headers = httpx.Headers()
        self.headers.update(
            {
                "User-Agent": Faker().user_agent(),
            }
        )

        # 创建httpx客户端
        self.client = httpx.Client(
            cookies=self.cookies, headers=self.headers, base_url=self.base_url
        )

        self.logger = logger

    def __del__(self):
        self.logger.info("关闭httpx客户端")
        if self.client is not None:
            self.client.close()

    def _get_text(self, td):
        if td.find("span") != None:
            span = td.find("span")
            if span.get("title") != None:
                return span["title"].strip()
            else:
                return span.get_text().strip()
        else:
            return td.get_text().strip()

    def _parse_curriculum(self, curriculum):
        self.logger.info("开始解析培养方案")

        soup = bs4.BeautifulSoup(curriculum, "html.parser")

        # 先找到 table  id="kcTable">
        table = soup.find("table", id="kcTable")
        user_curriculum = []

        # 先找到所有的表头
        keys = []
        tr1 = table.find("tr", class_="trr1")
        for td in tr1.find_all("td"):
            keys.append(self._get_text(td).strip())

        # 遍历所有信息
        tr2s = table.find_all("tr", class_="trr2")
        for tr in tr2s:
            # 找到所有的 td
            tds = tr.find_all("td")

            course = {}
            # 遍历所有的 td
            for td in tds:
                course[keys[tds.index(td)]] = self._get_text(td).strip()

            user_curriculum.append(course)

        return user_curriculum

    def get_curriculum(self):
        try:
            self.logger.info("开始获取培养方案")
            response = self.client.get(self.curr_url, params=self.params)
            self.logger.info("获取成功")

            curriculum = self._parse_curriculum(response.text)
            return curriculum
        except Exception as e:
            self.logger.error(f"获取失败: {e}")
            return None
