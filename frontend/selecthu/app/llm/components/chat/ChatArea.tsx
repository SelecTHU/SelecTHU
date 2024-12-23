 
// frontend/selecthu/app/llm/components/chat/ChatArea.tsx

import { Box, VStack, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Message } from "./types";

interface ChatAreaProps {
  messages: Message[];
}

export default function ChatArea({ messages }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bgColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      ref={scrollRef}
      h="full" // 改为充满父容器
      w="full"
      bg={bgColor}
      p={4}
      borderRadius="lg"
      shadow="sm"
      overflowY="auto"
      position="relative" // 添加相对定位
    >
      <VStack spacing={4} align="stretch">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </VStack>
    </Box>
  );
}