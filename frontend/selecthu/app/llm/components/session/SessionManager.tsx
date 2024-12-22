// frontend/selecthu/app/llm/components/session/SessionManager.tsx

import {
    Box,
    Text,
    VStack,
    HStack,
    IconButton,
    useColorModeValue,
    Button,
} from "@chakra-ui/react";
import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import { ChatSession } from "../chat/types";

interface SessionManagerProps {
    sessions: ChatSession[];
    currentSession: ChatSession | null;
    onSelectSession: (sessionId: string) => void;
    onDeleteSession: (sessionId: string) => void;
    onExportSession: (sessionId: string) => void;
}

export default function SessionManager({
    sessions,
    currentSession,
    onSelectSession,
    onDeleteSession,
    onExportSession,
}: SessionManagerProps) {
    const bgColor = useColorModeValue("white", "gray.800");
    const selectedBg = useColorModeValue("blue.50", "blue.900");

    return (
        <Box
            bg={bgColor}
            p={4}
            borderRadius="lg"
            shadow="sm"
            h="full"
            w="full"
            display="flex"
            flexDirection="column"
        >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
                会话记录
            </Text>
            <Box overflowY="auto" flex="1">
                <VStack spacing={2} align="stretch">
                    {sessions.map((session) => (
                        <HStack
                            key={session.id}
                            p={2}
                            borderRadius="md"
                            bg={currentSession?.id === session.id ? selectedBg : "transparent"}
                            _hover={{ bg: selectedBg }}
                            cursor="pointer"
                        >
                            <Box flex={1} onClick={() => onSelectSession(session.id)}>
                                <Text fontSize="sm" fontWeight="medium">
                                    {session.name}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    {new Date(session.updatedAt).toLocaleString()}
                                </Text>
                            </Box>
                            <IconButton
                                aria-label="导出会话"
                                icon={<DownloadIcon />}
                                size="sm"
                                variant="ghost"
                                onClick={() => onExportSession(session.id)}
                            />
                            <IconButton
                                aria-label="删除会话"
                                icon={<DeleteIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => onDeleteSession(session.id)}
                            />
                        </HStack>
                    ))}
                </VStack>
            </Box>
        </Box>
    );
}