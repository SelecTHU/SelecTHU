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
  Stack,
} from "@chakra-ui/react";
import { Course } from "@/app/types/course";
import { Volunteer } from "@/app/types/volunteer";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./constants";
import CourseBlock from "./CourseBlock";

interface CourseTableProps {
  selectedCourses: Course[];
  addCourseToTable: (course: Course) => void;
  getCourseColor?: (courseId: string) => string;  // 改为可选
  courseVolunteer?: {
    [courseId: string]: Volunteer;
  };
  onVolunteerDrop?: (courseId: string, volunteer: Volunteer) => void;
  onVolunteerRemove?: (courseId: string, volunteerId: string) => void;
}

export default function CourseTable({
  selectedCourses,
  addCourseToTable,
  getCourseColor = (courseId: string) => "gray.200",
  courseVolunteer = {},
  onVolunteerDrop = () => {},
  onVolunteerRemove = () => {},
}: CourseTableProps) {

      console.log("Rendering CourseTable with", courseVolunteer)
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");

  const timeSlots = [
    { name: "第一节", time: "8:00-8:45" },
    { name: "第二节", time: "8:50-9:35" },
    { name: "第三节", time: "9:50-10:35" },
    { name: "第四节", time: "10:40-11:25" },
    { name: "第五节", time: "11:30-12:15" },
    { name: "第六节", time: "13:30-14:15" },
    { name: "第七节", time: "14:20-15:05" },
    { name: "第八节", time: "15:20-16:05" },
    { name: "第九节", time: "16:10-16:55" },
    { name: "第十节", time: "17:05-17:50" },
    { name: "第十一节", time: "17:55-18:40" },
    { name: "第十二节", time: "19:20-20:05" },
    { name: "第十三节", time: "20:10-20:55" },
    { name: "第十四节", time: "21:00-21:45" },
    { name: "第十五节", time: "21:50-22:35" }
  ];

  const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

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

  const shouldShowCourse = (day: number, slot: number): boolean => {
    const course = getCourse(day, slot);
    if (!course) return false;
    return course.timeSlots.some((ts) => ts.day === day && ts.start === slot);
  };

  const getRowSpan = (day: number, slot: number): number => {
    const course = getCourse(day, slot);
    if (!course) return 1;
    const timeSlot = course.timeSlots.find(
      (ts) => ts.day === day && ts.start === slot
    );
    return timeSlot ? timeSlot.duration : 1;
  };

  const shouldRenderCell = (day: number, slot: number): boolean => {
    const course = getCourse(day, slot);
    if (!course) return true;
    return course.timeSlots.some((ts) => ts.day === day && ts.start === slot);
  };

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

  const boxRef = React.useRef<HTMLDivElement>(null);
  drop(boxRef);

  const getColor = (courseId: string) => {
    return getCourseColor(courseId);
  };

  const slotHeight = 49;

  return (
    <chakra.div
      ref={boxRef}
      bg={bgColor}
      p={2}
      borderRadius="lg"
      shadow="sm"
      border="1px"
      borderColor={borderColor}
      overflow="auto"
      width="100%"
    >
      <Table size="sm" variant="simple" width="100%">
        <Thead>
          <Tr height={`${slotHeight}px`}>
            <Th
              width="100px"
              border="1px solid"
              borderColor={borderColor}
              position="sticky"
              top="0"
              bg="white"
              _dark={{ bg: "gray.800" }}
              zIndex={1}
              height={`${slotHeight}px`}
              p={1}
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
                zIndex={1}
                height={`${slotHeight}px`}
                p={1}
              >
                {day}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {timeSlots.map((slot, slotIndex) => (
            <Tr key={`slot-${slotIndex}`} height={`${slotHeight}px`}>
              <Td
                border="1px solid"
                borderColor={borderColor}
                textAlign="center"
                height={`${slotHeight}px`}
                position="sticky"
                left="0"
                bg="white"
                _dark={{ bg: "gray.800" }}
                zIndex={1}
                p={1}
              >
                <Box fontSize="xs" lineHeight="1">
                  <Text>{slot.name}</Text>
                  <Text>{slot.time}</Text>
                </Box>
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
                    height={`${slotHeight * rowSpan}px`}
                    position="relative"
                  >
                    {course && shouldShowCourse(dayIndex + 1, slotIndex + 1) ? (
                      <Box position="absolute" top={0} left={0} right={0} bottom={0}>  
                        <CourseBlock
                          course={course}
                          color={color}
                          duration={rowSpan}
                          slotHeight={slotHeight}
                          volunteer={courseVolunteer[course.id]}
                          onVolunteerDrop={onVolunteerDrop}
                          onVolunteerRemove={onVolunteerRemove}
                        />
                      </Box>
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
