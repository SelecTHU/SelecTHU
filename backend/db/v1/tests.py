from django.test import TestCase
from db.v1.queryDB import *
from db.v1.modifyDB import *

import db.v1.const as const


class QueryDBTestCase(TestCase):
    def setUp(self):
        res1 = add_course(
            {
                "code": "1000016",
                "number": "01",
                "name": "计算机网络",
                "teacher": "罗伯特",
                "credit": 3,
                "department": "霜之哀伤",
                "course_type": "专业必修",
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
            const.CURRICULUM_KEYS[0]: ["1000016"],
            const.CURRICULUM_KEYS[1]: ["1000017"],
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

    def test_get_curriculum_valid_user(self):
        # 测试get_curriculum函数对有效用户的返回
        response = get_curriculum("valid_user")
        self.assertEqual(response["status"], 200)
        self.assertIn("curriculum", response)

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
        # 测试get_courses函数按指定数量返回课程
        response = get_courses(count=2)
        self.assertEqual(response["status"], 200)
        self.assertEqual(len(response["courses"]), 2)

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

    def test_get_course_fuzzy_search(self):
        # 测试get_course函数（模糊检索）
        response = get_course(name="计算机", search_mode="fuzzy")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)
        self.assertEqual(len(response["course"]), 2)

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
            const.CURRICULUM_KEYS[0]: ["1000016"],
            const.CURRICULUM_KEYS[1]: ["1000017"],
            const.CURRICULUM_KEYS[2]: [],
        }

        response = add_user(user_id="testuser2", curriculum=curriculum)
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["msg"], "add user successfully")

    def test_add_user_invalid_input(self):
        # 测试add_user函数在输入无效时的返回
        response = add_user(user_id=12345)
        self.assertEqual(response, const.RESPONSE_400)
