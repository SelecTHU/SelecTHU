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
import { useDrop } from "react-dnd";
import { ItemTypes } from "./constants";

interface CourseListProps {
  availableCourses: Course[];
  addCourseToTable: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  moveCourseToAvailable: (course: Course) => void;
  getCourseColor: (courseId: string) => string;
}

export default function CourseList({
  availableCourses,
  addCourseToTable,
  deleteCourse,
  moveCourseToAvailable,
  getCourseColor,
}: CourseListProps) {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const tableBgColor = useColorModeValue("white", "gray.800");

  const boxRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.COURSE,
    drop: (item: { course: Course }) => {
      moveCourseToAvailable(item.course);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(boxRef);

  const formatTimeSlots = (timeSlots: TimeSlot[]) => {
    return timeSlots
      .map((ts) => `周${ts.day}\n ${ts.start}-${ts.start + ts.duration - 1}节`)
      .join(",\n ");
  };

  return (
    <Box
      ref={boxRef}
      bg={isOver ? "blue.100" : tableBgColor}
      p={2}
      borderRadius="lg"
      shadow="sm"
      border="1px"
      borderColor={borderColor}
      overflow="auto"
      minHeight="200px"
      maxHeight="600px"
      mt="0vh"
      mb={8}
    >
      <chakra.h2 fontSize="lg" fontWeight="bold" mb={2}>
        备选清单
      </chakra.h2>
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th width="180px">课程名</Th>  {/* 固定宽度 */}
            <Th width="50px">教师</Th>    {/* 固定宽度 */}
            <Th width="60px">类型</Th>     {/* 固定宽度 */}
            <Th width="40px" isNumeric>学分</Th>
            <Th>时间段</Th>                {/* 自适应剩余空间 */}
            <Th width="40px">操作</Th>    {/* 固定宽度 */}
          </Tr>
        </Thead>
        <Tbody>
          {availableCourses.map((course) => (
            <CourseRow
              key={course.id}
              course={course}
              courseColor={getCourseColor(course.id)}
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