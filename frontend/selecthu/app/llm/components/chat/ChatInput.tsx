// frontend/selecthu/app/llm/components/chat/ChatInput.tsx

import {
    Box,
    Button,
    HStack,
    Textarea,
    IconButton,
    useColorModeValue,
    VStack,
  } from "@chakra-ui/react";
  import { DeleteIcon } from "@chakra-ui/icons";
  import { useState } from "react";
  
  interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: (message: string) => void;
    onClear: () => void;
}

export default function ChatInput({ value, onChange, onSend, onClear }: ChatInputProps) {
    const bgColor = useColorModeValue("white", "gray.800");

    const handleSend = () => {
        if (value.trim()) {
            onSend(value.trim());
            onChange(""); // 清空输入框
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Box bg={bgColor} p={4} borderRadius="lg" shadow="sm">
            <HStack spacing={4}>
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入您的问题..."
                    resize="none"
                    rows={3}
                    flex={1}
                />
                <VStack spacing={2}>
                    <Button
                        colorScheme="blue"
                        onClick={handleSend}
                        isDisabled={!value.trim()}
                    >
                        发送
                    </Button>
                    <IconButton
                        aria-label="清空对话"
                        icon={<DeleteIcon />}
                        onClick={onClear}
                        colorScheme="red"
                        variant="ghost"
                    />
                </VStack>
            </HStack>
        </Box>
    );
}