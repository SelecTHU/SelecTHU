// app/components/search/CourseSelectionPage.tsx

"use client";

import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import CoursesTable from "./CoursesTable";
import SelectedCourseInfo from "./SelectedCourseInfo";
import { Course } from "../../types/course";
import { Volunteer } from "@/app/types/volunteer";

const CourseSelectionPage = () => {
  // 初始化课程数据，包括高等数学和软件工程
  const [courses, setCourses] = useState<Course[]>([
  ]);

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // 查找选中的课程
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
    <Flex>
      <Box flex="1" mr={4}>
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
          } }        />
      </Box>
      <Box flex="1">
        <SelectedCourseInfo 
          course={selectedCourse} 
          onAddComment={handleAddComment}
        />
      </Box>
    </Flex>
  );
};

export default CourseSelectionPage;
