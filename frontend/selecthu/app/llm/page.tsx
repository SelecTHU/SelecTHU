// frontend/selecthu/app/llm/page.tsx

"use client";

import {
  Box,
  Container,
  Grid,
  GridItem,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import ChatArea from "./components/chat/ChatArea";
import ChatInput from "./components/chat/ChatInput";
import RecommendationArea from "./components/recommendation/RecommendationArea";
import PromptTemplates from "./components/prompt/PromptTemplates";
import SessionManager from "./components/session/SessionManager";
import { Message, ChatSession } from "./components/chat/types";

export default function LLMPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = (content: string) => {
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      type: "user",
      timestamp: new Date(),
    };
    
    // 添加AI回复消息
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(), // 确保ID不重复
      content: "不知道喵",
      type: "ai",
      timestamp: new Date(),
    };
    
    // 将两条消息都添加到消息列表中
    setMessages(prev => [...prev, userMessage, aiMessage]);
  };

  const handleClearChat = () => {
    setMessages([]);
    setInputValue("");
  };

  const handleAddToPlan = (courseId: string) => {
    // TODO: 实现添加到选课计划的逻辑
  };

  const handleSelectTemplate = (content: string) => {
    setInputValue(content);
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Navbar />
      
      <Container maxW="container.xl" py={5} h="calc(100vh - 64px)">
        <Grid templateColumns="repeat(12, 1fr)" gap={4} h="full">
          {/* 左侧聊天区域 */}
          <GridItem colSpan={{ base: 12, lg: 8 }} h="full">
            <VStack spacing={4} h="full">
              <Box flex="1" w="full" overflowY="hidden">
                <ChatArea messages={messages} />
              </Box>
              <Box w="full">
                <ChatInput 
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSendMessage}
                  onClear={handleClearChat}
                />
              </Box>
            </VStack>
          </GridItem>

          {/* 右侧功能区 */}
          <GridItem colSpan={{ base: 12, lg: 4 }} h="full">
            <VStack spacing={4} h="full">
              <Box h="300px" w="full">
                <RecommendationArea
                  recommendations={recommendations}
                  onAddToPlan={handleAddToPlan}
                />
              </Box>
              <Box h="250px" w="full">
                <PromptTemplates 
                  onSelectTemplate={handleSelectTemplate}
                  setInputValue={setInputValue}
                />
              </Box>
              <Box h="200px" w="full">
                <SessionManager
                  sessions={sessions}
                  currentSession={currentSession}
                  onSelectSession={(id) => {/* TODO */}}
                  onDeleteSession={(id) => {/* TODO */}}
                  onExportSession={(id) => {/* TODO */}}
                />
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}