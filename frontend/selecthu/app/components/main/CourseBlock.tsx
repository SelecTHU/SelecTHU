"use client";

import React, { useRef, useEffect } from "react";
import {
  Box,
  Text,
  useColorModeValue,
  Flex,
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
  volunteer: Volunteer;
  onVolunteerDrop?: (courseId: string, volunteer: Volunteer) => void;
  onVolunteerRemove?: (courseId: string, volunteerId: string) => void;
}

const volunteerBgColors = {
  b: ['', 'red.300', 'red.200', 'red.100'],
  x: ['', 'yellow.300', 'yellow.200', 'yellow.100'],
  r: ['green.1000', 'green.300', 'green.200', 'green.100'],
  t: ['', 'blue.300', 'blue.200', 'blue.100'],
};

const volunteerDarkBgColors = {
  b: ['red.900', 'red.800', 'red.700'],
  x: ['yellow.900', 'yellow.800', 'yellow.700'],
  r: ['green.900', 'green.800', 'green.700', 'green.600'],
  t: ['blue.900', 'blue.800', 'blue.700'],
};

const ProgressBar: React.FC<{ course: Course }> = ({ course }) => {
  const getColorForType = (type: string, priority: number) => {
    const baseColors = {
      'b': ['#FF0000', '#FF3333', '#FF6666'],
      'x': ['#FFD700', '#FFE44D', '#FFEB80'],
      'r': ['#00CC00', '#33FF33', '#66FF66', '#99FF99'],
      't': ['#0000FF', '#3333FF', '#6666FF']
    };
    
    if (type === 'r') {
      return baseColors[type][priority] || baseColors[type][0];
    }
    return baseColors[type][priority - 1] || baseColors[type][0];
  };

  const getVolunteerOrder = (volType) => {
      switch (volType) {
          case "required": return 1
          case "limited": return 2
          case "optional": return 3
      }
  }

  const renderSelectionBars = () => {
    const { selection, capacity } = course;
    if (!selection || !capacity) return null;

    const getCurrentVolunteerTotal = () => {
      let total = 0;
      const currentType = course.volType;
      const maxPriority = 3;

      (['b', 'x', 't']).forEach(type => {
          if (getVolunteerOrder(type) <= getVolunteerOrder(currentType)) {
              for (let priority = 0; priority <= maxPriority; priority++) {
                  total += selection[type][priority] || 0;
              }
          }
      });

      return total;
    };

    const currentTotal = getCurrentVolunteerTotal();
    const maxWidth = Math.max(capacity, currentTotal);
    const segments: { width: number; color: string }[] = [];
    
    ['b', 'x', 't'].forEach(type => {
      for (let priority = 1; priority <= 3; priority++) {
        const count = selection[type][priority] || 0;
        if (count > 0) {
          const width = (count / maxWidth) * 100;
          segments.push({
            width: Math.min(width, 100 - segments.reduce((acc, seg) => acc + seg.width, 0)),
            color: getColorForType(type, priority)
          });
        }
      }
    });

    for (let priority = 0; priority <= 3; priority++) {
      const count = selection.r[priority] || 0;
      if (count > 0) {
        const width = (count / maxWidth) * 100;
        segments.push({
          width: Math.min(width, 100 - segments.reduce((acc, seg) => acc + seg.width, 0)),
          color: getColorForType('r', priority)
        });
      }
    }

    return (
      <Box position="relative" w="100%" h="12px">
        <Flex 
          w="100%" 
          h="100%" 
          borderRadius="md" 
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
          position="relative"
        >
          {segments.map((segment, index) => (
            <Box
              key={index}
              w={`${segment.width}%`}
              h="100%"
              bg={segment.color}
            />
          ))}
          {maxWidth > capacity && (
            <Box
              position="absolute"
              left={`${(capacity / maxWidth) * 100}%`}
              h="100%"
              w="2px"
              bg="black"
              zIndex={2}
            />
          )}
        </Flex>
      </Box>
    );
  };

  return (
    <Box w="100%">
      {renderSelectionBars()}
    </Box>
  );
};

export default function CourseBlock({
  course,
  color,
  duration,
  slotHeight,
  volunteer,
  onVolunteerDrop,
  onVolunteerRemove,
}: CourseBlockProps) {

    console.log(`Rendering course ${course.name} with volunteer ${volunteer}, course`, course)
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
      if (volunteer.type === course.volType) {
        onVolunteerDrop?.(course.id, volunteer);
      }
    },
    canDrop: (volunteer: Volunteer) => volunteer.type === course.volType,
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

  const getTypeText = (type: string) => {
    switch(type) {
      case 'b': return '必修';
      case 'x': return '限选';
      case 'r': return '任选';
      case 't': return '体育';
      default: return '';
    }
  };

  const getVolunteerInfo = () => {
    // console.log("VOLUNTEER", volunteer)
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

    let priorities = selection[type];
    // console.log("priorities", priorities)
    let maxVol = Math.max(...priorities);
    let maxPriority = priorities.indexOf(maxVol);

    if (course.volType === 'optional' ) {
      maxPriority = 3;
    }

    maxPriority = +course.volNum

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
      </Box>
  
      {/* 底部进度条区域 */}
      <Box
        width="100%"
        bg={useColorModeValue(`${color}.50`, `${color}.900`)}
        borderTop="1px solid"
        borderColor={borderColor}
        p={1}
      >
        <ProgressBar course={course} />
      </Box>
    </Box>
  );
}
