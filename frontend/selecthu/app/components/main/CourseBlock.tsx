// components/main/CourseBlock.tsx

import React, { useRef, useEffect } from "react";
import {
  Box,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Course } from "@/app/types/course";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./constants"; // 推荐将 ItemTypes 移到单独的文件中
import { getEmptyImage } from "react-dnd-html5-backend";

interface CourseBlockProps {
  course: Course;
  color: string;
  duration: number; // 持续时间属性
  slotHeight: number; // 每节课的高度
}

export default function CourseBlock({
  course,
  color,
  duration,
  slotHeight,
}: CourseBlockProps) {
  // 使用 useDrag 钩子
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.COURSE,
    item: { course },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // 抑制默认的拖拽预览
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const boxRef = useRef<HTMLDivElement>(null);
  drag(boxRef);

  // 使用 useColorModeValue，根据主题模式选择适当的颜色
  const bgColor = useColorModeValue(`${color}.100`, `${color}.700`);
  const textColor = useColorModeValue("black", "white");

  // 计算课程块的高度
  const totalHeight = duration * slotHeight;

  return (
    <Box
      ref={boxRef}
      p={2}
      bg={bgColor}
      borderRadius="md"
      minHeight={`${totalHeight}px`} // 设置最小高度
      width="100%"
      fontSize="xs"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      opacity={isDragging ? 0 : 1} // 使用 isDragging 控制不透明度
      color={textColor}
      cursor="grab"
      _active={{ cursor: "grabbing" }}
    >
      <Text fontWeight="bold">{course.name}</Text>
      <Text>{course.teacher}</Text>
      <Text>{course.classroom}</Text>
    </Box>
  );
}