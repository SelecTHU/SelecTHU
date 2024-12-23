// frontend/selecthu/app/llm/components/recommendation/CourseCard.tsx

import {
    Box,
    Text,
    Badge,
    Button,
    VStack,
    HStack,
    useColorModeValue,
  } from "@chakra-ui/react";
  
  interface Course {
    id: string;
    name: string;
    teacher: string;
    credits: number;
    time: string;
    location: string;
    capacity: number;
    remaining: number;
  }
  
  interface CourseCardProps {
    course: Course;
    onAddToPlan: (courseId: string) => void;
  }
  
  export default function CourseCard({ course, onAddToPlan }: CourseCardProps) {
    const cardBg = useColorModeValue("white", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");
  
    return (
      <Box
        p={3}
        bg={cardBg}
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
        mb={2}
      >
        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between">
            <Text fontWeight="bold">{course.name}</Text>
            <Badge colorScheme={course.remaining > 0 ? "green" : "red"}>
              剩余名额: {course.remaining}
            </Badge>
          </HStack>
          
          <Text fontSize="sm" color="gray.500">
            教师: {course.teacher}
          </Text>
          
          <HStack fontSize="sm" color="gray.500">
            <Text>学分: {course.credits}</Text>
            <Text>时间: {course.time}</Text>
          </HStack>
          
          <Text fontSize="sm" color="gray.500">
            地点: {course.location}
          </Text>
          
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => onAddToPlan(course.id)}
          >
            添加到选课计划
          </Button>
        </VStack>
      </Box>
    );
  }