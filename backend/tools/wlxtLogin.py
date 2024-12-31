# 用于提交网络学堂登录信息的脚本
from faker import Faker
from requests.adapters import HTTPAdapter
from urllib3.util.ssl_ import create_urllib3_context

import bs4
import re
import requests
import time
import urllib3


class CustomSslContextHttpAdapter(HTTPAdapter):
    """"Transport adapter" that allows us to use a custom ssl context object with the requests."""
    def init_poolmanager(self, connections, maxsize, block=False):
        ctx = create_urllib3_context()
        ctx.load_default_certs()
        ctx.options |= 0x4  # ssl.OP_LEGACY_SERVER_CONNECT
        self.poolmanager = urllib3.PoolManager(ssl_context=ctx)


class Login:
    base_url = "https://learn.tsinghua.edu.cn"
    login_page = "/f/login"
    login_form_url = "https://id.tsinghua.edu.cn/do/off/ui/auth/login/post/bb5df85216504820be7bba2b0ae1535b/0?/login.do"

    def __init__(self, username, password, logger):
        self.username = username
        self.password = password


        self.headers = {
            "User-Agent": Faker().user_agent(),
        }

        self.data = {
            "i_user": username,
            "i_pass": password,
            "atOnce": "true",
        }

        # 创建自定义SSL上下文
        self.client = requests.Session()
        self.client.headers.update(self.headers)
        self.client.mount("https://id.tsinghua.edu.cn/",  CustomSslContextHttpAdapter())

        self.logger = logger

    def __del__(self):
        self.logger.info("关闭客户端")
        if self.client is not None:
            self.client.close()
        return None
    
    def login(self, retries: int = 3):
        while retries > 0:
            try:
                self.logger.info("开始登录")
                resp = self.client.get(f"{self.base_url}{self.login_page}")

                soup = bs4.BeautifulSoup(resp.text, "html.parser")
                login_form_url = soup.find(id="loginForm").get("action")
                login_form_url = login_form_url if login_form_url else self.login_form_url
                self.logger.info("获取登录页面成功")

                resp = self.client.post(login_form_url, data=self.data)

                # 处理重定向
                if resp.status_code == 200:
                    soup = bs4.BeautifulSoup(resp.text, "html.parser")
                    redirect_url = re.search(
                    r'window.location.replace\("([^"]+)" \);', soup.find_all("script")[0].get_text()
                    ).group(1)

                    params = dict([p.split("=") for p in redirect_url.split("?")[1].split("&")])

                    if params["status"] == "SUCCESS":
                        resp = self.client.get(redirect_url)
                        
                        # 二次重定向
                        soup = bs4.BeautifulSoup(resp.text, "html.parser")

                        redirect_url = re.search(
                            r'window.location="([^"]+)";', soup.find_all("script")[0].get_text()
                        ).group(1)

                        resp = self.client.get(f"{self.base_url}{redirect_url}")
                        
                        soup = bs4.BeautifulSoup(resp.text, "html.parser")
                        
                        name: str = soup.find(id="filtericon2").get_text().strip()

                        div = soup.find("div", class_="fl up-img-info")
                        if div:
                            name: str = div.find_all("p")[0].find_all("label")[0].get_text().strip()
                            department: str = div.find_all("p")[1].find_all("label")[0].get_text().strip()
                        if name and department:
                            self.logger.info("登录成功")
                            return True, name, department
                        else:
                            raise Exception("名称获取失败")
                        
                    elif params["status"] == "BAD_CREDENTIALS":
                        raise Exception("用户名或密码错误")
                    
                self.logger.error("登录失败")
                raise Exception("验证未通过")
            except Exception as e:
                self.logger.error(f"出现异常: {e}")
                retries -= 1
                time.sleep(0.3)

        self.logger.error("登录失败")
        return False, None, None