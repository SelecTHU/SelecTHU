// app/info/agreement/page.tsx
"use client";

import { Box, Flex, Text } from "@chakra-ui/react";

export default function AgreementPage() {
  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="md"
        maxWidth="600px"
        textAlign="center"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          用户协议
        </Text>
        <Text>
          这里是用户协议的详细信息。
        </Text>
      </Box>
    </Flex>
  );
}