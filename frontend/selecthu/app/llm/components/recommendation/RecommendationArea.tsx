// frontend/selecthu/app/llm/components/recommendation/RecommendationArea.tsx

import {
    Box,
    Text,
    VStack,
    useColorModeValue,
  } from "@chakra-ui/react";
  import CourseCard from "./CourseCard";
  
  interface RecommendationAreaProps {
    recommendations: Array<any>; // 使用之前定义的Course类型
    onAddToPlan: (courseId: string) => void;
  }
  
  export default function RecommendationArea({ recommendations, onAddToPlan }: RecommendationAreaProps) {
    const bgColor = useColorModeValue("white", "gray.800");
  
    return (
        <Box
        bg={bgColor}
        p={4}
        borderRadius="lg"
        shadow="sm"
        h="full" // 改为充满父容器
        w="full"
        display="flex"
        flexDirection="column"
      >
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          课程推荐
        </Text>
        <Box overflowY="auto" flex="1"> {/* 使用flex布局并允许滚动 */}
          <VStack spacing={3} align="stretch">
            {recommendations.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onAddToPlan={onAddToPlan}
              />
            ))}
          </VStack>
        </Box>
      </Box>
    );
  }