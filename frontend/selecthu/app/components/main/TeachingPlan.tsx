// app/components/main/TeachingPlan.tsx

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Link,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import { Course } from "@/app/types/course";
import { useMemo } from "react";

// 颜色数组
const colors = [
  "blue.500",
  "green.500",
  "red.500",
  "yellow.500",
  "purple.500",
  "teal.500",
  "orange.500",
  "pink.500",
  "cyan.500",
  "gray.500",
];

// 实际教学计划数据
const realPlanCourses: Course[] = [
  {
    id: "10720110",
    name: "体育专项(1)",
    teacher: "未提供",
    classroom: "体育必修",
    type: "必修",
    credits: 0,
    timeSlots: [], // 根据需要填写
    department: "体育学院", // 根据实际情况填写
    courseGroup: "体育必修",
    time: "", // 根据需要填写
    teachingInfo: "", // 根据需要填写
    teacherInfo: "", // 根据需要填写
    comments: [],
    courseNumber: "10720110",
    sequenceNumber: "0",
  },
  {
    id: "44100113",
    name: "计算机网络",
    teacher: "杨铮",
    classroom: "六教6A118",
    type: "必修",
    credits: 3,
    timeSlots: [
      { day: 3, start: 2, duration: 1, weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
    ],
    department: "计算机科学与技术学院",
    courseGroup: "专业主修",
    time: "周三 第2节 (1-16周)",
    teachingInfo: "教室：六教6A118",
    teacherInfo: "联系方式：yang@example.com", // 根据实际情况填写
    comments: [],
    courseNumber: "44100113",
    sequenceNumber: "0",
  },
  {
    id: "44100203",
    name: "软件工程",
    teacher: "刘璘",
    classroom: "六教6A118",
    type: "必修",
    credits: 3,
    timeSlots: [
      { day: 4, start: 2, duration: 1, weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
    ],
    department: "计算机科学与技术学院",
    courseGroup: "专业主修",
    time: "周四 第2节 (1-16周)",
    teachingInfo: "教室：六教6A118",
    teacherInfo: "联系方式：liu@example.com", // 根据实际情况填写
    comments: [],
    courseNumber: "44100203",
    sequenceNumber: "0",
  },
  {
    id: "44100573",
    name: "计算机组成原理",
    teacher: "杨铮",
    classroom: "六教6A118",
    type: "必修",
    credits: 3,
    timeSlots: [
      { day: 1, start: 2, duration: 1, weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
    ],
    department: "计算机科学与技术学院",
    courseGroup: "专业主修",
    time: "周一 第2节 (1-16周)",
    teachingInfo: "教室：六教6A118",
    teacherInfo: "联系方式：yang@example.com", // 根据实际情况填写
    comments: [],
    courseNumber: "44100573",
    sequenceNumber: "0",
  },
  {
    id: "44100593",
    name: "汇编与编译原理",
    teacher: "王朝坤",
    classroom: "六教6A216",
    type: "必修",
    credits: 3,
    timeSlots: [
      { day: 2, start: 2, duration: 1, weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
    ],
    department: "计算机科学与技术学院",
    courseGroup: "专业主修",
    time: "周二 第2节 (1-16周)",
    teachingInfo: "教室：六教6A216",
    teacherInfo: "联系方式：wang@example.com", // 根据实际情况填写
    comments: [],
    courseNumber: "44100593",
    sequenceNumber: "0",
  },
];

export default function TeachingPlan() {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // 创建颜色映射
  const courseColorMap = useMemo(() => {
    const map: { [courseId: string]: string } = {};
    realPlanCourses.forEach((course, index) => {
      map[course.id] = colors[index % colors.length];
    });
    return map;
  }, []);

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="lg"
      shadow="sm"
      border="1px"
      borderColor={borderColor}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          本学期教学计划
        </Text>
        <Link fontSize="sm" color="blue.500">
          查看
        </Link>
      </Flex>

      <Text fontSize="sm" mb={4}>
        软件工程 2024-2025学年 秋学期
      </Text>

      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th>课程号</Th>
            <Th>课程名</Th>
            <Th>课程属性</Th>
            <Th isNumeric>学分</Th>
            <Th>所属课组</Th>
          </Tr>
        </Thead>
        <Tbody>
          {realPlanCourses.map((course) => (
            <Tr key={course.id}>
              <Td>{course.courseNumber}</Td>
              <Td>
                <Badge
                  colorScheme="teal"
                  px={2}
                  py={1}
                  borderRadius="md"
                  bg={courseColorMap[course.id]}
                  color="white"
                >
                  {course.name}
                </Badge>
              </Td>
              <Td>{course.type}</Td>
              <Td isNumeric>{course.credits}</Td>
              <Td>{course.courseGroup}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}