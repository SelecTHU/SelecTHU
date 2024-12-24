"""
常量定义
定义了会在其他函数中使用的常量
v1版本
"""

from app.settings import BASE_DIR
from typing import Final

import logging
import os

# 日志
logger: Final[logging.Logger] = logging.getLogger("db_v1_logger")
if not os.path.exists(BASE_DIR / "logs"):
    os.makedirs(BASE_DIR / "logs")
_file_handler: Final[logging.FileHandler] = logging.FileHandler(
    filename=BASE_DIR / "logs" / "db.log",
    encoding="utf-8",
)
_file_handler.setLevel(logging.INFO)
_file_handler.setFormatter(
    logging.Formatter("(%(asctime)s) [%(levelname)s] %(name)s: %(message)s")
)
logger.addHandler(_file_handler)

# 培养方案键值（对应必限体）
CURRICULUM_KEYS: Final[tuple] = ("0", "1", "2")

# 哈希盐字符串
# 放入.env文件中
# 将SALT放入.env文件中并动态加载
_SALT_COUNT: Final[int] = int(os.getenv("SALT_COUNT", 7))
SALT: Final[tuple] = tuple(
    os.getenv(f"SALT_{i}", "") for i in range(1, _SALT_COUNT + 1)
)

# 搜索类型
SEARCH_MODE: Final[tuple] = ("exact", "exclude", "fuzzy")

# 评分范围定义
COMMENT_SCORE_MIN: Final[int] = 0  # 最低评分
COMMENT_SCORE_MAX: Final[int] = 7  # 最高评分

# 响应
RESPONSE_400: Final[dict] = {
    "status": 400,
    "msg": "Bad Request",
}  # 400错误响应：请求错误

RESPONSE_404: Final[dict] = {
    "status": 404,
    "msg": "Not Found",
}  # 404错误响应：资源未找到

RESPONSE_409: Final[dict] = {
    "status": 409,
    "msg": "Conflict",
}  # 409错误响应：资源冲突

RESPONSE_500: Final[dict] = {
    "status": 500,
    "msg": "Internal Server Error",
}  # 500错误响应：服务器内部错误

RESPONSE_501: Final[dict] = {
    "status": 501,
    "msg": "Not Implemented",
}  # 501错误响应：未实现


# 选课情况（空状态）
SELECTION_BLANK: Final[dict] = {
    "total": 0,
    "b1": 0,
    "b2": 0,
    "b3": 0,
    "x1": 0,
    "x2": 0,
    "x3": 0,
    "r0": 0,
    "r1": 0,
    "r2": 0,
    "r3": 0,
    "t1": 0,
    "t2": 0,
    "t3": 0,
}

# 培养方案（空表）
CURRICULUM_BLANK: Final[dict] = {
    CURRICULUM_KEYS[0]: [],
    CURRICULUM_KEYS[1]: [],
    CURRICULUM_KEYS[2]: [],
}


# 周次定义
class TIME_WEEK:
    ODD: Final[int] = 1  # 单周
    EVEN: Final[int] = 2  # 双周
    OTHER: Final[int] = 3  # 其他
    NONE: Final[int] = 0  # 无


TIME_BLANK_DICT: Final[dict] = {
    "type": TIME_WEEK.OTHER,
    "w0": 1,
    "w1": 16,
    "d": 0,
    "t0": 0
}
    
# 志愿类型定义
# 一个完整的志愿应该是两位字符串，第一位为志愿类型，第二位为志愿级别
# 如：b0、x1、r2、t3
class SELECTION_TYPE:
    ST_B: Final[str] = "b"  # 必修
    ST_X: Final[str] = "x"  # 限选
    ST_R: Final[str] = "r"  # 任选
    ST_T: Final[str] = "t"  # 体育
    LEVEL: Final[tuple] = ("0", "1", "2", "3")  # 志愿级别

    @staticmethod
    def in_type(selection: str) -> bool:
        """
        判断志愿类型是否合法

        :param selection: 志愿类型
        :return: 是否合法
        """
        return (
            isinstance(selection, str)
            and len(selection) == 2
            and selection[0]
            in (
                SELECTION_TYPE.ST_B,
                SELECTION_TYPE.ST_X,
                SELECTION_TYPE.ST_R,
                SELECTION_TYPE.ST_T,
            )
            and selection[1] in SELECTION_TYPE.LEVEL
        )
