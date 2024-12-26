// app/components/search/SelectedCourseInfo.tsx

"use client";

import {
  Box,
  Divider,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { Course } from "../../types/course"; // 从统一接口导入

interface SelectedCourseInfoProps {
  course: Course | null;
  onAddComment: (courseId: string, comment: string) => void;
}

const SelectedCourseInfo: React.FC<SelectedCourseInfoProps> = ({
  course,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState("");
  const courceInfoBg = useColorModeValue("white", "gray.800");
  const courceCommentBg = useColorModeValue("gray.100", "gray.700");


  // 处理评论发送
  const handleSendComment = () => {
    if (newComment.trim() !== "" && course) {
      onAddComment(course.id, newComment.trim());
      setNewComment("");
    }
  };

  if (!course) {
    return (
      <Box
        bg={courceInfoBg}
        p={4}
        borderRadius="md"
        boxShadow="md"
        height="100%"
      >
        <Text>请选择一门课程以查看详细信息。</Text>
      </Box>
    );
  }

  return (
    <Box
      bg={courceInfoBg}
      p={4}
      borderRadius="md"
      boxShadow="md"
      height="100%"
    >
      {/* 课程信息部分 */}
      <VStack align="start" spacing={2} mb={4}>
        <Heading size="md">课程信息</Heading>
        <Text>
          <strong>课程名称：</strong>
          {course.name}
        </Text>
        <Text>
          <strong>开课院系：</strong>
          {course.department}
        </Text>
        <Text>
          <strong>开课时间：</strong>
          {course.time}
        </Text>
        <Text>
          <strong>授课教师：</strong>
          {course.teacher} {/* 使用 teacher */}
        </Text>
        {/* <Text>
          <strong>授课信息：</strong>
          {course.teachingInfo}
        </Text>
        <Text>
          <strong>教师信息：</strong>
          {course.teacherInfo}
        </Text> */}
      </VStack>

      <Divider />

      {/* 课程评价部分 */}
      <VStack align="start" spacing={4} mt={4}>
        <Heading size="md">课程评价</Heading>
        {/* 展示已有评价 */}
        {course.comments.map((comment, index) => (
          <Box
            key={index}
            bg={courceCommentBg}
            p={2}
            borderRadius="md"
            w="100%"
          >
            {comment}
          </Box>
        ))}

        {/* 添加评价 */}
        <VStack align="start" w="100%" spacing={2}>
          <Input
            placeholder="请输入评论内容"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button colorScheme="blue" onClick={handleSendComment}>
            发送
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default SelectedCourseInfo;
