from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from db.v1.models import User, MainCourses, Curriculum, CoursesDetails  # 假设你有User和Course模型
from rest_framework.test import APIClient
import os

class ApiV1Tests(TestCase):

    def setUp(self):
        
        """
        每个测试之前都会运行此方法，模拟多个用户、课程和培养方案数据
        """
        self.client = APIClient()

        '''
        # 模拟多个用户数据
        self.user1 = User.objects.create(
            user_id='12345678',
            user_nickname='Test User 1',
            user_avatar='avatar_url_1',
            user_curriculum='12345678',
            user_decided=['course1', 'course3'],
            user_favorite=['course2', 'course4']
        )
        
        self.user2 = User.objects.create(
            user_id='23456789',
            user_nickname='Test User 2',
            user_avatar='avatar_url_2',
            user_curriculum="23456789",
            user_decided=['course3'],
            user_favorite=['course6']
        )
        
        self.user3 = User.objects.create(
            user_id='34567890',
            user_nickname='Test User 3',
            user_avatar='avatar_url_3',
            user_curriculum="34567890",
            user_decided=['course4'],
            user_favorite=['course5']
        )

        self.curriculum1 = Curriculum.objects.create(
            curriculum_id='12345678',
            courses={"0": ['course1', 'course2'], "1": ['course3'], "2": ['course4']}
        )

        self.curriculum2 = Curriculum.objects.create(
            curriculum_id='23456789',
            courses={"0": ['course2', 'course3'], "1": ['course4'], "2": ['course5']}
        )

        self.curriculum3 = Curriculum.objects.create(
            curriculum_id='34567890',
            courses={"0": ['course3', 'course4'], "1": ['course5'], "2": ['course6']}
        )
        '''

        self.course_detail1 = CoursesDetails.objects.create(
            course_id="course1",
            info={"description": "A detailed course description"},
            score=4.5,
            comments=[{
                "comment_time": "2024-01-01",
                "comment_score": 5,
                "comment": "Great course!"
            }]
        )

        self.course_detail2 = CoursesDetails.objects.create(
            course_id="course2",
            info={"description": "A detailed course description"},
            score=4.5,
            comments=[{
                "comment_time": "2024-01-01",
                "comment_score": 5,
                "comment": "Great course!"
            }]
        )

        self.course_detail3 = CoursesDetails.objects.create(
            course_id="course3",
            info={"description": "A detailed course description"},
            score=4.5,
            comments=[{
                "comment_time": "2024-01-01",
                "comment_score": 5,
                "comment": "Great course!"
            }]
        )

        self.course1 = MainCourses.objects.create(
            course_id='course1',
            code='34100173',
            number='1',
            name='数据库原理',
            teacher='Test Teacher 1',
            credit=3,
            time='5-1',
            department='Department A',
            course_type='A',
            features='feature A',
            text='text A',
            grade='a1',
            capacity=100,
            sec_choice=True,
            selection={
                "total": 100,
                "b1": 10,
                "b2": 10,
                "b3": 10,
                "x1": 10,
                "x2": 10,
                "x3": 10,
                "r0": 10,
                "r1": 10,
                "r2": 10,
                "r3": 10,
            },
            link=self.course_detail1,
        )
        
        self.course2 = MainCourses.objects.create(
            course_id='course2',
            code='44100102',
            number='2',
            name='人工智能导论',
            teacher='Test Teacher 2',
            credit=4,
            time='5-2',
            department='Department B',
            course_type='B',
            features='feature B',
            text='text B',
            grade='a2',
            capacity=100,
            sec_choice=False,
            selection={
                "total": 100,
                "b1": 10,
                "b2": 10,
                "b3": 10,
                "x1": 10,
                "x2": 10,
                "x3": 10,
                "r0": 10,
                "r1": 10,
                "r2": 10,
                "r3": 10,
            },
            link=self.course_detail2,
        )
        
        self.course3 = MainCourses.objects.create(
            course_id='course3',
            code='34567890',
            number='1',
            name='数据结构',
            teacher='Test Teacher 3',
            credit=2,
            time='5-3',
            department='Department C',
            course_type='C',
            features='feature C',
            text='text C',
            grade='a3',
            capacity=100,
            sec_choice=False,
            selection={
                "total": 100,
                "b1": 10,
                "b2": 10,
                "b3": 10,
                "x1": 10,
                "x2": 10,
                "x3": 10,
                "r0": 10,
                "r1": 10,
                "r2": 10,
                "r3": 10,
            },
            link=self.course_detail3,
        )

        self.course_detail1.save()
        self.course_detail2.save()
        self.course_detail3.save()
        self.course1.save()
        self.course2.save()
        self.course3.save()
        

    def test_status(self):
        url = reverse("backend_db_status")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_status2(self):
        url = reverse("backend_db_status")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    #######################################################
    # 功能测试部分：
    # 使用真实登陆数据观测整个用户链路能否正常工作
    ######################################################
    def test_pipeline(self):
        # login
        login_response = self.client.post(reverse('login'),
                                          {"user_id": os.getenv("USER_ID"), "password": os.getenv("PASSWORD")})
        assert login_response.status_code == 200
        print("login_response", login_response.data)
        auth = f"Bearer {login_response.data['jwt']}"
        # get user info
        user_info_response = self.client.get(reverse('get_user_info'), HTTP_AUTHORIZATION=auth)
        print("user_info_response", user_info_response.data)
        # get user info basic
        user_info_basic_response = self.client.get(reverse('get_user_info_basic'), HTTP_AUTHORIZATION=auth)
        print("user_info_basic_response", user_info_basic_response.data)
        # modify user info basic
        '''
        modify_user_info_basic_response = self.client.post(reverse('modify_user_info_basic'),
                                                              {"avatar": "new_avatar_url"}, HTTP_AUTHORIZATION=auth)
        print("modify_user_info_basic_response", modify_user_info_basic_response.data)
        '''
        # get selection stage
        selection_stage_response = self.client.get(reverse('get_selection_stage'), HTTP_AUTHORIZATION=auth)
        print("selection_stage_response", selection_stage_response.data)
        # get curriculum
        curriculum_response = self.client.get(reverse('get_curriculum'), HTTP_AUTHORIZATION=auth)
        print("curriculum_response", curriculum_response.data)
        # filter courses
        filter_courses_response = self.client.get(reverse('filter_courses'), {'name': '数据库原理'},
                                                    HTTP_AUTHORIZATION=auth)
        print("filter_courses_response", filter_courses_response.data)
        # get course detail
        get_course_detail_response = self.client.get(reverse('get_course_detail', args=["course1"]),
                                                        HTTP_AUTHORIZATION=auth)
        print("get_course_detail_response", get_course_detail_response.data)
        
        # modify course condition
        modify_course_condition_response = self.client.post(reverse('modify_course_condition'),
                                                            {"course_id": "course1", "condition": "decided"},
                                                            HTTP_AUTHORIZATION=auth)
        print("modify_course_condition_response", modify_course_condition_response.data)
        modify_course_condition_response = self.client.post(reverse('modify_course_condition'),
                                                            {"course_id": "course2", "condition": "favorite"},
                                                            HTTP_AUTHORIZATION=auth)
        print("modify_course_condition_response", modify_course_condition_response.data)
        modify_course_condition_response = self.client.post(reverse('modify_course_condition'),
                                                            {"course_id": "course3", "condition": "decided"},
                                                            HTTP_AUTHORIZATION=auth)
        # get courses decided
        get_courses_decided_response = self.client.get(reverse('get_courses_decided'), HTTP_AUTHORIZATION=auth)
        print("get_courses_decided_response", get_courses_decided_response.data)
        modify_course_condition_response = self.client.post(reverse('modify_course_condition'),
                                                            {"course_id": "course3", "condition": "dismiss"},
                                                            HTTP_AUTHORIZATION=auth)
        print("modify_course_condition_response", modify_course_condition_response.data)
        get_courses_decided_response = self.client.get(reverse('get_courses_decided'), HTTP_AUTHORIZATION=auth)
        print("get_courses_decided_response", get_courses_decided_response.data)
        # get courses favorite
        get_courses_favorite_response = self.client.get(reverse('get_courses_favorite'), HTTP_AUTHORIZATION=auth)
        print("get_courses_favorite_response", get_courses_favorite_response.data)
        # modify course selection type
        
        modify_course_selection_type_response = self.client.post(reverse('modify_course_selection_type'),
                                                                {"course_id": "course1", "selection_type": "b1"},
                                                                HTTP_AUTHORIZATION=auth)
        print("modify_course_selection_type_response", modify_course_selection_type_response.data)
        get_courses_decided_response = self.client.get(reverse('get_courses_decided'), HTTP_AUTHORIZATION=auth)
        print("get_courses_decided_response", get_courses_decided_response.data)

    #######################################################
    # 单元测试部分：
    # 使用mock数据测试接口实现逻辑是否正确
    ######################################################
    def test_logout(self):
        """
        测试登出
        """
        url = reverse('logout')
        auth = f"Bearer {self.jwt}"
        data = {}
        response = self.client.post(url, data, HTTP_AUTHORIZATION=auth)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_info(self):
        """
        测试获取用户完整信息接口
        """
        url = reverse('get_user_info')
        auth = f"Bearer {self.jwt}"
        data = {}
        response = self.client.get(url, data, HTTP_AUTHORIZATION=auth)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('courses-decided', response.data["user"])

    def test_get_user_info_basic(self):
        """
        测试获取用户完整信息接口
        """
        url = reverse('get_user_info_basic')
        auth = f"Bearer {self.jwt}"
        data = {}
        response = self.client.get(url, data, HTTP_AUTHORIZATION=auth)
        print("response")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('avatar', response.data["user"])

    def test_modify_user_info_basic(self):
        """
        测试修改用户基本信息接口
        """
        url = reverse('modify_user_info_basic')
        auth = f"Bearer {self.jwt}"
        data = {"avatar": "new_avatar_url"}
        response = self.client.post(url, data, HTTP_AUTHORIZATION=auth)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["avatar"], "new_avatar_url")

    def test_modify_user_curriculum(self):
        """
        测试修改用户培养方案接口
        """
        url = reverse('modify_user_curriculum')
        auth = f"Bearer {self.jwt}"
        data = {"curriculum_id": "23456789"}
        response = self.client.post(url, data, HTTP_AUTHORIZATION=auth)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["user_curriculum"], "23456789")

    def test_get_selection_stage(self):
        """
        测试获取选课阶段接口
        """
        url = reverse('get_selection_phase')
        auth = f"Bearer {self.jwt}"
        data = {}
        response = self.client.get(url, data, HTTP_AUTHORIZATION=auth)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('stage', response.data)

    def test_get_curriculum(self):
        """
        测试获取培养方案接口
        """
        url = reverse('get_curriculum')
        auth = f"Bearer {self.jwt}"
        data = {}
        response = self.client.get(url, data, HTTP_AUTHORIZATION=auth)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('courses', response.data)

    def test_filter_courses(self):
        """
        测试筛选获取课程接口
        """
        url = reverse('filter_courses')
        auth = f"Bearer {self.jwt}"
        data = {"department": "Department A"}
        response = self.client.get(url, data, HTTP_AUTHORIZATION=auth)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('courses', response.data)

    def test_get_course_detail(self):
        """
        测试获取课程详细信息接口
        """
        url = reverse('get_course_detail', args=["course1"])
        auth = f"Bearer {self.jwt}"
        data = {}
        response = self.client.get(url, data, HTTP_AUTHORIZATION=auth)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('info', response.data)

    def test_modify_course_condition(self):
        """
        测试选中/备选/不选状态切换接口
        """
        url = reverse('modify_course_condition')
        auth = f"Bearer {self.jwt}"
        data = {"course_id": "course1", "condition": "decided"}
        response = self.client.post(url, data, HTTP_AUTHORIZATION=auth)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["user_decided"], ["course3", "course1"])

    def test_get_courses_decided(self):
        """
        测试获取已选课程接口
        """
        url = reverse('get_course_decided')
        auth = f"Bearer {self.jwt}"
        data = {}
        response = self.client.get(url, data, HTTP_AUTHORIZATION=auth)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('courses', response.data)

    def test_get_courses_favorite(self):
        """
        测试获取收藏课程接口
        """
        url = reverse('get_course_favorite')
        auth = f"Bearer {self.jwt}"
        data = {}
        response = self.client.get(url, data, HTTP_AUTHORIZATION=auth)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('courses', response.data)

    def test_modify_course_selection_type(self):
        """
        测试修改课程志愿接口
        """
        url = reverse('modify_course_selection_type')
        auth = f"Bearer {self.jwt}"
        data = {"course_id": "course1", "selection_type": "b1"}
        response = self.client.post(url, data, HTTP_AUTHORIZATION=auth)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["user_decided"], ["course3", "course1"])
        self.assertEqual(response.data["user"]["user_favorite"], ["course2", "course4"])
    
    def tearDown(self):
        pass