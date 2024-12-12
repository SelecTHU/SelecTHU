# 用于提交选课系统登录信息的脚本
from faker import Faker

import httpx
import time


class Login:
    base_url = r"https://zhjwxk.cic.tsinghua.edu.cn"
    # 选课系统登录页面地址
    login_page_url = r"/xklogin.do"
    # 选课系统登录的表单提交地址，不是登录页面的地址
    login_form_url = r"/j_acegi_formlogin_xsxk.do"
    # 验证码地址
    captcha_url = r"/login-jcaptcah.jpg?captchaflag=login1"

    def __init__(self, username, password, logger):
        # 用户名和密码
        self.username = username
        self.password = password

        # 伪造cookies
        self.cookies = httpx.Cookies()

        # 伪造请求头
        self.headers = httpx.Headers()
        self.headers.update(
            {
                "User-Agent": Faker().user_agent(),
            }
        )

        # 这里填写用户名和密码
        self.data = {
            "j_username": username,  # 这里填写用户名
            "j_password": password,  # 这里填写密码
            "captchaflag": "login1",  # 不用管？
            "_login_image_": "",  # 这里需要识别验证码
        }

        # 创建httpx客户端
        self.client = httpx.Client(
            cookies=self.cookies, headers=self.headers, base_url=self.base_url
        )

        self.logger = logger

    def __del__(self):
        self.logger.info("关闭httpx客户端")
        if self.client is not None:
            self.client.close()

    def ocr_captcha(self, img_resp):
        try:
            import ddddocr

            ocr = ddddocr.DdddOcr(show_ad=False)
            ocr.set_ranges(5)
            captcha = ocr.classification(img_resp.content).upper()

            self.logger.info(f"已识别验证码，验证码为<{captcha}>")
            return captcha
        except Exception as e:
            self.logger.error(f"验证码识别失败: {e}")
            return None

    def login(self, retries: int = 5):
        while retries > 0:
            try:
                self.logger.info("开始登录")

                # 获取登录页面和cookies
                init_resp = self.client.get(f"{self.base_url}/xsxk_index.jsp")
                self.cookies.update(init_resp.cookies)

                self.logger.info("已获取登录页面和cookies")

                # 获取验证码图片
                img_resp = self.client.get(self.captcha_url)

                # 识别验证码
                captcha = self.ocr_captcha(img_resp)
                if captcha is None:
                    raise Exception("验证码识别失败")
                self.data["_login_image_"] = captcha

                # 提交登录信息
                login_resp = self.client.post(self.login_form_url, data=self.data)

                self.logger.info("已提交登录信息")

                while login_resp.status_code == 302:
                    redr_url = login_resp.headers["Location"]
                    self.logger.info(f"重定向到{redr_url}")
                    login_resp = self.client.get(redr_url)
                    time.sleep(0.5)

                if (
                    login_resp.url == f"{self.base_url}/xsxk_index.jsp"
                    or login_resp.url == f"{self.base_url}/xklogin.do"
                ):
                    raise Exception("登录失败")

                self.logger.info("登录成功")

                return True, login_resp, self.cookies
            except Exception as e:
                self.logger.error(f"登录失败: {e}")
                retries -= 1
                time.sleep(0.5)
        
        self.logger.error("登录失败")
        # 登录失败
        return False, None, None
