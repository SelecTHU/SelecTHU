from django.test import TestCase
from db.v1.queryDB import *
from db.v1.modifyDB import *

import db.v1.const as const


class QueryDBTestCase(TestCase):
    def setUp(self):
        res1 = add_course({
            "code": "1000016",
            "number": "01",
            "name": "计算机网络",
            "teacher": "罗伯特"
        })
        res2 = add_course({
            "code": "1000017",
            "number": "02",
            "name": "计算机组成原理",
            "teacher": "无敌喵喵拳",
        })
        curriculum1 = {
            const.CURRICULUM_KEYS[0]: [
                "1000016"
            ],
            const.CURRICULUM_KEYS[1]: [
                "1000017"
            ],
            const.CURRICULUM_KEYS[2]: [
            ]
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

    def test_get_course_by_teacher(self):
        # 测试get_course函数根据教师名检索
        response = get_course(teacher="无敌喵喵拳")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)

    def test_get_course_by_multi_cond(self):
        # 测试get_course函数根据多种条件
        response = get_course(name="计算机网络", teacher="无敌喵喵拳")
        self.assertEqual(response["status"], 200)
        self.assertIn("course", response)
        self.assertIsInstance(response["course"], list)


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
            const.CURRICULUM_KEYS[0]: [
                "1000016"
            ],
            const.CURRICULUM_KEYS[1]: [
                "1000017"
            ],
            const.CURRICULUM_KEYS[2]: [
            ]
        }
        response = add_user(user_id="testuser2", curriculum=curriculum)
        self.assertEqual(response["status"], 200)
        self.assertEqual(response["msg"], "add user successfully")

    def test_add_user_invalid_input(self):
        # 测试add_user函数在输入无效时的返回
        response = add_user(user_id=12345)
        self.assertEqual(response, const.RESPONSE_400)
