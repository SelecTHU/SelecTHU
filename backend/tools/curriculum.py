# 用于在登录后获取培养方案
from db.v1.const import CURRICULUM_KEYS, CURRICULUM_BLANK
from faker import Faker

import bs4
import httpx


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
        xn = ""  # 学年
        xq = ""  # 学期
        # 遍历所有信息
        tr2s = table.find_all("tr", class_="trr2")
        for tr in tr2s:
            # 找到所有的 td
            tds = tr.find_all("td")
            if len(keys) == len(tds):
                # 获取学年和学期
                xn = self._get_text(tds[0]).strip()
                xq = self._get_text(tds[1]).strip()

            # 学年学期共用两个td，需要考虑偏移
            offset = len(keys) - len(tds)  
            course = {}

            # 遍历所有的 td
            course[keys[tds.index(tds[0])]] = xn
            course[keys[tds.index(tds[1])]] = xq
            for td in tds:
                course[keys[tds.index(td) + offset]] = self._get_text(td).strip()

            user_curriculum.append(course)

        return user_curriculum

    def _parse_to_db_format(self, curriculum):
        self.logger.info("开始转换为数据库格式")

        # 所属课组 -> 培养方案类型
        curriculum_map = {
            "专业主修": CURRICULUM_KEYS[0],
            "专业选修": CURRICULUM_KEYS[1],
            "体育必修": CURRICULUM_KEYS[2],
        }

        db_curriculum = CURRICULUM_BLANK.copy()

        for course in curriculum:
            # 学年 学期 -> xnxq
            # 课程号 -> code
            # 课程名 -> name
            # 课程属性 -> attr
            # 学分 -> credit
            # 所属课组 -> group
            formatted_course = {
                "xnxq": course["学年"] + course["学期"],
                "code": course["课程号"],
                "name": course["课程名"],
                "attr": course["课程属性"],
                "credit": course["学分"],
                "group": course["所属课组"],
            }
            belong_to = curriculum_map.get(course["所属课组"], None)

            if not belong_to:
                raise Exception("课程类型错误")

            db_curriculum[belong_to].append(formatted_course)

        return db_curriculum

    def get_curriculum(self, format: bool = True):
        """
        获取培养方案

        :param `format`: 是否转换为数据库格式
        :return: 获取成功返回培养方案，否则返回`None`
        """
        try:
            self.logger.info("开始获取培养方案")
            response = self.client.get(self.curr_url, params=self.params)
            self.logger.info("获取成功")

            curriculum = self._parse_curriculum(response.text)
            if format:
                curriculum = self._parse_to_db_format(curriculum)
            return curriculum
        except Exception as e:
            self.logger.error(f"获取失败: {e}")
            return None
