// components/main/CourseRow.tsx

import React, { useRef, useEffect } from "react";
import {
  Td,
  Badge,
  IconButton,
  chakra,
  HStack,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Course, TimeSlot } from "@/app/types/course";
import { useDrag, DragSourceMonitor } from "react-dnd";
import { ItemTypes } from "./constants";
import { getEmptyImage } from "react-dnd-html5-backend";

interface CourseRowProps {
  course: Course;
  courseColor: string;
  formatTimeSlots: (timeSlots: TimeSlot[]) => string;
  handleAdd: (course: Course) => void;
  handleDelete: (courseId: string) => void;
}

// 获取课程类型的中文显示
const getTypeText = (type: string) => {
  switch(type) {
    case 'b': return '必修';
    case 'x': return '限选';
    case 'r': return '任选';
    case 't': return '体育';
    case 'required': return '必修';
    case 'elective': return '限选';
    case 'limited': return '限选';
    case 'optional': return '任选';
    case 'sports': return '体育';
    default: return type;
  }
};

export default function CourseRow({
  course,
  courseColor,
  formatTimeSlots,
  handleAdd,
  handleDelete,
}: CourseRowProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.COURSE,
    item: { course },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const rowRef = useRef<HTMLTableRowElement>(null);
  drag(rowRef);

  const hoverBgColor = useColorModeValue("gray.50", "gray.700");

  return (
    <chakra.tr
      ref={rowRef}
      opacity={isDragging ? 0.5 : 1}
      cursor="grab"
      _hover={{ bg: hoverBgColor }}
      transition="background-color 0.2s"
    >
      <Td maxWidth="180px">  {/* 对应 Th 的宽度 */}
        <Box
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          title={course.name}  // 鼠标悬停时显示完整课程名
        >
          <Badge
            colorScheme={courseColor}
            px={2}
            py={1}
            borderRadius="md"
            display="inline-block"  // 改为 inline-block
            whiteSpace="nowrap"
          >
            {course.name}
          </Badge>
        </Box>
      </Td>
      <Td whiteSpace="nowrap">{course.teacher}</Td>
      <Td>{getTypeText(course.type)}</Td>
      <Td isNumeric>{course.credits}</Td>
      <Td>{formatTimeSlots(course.timeSlots)}</Td>
      <Td>
        <HStack spacing={2} justify="flex-start">
          <IconButton
            aria-label="添加课程"
            icon={<AddIcon />}
            size="sm"
            variant="ghost"
            colorScheme="green"
            onClick={() => handleAdd(course)}
          />
          <IconButton
            aria-label="删除课程"
            icon={<DeleteIcon />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => handleDelete(course.id)}
          />
        </HStack>
      </Td>
    </chakra.tr>
  );
}