// components/main/CourseListView.tsx

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    useColorModeValue,
    Tag,
  } from "@chakra-ui/react";
  import { Course } from "../../types/course";
  
  interface CourseListViewProps {
    selectedCourses: Course[];
    getCourseColor: (courseId: string) => string;
    courseVolunteers: {
      [courseId: string]: any[];
    };
  }
  
  const CourseListView = ({ selectedCourses, getCourseColor, courseVolunteers }: CourseListViewProps) => {
    const getTimeString = (timeSlots: { day: number; start: number; duration: number }[]) => {
      const dayMap = ['', '周一', '周二', '周三', '周四', '周五'];
      return timeSlots.map(slot => 
        `${dayMap[slot.day]} 第${slot.start}-${slot.start + slot.duration - 1}节`
      ).join(' / ');
    };
  
    const getCourseTypeTag = (type: string) => {
      const typeConfig = {
        required: { label: '必修', color: 'red' },
        limited: { label: '限选', color: 'orange' },
        optional: { label: '任选', color: 'green' },
        sports: { label: '体育', color: 'blue' },
      }[type] || { label: '其他', color: 'gray' };
  
      return (
        <Tag size="sm" colorScheme={typeConfig.color} variant="solid">
          {typeConfig.label}
        </Tag>
      );
    };
  
    return (
      <Box
        bg={useColorModeValue("white", "gray.700")}
        rounded="lg"
        shadow="base"
        overflow="hidden"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>课程名称</Th>
              <Th>课程类型</Th>
              <Th>教师</Th>
              <Th>教室</Th>
              <Th>时间</Th>
              <Th>学分</Th>
              <Th>志愿</Th>
            </Tr>
          </Thead>
          <Tbody>
            {selectedCourses.map((course) => (
              <Tr key={course.id}>
                <Td color={`${getCourseColor(course.id)}.500`} fontWeight="bold">
                  {course.name}
                </Td>
                <Td>{getCourseTypeTag(course.type)}</Td>
                <Td>{course.teacher}</Td>
                <Td>{course.classroom}</Td>
                <Td>{getTimeString(course.timeSlots)}</Td>
                <Td>{course.credits}</Td>
                <Td>
                  {courseVolunteers[course.id]?.[0]?.priority 
                    ? `第${courseVolunteers[course.id][0].priority}志愿` 
                    : '未设置'}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    );
  };
  
  export default CourseListView;