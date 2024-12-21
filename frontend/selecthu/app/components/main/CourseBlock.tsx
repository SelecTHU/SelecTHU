// components/main/CourseBlock.tsx

import React, { useRef, useEffect, useCallback } from "react";
import {
  Box,
  Text,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Course } from "@/app/types/course";
import { Volunteer } from "@/app/types/volunteer";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./constants";
import { getEmptyImage } from "react-dnd-html5-backend";

interface CourseBlockProps {
  course: Course;
  color: string;
  duration: number;
  slotHeight: number;
  volunteers: Volunteer[];
  onVolunteerDrop?: (courseId: string, volunteer: Volunteer) => void;
  onVolunteerRemove?: (courseId: string, volunteerId: string) => void;
}

export default function CourseBlock({
  course,
  color,
  duration,
  slotHeight,
  volunteers,
  onVolunteerDrop,
  onVolunteerRemove,
}: CourseBlockProps) {
  const courseRef = useRef<HTMLDivElement>(null);
  const borderColor = useColorModeValue("gray.200", "gray.600");


    // 添加拖放相关的 hooks
    const [{ isDragging }, drag, preview] = useDrag(() => ({
      type: ItemTypes.COURSE,
      item: { course },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));
  
    const [{ isOver }, drop] = useDrop(() => ({
      accept: ItemTypes.VOLUNTEER,
      drop: (volunteer: Volunteer) => {
        if (volunteer.type === course.type) {
          onVolunteerDrop?.(course.id, volunteer);
        }
      },
      canDrop: (volunteer: Volunteer) => volunteer.type === course.type,
      collect: monitor => ({
        isOver: monitor.canDrop() && monitor.isOver(),
      }),
    }));
  
    // 合并 refs
    useEffect(() => {
      if (courseRef.current) {
        drag(courseRef.current);
        drop(courseRef.current);
      }
    }, [drag, drop]);
  
  // 获取志愿类型的中文名称
  const getTypeText = (type: string) => {
    switch(type) {
      case 'required': return '必修';
      case 'limited': return '限选';
      case 'optional': return '任选';
      case 'sports': return '体育';
      default: return '';
    }
  };

  // 获取显示的志愿文本
  const getVolunteerText = () => {
    if (volunteers && volunteers.length > 0) {
      const firstVolunteer = volunteers[0];
      return `${getTypeText(firstVolunteer.type)}${firstVolunteer.priority}志愿`;
    }
    return `${getTypeText(course.type)}3志愿`;
  };

  return (
    <Box
      ref={courseRef}
      position="relative"
      opacity={isDragging ? 0 : isOver ? 0.7 : 1}
      transition="opacity 0.2s"
      height="100%"
      border="1px solid"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
    >
      {/* 顶部志愿区域 */}
      <Box
        width="100%"
        bg={useColorModeValue(`${color}.50`, `${color}.900`)}
        borderBottom="1px solid"
        borderColor={borderColor}
        py={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="xs" lineHeight="1">
          {getVolunteerText()}
        </Text>
      </Box>

      {/* 主要课程信息区域 */}
      <Box
        bg={useColorModeValue(`${color}.100`, `${color}.700`)}
        px={2}
        py={1}
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        color={useColorModeValue("gray.800", "white")}
        cursor="grab"
        _active={{ cursor: "grabbing" }}
      >
        <Text fontWeight="bold" fontSize="sm">
          {course.name}
        </Text>
        <Text fontSize="xs">{course.teacher}</Text>
        <Text fontSize="xs">{course.classroom}</Text>
      </Box>

      {/* 底部课程编号区域 */}
      <Box
        width="100%"
        bg={useColorModeValue(`${color}.50`, `${color}.900`)}
        borderTop="1px solid"
        borderColor={borderColor}
        py={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="xs" lineHeight="1">
          {course.courseNumber}
        </Text>
      </Box>
    </Box>
  );
}