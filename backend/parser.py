"""
name -> 课程名
code -> 课程号
number -> 课序号
teacher -> 主讲教师
credit -> 学分
department -> 开课院系
capacity -> 本科生课容量
time -> 上课时间
course_type -> 通识选修课组
features -> 课程特色
text -> 选课文字说明
grade -> 年级
experiment -> 实验信息
sec_choice -> 是否二级选课
"""


from db.v1.modifyDB import add_course, remove_all_course

import json
import os


# 加载所有json文件
dir = f"./output"
files = os.listdir(dir)

file_cnt = 0
total_file = len(files)

# 清空所有课程
remove_all_course()

print(f"[INFO] 共有 {total_file} 份文件，开始添加课程")
for file in files:
    file_cnt += 1

    with open(f"{dir}/{file}", "r", encoding="utf-8") as f:
        data = json.load(f)
        total = 0
        cnt = 0
        total = len(data)
        for initial_course in data:
            cnt += 1
            course = {}
            course["name"] = initial_course.get("课程名", "")
            course["code"] = initial_course.get("课程号", "")
            course["number"] = initial_course.get("课序号", "")
            course["teacher"] = initial_course.get("主讲教师", "")
            course["credit"] = int(initial_course.get("学分", 0))
            course["department"] = initial_course.get("开课院系", "")
            course["capacity"] = int(initial_course.get("本科生课容量", 0))
            course["course_type"] = initial_course.get("通识选修课组", "")
            course["features"] = initial_course.get("课程特色", "")
            course["text"] = initial_course.get("选课文字说明", "")
            course["grade"] = initial_course.get("年级", "")
            course["experiment"] = initial_course.get("实验信息", "")
            course["sec_choice"] = initial_course.get("是否二级选课", "否") == "是"

            # 解析上课时间
            times = initial_course.get("上课时间", "")
            time_list = times.split(",")
            new_time_list = []
            for time in time_list:
                import re
                new_time = {"type": 0, "w0": 0, "w1": 0, "d": 0, "t0": 0}
                result = re.match(r"(?:(\d+)-(\d+))?\((.+)\)", time)
                if result:
                    groups = result.groups()
                    if groups[2] == "单周":
                        new_time["type"] = 1
                        new_time["w0"] = 1
                        new_time["w1"] = 15
                    elif groups[2] == "双周":
                        new_time["type"] = 2
                        new_time["w0"] = 2
                        new_time["w1"] = 16
                    else:
                        new_time["type"] = 3
                        if groups[2] == "全周":
                            new_time["w0"] = 1
                            new_time["w1"] = 16
                        elif groups[2] == "前八周":
                            new_time["w0"] = 1
                            new_time["w1"] = 8
                        elif groups[2] == "后八周":
                            new_time["w0"] = 9
                            new_time["w1"] = 16
                        else:
                            new_result = re.match(r"(\d+)-(\d+)周", groups[2])
                            if new_result:
                                new_time["w0"] = int(new_result.group(1))
                                new_time["w1"] = int(new_result.group(2))
                    
                    if groups[0] and groups[1]:
                        new_time["d"] = int(result.group(1))
                        new_time["t0"] = int(result.group(2))
                    else:
                        new_time["d"] = 0
                        new_time["t0"] = 0

                new_time_list.append(new_time)
                        
            course["time"] = new_time_list  

            
            # 添加课程
            try:
                status = add_course(course)["status"]
                if status == 200:
                    print(f"[INFO] 第 {file_cnt} / {total_file} 份文件，课程 {cnt} / {total} 添加成功, status: {status}")
                else:
                    print(f"[INFO] 第 {file_cnt} / {total_file} 份文件，课程 {cnt} / {total} 添加失败, status: {status}")
            except Exception as e:
                print(f"[ERROR] 第 {file_cnt} / {total_file} 份文件，课程 {cnt} / {total} 添加失败")
                print(e)
            
    import time
    time.sleep(0.05)
            

print("[INFO] 所有课程添加完成")