from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from django.core.files.storage import default_storage

from api.v1.utils import generate_jwt, login_required, verify_password

from db.v1 import utils as db_utils

@api_view(["GET"])
@permission_classes([AllowAny])
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

    if not verify_password(user_id, password):
        return Response({"status": 401, "message": "Invalid user_id or password"}, status=status.HTTP_401_UNAUTHORIZED)

    user = db_utils.get_user(user_id)
    if not user:
        db_utils.add_user(user_id)

    payload = {"user_id": user_id}
    token = generate_jwt(payload)
    return Response({"status": 200, "jwt": token}, status=status.HTTP_200_OK)

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

    decided_ids = user.user_decided
    courses_decided = []
    for course_id in decided_ids:
        course = db_utils.get_course(id_= course_id)
        courses_decided.append(course)

    favorite_ids = user.user_favorite
    courses_favorite = []
    for course_id in favorite_ids:
        course = db_utils.get_course(id_= course_id)
        courses_favorite.append(course)

    return Response({
        "status": 200,
        "user": {
            "nickname": user.user_nickname,
            "avatar": user.user_avatar,
            "courses-favorite": courses_favorite,
            "courses-decided": courses_decided,
            "curriculum": user.user_curriculum,
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
            "nickname": user.user_nickname,
            "avatar": user.user_avatar,
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
    avatar = request.FILES.get("avatar", None)

    if nickname:
        user.user_nickname = nickname
    if avatar:
        if user.avatar:
            default_storage.delete(user.user_avatar.path)  # 删除旧头像
        user.user_avatar = avatar

    user.save()
    return Response({"status": 200}, status=status.HTTP_200_OK)

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
    db_utils.modify_user_curriculum(user_id, curriculum)
    return Response({"status": 200}, status=status.HTTP_200_OK)

@api_view(["GET"])
@login_required
def get_selection_stage(request):
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
        "curriculum": user.user_curriculum,
    }, status=status.HTTP_200_OK)

@api_view(["GET"])
@login_required
def filter_courses(request):
    """
    筛选课程
    """
    filters = {
        "code": request.query_params.get("code", None),
        "name": request.query_params.get("name", None),
        "teacher": request.query_params.get("teacher", None),
        "credit": request.query_params.get("credit", None),
        "period": request.query_params.get("period", None),
        "time": request.query_params.get("time", None),
        "department": request.query_params.get("department", None),
        "type": request.query_params.get("type", None),
        "search_mode": request.query_params.get("search_mode", "exact"),
    }

    courses = db_utils.get_course(filters)

    return Response({
        "status": 200,
        "courses-main": courses,
    }, status=status.HTTP_200_OK)

@api_view(["GET"])
@login_required
def get_course_detail(request, course_id):
    """
    查询课程信息
    """
    course = db_utils.get_course_detail_by_id(course_id)
    if not course:
        return Response({"status": 404, "message": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        "status": 200,
        "course": {
            "info": course.info,
            "score": course.score,
            "comments": course.comments,
        }
    }, status=status.HTTP_200_OK)

@api_view(["POST"])
@login_required
def modify_course_condition(request, user_id):
    """
    修改课程状态
    """
    #TODO：<db>，增加接口add_course_to_decided, add_course_to_favorite, remove_course_from_decided, remove_course_from_favorite
    course_id = request.data.get("course_id")
    cond = request.data.get("cond")

    if cond not in ["decided", "favorite", "dismiss"]:
        return Response({"status": 400, "message": "Invalid condition"}, status=status.HTTP_400_BAD_REQUEST)

    user = db_utils.get_user(user_id)
    if not user:
        return Response({"status": 404, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if course_id in user.user_decided:
        prev_cond = "decided"
    elif course_id in user.user_favorite:
        prev_cond = "favorite"
    else:
        prev_cond = "dismiss"
    
    success = True
    if cond == "dismiss":
        if prev_cond == "decided":
            success = db_utils.remove_course_from_decided(user_id, course_id)
        elif prev_cond == "favorite":
            success = db_utils.remove_course_from_favorite(user_id, course_id)
    elif cond == "favorite":
        if prev_cond == "decided":
            success = db_utils.remove_course_from_decided(user_id, course_id)
            success = db_utils.add_course_to_favorite(user_id, course_id) and success
        elif prev_cond == "dismiss":
            success = db_utils.add_course_to_favorite(user_id, course_id)
    else:
        if prev_cond == "favorite":
            success = db_utils.remove_course_from_favorite(user_id, course_id)
            success = db_utils.add_course_to_decided(user_id, course_id) and success
        elif prev_cond == "dismiss":
            success = db_utils.add_course_to_decided(user_id, course_id)
    
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
    course_ids = user.user_decided
    courses = []
    for course_id in course_ids:
        course = db_utils.get_course(id_= course_id)
        courses.append(course)
    return Response({
        "status": 200,
        "courses-decided": courses,
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
    course_ids = user.user_favorite
    courses = []
    for course_id in course_ids:
        course = db_utils.get_course(id_= course_id)
        courses.append(course)
    return Response({
        "status": 200,
        "courses-decided": courses,
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
@login_required
def modify_course_selection_type(request, user_id):
    """
    修改课程志愿
    """
    #TODO：<db修改>增加change_course_level接口
    course_id = request.data.get("course_id")
    selection_type = request.data.get("selection_type")
    user = db_utils.get_user(user_id)
    if not user:
        return Response({"status": 404, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    if selection_type not in ["decided", "favorite", "dismiss"]:
        return Response({"status": 400, "message": "Invalid selection type"}, status=status.HTTP_400_BAD_REQUEST)
    success = db_utils.change_course_level(user_id, course_id, selection_type)
    if not success:
        return Response({"status": 404, "message": "Course not found or error in selection type change"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"status": 200}, status=status.HTTP_200_OK)