// components/main/CourseRow.tsx

import React, { useRef, useEffect } from "react";
import {
  Td,
  Badge,
  IconButton,
  chakra,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Course, TimeSlot } from "@/app/types/course";

import { useDrag, DragSourceMonitor } from "react-dnd";
import { ItemTypes } from "./constants"; // 引入常量
import { getEmptyImage } from "react-dnd-html5-backend";

interface CourseRowProps {
  course: Course;
  courseColor: string;
  formatTimeSlots: (timeSlots: TimeSlot[]) => string;
  handleAdd: (course: Course) => void;
  handleDelete: (courseId: string) => void;
}

export default function CourseRow({
  course,
  courseColor,
  formatTimeSlots,
  handleAdd,
  handleDelete,
}: CourseRowProps) {
  // 使用 useDrag 钩子
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.COURSE,
    item: { course },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 抑制默认的拖拽预览
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const rowRef = useRef<HTMLTableRowElement>(null);
  drag(rowRef);

  return (
    <chakra.tr
      key={course.id}
      ref={rowRef}
      opacity={isDragging ? 0.5 : 1}
      cursor="grab"
      _hover={{ bg: 'gray.100' }} // 可选的悬停样式
    >
      <Td>
        <Badge
          colorScheme={courseColor} // 确保 courseColor 是有效的 Chakra 颜色方案
          px={2}
          py={1}
          borderRadius="md"
          // 移除了 color="white" 以避免与 colorScheme 冲突
        >
          {course.name}
        </Badge>
      </Td>
      <Td>{course.teacher}</Td>
      <Td>{course.volType}</Td>
      <Td isNumeric>{course.credits}</Td>
      <Td>{formatTimeSlots(course.timeSlots)}</Td>
      <Td>
        {/* 添加和删除按钮 */}
        <IconButton
          aria-label="添加课程"
          icon={<AddIcon />}
          size="sm"
          variant="ghost"
          colorScheme="green"
          onClick={() => handleAdd(course)}
          mr={2}
        />
        <IconButton
          aria-label="删除课程"
          icon={<DeleteIcon />}
          size="sm"
          variant="ghost"
          colorScheme="red"
          onClick={() => handleDelete(course.id)}
        />
      </Td>
    </chakra.tr>
  );
}