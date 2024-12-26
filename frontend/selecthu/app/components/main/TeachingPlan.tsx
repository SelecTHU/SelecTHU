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
  // 可以添加更多课程
];

interface PlanCourse {
    code?: string,
    attr?: string,
    group?: string,
    credit?: string,
    name?: string,
}

export default function TeachingPlan({ curriculum,maxH, overflow, ...props }) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  console.log(curriculum)
  const curriculumCourses: PlanCourse[] = Object.values(curriculum).flat()

  // 创建颜色映射
  const courseColorMap = useMemo(() => {
    const map: { [courseId: string]: string } = {};
    curriculumCourses.forEach((course, index) => {
        map[course.code] = colors[index % colors.length];
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
      maxH={maxH}
      overflow={overflow}
      {...props}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          教学计划
        </Text>
        <Link fontSize="sm" color="brand.500" href="/main">
          刷新
        </Link>
      </Flex>

      <Text fontSize="sm" mb={4}>
        软件工程 2022级 三年级 第二学期
      </Text>

      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th>课程名</Th>
            <Th>课程编号</Th>
            <Th>选课属性</Th>
            <Th>课程类别</Th>
            <Th>学分</Th>
          </Tr>
        </Thead>
        <Tbody>
          {curriculumCourses.map((course) => (
            <Tr key={course.code}>
              <Td>
                <Badge
                  colorScheme="teal"
                  px={2}
                  py={1}
                  borderRadius="md"
                  bg={courseColorMap[course.code]}
                  color="white"
                >
                  {course.name}
                </Badge>
              </Td>
              <Td>{course.code}</Td>
              <Td>{course.attr}</Td>
              <Td>{course.group}</Td>
              <Td>{course.credit}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
