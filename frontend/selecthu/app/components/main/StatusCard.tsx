// components/main/StatusCard.tsx
import { Box, Text, useColorModeValue } from "@chakra-ui/react";

interface StatusCardProps {
  title: string;
  content: string;
  height?: string; // 添加 height 属性，可选
}

export default function StatusCard({ title, content }: StatusCardProps) {
  return (
    <Box
      p={5}
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="lg"
      shadow="sm"
      border="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Text
        fontSize="lg"
        fontWeight="bold"
        mb={2}
        color={useColorModeValue("gray.700", "white")}
      >
        {title}
      </Text>
      <Text
        fontSize="md"
        color={useColorModeValue("gray.600", "gray.300")}
      >
        {content}
      </Text>
    </Box>
  );
}