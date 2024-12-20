# SelecTHU 清华选课助手 后端部分
## 实现框架
- 语言：Python 3.12
- 框架：Django 5.1
- 数据库：PostgreSQL 17

## 数据库说明
见 [数据库部分](./db/README.md)

## 后端api接口说明
见 [api部分](./api/README.md)

## 依赖说明
所需依赖见 [requirements.txt](./requirements.txt)

- 在安装依赖时，如遇到安装 `psycopg` （或 `psycopg2`）时报错，可以尝试
```bash
# debian/ubuntu 等使用 apt 或 apt-get
sudo apt-get install libpq-dev

# centos/rhel 等使用 yum 或 dnf
sudo yum install libpq5-devel
sudo yum install postgresql17-devel
```
或安装预编译的二进制包。安装时和运行时的报错很可能是缺少 `libpq` 或 `libpq` 导入不正确的问题。