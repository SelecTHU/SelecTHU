import bs4
import curriculum
import json
import login
import logging
import os
import re

def get_text(td):
    if td.find("span") != None:
        span = td.find("span")
        if span.get("title") != None:
            return span["title"]
        else:
            return span.get_text()
    else:
        return td.get_text()
    

def parse_curriculum(curriculum):
    soup = bs4.BeautifulSoup(curriculum, "html.parser")

    # 先找到 table  id="kcTable">
    table = soup.find("table", id="kcTable")

    user_curriculum = []

    # 先找到所有的表头
    keys = []
    tr1 = table.find("tr", class_ = "trr1")
    for td in tr1.find_all("td"):
        keys.append(get_text(td).strip())

    # 遍历所有信息
    tr2s = table.find_all("tr", class_ = "trr2")
    for tr in tr2s:
        # 找到所有的 td
        tds = tr.find_all("td")

        course = {}
        # 遍历所有的 td
        for td in tds:
            course[keys[tds.index(td)]] = get_text(td).strip()
        
        user_curriculum.append(course)
    
    return user_curriculum


if __name__ == "__main__":
    # 切换到当前文件所在目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    # 配置日志
    logging.basicConfig(
        level=logging.INFO,
        filename="wlxt.log",
        format="(%(asctime)s) [%(levelname)s] %(name)s: %(message)s",
    )
    logger = logging.getLogger("Scheduler")

    try:
        # 登录
        username = "<username>"  # hint: 登录教务系统的用户名
        password = "<password>"  # hint: 登录教务系统的密码
        login_obj = login.Login(username, password)
        login_resp, cookies = login_obj.login()

        if login_resp == None:
            raise Exception("登录失败")
        
        # 获取学年学期和cookies
        p_xnxq = re.search(
            r"\"xkBks\.vxkBksXkbBs\.do\?m=showTree&p_xnxq=(.+)\"", login_resp.text
        ).group(1)

        logger.info(f"获取学年学期: {p_xnxq}")

        # 获取培养方案
        curriculum_obj = curriculum.Curriculum(p_xnxq, cookies)
        curriculum = curriculum_obj.get_curriculum()
        
        if curriculum == None:
            raise Exception("获取培养方案失败")
        
        logger.info(f"获取培养方案成功")

        # 解析培养方案
        soup = bs4.BeautifulSoup(curriculum, "html.parser")

        # 先找到 table  id="kcTable">
        table = soup.find("table", id="kcTable")

        # 再找到所有的 tr
        trs = table.find_all("tr")

        user_curriculum = parse_curriculum(curriculum)
        
        logger.info(f"解析培养方案成功")

        # 保存培养方案
        with open("curriculum.json", "w", encoding="utf-8") as f:
            json.dump(user_curriculum, f, ensure_ascii=False, indent=4)
        
        logger.info(f"保存培养方案成功")
        
    except Exception as e:
        logger.error(f"出现异常: {e}")