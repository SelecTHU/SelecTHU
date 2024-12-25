"use client";

import {
  Box,
  Container,
  Grid,
  GridItem,
  useColorModeValue,
  VStack,
  Text,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import ChatArea from "./components/chat/ChatArea";
import ChatInput from "./components/chat/ChatInput";
import { Message } from "./components/chat/types";

// Add interface for user data
interface CourseInfo {
  course_id: string;
  code: string;
  number: string;
  name: string;
  teacher: string;
  credit: number;
  time: Record<string, any>;
  department: string;
  "course-type": string;
  features: string;
  text: string;
  capacity: number;
  grade: string;
  "sec-choice": boolean;
  "selection-type"?: string;
}

interface UserData {
  nickname: string;
  avatar: string;
  "courses-favorite": CourseInfo[];
  "courses-decided": CourseInfo[];
  curriculum: Record<string, any>;
}

interface PromptTemplate {
  title: string;
  content: string;
  description: string;
  }

const promptTemplates: PromptTemplate[] = [
  {
  title: "课程推荐",
  content: "请根据我的兴趣推荐一些课程",
  description: "AI将根据您的兴趣和需求，为您推荐合适的课程。"
  },
  {
  title: "选课建议",
  content: "你觉得我应该选择哪些课程？",
  description: "获取关于课程选择的个性化建议和指导。"
  },
  {
  title: "课程详情",
  content: "请告诉我这门课程的具体信息",
  description: "了解特定课程的详细信息、课程要求和学习目标。"
  },
  {
  title: "分析课表",
  content: "请你分析我的课表，给我一些建议",
  description: "AI将分析您的课表，为您提供课程安排和时间管理建议。"
  },
  ];

export default function LLMPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [includeSchedule, setIncludeSchedule] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/v1/user/');
        if (response.status === 200) {
          const data = await response.json();
          setUserData(data.user);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Format user schedule information
  const formatUserSchedule = () => {
    if (!userData) return '';

    let scheduleText = "我的课程信息：\n";
    
    // Add decided courses
    if (userData["courses-decided"].length > 0) {
      scheduleText += "\n已选课程：\n";
      userData["courses-decided"].forEach((course, index) => {
        scheduleText += `${index + 1}. ${course.name} (${course.code})\n`;
        scheduleText += `   教师：${course.teacher}\n`;
        scheduleText += `   学分：${course.credit}\n`;
        scheduleText += `   课程类型：${course["course-type"]}\n`;
        if (course.time) {
          scheduleText += `   时间：${JSON.stringify(course.time)}\n`;
        }
        scheduleText += "\n";
      });
    }

    // Add favorite courses
    if (userData["courses-favorite"].length > 0) {
      scheduleText += "\n收藏课程：\n";
      userData["courses-favorite"].forEach((course, index) => {
        scheduleText += `${index + 1}. ${course.name} (${course.code})\n`;
      });
    }

    return scheduleText;
  };

  const handleSendMessage = async (content: string) => {
    // Include user schedule if checkbox is checked and userData exists
    const scheduleInfo = includeSchedule ? formatUserSchedule() : '';
    const fullContent = scheduleInfo ? `${scheduleInfo}\n\n${content}` : content;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content, // Only show the user input in the chat
      type: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/chatbot-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'user-input': fullContent // Send the full content including schedule if selected
        })
      });

      if (response.status === 200) {
        const data = await response.json();
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          type: "ai",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "抱歉，我遇到了一些问题，请稍后再试。",
          type: "ai",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "抱歉，网络连接出现问题，请检查您的网络连接。",
        type: "ai",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setInputValue("");
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
              <Box 
                ref={chatContainerRef}
                flex="1" 
                w="full" 
                overflowY="auto" 
                h="calc(100vh - 200px)"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'gray.300',
                    borderRadius: '24px',
                  },
                }}
              >
                <ChatArea messages={messages} />
              </Box>
              <Box w="full" position="sticky" bottom={0} bg={useColorModeValue("gray.50", "gray.900")} pt={2}>
                <Checkbox
                  mb={2}
                  isChecked={includeSchedule}
                  onChange={(e) => setIncludeSchedule(e.target.checked)}
                  colorScheme="blue"
                >
                  使用我的课表信息
                </Checkbox>
                <ChatInput 
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSendMessage}
                  onClear={handleClearChat}
                  // isLoading={isLoading}
                />
              </Box>
            </VStack>
          </GridItem>

          {/* 右侧常用提示词区域 */}
          <GridItem colSpan={{ base: 12, lg: 4 }} h="full">
            <VStack spacing={4} align="stretch">
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                常用提示词
              </Text>
              <VStack spacing={4} align="stretch">
                {promptTemplates.map((template, index) => (
                  <Box 
                    key={index}
                    borderWidth="1px"
                    borderRadius="lg"
                    p={4}
                    bg={useColorModeValue("white", "gray.800")}
                  >
                    <Button
                      w="full"
                      colorScheme="blue"
                      mb={2}
                      onClick={() => handleSelectTemplate(template.content)}
                    >
                      {template.title}
                    </Button>
                    <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
                      {template.description}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}