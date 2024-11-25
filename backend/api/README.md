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
- 说明：测试接口，无需任何输入，直接登陆默认用户，发送请求时需要带上jwt头，不需要额外指定user_id
- 错误码：
  - **400 Bad Request**：请求不合法或缺少必要信息。

2. **用户登陆**<span id="login"></span>
- 接口：`/api/v1/login/`
- 请求类型：`POST`
- 请求参数：
  - `user_id<str>`：用户id
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
- 接口：`/api/v1/logout/<user_id>/`
- 请求类型：`POST`
- 请求参数：无
- 返回值：
  ```json
  {
    "status": <int>
  }
  ```
- 说明：登出指定账号
- 错误码：
  - **401 Unauthorized**：JWT令牌无效或未提供。
  - **404 Not Found**：用户未找到。

#### 用户信息管理

1. **获取用户完整信息**<span id="get_user_info"></span>
- 接口：`/api/v1/user/<user_id>/`
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
          "name": <str>,
          "teacher": <str>,
          "credit": <int>,
          "period": <int>,
          "time": <dict>,
          "department": <str>,
          "type": <str>,
        },
        ...
      ],
      "courses-decided": [
        {
          "course_id": <str>,
          "code": <str>,
          "name": <str>,
          "teacher": <str>,
          "credit": <int>,
          "period": <int>,
          "time": <dict>,
          "department": <str>,
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
- 接口：`/api/v1/user-basic/<user_id>/`
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
- 接口：`/api/v1/user-basic/<user_id>/update/`
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

#### 选课管理

1. **获取选课阶段**<span id="get_selection_stage"></span>
- 接口：`/api/v1/selection-stage`
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
- 接口：`/api/v1/curriculum/<user_id>/`
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
    - "code": <str>（可选）
    - "name": <str>（可选）
    - "teacher": <str>（可选）
    - "credit": <int>（可选）
    - "period": <int>（可选）
    - "time": <dict>（可选）
    - "department": <str>（可选）
    - "type": <str>（可选）
    - "search_mode": <str>（可选，在"exact"精确搜索, "fuzzy"模糊搜索, "exclude"排除搜索三选一，默认exact）
- 返回值：
  ```json
  {
    "status": <int>, 
    "courses-main": <list>
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
- 接口：`/api/v1/modify-course-condition/<user_id>/`
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
- 接口：`/api/v1/courses-decided/<user_id>/`
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
        "name": <str>,
        "teacher": <str>,
        "credit": <int>,
        "period": <int>,
        "time": <dict>,
        "department": <str>,
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
- 接口：`/api/v1/courses-favorite/<user_id>/`
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
        "name": <str>,
        "teacher": <str>,
        "credit": <int>,
        "period": <int>,
        "time": <dict>,
        "department": <str>,
      },
      ...
    ]
  }
  ```
- 说明：获取用户的收藏课程
- 错误码：
  - **404 Not Found**：用户未找到。

8. **修改课程志愿**<span id="modify_course_selection_type"></span>
- 接口：`/api/v1/modify-course-wish/<user_id>`
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
    ```

### 问题与思路

- **选课冲突解决**:
  - 列表页面提供“选课”按钮，如果冲突则弹出提示，询问是否添加到备选。
  - 课表页面【待实现】。
- **列表页面标注已选课程**:
  - 说明：标注用户已选的课程，方便区分已选和未选课程。
