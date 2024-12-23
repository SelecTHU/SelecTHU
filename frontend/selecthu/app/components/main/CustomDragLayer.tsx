// components/main/CustomDragLayer.tsx
import React from "react";
import { useDragLayer } from "react-dnd";
import { Course } from "@/app/types/course";
import { Box, Text } from "@chakra-ui/react";

const ItemTypes = {
  COURSE: "course",
};

const layerStyles: React.CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 1000,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

function getItemStyles(initialOffset: any, currentOffset: any) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }

  const x = currentOffset.x;
  const y = currentOffset.y;

  // 调整拖拽预览的位置，使其中心位于鼠标位置
  const transform = `translate(${x - 75}px, ${y - 25}px)`; // 75 和 25 可以根据预览的大小调整

  return {
    transform,
    WebkitTransform: transform,
  };
}

export default function CustomDragLayer() {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || itemType !== ItemTypes.COURSE) {
    return null;
  }

  const course: Course = item.course;

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        <Box
          p={2}
          bg="gray.300"
          borderRadius="md"
          boxShadow="md"
          fontSize="xs"
          width="150px"
        >
          <Text fontWeight="bold">{course.name}</Text>
          <Text>{course.teacher}</Text>
          <Text>{course.classroom}</Text>
        </Box>
      </div>
    </div>
  );
}