import bs4
import curriculum
import fetch
import fetchZy
import json
import login
import logging
import os
import re


# 切换到当前文件所在目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    filename="xkxt.log",
    format="(%(asctime)s) [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("Scheduler")


def get_curriculum(p_xnxq, cookies):
    try:
        curriculum_obj = curriculum.Curriculum(p_xnxq, cookies)
        user_curriculum = curriculum_obj.get_curriculum()

        if user_curriculum == None:
            raise Exception("获取培养方案失败")

        logger.info(f"获取培养方案成功")
        return user_curriculum
    except Exception as e:
        logger.error(f"出现异常: {e}")
        return None


def get_courses(p_xnxq, cookies):
    try:
        fetcher_obj = fetch.Fetcher(p_xnxq, cookies)
        courses = fetcher_obj.fetch_courses()

        if courses == None:
            raise Exception("获取课程信息失败")

        logger.info(f"获取课程信息成功")
        return courses
    except Exception as e:
        logger.error(f"出现异常: {e}")
        return None

def get_zy(p_xnxq, cookies):
    try:
        zyfetcher_obj = fetchZy.ZyFetcher(p_xnxq, cookies)
        zy = zyfetcher_obj.fetch_data()

        if zy == None:
            raise Exception("获取志愿信息失败")

        logger.info(f"获取志愿信息成功")
        return zy
    except Exception as e:
        logger.error(f"出现异常: {e}")
        return None
    

if __name__ == "__main__":
    try:
        # 登录
        username = ""  # hint: 登录教务系统的用户名
        password = ""  # hint: 登录教务系统的密码
        login_obj = login.Login(username, password)
        login_resp, cookies = login_obj.login()

        if login_resp == None:
            raise Exception("登录失败")

        # 获取学年学期和cookies
        p_xnxq = re.search(
            r"\"xkBks\.vxkBksXkbBs\.do\?m=showTree&p_xnxq=(.+)\"", login_resp.text
        ).group(1)

        logger.info(f"获取学年学期: {p_xnxq}")

        # print("培养方案: ")
        # print(user_curriculum)
        # print("-------------------------------------------------")

        # print("课程信息: ")
        # print(courses)
        # print("------------------------------------------------")

        # print("志愿填报信息: ")
        # print(zy)
        # print("-------------------------------------------------")

        # 保存培养方案
        # user_curriculum = get_curriculum(p_xnxq, cookies)
        # print(user_curriculum)
        # with open("curriculum.json", "w", encoding="utf-8") as f:
        #     json.dump(user_curriculum, f, ensure_ascii=False, indent=4)
        #     logger.info(f"保存培养方案成功")

        # 保存课程信息
        courses = get_courses(p_xnxq, cookies)
        with open("courses.json", "w", encoding="utf-8") as f:    
            json.dump(courses, f, ensure_ascii=False, indent=4)
            logger.info(f"保存课程信息成功")    

        # 保存志愿填报信息
        # zy = get_zy(p_xnxq, cookies)
        # with open("zy.json", "w", encoding="utf-8") as f:
        #     json.dump(zy, f, ensure_ascii=False, indent=4)
        #     logger.info(f"保存志愿填报信息成功")

    except Exception as e:
        logger.error(f"出现异常: {e}")
