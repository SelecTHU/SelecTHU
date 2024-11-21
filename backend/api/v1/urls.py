from django.urls import path
from . import views

urlpatterns = [
    # 登录和登出
    path('login-default/', views.login_default, name='login'),  # 登录
    path('login/', views.login, name='login'),  # 登录
    path('logout/<str:user_id>/', views.logout, name='logout'),  # 登出

    # 用户信息管理
    path('user/<str:user_id>/', views.get_user_info, name='get_user_info'),  # 获取个人完整信息
    path('user-basic/<str:user_id>/', views.get_user_info_basic, name='get_user_info_basic'),  # 获取个人基本信息
    path('user-basic/<str:user_id>/update/', views.modify_user_info_basic, name='modify_user_info_basic'),  # 修改个人基本信息

    # 选课管理
    path('selection-stage/', views.get_selection_stage, name='get_selection_phase'),  # 获取选课阶段
    path('curriculum/<str:user_id>/', views.get_curriculum, name='get_curriculum'),  # 获取培养方案
    path('courses/', views.filter_courses, name='filter_courses'),  # 筛选获取课程
    path('course-detail/<str:course_id>/', views.get_course_detail, name='get_course_detail'),  # 获取课程详细信息
    path('change-course-condition/<str:user_id>', views.change_course_condition, name='change_course_condition'),  # 选中/备选/不选状态切换
    path('courses-decided/<str:user_id>/', views.get_courses_decided, name='get_course_decided'),  # 获取已选课程
    path('courses-favorite/<str:user_id>/', views.get_courses_favorite, name='get_course_favorite'),  # 获取收藏课程
    path('change-course-wish/<str:user_id>/', views.change_course_wish, name='change_course_wish'),  # 修改课程志愿
]
