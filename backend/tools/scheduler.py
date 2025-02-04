# 整个项目的调度器，用于调度各个模块的功能
from app.settings import BASE_DIR
from copy import deepcopy

import tools.curriculum as curriculum
import tools.fetch as fetch
import tools.fetchZy as fetchZy
import tools.xkxtLogin as xkxtLogin
import tools.wlxtLogin as wlxtLogin

import dotenv
import logging
import re


class Scheduler:
    # 配置日志
    _file_handler: logging.FileHandler = logging.FileHandler(
        filename=BASE_DIR / "logs" / "xkxt.log",
        encoding="utf-8",
    )
    _file_handler.setLevel(logging.DEBUG)
    _file_handler.setFormatter(
        logging.Formatter("(%(asctime)s) [%(levelname)s] %(name)s: %(message)s")
    )

    def __init__(self):
        dotenv.load_dotenv(BASE_DIR / ".env")
        self.logger = logging.getLogger("Scheduler")
        self.logger.addHandler(Scheduler._file_handler)
        self.cookies = None
        self.p_xnxq = None

    def verify(self, username: str, password: str):
        """
        登录网络学堂验证，并尝试获取姓名

        :param `username`: 用户名
        :param `password`: 密码
        :return: 登录成功返回 `Tuple[True, name]` ，否则返回 `Tuple[False, None]`
        """
        try:
            wlxt_login_obj = wlxtLogin.Login(username, password, self.logger)
            status, name, department = wlxt_login_obj.login()

            if status == False:
                raise Exception("登录失败")

            self.logger.info(f"登录成功")
            return True, name, department
        except Exception as e:
            self.logger.error(f"出现异常: {e}")
            return False, None, None

    def login(self, username: str, password: str):
        """
        登录选课系统

        :param `username`: 用户名
        :param `password`: 密码
        :return: 登录成功返回`True`，否则返回`False`
        """
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
            return False

    def get_curriculum(self, p_xnxq: str = None, cookies=None, format: bool = True):
        """
        获取培养方案

        如果`p_xnxq`和`cookies`为`None`，则使用上一次登录的`p_xnxq`和`cookies` （需要先使用`login`函数登录）

        :param `p_xnxq`: 学年学期
        :param `cookies`: 用户登录的cookies
        :return: 获取成功返回培养方案，否则返回`None`
        """
        try:
            use_p_xnxq = p_xnxq if p_xnxq != None else self.p_xnxq
            use_cookies = cookies if cookies != None else self.cookies
            curriculum_obj = curriculum.Curriculum(use_p_xnxq, use_cookies, self.logger)
            user_curriculum = curriculum_obj.get_curriculum(format=format)

            if user_curriculum == None:
                raise Exception("获取培养方案失败")

            self.logger.info(f"获取培养方案成功")
            return deepcopy(user_curriculum)
        except Exception as e:
            self.logger.error(f"出现异常: {e}")
            return None

    def get_courses(self, p_xnxq: str = None, cookies=None):
        """
        获取课程信息

        如果`p_xnxq`和`cookies`为`None`，则使用上一次登录的`p_xnxq`和`cookies` （需要先使用`login`函数登录）。
        尽管如此，课程信息一般情况下并不需要特定的用户，因此只需要一个能够登录使用的cookies即可

        :param `p_xnxq`: 学年学期
        :param `cookies`: 用户登录的cookies
        :return: 获取成功返回课程信息，否则返回`None`
        """
        try:
            use_p_xnxq = p_xnxq if p_xnxq != None else self.p_xnxq
            use_cookies = cookies if cookies != None else self.cookies

            fetcher_obj = fetch.Fetcher(use_p_xnxq, use_cookies, self.logger)
            courses = fetcher_obj.fetch_courses()

            if courses == None:
                raise Exception("获取课程信息失败")

            self.logger.info(f"获取课程信息成功")
            return deepcopy(courses)
        except Exception as e:
            self.logger.error(f"出现异常: {e}")
            return None

    def get_zy(self, p_xnxq: str = None, cookies=None):
        """
        获取实时志愿信息

        如果`p_xnxq`和`cookies`为`None`，则使用上一次登录的`p_xnxq`和`cookies` （需要先使用`login`函数登录）。
        尽管如此，实时志愿信息一般情况下并不需要特定的用户，因此只需要一个能够登录使用的cookies即可

        :param `p_xnxq`: 学年学期
        :param `cookies`: 用户登录的cookies
        :return: 获取成功返回志愿信息，否则返回`None`
        """
        try:
            use_p_xnxq = p_xnxq if p_xnxq != None else self.p_xnxq
            use_cookies = cookies if cookies != None else self.cookies
            zyfetcher_obj = fetchZy.ZyFetcher(use_p_xnxq, use_cookies, self.logger)
            zy = zyfetcher_obj.fetch_data()

            if zy == None:
                raise Exception("获取志愿信息失败")

            self.logger.info(f"获取志愿信息成功")
            return deepcopy(zy)
        except Exception as e:
            self.logger.error(f"出现异常: {e}")
            return None
