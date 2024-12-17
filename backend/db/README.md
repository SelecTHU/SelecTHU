# 数据库部分
## *注意：数据库部分模型和接口实现正在调整，以下接口列表暂不能作为最终使用判断！！！*
## 简要说明
- 数据库使用 PostgreSQL 作为后端数据库，通过 Django ORM 进行操作。
- 目录结构
```
db
├── v1
|    ├── migrations
|    |    └── __init__.py
│    ├── __init__.py
│    ├── apps.py
│    ├── const.py
│    ├── dbBasic.py
│    ├── models.py
│    ├── modifyDB.py
│    ├── queryDB.py
│    ├── tests.py
│    └── utils.py
├── __init__.py
└── README.md
```
## v1版本
### 数据库模型结构
- 定义源文件：见 [`models.py`](./v1/models.py)

1. `User` 用户表
    - `user_id <CharField>` : 用户ID（学号）
    - `nickname <CharField>` : 用户昵称
    - `avatar <ImageField>` : 用户头像
    - `favorite <JSONField>` : 用户备选课程
    - `decided <JSONField>` : 用户已选课程
    - `curriculum <CharField>` : 用户培养方案（对应培养方案ID）
2. `Curriculum` 培养方案表
    - `curriculum_id <CharField>` : 培养方案ID
    - `curriculum <JSONField>` : 培养方案内容
3. `MainCourses` 课程表
    - `course_id <CharField>` : 课程识别码
    - `code <CharField>` : 课程号
    - `number <CharField>` : 课序号
    - `name <CharField>` : 课程名
    - `teacher <CharField>` : 教师名
    - `credit <IntegerField>` : 学分
    - `time <JSONField>` : 开课时间
    - `course_type <CharField>` : 课程类型（通识课组）
    - `features <CharField>` : 课程特色
    - `text <CharField>` : 选课文字说明
    - `department <CharField>` : 开课院系
    - `capacity <IntegerField>` : 课程容量
    - `grade <CharField>` : 年级
    - `sec_choice <BooleanField>` : 是否二级选课
    - `experiment<CharField>` : 实验信息
    - `selection <JSONField>` : 已选人数
    - `link <CharField>` : 课程链接（指向 `CourseDetails` 表项）
4. `CourseDetails` 课程详细信息表
    - `course_id <CharField>` : 课程识别码
    - `info <JSONField>` : 课程详细信息
    - `score <JSONField>` : 课程评分
    - `comment <JSONField>` : 课程评价

### 接口列表
- 使用方法：导入包 `import db.v1.utils as db_utils`

#### 数据库查询
1. **查询数据库状态**<span id="db_status"></span>
    - 对应函数: `db_utils.db_status`
    - 请求参数: 无
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 说明: 查询数据库状态。

2. **查询培养方案**<span id="get_curriculum"></span>
    - 对应函数: `db_utils.get_curriculum`
    - 请求参数:
        - `user_id<str>` : 用户ID（学号）
    - 返回值: `{ "status": <int>, "curriculum": <list> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 未找到培养方案
        - `500` : 内部错误
    - 说明: 查询培养方案。

3. **查询培养方案是否存在**<span id="get_curriculum_existance"></span>
    - 对应函数: `db_utils.get_curriculum_existance`
    - 请求参数:
        - `curriculum<dict>` : 培养方案
    - 返回值: `{ "status": <int>, "value": <bool> }`
    - 错误码：
        - `400` : 参数错误
        - `500` : 内部错误
    - 说明: 查询培养方案是否存在。

4. **查询用户信息**<span id="get_user"></span>
    - 对应函数: `db_utils.get_user`
    - 请求参数:
        - `user_id<str>` : 用户ID（学号）
    - 返回值: `{ "status": <int>, "nickname": <str>, "avatar": <str>, "favorite": <list>, "decided": <list>, "curriculum": <list> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 未找到用户
        - `500` : 内部错误
    - 说明: 查询用户信息。在返回值中， `avatar` 为用户头像链接的URL，详细说明见 [头像字段说明](#avatar-explain) 。

5. **查询课程列表**<span id="get_courses"></span>
    - 对应函数: `db_utils.get_courses`
    - 请求参数:
        -  `index<int>` (可选): 返回课程的起始索引，默认为 `0` ，即从第一门课程开始返回
        -  `count<int>` (可选): 返回课程数量，默认为 `-1` ，即返回所有课程
    - 返回值: `{ "status": <int>, "courses": <list[dict]> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 未找到课程
        - `500` : 内部错误
    - 说明: 查询课程列表。

6. **按条件搜索课程简要信息**<span id="get_course"></span>
    - 对应函数: `db_utils.get_course`
    - 请求参数:
        - `course_id<str>` (可选): 课程识别码
        - `code<str>` (可选): 课程代码
        - `number<str>` (可选): 课序号
        - `name<str>` (可选): 课程名称
        - `teacher<str>` (可选): 教师名称
        - `credit<str>` (可选): 学分
        - `time<dict>` (可选): 开课时间，详细说明见 [时间字段说明](#time-explain)
        - `department<str>` (可选): 开课院系
        - `course_type<str>` (可选): 课程类型（通识课组）
        - `features<str>` (可选): 课程特色
        - `text<str>` (可选): 选课文字说明
        - `grade<str>` (可选): 年级
        - `sec_choice<bool>` (可选): 是否二级选课
        - `search_mode<str>` (可选): 搜索模式，可选值为 `exact` （精确匹配）、`fuzzy` （模糊匹配）和  `exclude` （排除匹配），默认为 `exact`
    - 返回值: `{ "status": <int>, "course": <list[dict]> }`
    - 错误码：
        - `400` : 参数错误
        - `500` : 内部错误
    - 说明: 按条件搜索课程简要信息，返回所有符合条件的课程。

7. **查询课程详细信息**<span id="get_course_detail"></span>
    1. 通过课程信息查询
        - 对应函数: `db_utils.get_course_detail_by_info`
        - 请求参数:
            - `code<str>` : 课程号
            - `number<str>` : 课序号
            - `name<str>` : 课程名
            - `teacher<str>` : 教师名
        - 返回值: `{ "status": <int>, "details": <dict> }`
        - 错误码：
            - `400` : 参数错误
            - `404` : 未找到课程
            - `500` : 多个课程匹配，内部错误
        - 说明: 查询课程详细信息。
    2. 通过课程ID查询
        - 对应函数: `db_utils.get_course_detail_by_id`
        - 请求参数:
            - `course_id<str>` : 课程ID
        - 返回值: `{ "status": <int>, "details": <dict> }`
        - 错误码：
            - `400` : 参数错误
            - `404` : 未找到课程
        - 说明: 查询课程详细信息。

#### 数据库修改
1. **添加用户**<span id="add_user"></span>
    - 对应函数: `db_utils.add_user`
    - 请求参数:
        - `user_id<str>` : 用户ID（学号）
        - `curriculum<dict>` (可选): 用户对应的培养方案
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `409` : 用户已存在
        - `500` : 内部错误
    - 说明: 添加用户。

2. **添加培养方案**<span id="add_curriculum"></span>
    - 对应函数: `db_utils.add_curriculum`
    - 请求参数:
        - `curriculum<dict>` : 培养方案
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `409` : 培养方案已存在
        - `500` : 内部错误
    - 说明: 添加培养方案。

3. **添加用户已选课程**<span id="add_course_to_decided"></span>
    - 对应函数: `db_utils.add_course_to_decided`
    - 请求参数:
        - `user_id<str>` : 用户ID（学号）
        - `course_id<str>` : 课程识别码
        - `selection_type<str>` (可选): 选课类型，详细说明见 [选课类型字段说明](#selection-explain)
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 用户不存在
        - `409` : 课程已存在
        - `500` : 内部错误
    - 说明: 添加用户已选课程。

4. **添加用户备选课程**<span id="add_course_to_favorite"></span>
    - 对应函数: `db_utils.add_course_to_favorite`
    - 请求参数:
        - `user_id<str>` : 用户ID（学号）
        - `course_id<str>` : 课程识别码
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 用户不存在
        - `409` : 课程已存在
        - `500` : 内部错误
    - 说明: 添加用户备选课程。

5. **移除用户备选课程**<span id="remove_course_from_favorite"></span>
    - 对应函数: `db_utils.remove_course_from_favorite`
    - 请求参数:
        - `user_id<str>` : 用户ID（学号）
        - `course_id<str>` : 课程识别码
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 用户不存在或课程不存在
        - `500` : 内部错误
    - 说明: 移除用户备选课程。

6. **删除培养方案（根据ID）**<span id="remove_curriculum_by_id"></span>
    - 对应函数: `db_utils.remove_curriculum_by_id`
    - 请求参数:
        - `curriculum_id<str>` : 培养方案ID
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 培养方案不存在
        - `500` : 内部错误
    - 说明: 通过ID删除培养方案。

7. **删除培养方案（根据课程）**<span id="remove_curriculum_by_curriculum"></span>
    - 对应函数: `db_utils.remove_curriculum_by_curriculum`
    - 请求参数:
        - `curriculum<dict>` : 培养方案
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 培养方案不存在
        - `500` : 内部错误
    - 说明: 通过培养方案内容删除培养方案。

8. **删除所有课程信息**<span id="remove_all_course"></span>
    - 对应函数: `db_utils.remove_all_course`
    - 请求参数: 无
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `500` : 内部错误
    - 说明: 删除所有课程信息。

9. **删除所有培养方案信息**<span id="remove_all_curriculum"></span>
    - 对应函数: `db_utils.remove_all_curriculum`
    - 请求参数: 无
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `500` : 内部错误
    - 说明: 删除所有培养方案信息。

10. **添加课程信息**<span id="add_course"></span>
    - 对应函数: `db_utils.add_course`
    - 请求参数:
        - `course<dict>` : 课程信息（包含课程简要信息和课程详细信息）
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `409` : 课程已存在
        - `500` : 内部错误
    - 说明: 添加新课程信息。

11. **添加课程评价和评分**<span id="add_course_comment"></span>
    - 对应函数: `db_utils.add_course_comment`
    - 请求参数:
        - `course_id<str>` : 课程识别码
        - `comment<dict>` : 课程评价（包含评论时间、评分和评论内容）
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 课程不存在
        - `500` : 内部错误
    - 说明: 为指定课程添加评论和评分。

12. **修改志愿分配**<span id="change_course_level"></span>
    - 对应函数: `db_utils.change_course_level`
    - 请求参数:
        - `user_id<str>` : 用户ID
        - `course_id<str>` : 课程识别码
        - `selection_type<str>` : 选课志愿类型
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 用户不存在
        - `500` : 内部错误
    - 说明: 修改用户的课程志愿分配。

13. **修改用户信息**<span id="change_user_info"></span>
    - 对应函数: `db_utils.change_user_info`
    - 请求参数:
        - `user_id<str>` : 用户ID
        - `nickname<str>` (可选): 用户昵称
        - `avatar<ImageFile>` (可选): 用户头像
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 用户不存在
        - `500` : 内部错误
    - 说明: 修改用户的昵称和头像信息。

14. **移除用户**<span id="remove_user"></span>
    - 对应函数: `db_utils.remove_user`
    - 请求参数:
        - `user_id<str>` : 用户ID
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 用户不存在
        - `500` : 内部错误
    - 说明: 从数据库中移除指定用户。

15. **移除已选课程**<span id="remove_course_from_decided"></span>
    - 对应函数: `db_utils.remove_course_from_decided`
    - 请求参数:
        - `user_id<str>` : 用户ID
        - `course_id<str>` : 课程识别码
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 用户或课程不存在
        - `500` : 内部错误
    - 说明: 从用户的已选课程中移除指定课程。

16. **删除课程信息**<span id="remove_course"></span>
    - 对应函数: `db_utils.remove_course`
    - 请求参数:
        - `course_id<str>` : 课程识别码
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 课程不存在
        - `500` : 内部错误
    - 说明: 删除指定课程的信息。

17. **删除所有课程评价和评分**<span id="remove_all_course_comment"></span>
    - 对应函数: `db_utils.remove_all_course_comment`
    - 请求参数:
        - `course_id<str>` : 课程识别码
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 课程不存在
        - `500` : 内部错误
    - 说明: 删除指定课程的所有评论和评分。

18. **修改用户培养方案**<span id="change_user_curriculum"></span>
    - 对应函数: `db_utils.change_user_curriculum`
    - 请求参数:
        - `user_id<str>` : 用户ID
        - `curriculum<dict>` : 新的培养方案
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 用户或培养方案不存在
        - `500` : 内部错误
    - 说明: 修改用户的培养方案。如果指定的培养方案不存在，将自动添加该培养方案。

19. **更新课程志愿信息**<span id="change_course_selection"></span>
    - 对应函数: `db_utils.change_course_selection`
    - 请求参数:
        - `course_id<str>` : 课程识别码
        - `selection<dict>` : 课程志愿信息（包含志愿类型和志愿等级）
    - 返回值: `{ "status": <int>, "msg": <str> }`
    - 错误码：
        - `400` : 参数错误
        - `404` : 课程不存在
        - `500` : 内部错误
    - 说明: 更新课程的志愿信息，该操作会覆盖原有志愿信息。该接口实际上是 `change_course_main` 的部分替代方案。

#### 其他信息
1. 更多常量定义见 [`const.py`](./v1/const.py)
2. `avatar` 字段详细说明：<span id="avatar-explain"></span>
`avatar` 实际上是头像对应的URL，如 `/avatar/ava.jpg` ，在前端需要拼接URL到服务器地址。例如，服务器地址为 `http://ip:port` ，则头像URL为 `http://ip:port/avatar/ava.jpg` 。
3. `time` 字段详细说明如下：<span id="time-explain"></span>
```json
[
    {
        "type": <int>,
        "w0": <int>,
        "w1": <int>,
        "d": <int>,
        "t0": <int>,
        "t1": <int>,
    },
    {
        ...
    },
    ...
]
```
其中：
- `type` : 课程周次类型，可选值为 `1` （单周）、`2` （双周）、`3` （其他），如无信息， `type` 为 `0`
- `w0` : 开课周次起始（特别地，对于单周，`w0` 为 `1` ，对于双周，`w0` 为 `2` ，如无信息， `w0` 为 `0` ）
- `w1` : 开课周次结束（特别地，对于单周，`w1` 为 `15` ，对于双周，`w1` 为 `16` ，如无信息，`w1` 为 `0`）
- `d` : 星期几，可选值为 `1` （周一）到 `7` （周日），如无信息， `d` 为 `0`
- `t0` : 开课节次起始（特别地，如无信息，`t0` 为 `0`）

对于**数据库存储**的情况， `time` 字段应遵循上述格式。但是，对于**查询课程**的情况， `time` 字段应为一个 `dict` ，具体格式等同于上述格式的其中一个时间段。

1. `selection_type` 字段（原 `level` 字段）说明：<span id="selection-explain"></span>
`selection_type` 字段表示课程的选课志愿分配，由两位字符组成，第一位表示志愿类型（包括必选、限选、任选、体育必选），第二位表示志愿等级（从 `0` 到 `3` ，数字越小，志愿等级越高，其中 `0` 志愿表示特殊优先级）。例如： `b2` 表示必选二志愿， `t1` 表示体育一志愿。具体定义见 [`const.py`](./v1/const.py) 。

### 单元测试报告
- 最后更新时间：2024-12-12
- 报告说明：
    1. 仅统计 `modifyDB.py` 和 `queryDB.py` 两份源代码的测试覆盖率，使用 `coverage` 工具生成（通过 `pip install coverage` 安装）。
    2. 进行单元测试时，使用 `coverage run manage.py test --keepdb` 以保护数据库结构（如不需要可以不使用 `--keepdb` 参数）；使用 `coverage report` 生成测试报告（为整个 `db` 部分的测试覆盖率，使用  `coverage report --include="db/v1/modifyDB.py,db/v1/queryDB.py"` 以生成两份接口代码的测试报告）。
```
Name                Stmts   Miss  Cover
---------------------------------------
db/v1/modifyDB.py     306    222    27%
db/v1/queryDB.py      185     79    57%
---------------------------------------
TOTAL                 491    301    39%
```