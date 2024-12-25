// components/main/CourseList.tsx

import React, { useRef } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  useColorModeValue,
  chakra,
} from "@chakra-ui/react";
import { Course, TimeSlot } from "@/app/types/course";
import CourseRow from "./CourseRow";

// 引入 React DnD 所需的模块
import { useDrop } from "react-dnd";

// 定义拖拽类型
import { ItemTypes } from "./constants";

interface CourseListProps {
  availableCourses: Course[];
  addCourseToTable: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  moveCourseToAvailable: (course: Course) => void;
  getCourseColor: (courseId: string) => string; // 添加 getCourseColor 函数的类型
}

export default function CourseList({
  availableCourses,
  addCourseToTable,
  deleteCourse,
  moveCourseToAvailable,
  getCourseColor, // 接收 getCourseColor 函数
}: CourseListProps) {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const tableBgColor = useColorModeValue("white", "gray.800");

  console.log("availableCourses", availableCourses)

  // 使用 useRef 创建一个引用
  const boxRef = useRef<HTMLDivElement>(null);

  // 使用 useDrop，使备选清单成为拖拽放置目标
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.COURSE,
    drop: (item: { course: Course }) => {
      moveCourseToAvailable(item.course);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // 将 drop 连接到 DOM 引用上
  drop(boxRef);

  // 格式化时间段
  const formatTimeSlots = (timeSlots: TimeSlot[]) => {
    return timeSlots
      .map((ts) => `周${ts.day} ${ts.start}-${ts.start + ts.duration - 1}节`)
      .join(", ");
  };

  return (
    <Box
      ref={boxRef} // 使用 boxRef
      bg={isOver ? "blue.100" : tableBgColor}
      p={2}
      borderRadius="lg"
      shadow="sm"
      border="1px"
      borderColor={borderColor}
      overflow="auto" // 允许滚动，以适应内容变化
      maxHeight="400px" // 根据需要调整最大高度
    >
      <chakra.h2 fontSize="lg" mb={2}>
        备选清单
      </chakra.h2>
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th>课程名</Th>
            <Th>教师</Th>
            <Th>类型</Th>
            <Th isNumeric>学分</Th>
            <Th>时间段</Th>
            <Th>操作</Th>
          </Tr>
        </Thead>
        <Tbody>
          {availableCourses.map((course) => (
            <CourseRow
              key={course.id}
              course={course}
              courseColor={getCourseColor(course.id)} // 使用 getCourseColor 函数
              formatTimeSlots={formatTimeSlots}
              handleAdd={addCourseToTable}
              handleDelete={deleteCourse}
            />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
