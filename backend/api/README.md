# 后端api部分
## *注意：后端api部分模型和接口实现正在调整，以下接口列表暂不能作为最终使用判断！！！*
## 简要说明
- 目录结构
  ```
  api
  ├── v1
  │   ├── __init__.py
  │   ├── utils.py
  │   ├── urls.py
  │   ├── views.py
  ├── __init__.py
  ├── README.md
  └── urls.py
  ```

## 接口列表
### v1版本

#### 测试接口
1. **测试连接后端**
- 接口：`api/v1/backend-db-status/`
- 请求类型：`POST`
- 请求参数：无
- 返回值
  ```json
  {
    "status": <int>,
  }
- 说明：测试后端能否正常连接

#### 账户管理
1. **默认用户登陆**<span id="login_default"></span>
- 接口：`/api/v1/login_default/`
- 请求类型：`POST`
- 请求参数：无
- 返回值：
  ```json
  {
    "status": <int>, 
    "jwt": <str>
  }
  ```
- 说明：测试所用接口，无需任何输入，直接登陆默认用户，发送请求时需要带上jwt头，不需要额外指定user_id
- 错误码：
  - **400 Bad Request**：请求不合法或缺少必要信息。

2. **用户登陆**<span id="login"></span>
- 接口：`/api/v1/login/`
- 请求类型：`POST`
- 请求参数：
  - `user_id<str>`：用户id
  - `password<str>`：密码（对应网络学堂）
- 返回值：
  ```json
  {
    "status": <int>, 
    "jwt": <str>
  }
  ```
- 说明：利用账号密码验证后登陆
- 错误码：
  - **400 Bad Request**：`user_id`参数缺失。
  - **404 Not Found**：用户未找到。

3. **用户登出**<span id="logout"></span>
- 接口：`/api/v1/logout/`
- 请求类型：`POST`
- 请求参数：无
- 返回值：
  ```json
  {
    "status": <int>,
  }
  ```
- 说明：登出指定账号
- 错误码：
  - **401 Unauthorized**：JWT令牌无效或未提供。
  - **404 Not Found**：用户未找到。

#### 用户信息管理

1. **获取用户完整信息**<span id="get_user_info"></span>
- 接口：`/api/v1/user/`
- 请求类型：`GET`
- 请求参数：无
- 返回值：
  ```json
  {
    "status": <int>,
    "user": 
    {
      "nickname": <str>, 
      "avatar": <str>,
      "courses-favorite": [
        {
          "course_id": <str>,
          "code": <str>,
          "number": <str>,
          "name": <str>,
          "teacher": <str>,
          "credit": <int>,
          "time": <dict>,
          "department": <str>,
          "course-type": <str>,
          "features": <str>,
          "text": <str>,
          "capacity": <int>,
          "grade": <str>,
          "sec-choice": <bool>,
          "selection": <dict>,
        },
        ...
      ],
      "courses-decided": [
        {
          "course_id": <str>,
          "code": <str>,
          "number": <str>,
          "name": <str>,
          "teacher": <str>,
          "credit": <int>,
          "time": <dict>,
          "department": <str>,
          "course-type": <str>,
          "features": <str>,
          "text": <str>,
          "capacity": <int>,
          "grade": <str>,
          "sec-choice": <bool>,
          "selection-type": <str>,
        },
        ...
      ],
      "curriculum": <dict>
    }
  }
  ```
- 说明：获取完整的用户信息，作为前端实现的一种alternative
- 错误码：
  - **404 Not Found**：用户未找到。

2. **获取用户基本信息**<span id="get_user_info_basic"></span>
- 接口：`/api/v1/user-basic/`
- 请求类型：`GET`
- 请求参数：无
- 返回值：
  ```json
  {
    "status": <int>, 
    "user": 
    {
      "nickname": <str>, 
      "avatar": <str>
    }
  }
  ```
- 说明：获取用户的基本信息，可能用在个人主页部分
- 错误码：
  - **404 Not Found**：用户未找到。

3. **修改用户基本信息**<span id="modify_user_info_basic"></span>
- 接口：`/api/v1/user-basic/update/`
- 请求类型：`POST`
- 请求参数：
  - `nickname<str>`（可选）：昵称
  - `avatar<file>`（可选）：用户的新头像，类型为文件，上传图片。
- 返回值：
  ```json
  {
    "status": <int>
  }
  ```
- 说明：修改用户的基本信息，可能用在个人主页部分
- 错误码：
  - **404 Not Found**：用户未找到。
  - **400 Bad Request**：请求的昵称或头像格式不正确。

4. **修改用户培养方案**<span id="modify_user_curriculum"></span>
- 接口：`/api/v1/modify-user-curriculum/`
- 请求类型：`POST`
- 请求参数：
  - `curriculum<dict>`：新培养方案
- 返回值：
  ```json
  {
    "status": <int>
  }
  ```
- 说明：修改用户培养方案，可能需要前端登陆网络学堂获取
- 错误码：
  - **404 Not Found**：用户未找到。

#### 选课管理

1. **获取选课阶段**<span id="get_selection_stage"></span>
- 接口：`/api/v1/selection-stage/`
- 请求类型：`GET`
- 请求参数：无
- 返回值：
  ```json
  {
    "status": <int>,
    "selection-stage": <str>
  }
  ```
- 说明：获取当前选课阶段
- 错误码：
  - **500 Internal Server Error**：获取选课阶段时发生错误。

2. **获取培养方案**<span id="get_curriculum"></span>
- 接口：`/api/v1/curriculum/`
- 请求类型：`GET`
- 请求参数：无
- 返回值：
  ```json
  {
    "status": <int>, 
    "curriculum": <dict>
  }
  ```
- 说明：获取用户培养方案
- 错误码：
  - **404 Not Found**：用户未找到。

3. **筛选获取课程**<span id="filter_courses"></span>
- 接口：`/api/v1/courses/`
- 请求类型：`GET`
- 请求参数：
    - `code<str>`（可选）：课程代码
    - `number<str>`（可选）：课程号
    - `name<str>`（可选）：课程名
    - `teacher<str>`（可选）：教师名
    - `credit<int>`（可选）：学分
    - `time<dict>`（可选）：上课时间
    - `department<str>`（可选）：开课院系
    - `course-type<str>`（可选）：课程类型
    - `features<str>`（可选）：课程特色
    - `text<str>`（可选）：课程简介
    - `grade<str>`（可选）：适用年级
    - `sec-choice<bool>`（可选）：二级选课
    - `search-mode<str>`（可选）：搜索模式（`exact`或`fuzzy`）
- 返回值：
  ```json
  {
    "status": <int>, 
    "courses-main": [
      {
        "course_id": <str>,
        "code": <str>,
        "number": <str>,
        "name": <str>,
        "teacher": <str>,
        "credit": <int>,
        "time": <dict>,
        "department": <str>,
        "course-type": <str>,
        "features": <str>,
        "text": <str>,
        "capacity": <int>,
        "grade": <str>,
        "sec-choice": <bool>,
        "selection": <dict>,
      },
      ...
    ]
  }
  ```
- 说明：根据筛选条件返回所有符合条件课程的基本信息
- 错误码：
  - **400 Bad Request**：无效的查询参数
  - **500 Internal Server Error**：筛选操作失败。

4. **获取课程详细信息**<span id="get_course_detail"></span>
- 接口：`/api/v1/course-detail/<course_id>/`
- 请求类型：`POST`
- 请求参数：
  - `course_id<str>`：课程id
- 返回值：（**尚未最终确定**）
  ```json
  {
    "status": <int>,
    "info": <dict>,
    "score": <float>,
    "comments": [
      {
        "comment_time": <str>,
        "comment_score": <int>,
        "comment": <str>
      }
    ]
  }
  ```
- 说明：获取指定id课程的详细信息
- 错误码：
  - **404 Not Found**：课程未找到。

5. **课程状态切换**<span id="modify_course_condition"></span>
- 接口：`/api/v1/modify-course-condition/`
- 请求类型：`POST`
- 请求参数：
  - `course_id<str>`：课程id
  - `condition<str>`：目标状态（在"decided", "favorite", "dismiss"三选一）
- 返回值：
  ```json
  {
    "status": <int>
  }
  ```
- 说明：改变此用户下某个课程的被选状态，一个请求只处理一个课程，前端做好冲突检测等合法性判断之后再发送请求
- 错误码：
  - **404 Not Found**：用户未找到。
  - **400 Bad Request**：无效的课程状态（非`decided`, `favorite`, `dismiss`）。
  - **404 Not Found**：课程未找到或无法修改状态。

6. **获取已选课程**<span id="get_courses_decided"></span>
- 接口：`/api/v1/courses-decided/`
- 请求类型：`GET`
- 请求参数：无
- 返回值：
  ```json
  {
    "status": <int>, 
    "courses-decided": [
      {
        "course_id": <str>,
        "code": <str>,
        "number": <str>,
        "name": <str>,
        "teacher": <str>,
        "credit": <int>,
        "time": <dict>,
        "department": <str>,
        "course-type": <str>,
        "features": <str>,
        "text": <str>,
        "capacity": <int>,
        "grade": <str>,
        "sec-choice": <bool>,
        "selection": <dict>,
        "selection-type": <str>,
      },
      ...
    ]
  }
  ```
- 说明：获取用户的已选课程，可以用于逻辑判断和课表显示等
- 错误码：
  - **404 Not Found**：用户未找到。

7. **获取收藏课程**<span id="get_courses_favorite"></span>
- 接口：`/api/v1/courses-favorite/`
- 请求类型：`GET`
- 请求参数：无
- 返回值：
  ```json
  {
    "status": <int>, 
    "courses-favorite": [
      {
        "course_id": <str>,
        "code": <str>,
        "number": <str>,
        "name": <str>,
        "teacher": <str>,
        "credit": <int>,
        "time": <dict>,
        "department": <str>,
        "course-type": <str>,
        "features": <str>,
        "text": <str>,
        "capacity": <int>,
        "grade": <str>,
        "sec-choice": <bool>,
        "selection": <dict>,
      },
      ...
    ]
  }
  ```
- 说明：获取用户的收藏课程
- 错误码：
  - **404 Not Found**：用户未找到。

8. **修改课程志愿**<span id="modify_course_selection_type"></span>
- 接口：`/api/v1/modify-course-wish/`
- 请求类型：`POST`
- 请求参数：无
  - `selection-type<str>`：目标志愿（两位字符，第一位b,x,r,t，第二位0,1,2,3）
- 返回值：
  ```json
  {
    "status": <int>
  }
  ```
- 说明：修改用户指定课程的志愿，前端做好处理后再将结果传递给后端（比如前端将一个徽章从一门课移到另一门课，则发送两个修改课程志愿的请求）
- 错误码：
  - **404 Not Found**：用户未找到。
  - **400 Bad Request**：无效的志愿类型（`selection-type`）。
  - **404 Not Found**：课程未找到或无法修改志愿。
  
### 附加说明
#### 关于jwt请求头
除了`backend-db-status`，`login-default`和`login`接口，其余接口都需要在请求头`Authorization`中带上`Bearer {jwt}`

#### 一些数据的内部结构
  - selection（course_main，course_detail中）
    ```json
    {
      "total": <int>,
      "b1": <int>, 
      "b2": <int>, 
      "b3": <int>, 
      "x1": <int>, 
      "x2": <int>, 
      "x3": <int>, 
      "r0": <int>,  
      "r1": <int>,
      "r2": <int>,
      "r3": <int>,
      "t0": <int>,
      "t1": <int>,
      "t2": <int>,
      "t3": <int>,
    }
    ```

  - curriculum（**尚未最终确定**）
    ```json
    {
      "curriculum_id" <int>,
      "courses": {
        "0": [
          <course_code: str>,
          ...
        ],
        "1": [
          <course_code: str>,
          ...
        ],
        "2": [
          <course_code: str>,
          ...
        ],
      }
    }
    ```

### 问题

1. **志愿的实时刷新**