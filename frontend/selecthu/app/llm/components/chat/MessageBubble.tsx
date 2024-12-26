// frontend/selecthu/app/llm/components/chat/MessageBubble.tsx

import { Box, useColorModeValue } from "@chakra-ui/react";
import { Message } from "./types";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const userBgColor = useColorModeValue("blue.100", "blue.700");
  const aiBgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Box
      maxW="70%"
      mb={4}
      ml={message.type === 'user' ? 'auto' : '0'}
      mr={message.type === 'ai' ? 'auto' : '0'}
    >
      <Box
        bg={message.type === 'user' ? userBgColor : aiBgColor}
        px={4}
        py={2}
        borderRadius="lg"
        shadow="sm"
      >
        {message.content}
      </Box>
      <Box
        fontSize="xs"
        color="gray.500"
        textAlign={message.type === 'user' ? 'right' : 'left'}
        mt={1}
      >
        {new Date(message.timestamp).toLocaleTimeString()}
      </Box>
    </Box>
  );
}