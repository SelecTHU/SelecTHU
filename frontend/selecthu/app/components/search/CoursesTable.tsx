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
import { Volunteer } from "@/app/types/volunteer"

interface CoursesTableProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  selectedCourseId: string | null;
  onAddCourse: (courseId: string) => void;
  courseVolunteers: {
    [courseId: string]: Volunteer[];
  };
  onVolunteerDrop: (courseId: string, volunteer: Volunteer) => void;
  onVolunteerRemove: (courseId: string, volunteerId: string) => void;
  getCourseColor: (courseId: string) => string;
}

const ProgressBar: React.FC<{ course: Course }> = ({ course }) => {
  const getColorForType = (type: string, priority: number) => {
    const baseColors = {
      'b': ['#FF0000', '#FF3333', '#FF6666'], // 红色系 - 必修
      'x': ['#FFD700', '#FFE44D', '#FFEB80'], // 黄色系 - 限选
      'r': ['#00CC00', '#33FF33', '#66FF66', '#99FF99'], // 绿色系 - 任选（4个层次）
      't': ['#0000FF', '#3333FF', '#6666FF']  // 蓝色系 - 体育
    };
    
    if (type === 'r') {
      return baseColors[type][priority] || baseColors[type][0]; // 任选使用0-3
    }
    return baseColors[type][priority - 1] || baseColors[type][0]; // 其他使用1-3
  };

  const renderSelectionBars = () => {
    const { selection, capacity } = course;
    if (!selection || !capacity) return null;

    const segments: { width: number; color: string }[] = [];
    
    // 处理必修、限选和体育课（优先级1-3）
    ['b', 'x', 't'].forEach(type => {
      for (let priority = 1; priority <= 3; priority++) {
        const count = selection[type][priority] || 0;
        if (count > 0) {
          const width = (count / capacity) * 100;
          segments.push({
            width: Math.min(width, 100 - segments.reduce((acc, seg) => acc + seg.width, 0)),
            color: getColorForType(type, priority)
          });
        }
      }
    });

    // 特殊处理任选课（优先级0-3）
    for (let priority = 0; priority <= 3; priority++) {
      const count = selection.r[priority] || 0;
      if (count > 0) {
        const width = (count / capacity) * 100;
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
        >
          {segments.map((segment, index) => (
            <Box
              key={index}
              w={`${segment.width}%`}
              h="100%"
              bg={segment.color}
            />
          ))}
        </Flex>
        {selection.total > capacity && (
          <Box
            position="absolute"
            right="-20px"
            top="50%"
            transform="translateY(-50%)"
            color="red.500"
            fontSize="xs"
          >
            {/* 溢出 */}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box w="200px">
      {renderSelectionBars()}
    </Box>
  );
};

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

  const renderWishType = (wish: string) => {
      if (wish == "required") {
          return "必修"
      }
      else if (wish == "limited") {
          return "限选"
      }
      else if (wish == "optional") {
          return "任选"
      }
      else if (wish == "sports") {
          return "体育"
      }
  }

  const renderVolunteers = (course: Course) => {
    const selection = course.selection
    return JSON.stringify(selection)
  }

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
                {renderWishType(course.volType)}
              </Td>
              <Td>
                <ProgressBar course={course} />
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
