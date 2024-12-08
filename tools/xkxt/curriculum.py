# 用于在登录后获取培养方案
from faker import Faker

import httpx
import logging


class Curriculum:
    base_url = r"https://zhjwxk.cic.tsinghua.edu.cn"

    curr_url = "jhBks.vjhBksPyfakcbBs.do?m=showBksZxZdxjxjhXmxqkclist"

    def __init__(self, p_xnxq, cookies):
        # 学年学期
        self.p_xnxq = p_xnxq

        self.params = {"p_xnxq": p_xnxq, "pathContent": "本学期教学计划"}

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

        self.logger = logging.getLogger("Curriculum")

    def __del__(self):
        self.logger.info("关闭httpx客户端")
        self.client.close()

    def get_curriculum(self):
        try:
            self.logger.info("开始获取培养方案")
            response = self.client.get(self.curr_url, params=self.params)
            self.logger.info("获取成功")
            return response.text
        except Exception as e:
            self.logger.error(f"获取失败: {e}")
            return None
