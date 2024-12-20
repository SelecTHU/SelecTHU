// components/main/CourseTable.tsx

import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  chakra,
  Box,
} from "@chakra-ui/react";
import { Course } from "@/app/types/course";

// 引入 React DnD 所需的模块
import { useDrop } from "react-dnd";
import { ItemTypes } from "./constants"; // 推荐将 ItemTypes 移到单独的文件中

import CourseBlock from "./CourseBlock"; // 确保 CourseBlock 是独立的组件

interface CourseTableProps {
  selectedCourses: Course[];
  addCourseToTable: (course: Course) => void;
  getCourseColor: (courseId: string) => string;
}

export default function CourseTable({
  selectedCourses,
  addCourseToTable,
  getCourseColor,
}: CourseTableProps) {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");

  // 时间段显示（节次从1-15）
  const timeSlots = [
    "第一节 (8:00-8:45)",
    "第二节 (8:50-9:35)",
    "第三节 (9:50-10:35)",
    "第四节 (10:40-11:25)",
    "第五节 (11:30-12:15)",
    "第六节 (13:30-14:15)",
    "第七节 (14:20-15:05)",
    "第八节 (15:20-16:05)",
    "第九节 (16:10-16:55)",
    "第十节 (17:00-17:45)",
    "第十一节 (18:00-18:45)",
    "第十二节 (18:50-19:35)",
    "第十三节 (19:40-20:25)",
    "第十四节 (20:30-21:15)",
    "第十五节 (21:20-22:05)",
  ];

  const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  // 根据时间段获取课程
  const getCourse = (day: number, slot: number): Course | undefined => {
    return selectedCourses.find((course) =>
      course.timeSlots.some(
        (ts) =>
          ts.day === day &&
          slot >= ts.start &&
          slot < ts.start + ts.duration
      )
    );
  };

  // 检查是否应该显示课程卡片
  const shouldShowCourse = (day: number, slot: number): boolean => {
    const course = getCourse(day, slot);
    if (!course) return false;
    return course.timeSlots.some((ts) => ts.day === day && ts.start === slot);
  };

  // 获取单元格的 rowSpan 值
  const getRowSpan = (day: number, slot: number): number => {
    const course = getCourse(day, slot);
    if (!course) return 1;
    const timeSlot = course.timeSlots.find(
      (ts) => ts.day === day && ts.start === slot
    );
    return timeSlot ? timeSlot.duration : 1;
  };

  // 判断是否应该渲染单元格
  const shouldRenderCell = (day: number, slot: number): boolean => {
    const course = getCourse(day, slot);
    if (!course) return true;
    return course.timeSlots.some((ts) => ts.day === day && ts.start === slot);
  };

  // 使用 useDrop 钩子，使课程表可以作为拖拽的放置目标
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.COURSE,
    drop: (item: { course: Course }) => {
      addCourseToTable(item.course);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // 创建一个 ref，并将 drop 方法应用到该 ref 上
  const boxRef = React.useRef<HTMLDivElement>(null);
  drop(boxRef);

  // 获取课程的颜色
  const getColor = (courseId: string) => {
    return getCourseColor(courseId);
  };

  // 定义固定的每节课的高度
  const slotHeight = 60; // 每节课的高度，保持一致

  return (
    <chakra.div
      ref={boxRef}
      bg={bgColor}
      p={2}
      borderRadius="lg"
      shadow="sm"
      border="1px"
      borderColor={borderColor}
      overflow="auto" // 允许滚动而不是固定整体尺寸
      width="100%" // 让表格自适应父容器宽度
      // 不设置固定的高度和宽度，以保持页面布局合理
    >
      <Table size="sm" variant="simple" width="100%">
        <Thead>
          <Tr>
            <Th
              width="100px"
              border="1px solid"
              borderColor={borderColor}
              position="sticky"
              top="0"
              bg="white"
              _dark={{ bg: "gray.800" }}
              // bg={useColorModeValue("white", "gray.800")}
              zIndex={1}
            >
              节次
            </Th>
            {weekDays.map((day) => (
              <Th
                key={day}
                textAlign="center"
                border="1px solid"
                borderColor={borderColor}
                position="sticky"
                top="0"
                bg="white"
                _dark={{ bg: "gray.800" }}
                // bg={useColorModeValue("white", "gray.800")}
                zIndex={1}
              >
                {day}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {timeSlots.map((time, slotIndex) => (
            // 使用固定高度
            <Tr key={`slot-${slotIndex}`} height={`${slotHeight}px`}>
              <Td
                fontSize="xs"
                border="1px solid"
                borderColor={borderColor}
                textAlign="center"
                height={`${slotHeight}px`}
                position="sticky"
                left="0"
                bg="white"
                _dark={{ bg: "gray.800" }}
                // bg={useColorModeValue("white", "gray.800")}
                zIndex={1}
              >
                {time}
              </Td>
              {weekDays.map((_, dayIndex) => {
                if (!shouldRenderCell(dayIndex + 1, slotIndex + 1)) {
                  return null;
                }

                const course = getCourse(dayIndex + 1, slotIndex + 1);
                const rowSpan = getRowSpan(dayIndex + 1, slotIndex + 1);
                const color = course ? getColor(course.id) : "gray";

                return (
                  <Td
                    key={`cell-${dayIndex}-${slotIndex}`}
                    p={0}
                    rowSpan={rowSpan}
                    textAlign="center"
                    border="1px solid"
                    borderColor={borderColor}
                    verticalAlign="top"
                    height={course ? `${slotHeight * rowSpan}px` : `${slotHeight}px`} // 设置单元格高度
                  >
                    {course && shouldShowCourse(dayIndex + 1, slotIndex + 1) ? (
                      <CourseBlock
                        course={course}
                        color={color}
                        duration={rowSpan} // 传递持续时间
                        slotHeight={slotHeight} // 传递每节课的高度
                      />
                    ) : null}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </chakra.div>
  );
}