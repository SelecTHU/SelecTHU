// components/main/CourseBlock.tsx
"use client";

import React, { useRef, useEffect } from "react";
import {
  Box,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Course, courseTypeMapping } from "@/app/types/course";
import { Volunteer } from "@/app/types/volunteer";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./constants";

interface CourseBlockProps {
  course: Course;
  color: string;
  duration: number;
  slotHeight: number;
  volunteers: Volunteer[];
  onVolunteerDrop?: (courseId: string, volunteer: Volunteer) => void;
  onVolunteerRemove?: (courseId: string, volunteerId: string) => void;
}

const volunteerBgColors = {
  b: ['red.50', 'red.100', 'red.200'],      // 必修
  x: ['yellow.50', 'yellow.100', 'yellow.200'],  // 限选
  r: ['green.50', 'green.100', 'green.200', 'green.300'],  // 任选（4个等级）
  t: ['blue.50', 'blue.100', 'blue.200'],   // 体育
};

const volunteerDarkBgColors = {
  b: ['red.900', 'red.800', 'red.700'],     // 必修
  x: ['yellow.900', 'yellow.800', 'yellow.700'], // 限选
  r: ['green.900', 'green.800', 'green.700', 'green.600'], // 任选（4个等级）
  t: ['blue.900', 'blue.800', 'blue.700'],  // 体育
};

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
      if (volunteer.type === courseTypeMapping[course.volType]) {
        onVolunteerDrop?.(course.id, volunteer);
      }
    },
    canDrop: (volunteer: Volunteer) => volunteer.type === courseTypeMapping[course.volType],
    collect: monitor => ({
      isOver: monitor.canDrop() && monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (courseRef.current) {
      drag(courseRef.current);
      drop(courseRef.current);
    }
  }, [drag, drop]);

  // 获取志愿类型的中文名称
  const getTypeText = (type: string) => {
    switch(type) {
      case 'b': return '必修';
      case 'x': return '限选';
      case 'r': return '任选';
      case 't': return '体育';
      default: return '';
    }
  };

  // 获取显示的志愿文本和颜色
  const getVolunteerInfo = () => {
    const selection = course.selection;
    const type = courseTypeMapping[course.volType];

    if (!selection || !selection[type] || selection[type].length === 0) {
      return {
        text: `${getTypeText(type)}`,
        colorScheme: useColorModeValue(
          volunteerBgColors[type][0], 
          volunteerDarkBgColors[type][0]
        )
      };
    }

    // 根据当前课程类型来确定志愿显示
    let priorities = selection[type];
    let maxVol = Math.max(...priorities);
    let maxPriority = priorities.indexOf(maxVol);

    // 如果是任选课，固定显示为3志愿
    if (course.volType === 'optional') {
      maxPriority = 3;
    }

    return {
      text: `${getTypeText(type)}${maxPriority > 0 ? maxPriority + '志愿' : ''}`,
      colorScheme: useColorModeValue(
        volunteerBgColors[type][maxPriority], 
        volunteerDarkBgColors[type][maxPriority]
      )
    };
  };

  const { text: volunteerText, colorScheme: volunteerColor } = getVolunteerInfo();

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
        bg={volunteerColor}
        borderBottom="1px solid"
        borderColor={borderColor}
        py={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="xs" lineHeight="1">
          {volunteerText}
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
        {/* <Text fontSize="xs">{course.classroom}</Text> */}
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