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
import { Course, TimeSlot } from "@/app/types/course";
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

// 教学计划示例数据
const samplePlanCourses: Course[] = [
  {
    id: "1",
    name: "高等数学",
    teacher: "张教授",
    classroom: "教学楼A101",
    type: "必修",
    credits: 4,
    timeSlots: [
      { day: 1, start: 1, duration: 2 }, // 周一1-2节
      { day: 3, start: 3, duration: 3 }, // 周三3-5节
    ],
    department: "数学与统计学院",
    time: "周一 08:00-10:00",
    teachingInfo: "教室：教学楼A101",
    teacherInfo: "电子邮箱：zhang@example.com",
    comments: [
      "课程内容深入，适合打好数学基础。",
      "老师讲解详细，有助于理解复杂概念。",
    ],
    courseNumber: "MATH101",
    sequenceNumber: "001",
  },
  {
    id: "2",
    name: "线性代数",
    teacher: "李教授",
    classroom: "教学楼B202",
    type: "必修",
    credits: 3,
    timeSlots: [
      { day: 2, start: 4, duration: 2 }, // 周二4-5节
      { day: 4, start: 1, duration: 1 }, // 周四1节
    ],
    department: "数学与统计学院",
    time: "周二 14:00-15:00",
    teachingInfo: "教室：教学楼B202",
    teacherInfo: "电子邮箱：li@example.com",
    comments: [
      "逻辑严谨，理论与实践结合紧密。",
      "适合希望深入理解数学原理的学生。",
    ],
    courseNumber: "MATH102",
    sequenceNumber: "002",
  },
  // 可以添加更多课程
];

export default function TeachingPlan() {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // 创建颜色映射
  const courseColorMap = useMemo(() => {
    const map: { [courseId: string]: string } = {};
    samplePlanCourses.forEach((course, index) => {
      map[course.id] = colors[index % colors.length];
    });
    return map;
  }, []);

  // 格式化时间段为可读字符串
  const formatTimeSlots = (timeSlots: TimeSlot[]): string => {
    const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    return timeSlots
      .map((ts) => {
        const startHour = ts.start.toString().padStart(2, '0') + ":00";
        const endHour = (ts.start + ts.duration - 1).toString().padStart(2, '0') + ":00";
        return `${weekDays[ts.day - 1]} ${startHour}-${endHour}`;
      })
      .join(", ");
  };

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
          教学计划
        </Text>
        <Link fontSize="sm" color="brand.500">
          查看
        </Link>
      </Flex>

      <Text fontSize="sm" mb={4}>
        计算机科学与技术 2023级 第二学期
      </Text>

      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th>课程名</Th>
            <Th>授课教师</Th>
            <Th>课程属性</Th>
            <Th isNumeric>学分数</Th>
            <Th>上课时间</Th>
          </Tr>
        </Thead>
        <Tbody>
          {samplePlanCourses.map((course) => (
            <Tr key={course.id}>
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
              <Td>{course.teacher}</Td>
              <Td>{course.type}</Td>
              <Td isNumeric>{course.credits}</Td>
              <Td>{formatTimeSlots(course.timeSlots)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}