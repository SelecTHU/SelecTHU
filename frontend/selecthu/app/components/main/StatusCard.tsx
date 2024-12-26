// components/main/StatusCard.tsx
import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";

interface StatusCardProps {
  title: string;
  content: string;
  height?: string | number; // 添加 height 属性
}

export default function StatusCard({ title, content, height }: StatusCardProps) {
  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="lg"
      shadow="sm"
      border="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      height={height} // 使用传入的height属性
      overflow="hidden"
    >
      <Flex
        direction="column"
        justify="center"
        height="100%"
        p={5}
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
      </Flex>
    </Box>
  );
}