from django.test import TestCase
from django.core.files.images import ImageFile
from db.v1.queryDB import *
from db.v1.modifyDB import *

import db.v1.const as const


class QueryDBTestCase(TestCase):
    def setUp(self):
        time1 = [{
            "type": const.TIME_WEEK.OTHER,
            "w0": 1,
            "w1": 16,
            "d": 1,
            "t0": 1,
        }]
        res1 = add_course(
            {
                "code": "1000016",
                "number": "01",
                "name": "计算机网络",
                "teacher": "罗伯特",
                "credit": 3,
                "department": "霜之哀伤",
                "course_type": "专业必修",
                "time": time1,
                "info": {"课程介绍": "罗伯特的计算机网络课程"},
            }
        )
        res2 = add_course(
            {
                "code": "1000017",
                "number": "02",
                "name": "计算机组成原理",
                "teacher": "无敌喵喵拳",
                "credit": 4,
                "department": "火之高兴",
                "course_type": "专业必修",
                "info": {"课程介绍": "无敌喵喵拳喵喵拳无敌"},
            }
        )
        curriculum1 = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000016"}],
            const.CURRICULUM_KEYS[1]: [{"code": "1000017"}],
            const.CURRICULUM_KEYS[2]: [],
        }
        user = add_user("valid_user", curriculum1)
        if user["status"] != 200:
            print("[ERROR] Failed to add user")
            raise Exception("Failed to add user")
        if res1["status"] != 200 or res2["status"] != 200:
            print("[ERROR] Failed to add courses")
            raise Exception("Failed to add courses")
        return super().setUp()

    def test_db_status(self):
        # 测试db_status函数是否正确返回连接状态
        response = db_status()
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["msg"], "connect successfully")

    def test_get_user_not_found(self):
        # 测试get_user函数在用户不存在时的返回
        response = get_user("nonexistent_user")
        self.assertEqual(response, const.RESPONSE_404)

    def test_get_user_found(self):
        # 测试get_user成功找到用户
        response = get_user("valid_user")
        self.assertEqual(response["status"], 200)

    def test_get_user_error_input(self):
        # 测试get_user函数在输入错误时的返回
        response = get_user(12345)
        self.assertEqual(response, const.RESPONSE_400)

    def test_get_curriculum_valid_user(self):
        # 测试get_curriculum函数对有效用户的返回
        response = get_curriculum("valid_user")
        self.assertEqual(response["status"], 200)
        self.assertIn("curriculum", response)
    
    def test_get_curriculum_existance(self):
        # 测试get_curriculum_existance函数是否正确返回
        test_curriculum_1 = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000016"}],
            const.CURRICULUM_KEYS[1]: [{"code": "1000017"}],
            const.CURRICULUM_KEYS[2]: [],
        }
        test_curriculum_2 = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000016"}, {"code": "1000017"}],
            const.CURRICULUM_KEYS[1]: [{"code": "1000018"}],
            const.CURRICULUM_KEYS[2]: [],
        }            

        response = get_curriculum_existance(test_curriculum_1)
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["value"], True)

        response = get_curriculum_existance(test_curriculum_2)
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["value"], False)

    def test_get_curriculum_existance_lack_input(self):
        # 测试get_curriculum_existance函数在缺少输入时的返回
        response = get_curriculum_existance(None)
        self.assertEqual(response, const.RESPONSE_400)
    
    def test_get_curriculum_existance_error_input(self):
        # 测试get_curriculum_existance函数在输入错误时的返回
        response = get_curriculum_existance({})
        self.assertEqual(response, const.RESPONSE_500)

    def test_get_curriculum_invalid_user(self):
        # 测试get_curriculum函数对无效用户的返回
        response = get_curriculum("invalid_user")
        self.assertEqual(response, const.RESPONSE_500)

    def test_get_courses_default(self):
        # 测试get_courses函数默认情况下返回全部课程
        response = get_courses()
        self.assertEqual(response["status"], 200)
        self.assertIsInstance(response["courses"], list)

    def test_get_courses_specific_count(self):
        # 测试get_courses函数按指定数量返回课程（超出数量）
        response = get_courses(count=10)
        self.assertEqual(response["status"], 200)
        self.assertEqual(len(response["courses"]), 2)

    def test_get_courses_specific_count_2(self):
        # 测试get_courses函数按指定数量返回课程（非0起始）
        response = get_courses(index=1, count=1)
        self.assertEqual(response["status"], 200)
        self.assertEqual(len(response["courses"]), 1)

    def test_get_course_by_id(self):
        # 测试get_course函数根据课程id检索
        response = get_course(code="1000016")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 1)

    def test_get_course_by_name(self):
        # 测试get_course函数根据课程名检索
        response = get_course(name="计算机网络")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 1)

    def test_get_course_by_number(self):
        # 测试get_course函数根据课程号检索
        response = get_course(number="02")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 1)

    def test_get_course_by_code(self):
        # 测试get_course函数根据课程代码检索
        response = get_course(code="1000017")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 1)

    def test_get_course_by_teacher(self):
        # 测试get_course函数根据教师名检索
        response = get_course(teacher="无敌喵喵拳")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 1)

    def test_get_course_by_credit(self):
        # 测试get_course函数根据学分检索
        response = get_course(credit=4)
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 1)

    def test_get_course_by_department(self):
        # 测试get_course函数根据开课院系检索
        response = get_course(department="火之高兴")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 1)

    def test_get_course_by_time(self):
        # 测试get_course函数根据时间检索
        test_time = {
            "type": 0,
            "w0": 1,
            "w1": 0,
            "d": 0,
            "t0": 1,
        }
        response = get_course(time=test_time)
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 1)

    def test_get_course_fuzzy_search(self):
        # 测试get_course函数（模糊检索）
        response = get_course(name="计算机", search_mode="fuzzy")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 2)

    def test_get_course_exact_search(self):
        # 测试get_course函数（精确检索）
        response = get_course(name="计算机", search_mode="exact")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 0)

        response = get_course(name="计算机网络", search_mode="exact")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 1)

    def test_get_course_exclude_search(self):
        # 测试get_course函数（排除检索）
        response = get_course(name="计算机", search_mode="exclude")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 2)

        response = get_course(name="计算机网络", search_mode="exclude")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 1)

    def test_get_course_by_multi_cond_1(self):
        # 测试get_course函数根据多种条件：课程名、教师名
        response = get_course(name="计算机网络", teacher="罗伯特")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 1)

    def test_get_course_by_multi_cond_2(self):
        # 测试get_course函数根据多种条件：课程代码、课程号
        response = get_course(code="1000017", number="02")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 1)

    def test_get_course_by_multi_cond_3(self):
        # 测试get_course函数根据多种条件：课程名、学分、开课院系
        response = get_course(name="计算机组成原理", credit=4, department="火之高兴")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 1)

    def test_get_course_by_multi_cond_4(self):
        # 测试get_course函数根据多种条件：课程名、课程类型、模糊检索
        response = get_course(
            name="算机", course_type="专业必修", search_mode="fuzzy"
        )
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 2)

    def test_get_course_by_multi_cond_5(self):
        # 测试get_course函数根据多种条件：课程名、学分、开课院系、课程类型、精确检索
        response = get_course(
            name="计算机组成原理",
            credit=4,
            department="火之高兴",
            course_type="专业必修",
            search_mode="exact"
        )
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 1)

    def test_get_course_by_multi_cond_6(self):
        # 测试get_course函数根据多种条件：课序号、课程号、教师名、开课院系、课程类型、排除检索
        response = get_course(
            code="1000017",
            number="02",
            teacher="无敌喵喵拳",
            department="火之高兴",
            course_type="专业必修",
            search_mode="exclude"
        )
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 0)

    def test_get_course_detail_by_info(self):
        # 测试get_course_detail_by_info正确返回
        resp = get_course(name="计算机组成原理", teacher="无敌喵喵拳")
        self.assertEqual(resp["status"], 200)
        course = resp["course"][0]
        code = course["code"]
        number = course["number"]
        name = course["name"]
        teacher = course["teacher"]
        response = get_course_detail_by_info(
            code=code, number=number, name=name, teacher=teacher
        )
        self.assertEqual(response["status"], 200)

    def test_get_course_detail_by_info_err_info(self):
        # 测试get_course_detail_by_info在错误信息（无匹配）时的返回
        code = "1000016"
        number = "02"
        name = "计算机网络"
        teacher = "无敌喵喵拳"
        response = get_course_detail_by_info(
            code=code, number=number, name=name, teacher=teacher
        )
        self.assertEqual(response["status"], 404)

    def test_get_course_detail_by_info_no_info(self):
        # 测试get_course_detail_by_info在无信息时的返回
        response = get_course_detail_by_info(None, None, None, None)
        self.assertEqual(response["status"], 400)

    def test_get_course_detail_by_id(self):
        # 测试get_course_detail_by_id正确返回
        resp = get_course(name="计算机组成原理", teacher="无敌喵喵拳")
        self.assertEqual(resp["status"], 200)
        course_id = resp["course"][0]["course_id"]
        response = get_course_detail_by_id(course_id=course_id)
        self.assertEqual(response["status"], 200)

    def test_get_course_detail_by_id_err_id(self):
        # 测试get_course_detail_by_id在错误id时的返回
        response = get_course_detail_by_id(course_id="999999")
        self.assertEqual(response["status"], 404)

    def test_get_course_detail_by_id_no_id(self):
        # 测试get_course_detail_by_id在无id时的返回
        response = get_course_detail_by_id(None)
        self.assertEqual(response["status"], 400)


class ModifyDBTestCase(TestCase):
    def setUp(self):
        time1 = [{
            "type": const.TIME_WEEK.OTHER,
            "w0": 1,
            "w1": 16,
            "d": 1,
            "t0": 1,
        }]
        res1 = add_course(
            {
                "code": "1000016",
                "number": "01",
                "name": "计算机网络",
                "teacher": "罗伯特",
                "credit": 3,
                "department": "霜之哀伤",
                "course_type": "专业必修",
                "time": time1,
                "info": {"课程介绍": "罗伯特的计算机网络课程"},
            }
        )
        res2 = add_course(
            {
                "code": "1000017",
                "number": "02",
                "name": "计算机组成原理",
                "teacher": "无敌喵喵拳",
                "credit": 4,
                "department": "火之高兴",
                "course_type": "专业必修",
                "info": {"课程介绍": "无敌喵喵拳喵喵拳无敌"},
            }
        )
        curriculum1 = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000016"}],
            const.CURRICULUM_KEYS[1]: [{"code": "1000017"}],
            const.CURRICULUM_KEYS[2]: [],
        }
        user = add_user("valid_user", curriculum1)
        if user["status"] != 200:
            print("[ERROR] Failed to add user")
            raise Exception("Failed to add user")
        if res1["status"] != 200 or res2["status"] != 200:
            print("[ERROR] Failed to add courses")
            raise Exception("Failed to add courses")
        return super().setUp()

    def test_add_user_success(self):
        # 测试add_user函数成功添加用户时的返回
        response = add_user(user_id="testuser")
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["msg"], "add user successfully")

    def test_add_user_conflict(self):
        # 测试add_user函数在用户已存在时的返回
        add_user(user_id="testuser")
        response = add_user(user_id="testuser")
        self.assertEqual(response, const.RESPONSE_409)

    def test_add_user_with_curriculum(self):
        # 测试add_user函数添加带培养方案的用户
        curriculum = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000016"}],
            const.CURRICULUM_KEYS[1]: [{"code": "1000017"}],
            const.CURRICULUM_KEYS[2]: [],
        }

        response = add_user(user_id="testuser2", curriculum=curriculum)
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["msg"], "add user successfully")

    def test_add_user_invalid_input(self):
        # 测试add_user函数在输入无效时的返回
        response = add_user(user_id=12345)
        self.assertEqual(response, const.RESPONSE_400)

    def test_add_course(self):
        # 测试add_course函数成功添加课程时的返回
        response = add_course(
            {
                "code": "1000020",
                "number": "02",
                "name": "计算机组成原理",
                "teacher": "无敌喵喵拳",
                "credit": 4,
                "department": "火之高兴",
                "course_type": "专业必修",
                "info": {"课程介绍": "无敌喵喵拳喵喵拳无敌"},
            }
        )
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["msg"], "add course successfully")

    def test_add_course_type_error_input(self):
        # 测试add_course函数在输入格式错误时的返回
        response = add_course("this is not a dictionary")
        self.assertEqual(response["status"], 400)
    
    def test_add_course_error_input(self):
        # 测试add_course函数在输入内容错误时的返回
        response = add_course(
            {
                "code": "1000021",
                "number": "025",
                "name": "计算机组成原理",
                "teacher": "无敌喵喵拳",
                "credit": "hhhh",
                "department": 124,
                "course_type": 214142,
                "info": {"课程介绍": "无敌喵喵拳喵喵拳无敌"},
            }
        )
        self.assertEqual(response["status"], 500)
    def test_add_course_exist(self):
        # 测试add_course函数在课程已存在时的返回
        response = add_course(
             {
                "code": "1000016",
                "number": "01",
                "name": "计算机网络",
                "teacher": "罗伯特",
                "credit": 3,
                "department": "霜之哀伤",
                "course_type": "专业必修",
                "info": {"课程介绍": "罗伯特的计算机网络课程"},
            }
        )
        self.assertEqual(response, const.RESPONSE_409)

    def test_add_curriculum(self):
        # 测试add_curriculum函数成功添加培养方案时的返回
        test_curriculum = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000016"}],
            const.CURRICULUM_KEYS[1]: [{"code": "1000017"}],
            const.CURRICULUM_KEYS[2]: [{"code": "1000217"}],
        }
        response = add_curriculum(test_curriculum)
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["msg"], "add curriculum successfully")

    def test_add_curriculum_error_type(self):
        # 测试add_curriculum函数在输入类型错误时的返回
        response = add_curriculum("this is not a dictionary")
        self.assertEqual(response, const.RESPONSE_400)

        test_curriculum = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000016"}],
            "hhhh": [{"code": "1000017"}],
            const.CURRICULUM_KEYS[2]: 12345,
        }
        response = add_curriculum(test_curriculum)
        self.assertEqual(response, const.RESPONSE_400)

    def test_add_curriculum_error_input(self):
        # 测试add_curriculum函数在输入内容错误时的返回
        test_curriculum = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000016"}],
            const.CURRICULUM_KEYS[1]: [{"code": "1000017"}],
            const.CURRICULUM_KEYS[2]: 12345,
        }
        response = add_curriculum(test_curriculum)
        self.assertEqual(response, const.RESPONSE_500)

    def test_add_curriculum_exist(self):
        # 测试add_curriculum函数在培养方案已存在时的返回
        test_curriculum = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000016"}],
            const.CURRICULUM_KEYS[1]: [{"code": "1000017"}],
            const.CURRICULUM_KEYS[2]: [],
        }
        response = add_curriculum(test_curriculum)
        self.assertEqual(response["status"], 409)

    def test_add_course_to_decided(self):
        # 测试add_course_to_decided函数成功添加课程时的返回
        response = add_course_to_decided("valid_user", "1000016", "b2")
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["msg"], "add course to decided successfully")

    def test_add_course_to_decided_error_type(self):
        # 测试add_course_to_decided函数在输入类型错误时的返回
        response = add_course_to_decided("valid_user", 1000016, "b2")
        self.assertEqual(response, const.RESPONSE_400)

    def test_add_course_to_decided_invalid_user(self):
        # 测试add_course_to_decided函数在用户不存在时的返回
        response = add_course_to_decided("invalid_user", "1000016", "b2")
        self.assertEqual(response, const.RESPONSE_404)

    def test_add_course_to_decided_invalid_course(self):
        # 测试add_course_to_decided函数在课程冲突时的返回
        response = add_course_to_decided("valid_user", "1000018", "b2")
        response = add_course_to_decided("valid_user", "1000018", "b2")
        self.assertEqual(response, const.RESPONSE_409)

    def test_add_course_to_decided_error_input(self):
        # 测试add_course_to_decided函数在输入内容错误时的返回
        response = add_course_to_decided("valid_user", "1000016", "b5")
        self.assertEqual(response, const.RESPONSE_400)

    def test_add_course_to_favorate(self):
        # 测试add_course_to_favorate正确输入
        resp = get_course(name="计算机组成原理", teacher="无敌喵喵拳")
        self.assertEqual(resp["status"], 200)
        self.assertGreaterEqual(len(resp["course"]), 1)
        course_id = resp["course"][0]["course_id"]

        response = add_course_to_favorite("valid_user", course_id)
        self.assertEqual(response["status"], 200)

        response = get_user("valid_user")
        self.assertEqual(response["status"], 200)
        self.assertIsInstance(response["favorite"], list)
        self.assertIn(course_id, response["favorite"])
    
    def test_add_course_to_favorate_lack_input(self):
        # 测试add_course_to_favorate无输入
        response = add_course_to_favorite(None, None)
        self.assertEqual(response, const.RESPONSE_400)

    def test_add_course_to_favorate_invalid_user(self):
        # 测试add_course_to_favorate无效用户
        response = add_course_to_favorite("invalid_user", "1000016")
        self.assertEqual(response, const.RESPONSE_404)

    def test_add_course_to_favorite_invalid_course(self):
        # 测试add_course_to_favorite无效课程
        response = add_course_to_favorite("valid_user", "1000018")
        self.assertEqual(response, const.RESPONSE_404)

    def test_add_course_to_favorite_course_conflict(self):
        # 测试add_course_to_favorite课程冲突
        resp = get_course(name="计算机组成原理", teacher="无敌喵喵拳")
        self.assertEqual(resp["status"], 200)
        self.assertGreaterEqual(len(resp["course"]), 1)
        course_id = resp["course"][0]["course_id"]

        response = add_course_to_favorite("valid_user", course_id)
        response = add_course_to_favorite("valid_user", course_id)
        self.assertEqual(response, const.RESPONSE_409)

    def test_add_course_comment(self):
        # 测试add_course_comment正确输入
        resp = get_course(name="计算机组成原理", teacher="无敌喵喵拳")
        self.assertEqual(resp["status"], 200)
        self.assertGreaterEqual(len(resp["course"]), 1)
        course_id = resp["course"][0]["course_id"]
    
        comment: dict = {
            "comment_time": "2021-06-01 12:00:00",
            "comment_score": 3,
            "comment": "Ciallo～(∠・ω< )⌒☆"
        }
        response = add_course_comment(course_id, comment)
        self.assertEqual(response["status"], 200)

        resp = get_course_detail_by_id(course_id)

    def test_add_course_comment_more(self):
        # 测试add_course_comment多次评论
        resp = get_course(name="计算机组成原理", teacher="无敌喵喵拳")
        self.assertEqual(resp["status"], 200)
        self.assertGreaterEqual(len(resp["course"]), 1)
        course_id = resp["course"][0]["course_id"]

        comment1: dict = {
            "comment_time": "2021-06-01 12:00:00",
            "comment_score": 3,
            "comment": "Ciallo～(∠・ω< )⌒☆"
        }
        comment2: dict = {
            "comment_time": "2021-06-02 12:00:00",
            "comment_score": 4,
            "comment": "欸嘿"
        }
        response = add_course_comment(course_id, comment1)
        self.assertEqual(response["status"], 200)

        response = add_course_comment(course_id, comment2)
        self.assertEqual(response["status"], 200)

        resp = get_course_detail_by_id(course_id)
        self.assertEqual(resp["status"], 200)
        details = resp["details"]
        self.assertEqual(details["score"], 3.5)
        self.assertEqual(len(details["comments"]), 2)

    def test_change_course_level(self):
        # 测试change_course_level正确输入
        resp = get_course(name="计算机组成原理", teacher="无敌喵喵拳")
        self.assertEqual(resp["status"], 200)
        self.assertEqual(len(resp["course"]), 1)
        course_id = resp["course"][0]["course_id"]

        response = add_course_to_decided("valid_user", course_id, "b2")
        self.assertEqual(response["status"], 200)

        response = change_course_level("valid_user", course_id, "b1")
        self.assertEqual(response["status"], 200)
        
        decided = {
            "course_id": course_id,
            "selection_type": "b1",
        }
        resp = get_user("valid_user")
        self.assertEqual(resp["status"], 200)
        self.assertIn(decided, resp["decided"])

    def test_change_course_level_lack_input(self):
        # 测试change_course_level无输入
        response = change_course_level(None, None, None)
        self.assertEqual(response, const.RESPONSE_400)

    def test_change_course_level_invalid_user(self):
        # 测试change_course_level无效用户
        response = change_course_level("invalid_user", "1000016", "b2")
        self.assertEqual(response, const.RESPONSE_404)

    def test_change_course_level_invalid_type(self):
        # 测试change_course_level无效类型
        response = change_course_level("valid_user", "1000016", "b5")
        self.assertEqual(response, const.RESPONSE_400)

    def test_change_course_level_invalid_course(self):
        # 测试change_course_level无效课程（不存在于decided中）
        response = change_course_level("valid_user", "1000018", "b2")
        self.assertEqual(response["status"], 200)

    def test_change_user_info_nickname(self):
        # 测试change_user_info修改昵称
        nickname = "test_nickname"
        response = change_user_info("valid_user", nickname=nickname)
        self.assertEqual(response["status"], 200)

    def test_change_user_info_avatar(self):
        # 测试change_user_info函数修改用户头像
        add_user(user_id="testuser")
        resp = get_user("testuser")
        self.assertEqual(resp["status"], 200)
        self.assertEqual(resp["avatar"], "/media/avatar/default_avatar.png")

        # 获取测试图片(test_avatar.png)
        imageFile = ImageFile(open("media/avatar/test_avatar.png", "rb"))
        imageFile.name = "test_avatar.png"

        response = change_user_info("testuser", avatar=imageFile)
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["msg"], "change user info successfully")

        new_resp = get_user("testuser")
        self.assertEqual(new_resp["status"], 200)
        self.assertNotEqual(resp["avatar"], new_resp["avatar"])
        self.assertRegex(new_resp["avatar"], r"^/media/avatar/test_avatar(_\w+)?\.png$")

    def test_change_user_info_invalid_input(self):
        # 测试change_user_info无效输入
        response = change_user_info("123")
        self.assertEqual(response, const.RESPONSE_400)

    def test_change_user_info_invalid_input_2(self):
        # 测试change_user_info无效输入
        response = change_user_info(124, "12", "12")
        self.assertEqual(response, const.RESPONSE_400)

    def test_change_user_info_invalid_user(self):
        # 测试change_user_info无效用户
        response = change_user_info("invalid_user", "1")
        self.assertEqual(response, const.RESPONSE_404)

    def test_change_user_curriculum(self):
        # 测试change_user_curriculum正确输入
        test_curriculum = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000016"}],
            const.CURRICULUM_KEYS[1]: [{"code": "1000017"}],
            const.CURRICULUM_KEYS[2]: [],
        }
        response = change_user_curriculum("valid_user", test_curriculum)
        self.assertEqual(response["status"], 200)

    def test_change_user_curriculum_lack_input(self):
        # 测试change_user_curriculum无输入
        response = change_user_curriculum(None, None)
        self.assertEqual(response, const.RESPONSE_400)

    def test_change_user_curriculum_invalid_user(self):
        # 测试change_user_curriculum无效用户
        test_curriculum = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000016"}],
            const.CURRICULUM_KEYS[1]: [{"code": "1000017"}],
            const.CURRICULUM_KEYS[2]: [],
        }
        response = change_user_curriculum("invalid_user", test_curriculum)
        self.assertEqual(response, const.RESPONSE_404)

    def test_change_course_main(self):
        response = change_course_main()
        self.assertEqual(response, const.RESPONSE_501)

    def test_change_course_selection(self):
        # 测试change_course_selection正确输入
        resp = get_course(name="计算机组成原理", teacher="无敌喵喵拳")
        self.assertEqual(resp["status"], 200)
        self.assertEqual(len(resp["course"]), 1)
        course_id = resp["course"][0]["course_id"]

        blank = deepcopy(const.SELECTION_BLANK)
        response = change_course_selection(course_id, blank)

    def test_change_course_selection_lack_input(self):
        # 测试change_course_selection无输入
        response = change_course_selection(None, None)
        self.assertEqual(response, const.RESPONSE_400)

    def test_change_course_selection_invalid_course(self):
        # 测试change_course_selection无效课程
        blank = deepcopy(const.SELECTION_BLANK)
        response = change_course_selection("1000018", blank)
        self.assertEqual(response, const.RESPONSE_404)

    def test_change_course_selection_invalid_input(self):
        # 测试change_course_selection无效输入
        resp = get_course(name="计算机组成原理", teacher="无敌喵喵拳")
        self.assertEqual(resp["status"], 200)
        self.assertEqual(len(resp["course"]), 1)
        course_id = resp["course"][0]["course_id"]

        selection = deepcopy(const.SELECTION_BLANK)
        selection["total"] = 12
        selection["b1"] = -2
        response = change_course_selection(course_id, selection)
        self.assertEqual(response, const.RESPONSE_400)

    def test_change_course_detail(self):
        response = change_course_main()
        self.assertEqual(response, const.RESPONSE_501)

    def test_remove_user(self):
        # 测试remove_user函数正确返回
        resp = add_user("remove_user")
        self.assertEqual(resp["status"], 200)

        response = remove_user("remove_user")
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["msg"], "remove user successfully")

        response = get_user("remove_user")
        self.assertEqual(response["status"], 404)

    def test_remove_user_invalid_input(self):
        # 测试remove_user函数无效输入
        response = remove_user(12345)
        self.assertEqual(response, const.RESPONSE_400)

    def test_remove_user_invalid_user(self):
        # 测试remove_user函数无效用户
        response = remove_user("invalid_user")
        self.assertEqual(response, const.RESPONSE_404)

    def test_remove_course_from_decided(self):
        # 测试remove_course_from_decided正确返回
        resp = get_course(name="计算机组成原理", teacher="无敌喵喵拳")
        self.assertEqual(resp["status"], 200)
        self.assertEqual(len(resp["course"]), 1)
        course_id = resp["course"][0]["course_id"]

        decided = {
            "course_id": course_id,
            "selection_type": "b2",
        }

        response = add_course_to_decided("valid_user", course_id, "b2")
        self.assertEqual(response["status"], 200)
        resp = get_user("valid_user")
        self.assertEqual(resp["status"], 200)
        self.assertIn(decided, resp["decided"])

        response = remove_course_from_decided("valid_user", course_id)
        self.assertEqual(response["status"], 200)
        resp = get_user("valid_user")
        self.assertEqual(resp["status"], 200)
        self.assertNotIn(decided, resp["decided"])

    def test_remove_course_from_decided_lack_input(self):
        # 测试remove_course_from_decided无输入
        response = remove_course_from_decided(None, None)
        self.assertEqual(response, const.RESPONSE_400)

    def test_remove_course_from_decided_invalid_user(self):
        # 测试remove_course_from_decided无效用户
        response = remove_course_from_decided("invalid_user", "1000016")
        self.assertEqual(response, const.RESPONSE_404)

    def test_remove_course_from_decided_invalid_course(self):
        # 测试remove_course_from_decided无效课程
        response = remove_course_from_decided("valid_user", "1000018")
        self.assertEqual(response, const.RESPONSE_404)

    def test_remove_course_from_favorite(self):
        # 测试remove_course_from_favorite正确返回
        resp = get_course(name="计算机组成原理", teacher="无敌喵喵拳")
        self.assertEqual(resp["status"], 200)
        self.assertEqual(len(resp["course"]), 1)
        course_id = resp["course"][0]["course_id"]

        response = add_course_to_favorite("valid_user", course_id)
        self.assertEqual(response["status"], 200)

        response = remove_course_from_favorite("valid_user", course_id)
        self.assertEqual(response["status"], 200)

        resp = get_user("valid_user")
        self.assertEqual(resp["status"], 200)
        self.assertNotIn(course_id, resp["favorite"])

    def test_remove_course_from_favorite_lack_input(self):
        # 测试remove_course_from_favorite无输入
        response = remove_course_from_favorite(None, None)
        self.assertEqual(response, const.RESPONSE_400)

    def test_remove_course_from_favorite_invalid_user(self):
        # 测试remove_course_from_favorite无效用户
        response = remove_course_from_favorite("invalid_user", "1000016")
        self.assertEqual(response, const.RESPONSE_404)

    def test_remove_course_from_favorite_invalid_course(self):
        # 测试remove_course_from_favorite无效课程
        response = remove_course_from_favorite("valid_user", "1000018")
        self.assertEqual(response, const.RESPONSE_404)

    def test_remove_course(self):
        # 测试remove_course函数正确返回
        new_course = {
            "code": "1000020",
            "number": "09",
            "name": "软件工程",
            "teacher": "巧克力",
            "credit": 4,
            "department": "霜之哀伤",
            "course_type": "社科",
            "info": {"课程介绍": "没有"},
        }
        response = add_course(new_course)
        self.assertEqual(response["status"], 200)

        resp = get_course(name="软件工程", teacher="巧克力")
        self.assertEqual(resp["status"], 200)
        self.assertEqual(len(resp["course"]), 1)
        course_id = resp["course"][0]["course_id"]

        response = remove_course(course_id)
        self.assertEqual(response["status"], 200)

        response = get_course(course_id=course_id)
        self.assertEqual(len(response["course"]), 0)
        response = get_course_detail_by_id(course_id)
        self.assertEqual(response["status"], 404)

    def test_remove_course_lack_input(self):
        # 测试remove_course无输入
        response = remove_course(None)
        self.assertEqual(response, const.RESPONSE_400)

    def test_remove_course_invalid_course(self):
        # 测试remove_course无效课程
        response = remove_course("1000018")
        self.assertEqual(response, const.RESPONSE_404)

    def test_remove_curriculum_by_id(self):
        # 测试remove_curriculum_by_id正确返回
        test_curriculum = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000018"}],
            const.CURRICULUM_KEYS[1]: [{"code": "1000019"}],
            const.CURRICULUM_KEYS[2]: [{"code": "1000029"}],
        }
        response = add_curriculum(test_curriculum)
        self.assertEqual(response["status"], 200)

        resp = get_curriculum_existance(deepcopy(test_curriculum))
        self.assertEqual(resp["status"], 200)
        self.assertEqual(resp["value"], True)
        
        curriculum_id = cal_curriculum_id(deepcopy(test_curriculum))

        response = remove_curriculum_by_id(curriculum_id)
        self.assertEqual(response["status"], 200)

        response = get_curriculum_existance(deepcopy(test_curriculum))
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["value"], False)

    def test_remove_curriculum_by_id_lack_input(self):
        # 测试remove_curriculum_by_id无输入
        response = remove_curriculum_by_id(None)
        self.assertEqual(response, const.RESPONSE_400)

    def test_remove_curriculum_by_id_invalid_curriculum(self):
        # 测试remove_curriculum_by_id无效培养方案
        response = remove_curriculum_by_id("12345")
        self.assertEqual(response, const.RESPONSE_404)

    def test_remove_curriculum_by_curriculum(self):
        # 测试remove_curriculum_by_curriculum正确返回
        test_curriculum = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000018"}],
            const.CURRICULUM_KEYS[1]: [{"code": "1000020"}],
            const.CURRICULUM_KEYS[2]: [{"code": "1000029"}],
        }
        response = add_curriculum(test_curriculum)
        self.assertEqual(response["status"], 200)

        resp = get_curriculum_existance(deepcopy(test_curriculum))
        self.assertEqual(resp["status"], 200)
        self.assertEqual(resp["value"], True)

        response = remove_curriculum_by_curriculum(deepcopy(test_curriculum))
        self.assertEqual(response["status"], 200)

        response = get_curriculum_existance(deepcopy(test_curriculum))
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["value"], False)

    def test_remove_curriculum_by_curriculum_lack_input(self):
        # 测试remove_curriculum_by_curriculum无输入
        response = remove_curriculum_by_curriculum(None)
        self.assertEqual(response, const.RESPONSE_400)

    def test_remove_curriculum_by_curriculum_invalid_curriculum(self):
        # 测试remove_curriculum_by_curriculum无效培养方案
        response = remove_curriculum_by_curriculum({})
        self.assertEqual(response, const.RESPONSE_500)

    def test_remove_curriculum_by_curriculum_not_exist(self):
        # 测试remove_curriculum_by_curriculum不存在的培养方案
        test_curriculum = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000018"}],
            const.CURRICULUM_KEYS[1]: [{"code": "1000025"}],
            const.CURRICULUM_KEYS[2]: [{"code": "1000039"}],
        }
        response = remove_curriculum_by_curriculum(test_curriculum)
        self.assertEqual(response, const.RESPONSE_404)

    def test_remove_all_course_comment(self):
        # 测试remove_all_course_comment正确返回
        resp = get_course(name="计算机组成原理", teacher="无敌喵喵拳")
        self.assertEqual(resp["status"], 200)
        self.assertEqual(len(resp["course"]), 1)
        course_id = resp["course"][0]["course_id"]

        comment1: dict = {
            "comment_time": "2021-06-01 12:00:00",
            "comment_score": 3,
            "comment": "Ciallo～(∠・ω< )⌒☆"
        }
        comment2: dict = {
            "comment_time": "2021-06-02 12:00:00",
            "comment_score": 4,
            "comment": "欸嘿"
        }
        response = add_course_comment(course_id, comment1)
        self.assertEqual(response["status"], 200)

        response = add_course_comment(course_id, comment2)
        self.assertEqual(response["status"], 200)

        resp = get_course_detail_by_id(course_id)
        self.assertEqual(resp["status"], 200)
        details = resp["details"]
        self.assertEqual(details["score"], 3.5)
        self.assertEqual(len(details["comments"]), 2)

        response = remove_all_course_comment(course_id)
        self.assertEqual(response["status"], 200)

        resp = get_course_detail_by_id(course_id)
        self.assertEqual(resp["status"], 200)
        details = resp["details"]
        self.assertEqual(details["score"], 0)
        self.assertEqual(len(details["comments"]), 0)

    def test_remove_all_course_comment_lack_input(self):
        # 测试remove_all_course_comment无输入
        response = remove_all_course_comment(None)
        self.assertEqual(response, const.RESPONSE_400)

    def test_remove_all_course_comment_invalid_course(self):
        # 测试remove_all_course_comment无效课程
        response = remove_all_course_comment("1000018")
        self.assertEqual(response, const.RESPONSE_404)

    def test_remove_all_course(self):
        # 测试remove_all_courses正确返回
        response = remove_all_course()
        self.assertEqual(response["status"], 200)

        response = get_courses()
        self.assertEqual(response["status"], 400)

    def test_remove_all_curriculum(self):
        # 测试remove_all_curriculum正确返回
        test_curriculum = {
            const.CURRICULUM_KEYS[0]: [{"code": "1000216"}],
            const.CURRICULUM_KEYS[1]: [{"code": "1000217"}],
            const.CURRICULUM_KEYS[2]: [],
        }
        response = add_curriculum(test_curriculum)
        self.assertEqual(response["status"], 200)

        response = remove_all_curriculum()
        self.assertEqual(response["status"], 200)

        response = get_curriculum_existance(deepcopy(test_curriculum))
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["value"], False)