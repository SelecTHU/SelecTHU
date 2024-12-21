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
  onVolunteerDrop: (courseId: string, volunteer: Volunteer) => void;
  onVolunteerRemove: (courseId: string, volunteerId: string) => void;
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

  // 课程块的拖拽功能
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.COURSE,
    item: { course },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // 志愿放置功能
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.VOLUNTEER,
    drop: (volunteer: Volunteer) => {
      if (volunteer.type === course.type) {
        onVolunteerDrop(course.id, volunteer);
      }
    },
    canDrop: (volunteer: Volunteer) => volunteer.type === course.type,
    collect: monitor => ({
      isOver: monitor.canDrop() && monitor.isOver(),
    }),
  }));

  // 抑制默认拖拽预览
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // 合并 refs
  useEffect(() => {
    if (courseRef.current) {
      drag(courseRef.current);
      drop(courseRef.current);
    }
  }, [drag, drop]);

  // 志愿标签组件
  const VolunteerTag = ({ volunteer }: { volunteer: Volunteer }) => {
    const volunteerRef = useRef<HTMLDivElement>(null);
    const [{ isDragging: isVolunteerDragging }, volunteerDrag] = useDrag(() => ({
      type: ItemTypes.VOLUNTEER,
      item: volunteer,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        if (monitor.didDrop()) {
          onVolunteerRemove(course.id, volunteer.id);
        }
      },
    }));

    useEffect(() => {
      if (volunteerRef.current) {
        volunteerDrag(volunteerRef.current);
      }
    }, [volunteerDrag]);

    return (
      <Box
        ref={volunteerRef}
        bg={`${volunteer.type}.100`}
        px={1}
        py={0.5}
        borderRadius="sm"
        fontSize="xs"
        opacity={isVolunteerDragging ? 0.5 : 1}
        cursor="move"
      >
        {`${volunteer.priority}志愿`}
      </Box>
    );
  };

  // 颜色模式
  const bgColor = useColorModeValue(`${color}.100`, `${color}.700`);
  const textColor = useColorModeValue("black", "white");

  // 根据课程类型决定顶部区域的显示文本
  const getTypeText = (type: string) => {
    switch(type) {
      case 'required': return '必修';
      case 'limited': return '限选';
      case 'optional': return '任选';
      case 'sports': return '体育';
      
      default: return '任选';
    }
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
      {/* 顶部类型区域 */}
      <Box
        width="100%"
        bg={useColorModeValue(`${color}.50`, `${color}.900`)}
        borderBottom="1px solid"
        borderColor={borderColor}
        height="16px" // 固定高度
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="10px" lineHeight="1">
          {getTypeText(course.type)}
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

        {/* 如果需要显示志愿信息，可以在这里添加 */}
        {volunteers.length > 0 && (
          <Stack direction="row" spacing={1} mt={1} justifyContent="center">
            {volunteers.map(volunteer => (
              <VolunteerTag key={volunteer.id} volunteer={volunteer} />
            ))}
          </Stack>
        )}
      </Box>

      {/* 底部信息区域 */}
      <Box
        width="100%"
        bg={useColorModeValue(`${color}.50`, `${color}.900`)}
        borderTop="1px solid"
        borderColor={borderColor}
        height="16px" // 固定高度
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="10px" lineHeight="1">
          {course.courseNumber}
        </Text>
      </Box>
    </Box>
  );
}