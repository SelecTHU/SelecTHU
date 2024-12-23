"use client";

import { 
  Box, 
  Flex, 
  Text, 
  VStack, 
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Divider,
  Icon
} from "@chakra-ui/react";
import { FaQuestionCircle, FaCheckCircle } from "react-icons/fa";

export default function HelpPage() {
  const faqs = [
    {
      question: "如何开始使用?",
      answer: [
        "1. 使用清华大学统一身份认证登录系统",
        "2. 在主页面查看可选课程列表",
        "3. 使用拖拽功能将课程添加到课表中",
        "4. 点击保存按钮提交选课结果"
      ]
    },
    {
      question: "如何使用课表拖拽功能?",
      answer: [
        "1. 在左侧课程列表中找到想要选择的课程",
        "2. 点击并按住课程卡片",
        "3. 将课程拖拽到右侧课表的对应时间段",
        "4. 松开鼠标完成课程添加"
      ]
    },
    {
      question: "如何使用大模型推荐功能?",
      answer: [
        "1. 点击页面右上角的AI推荐按钮",
        "2. 输入你的选课偏好（如:专业方向、兴趣爱好等）",
        "3. 等待系统根据你的偏好生成推荐课程列表",
        "4. 从推荐列表中选择你感兴趣的课程"
      ]
    },
    {
      question: "如何处理课程时间冲突?",
      answer: [
        "1. 系统会自动检测时间冲突",
        "2. 冲突的课程会以红色标识显示",
        "3. 需要手动调整或删除冲突的课程",
        "4. 确保所有课程时间都不重叠后才能保存"
      ]
    },
    {
      question: "选课结果如何保存?",
      answer: [
        "1. 完成课程安排后点击保存按钮",
        "2. 系统会自动检查课程冲突和学分限制",
        "3. 如果没有问题,选课结果会立即保存",
        "4. 可以随时修改和更新选课结果"
      ]
    }
  ];

  const features = [
    "课表可视化展示",
    "拖拽式课程管理",
    "智能课程推荐",
    "多课表方案对比",
    "选课冲突检测"
  ];

  return (
    <Flex
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      py={8}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        maxWidth="800px"
        width="90%"
      >
        <VStack spacing={6} align="stretch">
          {/* 标题 */}
          <Box textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="teal.600">
              帮助中心
            </Text>
            <Text fontSize="md" color="gray.600" mt={2}>
              SelecTHU 使用指南
            </Text>
          </Box>

          <Divider />

          {/* 主要功能 */}
          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={3}>
              主要功能
            </Text>
            <List spacing={2}>
              {features.map((feature, index) => (
                <ListItem key={index} display="flex" alignItems="center">
                  <ListIcon as={FaCheckCircle} color="teal.500" />
                  {feature}
                </ListItem>
              ))}
            </List>
          </Box>

          {/* 常见问题 */}
          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={3}>
              常见问题
            </Text>
            <Accordion allowMultiple>
              {faqs.map((faq, index) => (
                <AccordionItem key={index}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <Flex align="center">
                          <Icon as={FaQuestionCircle} color="teal.500" mr={2} />
                          {faq.question}
                        </Flex>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <List spacing={2}>
                      {faq.answer.map((step, stepIndex) => (
                        <ListItem key={stepIndex} color="gray.700">
                          {step}
                        </ListItem>
                      ))}
                    </List>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>

          {/* 使用提示 */}
          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={3}>
              使用提示
            </Text>
            <List spacing={2}>
              <ListItem color="gray.700">
                • 建议使用最新版本的Chrome、Firefox或Safari浏览器
              </ListItem>
              <ListItem color="gray.700">
                • 确保浏览器启用了JavaScript
              </ListItem>
              <ListItem color="gray.700">
                • 保持网络连接稳定
              </ListItem>
              <ListItem color="gray.700">
                • 定期保存选课结果
              </ListItem>
            </List>
          </Box>

          {/* 版权信息 */}
          <Box textAlign="center" pt={4}>
            <Text fontSize="sm" color="gray.500">
              © 2024 SelecTHU Team. All rights reserved.
            </Text>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
}