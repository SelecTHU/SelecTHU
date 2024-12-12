import curriculum
import dotenv
import fetch
import fetchZy
import logging
import xkxtLogin
import re
import wlxtLogin
import os

from app.settings import BASE_DIR


# 配置日志
logging.basicConfig(
    level=logging.INFO,
    filename="xkxt.log",
    format="(%(asctime)s) [%(levelname)s] %(name)s: %(message)s",
)

class Scheduler:
    def __init__(self):
        dotenv.load_dotenv(BASE_DIR / ".env")
        self.logger = logging.getLogger("Scheduler")
        self.cookies = None
        self.p_xnxq = None

    def verify(self, username, password):
        """
        该函数暂时不可用！
        """
        return False
        try:
            xkxt_login_obj = xkxtLogin.Login(username, password)
            status, name = xkxt_login_obj.login()

            if status == 500:
                raise Exception("登录失败")

            self.logger.info(f"登录成功")
            return True
        except Exception as e:
            self.logger.error(f"出现异常: {e}")
            return False
        
    def login(self, username, password):
        try:
            xkxt_login_obj = xkxtLogin.Login(username, password, self.logger)
            status, login_resp, cookies = xkxt_login_obj.login()

            if status == False:
                raise Exception("登录失败")

            self.cookies = cookies
            self.p_xnxq = re.search(
                r"\"xkBks\.vxkBksXkbBs\.do\?m=showTree&p_xnxq=(.+)\"", login_resp.text
            ).group(1)

            self.logger.info(f"登录成功")
            return True
        except Exception as e:
            self.logger.error(f"出现异常: {e}")

    def get_curriculum(self, p_xnxq = None, cookies = None):
        try:
            use_p_xnxq = p_xnxq if p_xnxq != None else self.p_xnxq
            use_cookies = cookies if cookies != None else self.cookies
            curriculum_obj = curriculum.Curriculum(use_p_xnxq, use_cookies, self.logger)
            user_curriculum = curriculum_obj.get_curriculum()

            if user_curriculum == None:
                raise Exception("获取培养方案失败")

            self.logger.info(f"获取培养方案成功")
            return user_curriculum
        except Exception as e:
            self.logger.error(f"出现异常: {e}")
            return None


    def get_courses(self, p_xnxq = None, cookies = None):
        try:
            use_p_xnxq = p_xnxq if p_xnxq != None else self.p_xnxq
            use_cookies = cookies if cookies != None else self.cookies

            fetcher_obj = fetch.Fetcher(use_p_xnxq, use_cookies, self.logger)
            courses = fetcher_obj.fetch_courses()

            if courses == None:
                raise Exception("获取课程信息失败")

            self.logger.info(f"获取课程信息成功")
            return courses
        except Exception as e:
            self.logger.error(f"出现异常: {e}")
            return None

    def get_zy(self, p_xnxq = None, cookies = None):
        try:
            use_p_xnxq = p_xnxq if p_xnxq != None else self.p_xnxq
            use_cookies = cookies if cookies != None else self.cookies
            zyfetcher_obj = fetchZy.ZyFetcher(use_p_xnxq, use_cookies, self.logger)
            zy = zyfetcher_obj.fetch_data()

            if zy == None:
                raise Exception("获取志愿信息失败")

            self.logger.info(f"获取志愿信息成功")
            return zy
        except Exception as e:
            self.logger.error(f"出现异常: {e}")
            return None
