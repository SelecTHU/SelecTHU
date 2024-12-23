import React, { useState } from 'react';
import { Course } from "@/app/types/course";
import CourseList from './CourseList';
import CourseTable from './CourseTable';

export default function CourseSelection() {
  // 初始的可用课程列表
  const initialAvailableCourses: Course[] = [
    // 将您的课程数据放在这里
  ];

  // 状态：备选清单和已选课程
  const [availableCourses, setAvailableCourses] = useState<Course[]>(initialAvailableCourses);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  // 颜色数组
  const colors = [
    "blue",
    "green",
    "red",
    "yellow",
    "purple",
    "teal",
    "orange",
    "pink",
    "cyan",
    "gray",
  ];

  // 定义 getCourseColor 函数，根据课程 ID 返回固定的颜色
  const getCourseColor = (courseId: string): string => {
    // 使用简单的哈希函数，将 courseId 映射到 colors 数组的索引
    let hash = 0;
    for (let i = 0; i < courseId.length; i++) {
      hash = courseId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // 添加课程到课表
  const addCourseToTable = (course: Course) => {
    if (!selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses([...selectedCourses, course]);
    }

    // 从备选清单中删除该课程
    setAvailableCourses(prevAvailableCourses =>
      prevAvailableCourses.filter(c => c.id !== course.id)
    );
  };

  // 从备选清单中删除课程
  const removeCourseFromAvailable = (courseId: string) => {
    setAvailableCourses(prevAvailableCourses =>
      prevAvailableCourses.filter(c => c.id !== courseId)
    );
  };

  // 从课表中删除课程
  const moveCourseToAvailable = (course: Course) => {
    // 从已选课程中删除
    setSelectedCourses(prevSelectedCourses =>
      prevSelectedCourses.filter(c => c.id !== course.id)
    );

    // 添加回备选清单（如果尚未存在）
    setAvailableCourses(prevAvailableCourses => {
      if (!prevAvailableCourses.some((c) => c.id === course.id)) {
        return [...prevAvailableCourses, course];
      }
      return prevAvailableCourses;
    });
  };

  return (
    <>
      <CourseList
        availableCourses={availableCourses}
        addCourseToTable={addCourseToTable}
        deleteCourse={removeCourseFromAvailable}
        moveCourseToAvailable={moveCourseToAvailable}
        getCourseColor={getCourseColor} // 传递 getCourseColor 属性
      />
      <CourseTable
        selectedCourses={selectedCourses}
        addCourseToTable={addCourseToTable}
        getCourseColor={getCourseColor} // 传递 getCourseColor 属性
      />
    </>
  );
}