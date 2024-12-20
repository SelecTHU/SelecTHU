"""
数据库查询模块
定义并实现了数据库查询操作的接口
"""

from db.v1.dbBasic import *


# 测试接口连接
def db_status():
    """
    测试接口连接
    """
    const.logger.info("db_status: calling", extra=const.LOGGING_TYPE.INFO)
    return {"status": 200, "msg": "connect successfully"}


# 查询培养方案
def get_curriculum(user_id: str):
    """
    查询培养方案

    :param `user_id`: 用户id
    :return: 返回数据（在请求正确的情况下包含培养方案 `curriculum<type = list>` ）
    """
    const.logger.info("get_curriculum: calling", extra=const.LOGGING_TYPE.INFO)

    # 检查输入合法性
    if isinstance(user_id, str) is False:
        return const.RESPONSE_400
    try:
        # 查询
        user = models.User.objects.get(user_id=user_id)

        curriculum = dict()
        if user.user_curriculum != "":
            user_curriculum_id = user.user_curriculum
            try_curriculum = models.Curriculum.objects.filter(
                curriculum_id=user_curriculum_id
            )
            if try_curriculum.exists():
                curriculum = try_curriculum.values("courses").first()

        # 返回结果
        return {"status": 200, "curriculum": curriculum}
    except Exception as e:
        const.logger.error("get_curriculum: %s", e, extra=const.LOGGING_TYPE.ERROR)
        return const.RESPONSE_500


# 查询培养方案是否存在
def get_curriculum_existance(curriculum: dict):
    """
    查询培养方案是否存在

    :param `curriculum`: 培养方案
    :return: 返回数据（在请求正确的情况下包含布尔值 `value<type = bool>` ）
    """
    const.logger.info(
        "get_curriculum_existance: calling", extra=const.LOGGING_TYPE.INFO
    )

    # 检查输入合法性
    if isinstance(curriculum, dict) is False:
        return const.RESPONSE_400

    try:
        # 计算id
        curriculum_id = cal_curriculum_id(curriculum)
        # 查询数据库
        curriculum = models.Curriculum.objects.filter(
            curriculum_id=curriculum_id
        ).exists()
        return {"status": 200, "value": curriculum}
    except Exception as e:
        const.logger.error(
            "get_curriculum_existance: %s", e, extra=const.LOGGING_TYPE.ERROR
        )
        return const.RESPONSE_500


# 查询用户信息
def get_user(user_id: str):
    """
    查询用户信息

    :param `user_id`: 用户id（学号）
    :return: 返回数据
    （包含用户信息
    `nickname<type = str>`，
    `avatar<type = str>` （为图片路径），
    `favorite<type = list>`，
    `decided<type = list>`，
    `curriculum<type = list>`
    ）
    """
    const.logger.info("get_user: calling", extra=const.LOGGING_TYPE.INFO)

    # 检查输入合法性
    if isinstance(user_id, str) is False:
        return const.RESPONSE_400
    try:
        # 查询
        user = models.User.objects.filter(user_id=user_id)
        if user.exists() is False:
            return const.RESPONSE_404
        user = models.User.objects.get(user_id=user_id)
        avatar_url = user.user_avatar.url
        curriculum = dict()
        if user.user_curriculum:
            user_curriculum_id = user.user_curriculum
            user_curriculum = models.Curriculum.objects.filter(
                curriculum_id=user_curriculum_id
            )
            if user_curriculum.exists():
                curriculum = user_curriculum.values("courses").first()

        # 返回结果
        return {
            "status": 200,
            "nickname": user.user_nickname,
            "avatar": avatar_url,
            "favorite": user.user_favorite,
            "decided": user.user_decided,
            "curriculum": curriculum,
        }
    except Exception as e:
        const.logger.error("get_user: %s", e, extra=const.LOGGING_TYPE.ERROR)
        return const.RESPONSE_500


# 查询课程列表
def get_courses(index: int = 0, count: int = -1):
    """
    查询课程列表（指定数量）

    :param `index`: 查询起始位置（默认为0）
    :param `count`: 查询数量（默认为-1，即全部查询）
    :return: 返回数据（在请求正确的情况下包含字典列表 `courses<type = list[dict]>` ）
    """
    const.logger.info("get_courses: calling", extra=const.LOGGING_TYPE.INFO)

    if isinstance(index, int) is False or isinstance(count, int) is False:
        return const.RESPONSE_400

    if index < 0 or index >= models.MainCourses.objects.count() or count < -1:
        return const.RESPONSE_400
    
    try:
        courses = []
        query_count = models.MainCourses.objects.count() if count == -1 or count > models.MainCourses.objects.count() else count
        
        # 查询数据库
        courses = models.MainCourses.objects.all().values(
            "course_id",
            "code",
            "number",
            "name",
            "teacher",
            "credit",
            "time",
            "department",
            "course_type",
            "features",
            "text",
            "capacity",
            "grade",
            "experiment",
            "sec_choice",
            "selection",
        )[index : index + query_count]

        if not courses:
            return const.RESPONSE_404

        # 返回结果
        return {"status": 200, "courses": list(courses)}
    except Exception as e:
        const.logger.error("get_courses: %s", e, extra=const.LOGGING_TYPE.ERROR)
        return const.RESPONSE_500


# 按条件搜索课程简要信息
def get_course(
    course_id: str = None,
    code: str = None,
    number: str = None,
    name: str = None,
    teacher: str = None,
    credit: int = None,
    time: dict = None,
    department: str = None,
    course_type: str = None,
    features: str = None,
    text: str = None,
    grade: str = None,
    sec_choice: bool = None,
    search_mode: str = "exact",
):
    """
    按条件搜索课程简要信息

    :param `course_id`: 课程识别码
    :param `code`: 课程代码
    :param `number`: 课序号
    :param `name`: 课程名称
    :param `teacher`: 教师名称
    :param `credit`: 学分
    :param `time`: 开课时间
    :param `department`: 开课院系
    :param `course_type`: 课程类型（通识课组）
    :param `features`: 课程特色
    :param `text`: 选课文字说明
    :param `grade`: 年级
    :param `sec_choice`: 二级选课
    :param `search_mode`: 搜索模式（默认为`exact` - 精确搜索，可选： `fuzzy` - 模糊搜索，`exclude` - 排除搜索）

    :return: 返回数据（包含字典 `course<type = list[dict]>` ）
    """
    const.logger.info("get_course: calling", extra=const.LOGGING_TYPE.INFO)

    if search_mode not in const.SEARCH_MODE:
        return const.RESPONSE_400
    try:
        # 查询数据库
        # 先获取所有课程
        course_list = models.MainCourses.objects.all()
        if search_mode == "exact" or search_mode == "fuzzy":
            if course_id is not None:
                course_list = course_list.filter(course_id=course_id)
            if code is not None:
                course_list = course_list.filter(code=code)
            if number is not None:
                course_list = course_list.filter(number=number)
            if teacher is not None:
                course_list = course_list.filter(teacher=teacher)
            if credit is not None:
                course_list = course_list.filter(credit=credit)
            if department is not None:
                course_list = course_list.filter(department=department)
            if course_type is not None:
                course_list = course_list.filter(course_type=course_type)
            if grade is not None:
                course_list = course_list.filter(grade=grade)
            if sec_choice is not None:
                course_list = course_list.filter(sec_choice=sec_choice)
            if search_mode == "fuzzy":
                # 模糊搜索
                if name is not None:
                    # 将特殊字符转义
                    name = re.escape(name)
                    query_name = ".*" + ".*".join(name) + ".*"
                    course_list = course_list.filter(name__iregex=query_name)
                if features is not None:
                    features = re.escape(features)
                    query_features = ".*" + ".*".join(features) + ".*"
                    course_list = course_list.filter(features__iregex=query_features)
                if text is not None:
                    text = re.escape(text)
                    query_text = ".*" + ".*".join(text) + ".*"
                    course_list = course_list.filter(text__iregex=query_text)
            elif search_mode == "exact":
                # 精确搜索
                if name is not None:
                    course_list = course_list.filter(name=name)
                if features is not None:
                    course_list = course_list.filter(features=features)
                if text is not None:
                    course_list = course_list.filter(text=text)
        elif search_mode == "exclude":
            if course_id is not None:
                course_list = course_list.exclude(course_id=course_id)
            if code is not None:
                course_list = course_list.exclude(code=code)
            if number is not None:
                course_list = course_list.exclude(number=number)
            if name is not None:
                course_list = course_list.exclude(name=name)
            if teacher is not None:
                course_list = course_list.exclude(teacher=teacher)
            if credit is not None:
                course_list = course_list.exclude(credit=credit)
            if department is not None:
                course_list = course_list.exclude(department=department)
            if course_type is not None:
                course_list = course_list.exclude(course_type=course_type)
            if features is not None:
                course_list = course_list.exclude(features=features)
            if text is not None:
                course_list = course_list.exclude(text=text)
            if grade is not None:
                course_list = course_list.exclude(grade=grade)
            if sec_choice is not None:
                course_list = course_list.exclude(sec_choice=sec_choice)

        if course_list.exists() is False:
            return {"status": 200, "course": []}

        # 不返回link字段
        course_list = course_list.values(
            "course_id",
            "code",
            "number",
            "name",
            "teacher",
            "credit",
            "time",
            "department",
            "course_type",
            "features",
            "text",
            "capacity",
            "grade",
            "experiment",
            "sec_choice",
            "selection",
        )
        course_list = list(course_list)
        # 手动筛选time字段
        if time is not None:
            assert isinstance(time, dict)
            for index in range(len(course_list)):
                current_time = course_list[index]["time"]
                conform = False  # 是否符合筛选条件
                for period in current_time:
                    if (not time["type"] == const.TIME_WEEK.NONE) or time[
                        "type"
                    ] == period["type"]:
                        if (
                            ((not (time["w0"] == 0)) or time["w0"] == period["w0"])
                            and ((not (time["w1"] == 0)) or time["w1"] == period["w1"])
                            and ((not (time["d"] == 0)) or time["d"] == period["d"])
                            and ((not (time["t0"] == 0)) or time["t0"] == period["t0"])
                        ):
                            conform = True
                            break

                if not conform:
                    course_list.pop(index)

        return {"status": 200, "course": course_list}
    except Exception as e:
        const.logger.error("get_course: %s", e, extra=const.LOGGING_TYPE.ERROR)
        return const.RESPONSE_500


# 查询课程详细信息（通过课程信息）
def get_course_detail_by_info(code: str, number: str, name: str, teacher: str):
    """
    查询课程详细信息

    :param `code`: 课程号
    :param `number`: 课序号
    :param `name`: 课程名
    :param `teacher`: 教师名

    :return: 返回数据（包含 详细信息 `details<type = dict>` ）
    """
    const.logger.info(
        "get_course_detail_by_info: calling", extra=const.LOGGING_TYPE.INFO
    )

    if code is None or name is None or teacher is None:
        return const.RESPONSE_400

    try:
        course_id = cal_course_id(code, number, name, teacher)
        # 查询数据库
        course = models.CoursesDetails.objects.filter(course_id=course_id).values(
            "course_id", "info", "score", "comments"
        )

        # 课程不存在
        if course.exists() is False:
            return const.RESPONSE_404

        # 如果有多个结果，说明发生错误
        if course.count() > 1:
            return const.RESPONSE_500

        details = course.first()

        return {"status": 200, "details": details}
    except Exception as e:
        const.logger.error(
            "get_course_detail_by_info: %s", e, extra=const.LOGGING_TYPE.ERROR
        )
        return const.RESPONSE_500


# 查询课程详细信息（通过课程id）
def get_course_detail_by_id(course_id: str):
    """
    查询课程详细信息

    :param `course_id`: 课程id
    :return: 返回数据（包含 详细信息 `details<type = dict>` ）
    """
    const.logger.info("get_course_detail_by_id: calling", extra=const.LOGGING_TYPE.INFO)

    if course_id is None:
        return const.RESPONSE_400

    try:
        # 查询数据库
        course = models.CoursesDetails.objects.filter(course_id=course_id).values(
            "course_id", "info", "score", "comments"
        )

        # 课程不存在
        if course.exists() is False:
            return const.RESPONSE_404

        # 如果有多个结果，说明发生错误
        if course.count() > 1:
            return const.RESPONSE_500

        details = course.first()

        return {"status": 200, "details": details}
    except Exception as e:
        const.logger.error(
            "get_course_detail_by_id: %s", e, extra=const.LOGGING_TYPE.ERROR
        )
        return const.RESPONSE_500
