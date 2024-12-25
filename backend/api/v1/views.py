from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from django.core.files.storage import default_storage

from api.v1.utils import generate_jwt, login_required, verify_password
from db.v1 import utils as db_utils
from tools.scheduler import Scheduler
from tools.chatai import run


@api_view(["GET"])
def backend_db_status(request):
    """
    后端状态检查
    """
    db_status = db_utils.db_status()
    return Response({"status": 200, "message": "successfully connect to backend and database!"}, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([AllowAny])
def login_default(request):
    """
    使用默认id登录
    """
    user_id = "12345678"
    payload = {"user_id": user_id}
    token = generate_jwt(payload)
    return Response({"status": 200, "jwt": token}, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    """
    用户登录
    """
    user_id = request.data.get("user_id")
    if not user_id:
        return Response({"status": 400, "message": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    password = request.data.get("password")
    if not password:
        return Response({"status": 400, "message": "password is required"}, status=status.HTTP_400_BAD_REQUEST)

    #if not verify_password(user_id, password):
    #    return Response({"status": 401, "message": "Invalid user_id or password"}, status=status.HTTP_401_UNAUTHORIZED)
    scheduler = Scheduler()
    status_, name = scheduler.verify(user_id, password)
    test = scheduler.login(user_id, password)
    if not status_ or not test:
        return Response({"status": 401, "message": "Invalid user_id or password"}, status=status.HTTP_401_UNAUTHORIZED)
    
    response = db_utils.get_user(user_id)
    if response["status"] == 404:
        # import requests
        # import os
        # proxy = os.getenv("PROXY")
        # if proxy:
        #     data = {
        #         "username": user_id,
        #         "password": password,
        #     }
        #     resp = requests.post(f"{proxy}/login", json=data)
        #     if resp["status"] == 200:
        #         resp = requests.get(f"{proxy}/curriculum", params={"username": user_id})
        #         if resp["status"] == 200:
        #             curriculum = resp["curriculum"]
        #             db_utils.add_user(user_id, curriculum)
        curriculum = scheduler.get_curriculum()
        db_utils.add_user(user_id, curriculum)
    else:
        curr_curriculum = response["curriculum"]
        if not curr_curriculum:
            curriculum = scheduler.get_curriculum()
            db_utils.change_user_curriculum(user_id, curriculum)

    payload = {"user_id": user_id}
    token = generate_jwt(payload)
    return Response({"status": 200, "jwt": token, "name": name}, status=status.HTTP_200_OK)

@api_view(["POST"])
@login_required
def logout(request, user_id):
    """
    用户登出
    """
    return Response({"status": 200}, status=status.HTTP_200_OK)

@api_view(["GET"])
@login_required
def get_user_info(request, user_id):
    """
    获取用户完整信息
    """
    user = db_utils.get_user(user_id)
    if not user:
        return Response({"status": 404, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    decided_list = user["decided"]
    courses_decided = []
    for item in decided_list:
        course = db_utils.get_course(course_id=item["course_id"])["course"][0]
        course["selection_type"] = item["selection_type"]
        courses_decided.append(course)

    favorite_ids = user["favorite"]
    courses_favorite = []
    for course_id in favorite_ids:
        course = db_utils.get_course(course_id=course_id)["course"][0]
        courses_favorite.append(course)

    return Response({
        "status": 200,
        "user": {
            "nickname": user["nickname"],
            "avatar": user["avatar"],
            "courses-favorite": courses_favorite,
            "courses-decided": courses_decided,
            "curriculum": user["curriculum"],
        }
    }, status=status.HTTP_200_OK)

@api_view(["GET"])
@login_required
def get_user_info_basic(request, user_id):
    """
    获取用户基本信息
    """
    user = db_utils.get_user(user_id)
    if not user:
        return Response({"status": 404, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        "status": 200,
        "user": {
            "nickname": user["nickname"],
            "avatar": user["avatar"],
        }
    }, status=status.HTTP_200_OK)

@api_view(["POST"])
@login_required
def modify_user_info_basic(request, user_id):
    """
    修改用户基本信息
    """
    user = db_utils.get_user(user_id)
    if not user:
        return Response({"status": 404, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    nickname = request.data.get("nickname", None)
    avatar = request.data.get("avatar", None)
    
    res = db_utils.change_user_info(user_id, nickname, avatar)
    
    if res["status"] == 200:
        return Response({"status": 200}, status=status.HTTP_200_OK)
    return Response({"status": 400, "message": "Invalid nickname or avatar"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@login_required
def modify_user_curriculum(request, user_id):
    """
    修改用户培养方案
    """
    user = db_utils.get_user(user_id)
    if not user:
        return Response({"status": 404, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    curriculum = request.data.get("curriculum", None)
    #[TODO]
    op = db_utils.change_user_curriculum(user_id, curriculum)
    if op["status"] == 200:
        return Response({"status": 200}, status=status.HTTP_200_OK)
    else:
        return Response({"status": 400, "message": "Invalid curriculum"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@login_required
def get_selection_stage(request, user_id):
    """
    查询选课阶段
    """
    selection_stage = "预选"  # mock数据，实际应从数据库获取
    return Response({
        "status": 200,
        "selection-stage": selection_stage,
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
@login_required
def get_curriculum(request, user_id):
    """
    查询培养方案
    """
    user = db_utils.get_user(user_id)
    if not user:
        return Response({"status": 404, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    return Response({
        "status": 200,
        "curriculum": user["curriculum"],
    }, status=status.HTTP_200_OK)

@api_view(["GET"])
@login_required
def filter_courses(request, user_id):
    """
    筛选课程
    """
    courses = db_utils.get_course(
        code=request.query_params.get("code", None),
        number=request.query_params.get("number", None),
        name=request.query_params.get("name", None),
        teacher=request.query_params.get("teacher", None),
        credit=request.query_params.get("credit", None),
        time=request.query_params.get("time", None),  # Assuming time is a JSON string or dictionary
        department=request.query_params.get("department", None),
        course_type=request.query_params.get("course-type", None),  # Renamed to course_type to match get_course
        features=request.query_params.get("features", None),
        text=request.query_params.get("text", None),
        grade=request.query_params.get("grade", None),
        sec_choice=request.query_params.get("sec-choice", None),
        search_mode=request.query_params.get("search-mode", "exact"),
    )

    return Response({
        "status": 200,
        "courses-main": courses["course"],
    }, status=status.HTTP_200_OK)

@api_view(["GET"])
@login_required
def get_course_detail(request, course_id, user_id):
    """
    查询课程信息
    """
    course = db_utils.get_course_detail_by_id(course_id)
    if not course:
        return Response({"status": 404, "message": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        "status": 200,
        "course": {
            "info": course["details"]["info"],
            "score": course["details"]["score"],
            "comments": course["details"]["comments"],
        }
    }, status=status.HTTP_200_OK)

@api_view(["POST"])
@login_required
def modify_course_condition(request, user_id):
    """
    修改课程状态
    """
    # TODO: 刚加入时需要设置默认志愿
    course_id = request.data.get("course_id")
    condition = request.data.get("condition")

    if condition not in ["decided", "favorite", "dismiss"]:
        return Response({"status": 400, "message": "Invalid condition"}, status=status.HTTP_400_BAD_REQUEST)

    code = db_utils.get_course(course_id=course_id)["course"][0]["code"]
    user = db_utils.get_user(user_id)
    if not user:
        return Response({"status": 404, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if course_id in [item["course_id"] for item in user["decided"]]:
        prev_cond = "decided"
    elif course_id in user["favorite"]:
        prev_cond = "favorite"
    else:
        prev_cond = "dismiss"
    
    success = True
    if condition == "dismiss":
        if prev_cond == "decided":
            success = db_utils.remove_course_from_decided(user_id, course_id)
        elif prev_cond == "favorite":
            success = db_utils.remove_course_from_favorite(user_id, course_id)
    elif condition == "favorite":
        if prev_cond == "decided":
            success = db_utils.remove_course_from_decided(user_id, course_id)
            success = db_utils.add_course_to_favorite(user_id, course_id) and success
        elif prev_cond == "dismiss":
            success = db_utils.add_course_to_favorite(user_id, course_id)
    else:
        curriculum = user["curriculum"]["courses"]
        in0 = code in [item["code"] for item in curriculum['0']]
        in1 = code in [item["code"] for item in curriculum['1']]
        in2 = code in [item["code"] for item in curriculum['2']]
        selection_type = "b3" if in0 else "x3" if in1 else "t3" if in2 else "r3"
        if prev_cond == "favorite":
            success = db_utils.remove_course_from_favorite(user_id, course_id)
            success = db_utils.add_course_to_decided(user_id, course_id, selection_type) and success
        elif prev_cond == "dismiss":
            success = db_utils.add_course_to_decided(user_id, course_id, selection_type)
    
    if not success:
        return Response({"status": 404, "message": "Course not found or error in condition change"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"status": 200}, status=status.HTTP_200_OK)

@api_view(["GET"])
@login_required
def get_courses_decided(request, user_id):
    """
    获取已选课程
    """
    user = db_utils.get_user(user_id)
    if not user:
        return Response({"status": 404, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    decided_list = user["decided"]
    courses_decided = []
    for item in decided_list:
        course = db_utils.get_course(course_id= item["course_id"])["course"][0]
        course["selection_type"] = item["selection_type"]
        courses_decided.append(course)
    return Response({
        "status": 200,
        "courses-decided": courses_decided,
    }, status=status.HTTP_200_OK)

@api_view(["GET"])
@login_required
def get_courses_favorite(request, user_id):
    """
    获取收藏课程
    """
    user = db_utils.get_user(user_id)
    if not user:
        return Response({"status": 404, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    favorite_ids = user["favorite"]
    courses_favorite = []
    for course_id in favorite_ids:
        course = db_utils.get_course(course_id= course_id)["course"][0]
        courses_favorite.append(course)
    return Response({
        "status": 200,
        "courses-favorite": courses_favorite,
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
@login_required
def modify_course_selection_type(request, user_id):
    """
    修改课程志愿
    """
    course_id = request.data.get("course_id")
    selection_type = request.data.get("selection_type")
    user = db_utils.get_user(user_id)
    if not user:
        return Response({"status": 404, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    if selection_type[0] not in ['b', 'x', 'r', 't'] or selection_type[1] not in ['0', '1', '2', '3']:
        return Response({"status": 400, "message": "Invalid selection type"}, status=status.HTTP_400_BAD_REQUEST)
    success = db_utils.change_course_level(user_id, course_id, selection_type)
    if not success:
        return Response({"status": 404, "message": "Course not found or error in selection type change"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["POST"])
@login_required
def chatbot_reply(request):
    """
    聊天机器人回复
    """
    input = request.data.get("user-input")
    response = run(input)
    return response