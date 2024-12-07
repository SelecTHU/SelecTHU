# 使用官方的PostgreSQL镜像作为基础镜像
FROM postgres:17

# 将初始化脚本复制到容器中
COPY ./init.sql /docker-entrypoint-initdb.d/
