from database import *


# 测试接口连接
def db_status():
    """
    测试接口连接
    """
    return {"status": 200, "msg": "connect successfully"}


# 查询培养方案
def get_curriculum(id_: str):
    """
    查询培养方案

    :param `id_`: 培养方案id（不叫id是避免与关键字冲突）
    :return: 返回的信息（在请求正确的情况下包含培养方案 `curriculum<type = list>` ）
    """

    # 检查输入合法性
    if id_ is None:
        return const.RESPONSE_400

    # 查询
    user = models.User.objects.filter(user_id=id_).first()
    if not user:
        return const.RESPONSE_404

    # 返回结果
    return {"status": 200, "curriculum": user.user_curriculum.courses}


# 查询培养方案是否存在
def get_curriculum_existance(curriculum: dict):
    """
    查询培养方案是否存在

    :param `curriculum`: 培养方案
    :return: 返回的信息（在请求正确的情况下包含布尔值 `value<type = bool>` ）
    """

    # 检查输入合法性
    if curriculum is None:
        return const.RESPONSE_400

    try:
        # 计算id
        id_ = cal_curriculum_id(curriculum)
        # 查询数据库
        curriculum = models.Curriculum.objects.filter(id=id_).exists()
        return {"status": 200, "value": curriculum}
    except Exception as e:
        return const.RESPONSE_500


# 查询用户信息
def get_user(id_: str):
    """
    查询用户信息

    :param `id_`: 用户id（学号）
    :return: 返回的信息
    （包含用户信息
    `nickname<type = str>`，
    `avatar<type = str>` （为图片路径），
    `favorite<type = list>`,
    `decided<type = list>`,
    `curriculum<type = list>`
    ）
    """
    # 检查输入合法性
    if id_ is None:
        return const.RESPONSE_400

    # 查询
    user = models.User.objects.filter(user_id=id_).first()
    if not user:
        return const.RESPONSE_404
    avatar_url = user.user_avatar.url
    curriculum = user.user_curriculum.courses if user.user_curriculum else None
    # 返回结果
    return {
        "status": 200,
        "nickname": user.user_nickname,
        "avatar": avatar_url,
        "favorite": user.user_favorite,
        "decided": user.user_decided,
        "curriculum": curriculum,
    }


# 查询课程列表
def get_courses():
    """
    查询课程列表

    :return: 返回的信息（在请求正确的情况下包含字典列表 `courses<type = list[dict]>` ）
    """
    # 查询数据库
    courses = models.MainCourses.objects.all().values(
        "code",
        "name",
        "teacher",
        "credit",
        "period",
        "time",
        "department",
        "type",
        "selection",
    )
    if not courses:
        return const.RESPONSE_404

    # 返回结果
    return {"status": 200, "courses": list(courses)}


# 按条件搜索课程简要信息
def get_course(
    id_: str = None,
    code: str = None,
    name: str = None,
    teacher: str = None,
    credit: int = None,
    period: int = None,
    time: dict = None,
    department: str = None,
    type_: str = None,
    search_mode: str = "exact",
):
    """
    按条件搜索课程简要信息

    :param `id_`: 课程识别码
    :param `code`: 课程代码
    :param `nam`: 课程名称
    :param `teacher`: 教师名称
    :param `credit`: 学分
    :param `period`: 学时
    :param `time`: 开课时间
    :param `department`: 开课院系
    :param `type_`: 课程类型
    :param `search_mode`: 搜索模式（默认为`exact` - 精确搜索，可选： `fuzzy` - 模糊搜索，`exclude` - 排除搜索）

    :return: 返回的信息（包含字典 `course<type = list[dict]>` ）
    """
    if search_mode not in const.SEARCH_MODE:
        return const.RESPONSE_400
    try:
        # 查询数据库
        # 不返回link字段和id字段
        course_list = None
        if search_mode == "exact" or search_mode == "fuzzy":
            if id_ is not None:
                course_list = models.MainCourses.objects.filter(id=id_)
            if code is not None:
                course_list = models.MainCourses.objects.filter(code=code)
            if name is not None:
                if search_mode == "exact":
                    course_list = models.MainCourses.objects.filter(name=name)
                else:
                    course_list = models.MainCourses.objects.filter(
                        name__icontains="%".join(name)
                    )
            if teacher is not None:
                course_list = models.MainCourses.objects.filter(teacher=teacher)
            if credit is not None:
                course_list = models.MainCourses.objects.filter(credit=credit)
            if period is not None:
                course_list = models.MainCourses.objects.filter(period=period)
            if department is not None:
                course_list = models.MainCourses.objects.filter(department=department)
            if type_ is not None:
                course_list = models.MainCourses.objects.filter(type=type_)
        elif search_mode == "exclude":
            if id_ is not None:
                course_list = models.MainCourses.objects.exclude(id=id_)
            if code is not None:
                course_list = models.MainCourses.objects.exclude(code=code)
            if name is not None:
                course_list = models.MainCourses.objects.exclude(name=name)
            if teacher is not None:
                course_list = models.MainCourses.objects.exclude(teacher=teacher)
            if credit is not None:
                course_list = models.MainCourses.objects.exclude(credit=credit)
            if period is not None:
                course_list = models.MainCourses.objects.exclude(period=period)
            if department is not None:
                course_list = models.MainCourses.objects.exclude(department=department)
            if type_ is not None:
                course_list = models.MainCourses.objects.exclude(type=type_)

        if course_list.exists() is False:
            return {"status": 200, "course": []}

        course_list = course_list.values(
            "code",
            "name",
            "teacher",
            "credit",
            "period",
            "time",
            "department",
            "type",
            "selection",
        )
        course_list = list(course_list)
        # 手动筛选time字段
        if time is not None:
            for i in range(len(course_list)):
                week_type = course_list[i]["time"]["type"]
                if week_type == time["type"]:
                    # 无需筛选
                    if len(time["data"]) == 0:
                        continue

                    # 筛选
                    week = time["data"][0]
                    for index in range(0, len(course_list[i]["time"]["data"])):
                        course_time = course_list[i]["time"]["data"][index]
                        # 该课程时间在筛选时间内，符合条件
                        if (
                            week["w0"] <= course_time["w0"]
                            and week["w1"] >= course_time["w1"]
                            and week["d"] == course_time["d"]
                            and week["t0"] <= course_time["t0"]
                            and week["t1"] >= course_time["t1"]
                        ):
                            continue

                course_list.pop(i)

        return {"status": 200, "course": course_list}
    except:
        return const.RESPONSE_500


# 查询课程详细信息
def get_course_detail(id_: str):
    """
    查询课程详细信息

    :param `id_`: 课程识别码

    :return: 返回的信息（包含 详细信息 `details<type = dict>` ）
    """
    try:
        if id_ is None:
            return const.RESPONSE_400
        # 查询数据库
        course = models.MainCourses.objects.get(id=id_)

        if course is None:
            return const.RESPONSE_404

        details = {
            "info": course.link.info,
            "score": course.link.score,
            "comments": course.link.comments,
        }

        return {"status": 200, "details": details}
    except:
        return const.RESPONSE_500
