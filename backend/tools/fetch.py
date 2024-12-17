# 获取课程信息（简要信息和详情信息）
from bs4 import BeautifulSoup
from faker import Faker

import httpx
import re
import time


class Fetcher:
    base_url = r"https://zhjwxk.cic.tsinghua.edu.cn"
    search_url = r"/xkBks.vxkBksJxjhBs.do"

    def __init__(self, p_xnxq, cookies, logger):
        self.headers = httpx.Headers(
            {
                "User-Agent": Faker().user_agent(),
            }
        )

        self.cookies = cookies
        self.p_xnxq = p_xnxq

        self.params = {
            "p_xnxq": self.p_xnxq,
            "m": "kkxxSearch",
        }

        self.client = httpx.Client(
            cookies=self.cookies, headers=self.headers, base_url=self.base_url
        )

        self.logger = logger

    def __del__(self):
        self.logger.info("关闭httpx客户端")
        if self.client is not None:
            self.client.close()

    def _get_post_data(self, soup, page):
        ret = {}
        form = soup.find("form")
        for inp in form.find_all("input"):
            name = inp.get("name")
            value = inp.get("value")
            if name is not None and value is not None:
                ret[name] = value
        for sel in form.find_all("select"):
            name = sel.get("name")
            if name is not None:
                ret[name] = ""
        ret["m"] = "kkxxSearch"
        ret["page"] = page
        return ret

    def _get_text(self, td):
        if td.find("table") != None:
            table = td.find("table")
            # 有些课程的课程信息在table里
            # 直接返回table的html
            return table.prettify().strip()
        elif td.find("span") != None:
            span = td.find("span")
            if span.get("title") != None:
                return span["title"].strip()
            else:
                return span.get_text()
        elif td.find("div") != None:
            div = td.find("div")
            if div.get("title") != None:
                return div.get_text().strip()
        else:
            return td.get_text().strip()

    def fetch_courses(self):
        try:
            self.logger.info(f"开始获取{self.p_xnxq}学期课程信息")

            # 获取初始页面
            res = self.client.get(self.search_url, params=self.params)
            soup = BeautifulSoup(res.text, "html.parser")

            # 获取总页数
            total_pages = int(
                re.match(
                    r"javascript:turn\((\d+)\)", soup.find(id="endpage")["href"]
                ).group(1)
            )

            self.logger.info(f"共{total_pages}页")

            result = []
            for page in range(1, total_pages + 1):
                self.logger.info(f"正在获取第{page}页")

                data = self._get_post_data(soup, str(page))
                res = self.client.post(self.search_url, data=data)
                soup = BeautifulSoup(res.text, "html.parser")

                # 解析表格
                table = soup.find("table")
                keys = [
                    self._get_text(span)
                    for span in table.find("tr", class_="trr1").find_all("span")
                ]

                for tr in table.find_all("tr", class_="trr2"):
                    spans = tr.find_all("span")
                    # 获取课程信息
                    item = {
                        keys[i]: self._get_text(spans[i]) for i in range(len(spans))
                    }

                    # 获取课程详情
                    self.logger.info(f"正在获取{item['课程号']}课程详情")
                    main_href = tr.find("a", class_="mainHref")

                    if main_href is not None:
                        main_href = main_href.get("href")
                        main_res = self.client.get(main_href)

                        # 解析课程详情
                        main_soup = BeautifulSoup(main_res.text, "html.parser")
                        table = main_soup.find(
                            "table", class_="table table-striped table-condensed"
                        )
                        # 需要移除table中的教学日历和所有a标签
                        for table_tr in table.find_all("tr"):
                            a = table_tr.find("a")
                            if a:
                                # 移除a的父节点对应的tr标签
                                a.parent.parent.decompose()

                        # 获取table的html
                        content = table.prettify().strip()
                        item["详情"] = content
                        #
                        # info = {}
                        # for table_tr in table.find_all("tr"):
                        #     table_tds = table_tr.find_all("td")

                        #     if len(table_tds) % 2 == 0:
                        #         for index in range(0, len(table_tds), 2):
                        #             div = table_tds[index].find("div")
                        #             key = (
                        #                 self._get_text(div).rstrip("：")
                        #                 if div
                        #                 else self._get_text(table_tds[index]).rstrip(
                        #                     "："
                        #                 )
                        #             )
                        #             value = self._get_text(table_tds[index + 1])
                        #             if value is None:
                        #                 value = ""
                        #             info[key] = value

                        # item["详情"] = info

                    result.append(item)

                    time.sleep(0.1)

                time.sleep(0.3)  # 避免请求过快

            self.logger.info(f"成功获取{len(result)}条课程信息")
            return result

        except Exception as e:
            self.logger.error(f"获取课程信息失败: {e}")
            return None
