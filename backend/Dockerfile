# 后端依赖安装
FROM python:3.12

ENV PYTHONUNBUFFERED 1

RUN mkdir /backend
WORKDIR /backend
RUN pip install pip -U -i https://pypi.tuna.tsinghua.edu.cn/simple
ADD requirements.txt /backend/
RUN pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
ADD . /backend/