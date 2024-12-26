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
import { getAIMessage, getUserData } from "./actions";

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
  const [scheduleFlag, setScheduleFlag] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      if (data) {
        setUserData(data);
      }
    };

    fetchUserData();
  }, []);

  const formatUserSchedule = () => {
    if (!userData) return '';

    let scheduleText = "我的课程信息：\n";
    
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

    if (userData["courses-favorite"].length > 0) {
      scheduleText += "\n收藏课程：\n";
      userData["courses-favorite"].forEach((course, index) => {
        scheduleText += `${index + 1}. ${course.name} (${course.code})\n`;
      });
    }

    return scheduleText;
  };

  const handleSendMessage = async (content: string) => {
    const messageContent = scheduleFlag === 1
      ? `${formatUserSchedule()}\n\n${content}` 
      : content;
  
    const fullContent = `${messageContent}\n\n请不要输出markdown格式，并且输出控制在200字以内`;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      type: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
  
    try {
      const aiMessage = await getAIMessage(fullContent);
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
      
      <Container maxW="container.xl" py={5} h="calc(100vh - 64px)" position="relative">
        <Grid 
          templateColumns="repeat(12, 1fr)" 
          gap={4} 
          h="full"
          maxH="calc(100vh - 64px - 40px)"
        >
          <GridItem 
            colSpan={{ base: 12, lg: 8 }} 
            h="full"
            position="relative"
            display="flex"
            flexDirection="column"
          >
            <VStack spacing={4} h="full">
              <Box 
                ref={chatContainerRef}
                flex="1"
                w="full" 
                overflowY="auto"
                position="relative"
                maxH="calc(100vh - 64px - 40px - 120px)"
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
              <Box 
                w="full" 
                position="sticky" 
                bottom={0} 
                bg={useColorModeValue("gray.50", "gray.900")} 
                pt={2}
                minH="100px"
              >
                <Checkbox
                  mb={2}
                  isChecked={includeSchedule}
                  onChange={(e) => {
                    setIncludeSchedule(e.target.checked);
                    setScheduleFlag(e.target.checked ? 1 : 0);
                  }}
                  colorScheme="blue"
                >
                  使用我的课表信息
                </Checkbox>
                <ChatInput 
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSendMessage}
                  onClear={handleClearChat}
                />
              </Box>
            </VStack>
          </GridItem>

          <GridItem 
            colSpan={{ base: 12, lg: 4 }} 
            h="full"
            overflowY="auto"
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