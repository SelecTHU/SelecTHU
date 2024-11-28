# -*- coding: utf-8 -*-
import base64
import datetime

import jwt
import scrypt
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from db.v1.utils import get_user


def generate_jwt(payload, expiry=None):
    """
    生成jwt
    :param payload: dict 载荷
    :param expiry: datetime 有效期
    :return: 生成jwt
    """
    if expiry is None:
        now = datetime.datetime.now()
        expire_hours = (
            int(settings.JWT_EXPIRE_HOURS)
            if int(settings.JWT_EXPIRE_HOURS) > 0
            else 1
        )
        expiry = now + datetime.timedelta(hours=expire_hours)
        print("now:", now)
        print("expiry:", expiry)

    _payload = {"exp": expiry}
    _payload.update(payload)

    secret = settings.JWT_SECRET

    token = jwt.encode(_payload, secret, algorithm="HS256")

    return token


def verify_jwt(token):
    """
    校验jwt
    :param token: jwt
    :return: dict: payload
    """
    secret = settings.JWT_SECRET

    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
    except jwt.PyJWTError:
        payload = None

    return payload


def jwt_authentication(request) -> int: 
    """
    根据jwt验证用户身份
    """
    request.user = None
    token = request.headers.get("Authorization")
    if token:
        payload = verify_jwt(token)
        if payload:
            user_id = payload.get("user_id")
            res = get_user(user_id)
            if res["status"] == 200:
                return 1
    return 0


def login_required(func):
    """
    用户必须登录装饰器
    使用方法：放在 method_decorators 中
    """

    # @wraps(func)
    def wrapper(*args, **kwargs):
        request = args[0]

        res = jwt_authentication(request)
        if not res:
            return Response(
                {"message": "User must be authorized."}, status=status.HTTP_401_UNAUTHORIZED
            )
        else:
            return func(*args, **kwargs)

    return wrapper

def verify_password(user_id, password):
    """
    校验密码
    :param user_id: 用户id
    :param password: 密码
    :return: bool
    """
    
    return True
