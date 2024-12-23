// app/search/page.tsx

"use client";

import {
  Box,
  Flex,
  Grid,
  GridItem,
  useColorModeValue,
  Heading,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import FilterSection, { Filter } from "../components/search/FilterSection";
import SelectedFilters from "../components/search/SelectedFilters";
import CoursesTable from "../components/search/CoursesTable";
import SelectedCourseInfo from "../components/search/SelectedCourseInfo";
import { searchCourses } from "./actions"

// 从统一的类型文件导入 Course 接口
import { Course, TimeSlot } from "../types/course";
import { Volunteer } from "../types/volunteer";

export default function SearchPage() {
  // 管理已选择的筛选条件
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);

  // 添加筛选条件的处理函数
  const addFilter = (filter: Filter) => {
    // 如果已存在同类型的筛选条件，则替换
    if (!selectedFilters.some((f) => f.type === filter.type)) {
      setSelectedFilters([...selectedFilters, filter]);
    } else {
      setSelectedFilters(
        selectedFilters.map((f) => (f.type === filter.type ? filter : f))
      );
    }
  };

  // 移除筛选条件的处理函数
  const removeFilter = (type: string) => {
    setSelectedFilters(selectedFilters.filter((f) => f.type !== type));
  };

  // 初始化课程数据，包括高等数学和软件工程，新增两门课程
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "math101",
      courseNumber: "MATH101",
      sequenceNumber: "01",
      name: "高等数学",
      credits: 4,
      department: "数学与统计学院",
      time: "周一 08:00-10:00 / 周三 09:00-12:00",
      teacher: "李四", // 使用 teacher 而非 instructor
      classroom: "理学楼201",
      type: "必修", // 添加 type 属性
      timeSlots: [
        { day: 1, start: 8, duration: 2 }, // 周一08:00-10:00
        { day: 3, start: 9, duration: 3 }, // 周三09:00-12:00
      ], // 添加 timeSlots 属性
      teachingInfo: "教室：理学楼201，配备投影仪和白板",
      teacherInfo: "电子邮箱：lisi@example.com",
      comments: [
        "课程内容深入，适合打好数学基础。",
        "老师讲解详细，有助于理解复杂概念。",
      ],
    },
    {
      id: "sweng201",
      courseNumber: "SWENG201",
      sequenceNumber: "01",
      name: "软件工程",
      credits: 3,
      department: "计算机学院",
      time: "周三 14:00-16:00 / 周五 10:00-12:00",
      teacher: "王五", // 使用 teacher 而非 instructor
      classroom: "软件楼303",
      type: "选修", // 添加 type 属性
      timeSlots: [
        { day: 3, start: 14, duration: 2 }, // 周三14:00-16:00
        { day: 5, start: 10, duration: 2 }, // 周五10:00-12:00
      ], // 添加 timeSlots 属性
      teachingInfo: "教室：软件楼303，配备计算机和白板",
      teacherInfo: "电子邮箱：wangwu@example.com",
      comments: [
        "实用性强，项目实践丰富。",
        "课程安排合理，适合提升编程技能。",
      ],
    },
    {
      id: "math102",
      courseNumber: "MATH102",
      sequenceNumber: "02",
      name: "线性代数",
      credits: 3,
      department: "数学与统计学院",
      time: "周二 10:00-12:00 / 周四 14:00-15:00",
      teacher: "张三",
      classroom: "理学楼202",
      type: "必修",
      timeSlots: [
        { day: 2, start: 10, duration: 2 }, // 周二10:00-12:00
        { day: 4, start: 14, duration: 1 }, // 周四14:00-15:00
      ],
      teachingInfo: "教室：理学楼202，配备投影仪和白板",
      teacherInfo: "电子邮箱：zhangsan@example.com",
      comments: [
        "课程逻辑严谨，适合数学爱好者。",
        "老师讲解清晰，课后习题丰富。",
      ],
    },
    {
      id: "sweng202",
      courseNumber: "SWENG202",
      sequenceNumber: "02",
      name: "数据结构",
      credits: 4,
      department: "计算机学院",
      time: "周四 16:00-18:00 / 周一 10:00-12:00",
      teacher: "赵六",
      classroom: "软件楼304",
      type: "必修",
      timeSlots: [
        { day: 4, start: 16, duration: 2 }, // 周四16:00-18:00
        { day: 1, start: 10, duration: 2 }, // 周一10:00-12:00
      ],
      teachingInfo: "教室：软件楼304，配备计算机和白板",
      teacherInfo: "电子邮箱：zhaoliu@example.com",
      comments: [
        "内容全面，涵盖各种重要数据结构。",
        "适合打算深入学习算法的学生。",
      ],
    },
  ]);

  // 管理选中的课程 ID
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // 查找选中的课程对象
  const selectedCourse =
    courses.find((course) => course.id === selectedCourseId) || null;

  // 处理添加评论
  const handleAddComment = (courseId: string, comment: string) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId
          ? { ...course, comments: [...course.comments, comment] }
          : course
      )
    );
  };

  // 处理添加课程（示例：可以将课程添加到选课列表，具体实现根据需求）
  const handleAddCourse = (courseId: string) => {
    console.log("添加课程ID:", courseId);
    // 实现添加课程到选中列表的逻辑
    // 例如，您可以维护一个选课列表状态，并在这里更新
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      {/* 导航栏 */}
      <Navbar />

      {/* 页面标题（可选） */}
      <Box p={4}>
        <Heading>课程选择</Heading>
      </Box>

      {/* 主内容区域 */}
      <Flex p={4}>
        <Grid
          templateColumns={{ base: "1fr", lg: "3fr 1fr" }}
          gap={4}
          w="100%"
        >
          {/* 左侧内容：筛选部分和课程表 */}
          <GridItem>
            {/* 筛选部分 */}
            <FilterSection
              selectedFilters={selectedFilters}
              addFilter={addFilter}
              searchCoursesAction={async (filters) => {
                  const res = await searchCourses(filters)
                  setCourses(res.map((data): Course => {
                      return {
                          id: data.course_id,
                          courseNumber: data.code,
                          sequenceNumber: data.number,
                          name: data.name,
                          teacher: data.teacher,
                          credits: data.credit,
                          department: data.department,
                          time: "tbd",
                          classroom: "not known",
                          type: "not known",
                          timeSlots: data.time.map((time) => {
                              return {
                                  day: time.d,
                                  start: time.t0,
                                  duration: 2
                              }
                          }),
                          teachingInfo: "none",
                          teacherInfo: "none",
                          comments: [],
                      }
                  }))
              }}
            />

            {/* 已选择的筛选标准展示部分 */}
            <SelectedFilters
              selectedFilters={selectedFilters}
              removeFilter={removeFilter}
            />

            {/* 课程表展示部分 */}
            <CoursesTable
              courses={courses}
              onSelectCourse={setSelectedCourseId}
              selectedCourseId={selectedCourseId}
              onAddCourse={handleAddCourse} // 传递 onAddCourse
              courseVolunteers={{}} onVolunteerDrop={function (courseId: string, volunteer: Volunteer): void {
                throw new Error("Function not implemented.");
              } } onVolunteerRemove={function (courseId: string, volunteerId: string): void {
                throw new Error("Function not implemented.");
              } } getCourseColor={function (courseId: string): string {
                throw new Error("Function not implemented.");
              } }            />
          </GridItem>

          {/* 右侧内容：选中课程信息 */}
          <GridItem>
            <SelectedCourseInfo
              course={selectedCourse}
              onAddComment={handleAddComment}
            />
          </GridItem>
        </Grid>
      </Flex>
    </Box>
  );
}
