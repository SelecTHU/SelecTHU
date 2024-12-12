# 用于提交网络学堂登录信息的脚本
from faker import Faker

import bs4
import httpx
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

        self.client = httpx.Client(
            cookies=self.cookies, headers=self.headers, base_url=self.base_url, verify=False
        )

        self.logger = logger

    def __del__(self):
        self.logger.info("关闭httpx客户端")
        if self.client is not None:
            self.client.close()

    def _parse_wlxt_page(self, resp):
        soup = bs4.BeautifulSoup(resp.text, "html.parser")
        
        w_header = soup.find("div", class_="w")
        if w_header:
            right = w_header.find("div", class_="right")
            if right:
                user_log = right.find("a", class_="user-log")
                if user_log:
                    name = user_log.get_text()
                    if name:
                        self.logger.info(f"解析页面成功，用户名为<{name}>")
                        return name
        
        self.logger.error(f"解析页面失败")
        return None
    
    def login(self, retries: int = 3):
        while retries > 0:
            try:
                self.logger.info(f"开始登录")
                resp = self.client.get(self.login_page)
                self.cookies.update(resp.cookies)
                self.logger.info(f"获取登录页面成功")

                resp = self.client.post(self.login_form_url, data=self.data)
                                        
                # 处理重定向
                if resp.status_code == 200:
                    soup = bs4.BeautifulSoup(resp.text, "html.parser")
                    div = soup.find("div", class_="wrapper")

                    if div:
                        if "登录成功" in div.text:
                            # 获取cookies
                            print(resp.cookies)
                            
                            redirect_url = div.find("a").get("href")

                            params = redirect_url.split("?")[1].split("&")
                            url = redirect_url.split("?")[0]
                            for i in range(len(params)):
                                params[i] = params[i].split("=")
                            params = dict(params)

                            print(params)
                            # print(redirect_url)
                            resp = self.client.get(url, params=params)
                            with open("wlxt.html", "w") as f:
                                f.write(resp.text)

                            # 解析页面
                            name = self._parse_wlxt_page(resp)
                            if name:
                                self.logger.info(f"登录成功")
                                return name
                    else:
                        raise Exception("验证未通过")
                else:
                    self.logger.error(f"登录失败")
                    retries -= 1
                self.logger.info(f"登录成功")

                raise Exception("验证未通过")
            except Exception as e:
                self.logger.error(f"出现异常: {e}")
                retries -= 1
                return False
            
        self.logger.error(f"登录失败")
        return False
    

