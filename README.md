# SelecTHU 清华选课助手

![2](https://raw.githubusercontent.com/ShYuF/myPic/refs/heads/main/3plus.jpg)

<p align="center">
<a href="https://github.com/SelecTHU/SelecTHU">
<img src="https://img.shields.io/github/stars/SelecTHU/SelecTHU.svg?style=flat" alt="stars">
</a>
<a href="https://github.com/SelecTHU/SelecTHU/issues">
<img src="https://img.shields.io/github/issues/SelecTHU/SelecTHU.svg?style=flat" alt="forks">
</a>
</p>

## 项目介绍
SelecTHU 是清华大学选课助手，旨在改进原选课系统种种不适的体验，帮助清华大学本科阶段学生更好地选课。SelecTHU 提供了课程搜索、课程推荐、备选课程、选课模拟等功能，帮助学生更好地了解课程信息，规划课程表，提高选课效率。

## 项目环境
- 前端：Next.js 14.2.10 + React 18.x + TypeScript 5.x
- 后端：Python 3.12 + Django 5.1
- 数据库：PostgreSQL 17


## 项目结构
```
.
├── frontend
|   ├── selecthu
|   |   └── ...
|   └── README.md
├── backend
|   ├── app
|   |   └── ...
|   ├── db
|   |   ├── v1
|   |   |    └── ...
|   |   └── ...
|   ├── .env.example
|   ├── Dockerfile
|   ├── manage.py
|   ├── requirements.txt
|   └── README.md
├── nginx
|   └── app.conf
├── postgres
|   ├── psql
|   |   └── ...
|   └── Dockerfile
├── .gitignore
├── .env.example
├── docker-compose.yml
└── README.md
```
