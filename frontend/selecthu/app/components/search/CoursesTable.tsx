// app/components/search/CoursesTable.tsx
"use client";

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Text,
  Select,
  Flex,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { Course } from '../../types/course';

// 添加 Volunteer 接口
interface Volunteer {
  id: string;
  type: string;
  priority: number;
}

interface CoursesTableProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  selectedCourseId: string | null;
  onAddCourse: (courseId: string) => void;
  // 新增的属性
  courseVolunteers: {
    [courseId: string]: Volunteer[];
  };
  onVolunteerDrop: (courseId: string, volunteer: Volunteer) => void;
  onVolunteerRemove: (courseId: string, volunteerId: string) => void;
  getCourseColor: (courseId: string) => string;
}

const CoursesTable: React.FC<CoursesTableProps> = ({
  courses,
  onSelectCourse,
  selectedCourseId,
  onAddCourse,
  courseVolunteers,
  onVolunteerDrop,
  onVolunteerRemove,
  getCourseColor,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursesPerPage] = useState(20);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const boxBg = useColorModeValue("white", "gray.800");
  const tableBg = useColorModeValue("gray.100", "gray.700");
  const borderCol = useColorModeValue("gray.200", "gray.700");
  const hoverCol = useColorModeValue("gray.50", "gray.600");

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const handleAddCourse = (courseId: string) => {
    onAddCourse(courseId);
  };

  // 新增：渲染志愿标签
  const renderVolunteers = (courseId: string) => {
    const volunteers = courseVolunteers && courseVolunteers[courseId] ? courseVolunteers[courseId] : [];
    return (
      <Stack direction="row" spacing={1}>
        {volunteers.map((volunteer, index) => (
          <Box
            key={index}
            bg={`${volunteer.type}.100`}
            px={1}
            py={0.5}
            borderRadius="sm"
            fontSize="xs"
          >
            {`${volunteer.priority}志愿`}
          </Box>
        ))}
      </Stack>
    );
  };

  return (
    <Box
      bg={boxBg}
      p={4}
      borderRadius="md"
      boxShadow="md"
    >
      <Text fontSize="lg" mb={4} fontWeight="bold">
        课程列表
      </Text>

      <Table variant="simple" border="1px" borderColor={borderCol}>
        <Thead bg={tableBg}>
          <Tr>
            <Th borderRight="1px solid" borderColor={borderCol}>操作</Th>
            <Th borderRight="1px solid" borderColor={borderCol}>课程号-课序号</Th>
            <Th borderRight="1px solid" borderColor={borderCol}>课程名称</Th>
            <Th borderRight="1px solid" borderColor={borderCol}>学分</Th>
            <Th borderRight="1px solid" borderColor={borderCol}>开课院系</Th>
            <Th borderRight="1px solid" borderColor={borderCol}>授课教师</Th>
            <Th borderRight="1px solid" borderColor={borderCol}>上课时间</Th>
            <Th borderRight="1px solid" borderColor={borderCol}>志愿情况</Th>
            <Th>选课情况</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentCourses.map((course) => (
            <Tr
              key={course.id}
              cursor="pointer"
              bg={selectedCourseId === course.id ? tableBg : "transparent"}
              onClick={() => onSelectCourse(course.id)}
              _hover={{ bg: hoverCol }}
            >
              <Td borderRight="1px solid" borderColor={borderCol}>
                <IconButton
                  icon={<AddIcon />}
                  size="sm"
                  colorScheme="green"
                  aria-label="添加课程"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddCourse(course.id);
                  }}
                />
              </Td>
              <Td borderRight="1px solid" borderColor={borderCol}>
                {course.courseNumber}-{course.sequenceNumber}
              </Td>
              <Td borderRight="1px solid" borderColor={borderCol}>
                {course.name}
              </Td>
              <Td borderRight="1px solid" borderColor={borderCol}>
                {course.credits}
              </Td>
              <Td borderRight="1px solid" borderColor={borderCol}>
                {course.department}
              </Td>
              <Td borderRight="1px solid" borderColor={borderCol}>
                {course.teacher}
              </Td>
              <Td borderRight="1px solid" borderColor={borderCol}>
                {course.time}
              </Td>
              <Td borderRight="1px solid" borderColor={borderCol}>
                {renderVolunteers(course.id)}
              </Td>
              <Td>
                <Box w="100px" h="8px" bg="green.400" borderRadius="md" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Flex justifyContent="space-between" alignItems="center" mt={4}>
        <Text>共 {totalPages} 页</Text>

        <Stack direction="row" spacing={4} align="center">
          <IconButton
            aria-label="上一页"
            icon={<Text>&lt;</Text>}
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={currentPage === 1}
          />
          <Text>第 {currentPage} 页</Text>
          <IconButton
            aria-label="下一页"
            icon={<Text>&gt;</Text>}
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            isDisabled={currentPage === totalPages}
          />
          <Select
            width="100px"
            value={coursesPerPage}
            onChange={(e) => setCoursesPerPage(Number(e.target.value))}
          >
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </Select>
        </Stack>
      </Flex>
    </Box>
  );
};

export default CoursesTable;