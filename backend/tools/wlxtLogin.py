# 用于提交网络学堂登录信息的脚本
from faker import Faker

import bs4
import httpx
import re
import ssl
import time


class Login:
    base_url = "https://learn.tsinghua.edu.cn"
    login_page = "/f/login"
    login_form_url = "https://id.tsinghua.edu.cn/do/off/ui/auth/login/post/bb5df85216504820be7bba2b0ae1535b/0?/login.do"

    def __init__(self, username, password, logger):
        self.username = username
        self.password = password

        self.cookies = httpx.Cookies()

        self.headers = httpx.Headers()
        self.headers.update(
            {
                "User-Agent": Faker().user_agent(),
            }
        )

        self.data = {
            "i_user": username,
            "i_pass": password,
            "atOnce": "true",
        }

        # 创建自定义SSL上下文
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        self.client = httpx.Client(
            cookies=self.cookies,
            headers=self.headers,
            verify=False,
            http2=True,
            trust_env=True,
            transport=httpx.HTTPTransport(verify=ssl_context),
            follow_redirects=True,
        )

        self.logger = logger

    def __del__(self):
        self.logger.info("关闭httpx客户端")
        if self.client is not None:
            self.client.close()

        self.logger.error("解析页面失败")
        return None
    
    def login(self, retries: int = 3):
        while retries > 0:
            try:
                self.logger.info("开始登录")
                resp = self.client.get(f"{self.base_url}{self.login_page}")
                self.client.cookies.update(resp.cookies)
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
                        
                        name = soup.find(id="filtericon2").get_text().strip()

                        if name:
                            self.logger.info("登录成功")
                            return True, name
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
        return False, None