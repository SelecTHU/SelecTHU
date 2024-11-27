"""
数据库修改模块
定义并实现了数据库的修改操作的接口
"""

from db.v1.dbBasic import *


"""添加类操作"""


# 新建用户
def add_user(user_id: str, curriculum: dict = None) -> dict:
    """
    添加用户
    - 注意：该函数添加用户时，若培养方案不存在则会自动添加培养方案

    :param user_id: 用户id（学号）
    :param curriculum: 培养方案

    :return: 执行结果
    """
    const.logger.info("add_user: calling", extra=const.LOGGING_TYPE.INFO)
    # 检查输入合法性
    if isinstance(user_id, str) is False:
        return const.RESPONSE_400

    try:
        # 检查是否已存在
        if models.User.objects.filter(user_id=user_id).exists():
            # 返回结果：资源冲突（用户已存在）
            return const.RESPONSE_409

        # 添加培养方案
        curriculum_id = None
        if curriculum:
            curriculum_id = cal_curriculum_id(curriculum)
            curriculum_ = models.Curriculum.objects.filter(
                curriculum_id=curriculum_id
            ).exists()
            if not curriculum_:
                curriculum_ = models.Curriculum(
                    curriculum_id=curriculum_id, courses=curriculum
                )
                curriculum_.save()
            else:
                curriculum_ = models.Curriculum.objects.get(curriculum_id=curriculum_id)

            # 添加到数据库
            user = models.User(
                user_id=user_id, user_nickname=user_id, user_curriculum=curriculum_id
            )
            user.save()
        else:
            user = models.User(user_id=user_id, user_nickname=user_id)
            user.save()

        # 返回结果
        return {"status": 200, "msg": "add user successfully"}
    except Exception as e:
        const.logger.info("add_user: %s", e, extra=const.LOGGING_TYPE.ERROR)
        return const.RESPONSE_500


# 添加课程信息
def add_course(course: dict):
    """
    添加课程信息（添加新课程）

    :param course: 课程信息（包含课程简要信息和课程详细信息，为二者，具体结构见models定义）
    :return: 执行结果
    """
    const.logger.info("add_course: calling", extra=const.LOGGING_TYPE.INFO)
    if isinstance(course, dict) is False:
        return const.RESPONSE_400

    try:
        # 先计算课程id
        code = course.get("code", "")
        number = course.get("number", "")
        name = course.get("name", "")
        teacher = course.get("teacher", "")
        course_id = cal_course_id(code, number, name, teacher)

        # 检查是否已存在
        if models.MainCourses.objects.filter(course_id=course_id).exists():
            return const.RESPONSE_409

        # 添加到数据库
        # MainCourses：课程简要信息
        credit = int(course.get("credit", 0))
        period = int(course.get("period", 0))
        time = course.get("time", "")
        department = course.get("department", "")
        course_type = course.get("course_type", "")
        capacity = int(course.get("capacity", 0))

        selection = course.get("selection", const.SELECTION_BLANK.copy())

        # CoursesDetails：课程详细信息
        info = course.get("info", dict())

        # 添加至数据库
        course_details = models.CoursesDetails(course_id=course_id, info=info)
        course_details.save()

        course_main = models.MainCourses(
            course_id=course_id,
            code=code,
            number=number,
            name=name,
            teacher=teacher,
            credit=credit,
            period=period,
            time=time,
            department=department,
            course_type=course_type,
            capacity=capacity,
            selection=selection,
            link=course_details,
        )
        course_main.save()

        # 返回结果
        return {"status": 200, "msg": "add course successfully"}
    except Exception as e:
        const.logger.info("add_course: %s", e, extra=const.LOGGING_TYPE.ERROR)
        return const.RESPONSE_500


# 添加培养方案
def add_curriculum(curriculum: dict) -> dict:
    """
    添加培养方案

    :param curriculum: 培养方案
    :return: 执行结果
    """
    const.logger.info("add_curriculum: calling", extra=const.LOGGING_TYPE.INFO)
    # 检查输入合法性
    if isinstance(curriculum, dict) is False:
        return const.RESPONSE_400

    try:
        # 计算id
        course_id = cal_curriculum_id(curriculum)
        # 检查是否已存在
        if models.Curriculum.objects.filter(course_id=course_id).exists():
            # 返回结果：资源冲突（培养方案已存在）
            return const.RESPONSE_409

        # 添加到数据库
        curriculum = models.Curriculum(course_id=course_id, courses=curriculum)
        curriculum.save()

        # 返回结果：添加成功
        return {"status": 200, "msg": "add curriculum successfully"}
    except Exception as e:
        const.logger.info("add_curriculum: %s", e, extra=const.LOGGING_TYPE.ERROR)
        return const.RESPONSE_500


# 添加已选课程
def add_course_to_decided(user_id: str, course_id: str, selection_type: str = ""):
    """
    添加用户已选课程

    :param user_id: 用户id
    :param course_id: 课程识别码
    :param selection_type: 选课类型
    :return: 执行结果
    """
    const.logger.info("add_course_to_decided: calling", extra=const.LOGGING_TYPE.INFO)
    # 检查输入合法性
    if isinstance(user_id, str) is False or isinstance(course_id, str) is False:
        return const.RESPONSE_400

    try:
        # 检查用户是否存在
        if not models.User.objects.filter(user_id=user_id).exists():
            return const.RESPONSE_404

        # 检查志愿是否合法
        if selection_type and const.SELECTION_TYPE.in_type(selection_type) is False:
            return const.RESPONSE_400
        # 添加课程
        user = models.User.objects.get(user_id=user_id)
        for course in user.user_decided:
            if course["course_id"] == course_id:
                # 返回结果：资源冲突（课程已存在）
                return const.RESPONSE_409

        user.user_decided.append(
            {"course_id": course_id, "selection_type": selection_type}
        )
        user.save()

        # 返回结果：添加成功
        return {"status": 200, "msg": "add course to decided successfully"}
    except Exception as e:
        const.logger.info(
            "add_course_to_decided: %s", e, extra=const.LOGGING_TYPE.ERROR
        )
        return const.RESPONSE_500


# 添加备选课程
def add_course_to_favorite(user_id: str, course_id: str):
    """
    添加用户备选课程

    :param user_id: 用户id
    :param course_id: 课程识别码
    :return: 执行结果
    """
    const.logger.info("add_course_to_favorite: calling", extra=const.LOGGING_TYPE.INFO)
    # 检查输入合法性
    if isinstance(user_id, str) is False or isinstance(course_id, str) is False:
        return const.RESPONSE_400

    try:
        # 检查用户是否存在
        if not models.User.objects.filter(user_id=user_id).exists():
            return const.RESPONSE_404

        # 添加课程
        user = models.User.objects.get(user_id=user_id)
        if course_id not in user.user_favorite:
            user.user_favorite.append(course_id)
            user.save()

            # 返回结果：添加成功
            return {"status": 200, "msg": "add course to favorite successfully"}
        else:
            # 返回结果：资源冲突（课程已存在）
            return const.RESPONSE_409
    except Exception as e:
        const.logger.info(
            "add_course_to_favorite: %s", e, extra=const.LOGGING_TYPE.ERROR
        )
        return const.RESPONSE_500


# 添加课程评价和评分
def add_course_comment(course_id: str, comment: dict):
    """
    添加课程评价和评分

    :param course_id: 课程识别码
    :param comment: 课程评价（结构：
    ```
    {
        "comment_time": <str>,
        "comment_score": <int>,
        "comment": <str>
    }
    ```
    ）

    :return: 执行结果
    """
    const.logger.info("add_course_comment: calling", extra=const.LOGGING_TYPE.INFO)
    if isinstance(course_id, str) is False or isinstance(comment, dict) is False:
        return const.RESPONSE_400

    try:
        # 检查传入的课程是否存在
        if not models.CoursesDetails.objects.filter(course_id=course_id).exists():
            return const.RESPONSE_404

        # 检查传入的评论格式是否正确
        if (
            "comment_time" not in comment
            or "comment_score" not in comment
            or "comment" not in comment
        ):
            return const.RESPONSE_400

        if (
            not isinstance(comment["comment_time"], str)
            or not isinstance(comment["comment_score"], int)
            or not isinstance(comment["comment"], str)
        ):
            return const.RESPONSE_400

        if (
            comment["comment_score"] < const.COMMENT_SCORE_MIN
            or comment["comment_score"] > const.COMMENT_SCORE_MAX
        ):
            return const.RESPONSE_400

        details = models.CoursesDetails.objects.get(course_id=course_id)

        comment_score = comment["comment_score"]
        cnt = 1
        for c in details.comments:
            comment_score += c["comment_score"]
            cnt += 1

        # 保留两位小数
        details.score = round(comment_score / cnt, 2)
        details.comments.append(comment)
        details.save()

        return {"status": 200, "msg": "add course comment successfully"}
    except Exception as e:
        const.logger.info("add_course_comment: %s", e, extra=const.LOGGING_TYPE.ERROR)
        return const.RESPONSE_500


"""修改类操作"""


# 修改志愿分配
def change_course_level(user_id: str, course_id: str, selection_type: str):
    """
    修改志愿分配。一般用于用户修改志愿分配，避免用于添加志愿。

    若需添加志愿，使用 `add_course_to_decided`

    :param user_id: 用户id
    :param course_id: 课程识别码
    :param selection_type: 选课志愿类型
    :return: 执行结果
    """
    const.logger.info("change_course_level: calling", extra=const.LOGGING_TYPE.INFO)
    if (
        isinstance(user_id, str) is False
        or isinstance(course_id, str) is False
        or isinstance(selection_type, str) is False
    ):
        return const.RESPONSE_400

    try:
        # 检查志愿是否合法
        if const.SELECTION_TYPE.in_type(selection_type) is False:
            return const.RESPONSE_400

        # 检查用户是否存在
        if not models.User.objects.filter(user_id=user_id).exists():
            return const.RESPONSE_404

        # 检查志愿是否存在
        user = models.User.objects.get(user_id=user_id)
        for course in user.user_decided:
            if course["course_id"] == course_id:
                course["selection_type"] = selection_type
                user.save()
                return {"status": 200, "msg": "change course level successfully"}

        # 若不存在，则添加（尽量避免进行该操作）
        user.user_decided.append(
            {"course_id": course_id, "selection_type": selection_type}
        )
        user.save()
        return {"status": 200, "msg": "change course level successfully"}
    except Exception as e:
        const.logger.info("change_course_level: %s", e, extra=const.LOGGING_TYPE.ERROR)
        return const.RESPONSE_500


# TODO:修改用户信息（确定参数avatar的格式）
def change_user_info(user_id: str, nickname: str = None, avatar=None):
    """
    修改用户信息（用户昵称、头像，至少需要一个参数）

    :param user_id: 用户id
    :param nickname: 用户昵称
    :param avatar: 用户头像
    :return: 执行结果
    """
    const.logger.info("change_user_info: calling", extra=const.LOGGING_TYPE.INFO)

    # 检查输入合法性
    if isinstance(user_id, str) is False or (
        (isinstance(nickname, str) and nickname) or avatar is False
    ):
        return const.RESPONSE_400

    try:
        # 检查用户是否存在
        if not models.User.objects.filter(user_id=user_id).exists():
            return const.RESPONSE_404

        # 修改用户信息
        if isinstance(nickname, str) and nickname:
            models.User.objects.filter(user_id=user_id).update(user_nickname=nickname)

        if avatar:
            # TODO: 解析并修改头像
            return const.RESPONSE_501

        # 返回结果
        return {"status": 200, "msg": "change user info successfully"}
    except Exception as e:
        const.logger.info("change_user_info: %s", e, extra=const.LOGGING_TYPE.ERROR)
        return const.RESPONSE_500


# 修改用户培养方案
def change_user_curriculum(user_id: str, curriculum: dict):
    """
    修改用户培养方案

    :param user_id: 用户id
    :param curriculum: 培养方案
    :return: 执行结果
    """
    const.logger.info("change_user_curriculum: calling", extra=const.LOGGING_TYPE.INFO)
    # 检查输入合法性
    if isinstance(user_id, str) is False or isinstance(curriculum, dict) is False:
        return const.RESPONSE_400

    try:
        # 检查用户是否存在
        if not models.User.objects.filter(user_id=user_id).exists():
            return const.RESPONSE_404

        # 计算id
        curriculum_id = cal_curriculum_id(curriculum)
        # 检查是否存在
        if not models.Curriculum.objects.filter(curriculum_id=curriculum_id).exists():
            # 添加培养方案
            curriculum_ = models.Curriculum(
                curriculum_id=curriculum_id, courses=curriculum
            )
            curriculum_.save()

        # 修改用户培养方案
        models.User.objects.filter(user_id=user_id).update(
            user_curriculum=curriculum_id
        )

        # 返回结果
        return {"status": 200, "msg": "change user curriculum successfully"}
    except Exception as e:
        const.logger.info(
            "change_user_curriculum: %s", e, extra=const.LOGGING_TYPE.ERROR
        )
        return const.RESPONSE_500


# 修改课程简要信息
def change_course_main():
    """
    修改课程简要信息

    经考虑，该接口暂不实现
    """
    return const.RESPONSE_501


# 修改课程详细信息
def change_course_detail():
    """
    修改课程详细信息

    经考虑，该接口暂不实现
    """
    return const.RESPONSE_501


"""删除类操作"""


# 移除用户
def remove_user(user_id: str):
    """
    移除用户

    :param user_id: 用户id
    :return: 执行结果
    """
    const.logger.info("remove_user: calling", extra=const.LOGGING_TYPE.INFO)
    if isinstance(user_id, str) is False:
        return const.RESPONSE_400

    try:
        # 检查是否存在
        if not models.User.objects.filter(user_id=user_id).exists():
            return const.RESPONSE_404

        # 删除
        models.User.objects.filter(user_id=user_id).delete()

        # 返回结果
        return {"status": 200, "msg": "remove user successfully"}
    except Exception as e:
        const.logger.info("remove_user: %s", e, extra=const.LOGGING_TYPE.ERROR)
        return const.RESPONSE_500


# 移除已选课程
def remove_course_from_decided(user_id: str, course_id: str):
    """
    移除用户已选课程

    :param user_id: 用户id
    :param course_id: 课程识别码
    :return: 执行结果
    """
    const.logger.info(
        "remove_course_from_decided: calling", extra=const.LOGGING_TYPE.INFO
    )

    # 检查输入合法性
    if isinstance(user_id, str) is False or isinstance(course_id, str) is False:
        return const.RESPONSE_400

    try:
        # 检查用户是否存在
        if not models.User.objects.filter(user_id=user_id).exists():
            return const.RESPONSE_404

        # 移除课程
        user = models.User.objects.get(user_id=user_id)
        for course in user.user_decided:
            if course["course_id"] == course_id:
                user.user_decided.remove(course)
                user.save()
                # 返回结果：移除成功
                return {"status": 200, "msg": "remove course from decided successfully"}
        # 返回结果：资源不存在（课程不存在）
        return const.RESPONSE_404
    except Exception as e:
        const.logger.info(
            "remove_course_from_decided: %s", e, extra=const.LOGGING_TYPE.ERROR
        )
        return const.RESPONSE_500


# 移除备选课程
def remove_course_from_favorite(user_id: str, course_id: str):
    """
    移除用户备选课程

    :param user_id: 用户id
    :param course_id: 课程识别码
    :return: 执行结果
    """
    const.logger.info(
        "remove_course_from_favorite: calling", extra=const.LOGGING_TYPE.INFO
    )
    # 检查输入合法性
    if isinstance(user_id, str) is False or isinstance(course_id, str) is False:
        return const.RESPONSE_400

    try:
        # 检查用户是否存在
        if not models.User.objects.filter(user_id=user_id).exists():
            return const.RESPONSE_404

        # 移除课程
        user = models.User.objects.get(user_id=user_id)
        if course_id in user.user_favorite:
            user.user_favorite.remove(course_id)
            user.save()

            # 返回结果：移除成功
            return {"status": 200, "msg": "remove course from favorite successfully"}
        else:
            # 返回结果：资源不存在（课程不存在）
            return const.RESPONSE_404
    except Exception as e:
        const.logger.info(
            "remove_course_from_favorite: %s", e, extra=const.LOGGING_TYPE.ERROR
        )
        return const.RESPONSE_500


# 删除课程信息
def remove_course(course_id: str):
    """
    删除课程信息（根据课程识别码）

    :param course_id: 课程识别码
    :return: 执行结果
    """
    const.logger.info("remove_course: calling", extra=const.LOGGING_TYPE.INFO)
    if isinstance(course_id, str) is False:
        return const.RESPONSE_400

    try:
        # 检查是否存在
        if not models.MainCourses.objects.filter(course_id=course_id).exists():
            return const.RESPONSE_404

        # 删除
        models.MainCourses.objects.filter(course_id=course_id).delete()

        # 返回结果
        return {"status": 200, "msg": "remove course successfully"}
    except Exception as e:
        const.logger.info("remove_course: %s", e, extra=const.LOGGING_TYPE.ERROR)
        return const.RESPONSE_500


# 删除培养方案（根据id）
def remove_curriculum_by_id(curriculum_id: str):
    """
    删除培养方案（根据id）

    :param curriculum_id: 培养方案id
    :return: 执行结果
    """
    const.logger.info("remove_curriculum_by_id: calling", extra=const.LOGGING_TYPE.INFO)
    # 检查输入合法性
    if isinstance(curriculum_id, str) is False:
        return const.RESPONSE_400

    try:
        # 检查是否存在
        if not models.Curriculum.objects.filter(curriculum_id=curriculum_id).exists():
            return const.RESPONSE_404

        # 删除
        models.Curriculum.objects.filter(curriculum_id=curriculum_id).delete()

        # 返回结果
        return {"status": 200, "msg": "remove curriculum successfully"}
    except Exception as e:
        const.logger.info(
            "remove_curriculum_by_id: %s", e, extra=const.LOGGING_TYPE.ERROR
        )
        return const.RESPONSE_500


# 删除培养方案（根据培养方案内容）
def remove_curriculum_by_curriculum(curriculum: dict):
    """
    删除培养方案（根据培养方案内容）

    :param curriculum: 培养方案
    :return: 执行结果
    """
    const.logger.info(
        "remove_curriculum_by_curriculum: calling", extra=const.LOGGING_TYPE.INFO
    )
    # 检查输入合法性
    if isinstance(curriculum, dict) is False:
        return const.RESPONSE_400

    try:
        # 计算id
        curriculum_id = cal_curriculum_id(curriculum)
        # 检查是否存在
        if not models.Curriculum.objects.filter(curriculum_id=curriculum_id).exists():
            return const.RESPONSE_404

        # 删除
        models.Curriculum.objects.filter(curriculum_id=curriculum_id).delete()

        # 返回结果
        return {"status": 200, "msg": "remove curriculum successfully"}
    except Exception as e:
        const.logger.info(
            "remove_curriculum_by_curriculum: %s", e, extra=const.LOGGING_TYPE.ERROR
        )
        return const.RESPONSE_500


# 删除所有课程信息
def remove_all_course():
    """
    删除所有课程信息
    """
    const.logger.info("remove_all_course: calling", extra=const.LOGGING_TYPE.INFO)
    try:
        # 删除
        models.MainCourses.objects.all().delete()

        # 返回结果
        return {"status": 200, "msg": "remove all course successfully"}
    except Exception as e:
        const.logger.info("remove_all_course: %s", e, extra=const.LOGGING_TYPE.ERROR)
        return const.RESPONSE_500


# 删除指定课程的所有课程评价和评分
def remove_all_course_comment(course_id: str):
    """
    删除指定课程的所有课程评价和评分（根据课程识别码）

    :param course_id: 课程识别码
    :return: 执行结果
    """
    const.logger.info(
        "remove_all_course_comment: calling", extra=const.LOGGING_TYPE.INFO
    )
    # 检查输入合法性
    if isinstance(course_id, str) is False:
        return const.RESPONSE_400

    try:
        # 检查是否存在
        if not models.CoursesDetails.objects.filter(course_id=course_id).exists():
            return const.RESPONSE_404

        # 删除
        details = models.CoursesDetails.objects.get(course_id=course_id)
        details.score = -1
        details.comments = []
        details.save()

        # 返回结果
        return {"status": 200, "msg": "remove all course comment successfully"}
    except Exception as e:
        const.logger.info(
            "remove_all_course_comment: %s", e, extra=const.LOGGING_TYPE.ERROR
        )
        return const.RESPONSE_500


# 删除所有培养方案信息
def remove_all_curriculum():
    """
    删除所有培养方案信息
    """
    const.logger.info("remove_all_curriculum: calling", extra=const.LOGGING_TYPE.INFO)
    try:
        # 删除
        models.Curriculum.objects.all().delete()

        # 返回结果
        return {"status": 200, "msg": "remove all curriculum successfully"}
    except Exception as e:
        const.logger.info(
            "remove_all_curriculum: %s", e, extra=const.LOGGING_TYPE.ERROR
        )
        return const.RESPONSE_500
