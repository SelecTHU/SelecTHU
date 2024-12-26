"use client";

import { Box, Flex, Text, VStack, Link, Divider, List, ListItem, ListIcon } from "@chakra-ui/react";
import { FaGithub, FaCode, FaUsers, FaBookOpen, FaRobot } from "react-icons/fa";

export default function AboutPage() {
  const teamMembers = [
    "Zaytsev - 前端开发",
    "Syllina - 前端开发",
    "ShYuF - 后端开发",
    "TalkIsCheap22 - API开发",
    // 请替换为实际的团队成员信息
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
          {/* 项目标题 */}
          <Box textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color="teal.600">
              SelecTHU
            </Text>
            <Text fontSize="md" color="gray.600" mt={2}>
              清华大学选课系统优化项目
            </Text>
          </Box>

          <Divider />

          {/* 项目简介 */}
          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={3}>
              项目简介
            </Text>
            <Text color="gray.700" lineHeight="tall">
              SelecTHU 是清华大学软件学院 2024 年春季学期《软件工程》课程的大作业项目。
              本项目提供了模拟选课、模拟课表搭配、大模型交互等功能，旨在优化现有的选课系统，提供更好的用户体验和更高效的选课流程。
            </Text>
          </Box>

          {/* 主要功能 */}
          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={3}>
              主要功能
            </Text>
            <List spacing={2}>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaBookOpen} color="teal.500" />
                课程可视化展示与管理
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaUsers} color="teal.500" />
                多志愿选课系统
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaCode} color="teal.500" />
                直观的拖拽操作界面
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={FaRobot} color="teal.500" />
                基于大模型的智能选课推荐
              </ListItem>
            </List>
          </Box>

          {/* 技术栈 */}
          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={3}>
              技术栈
            </Text>
            <Text color="gray.700">
              前端：React, Next.js, Chakra UI, TypeScript
              <br />
              后端：Node.js, Express, MongoDB
              <br />
              部署：Docker, GitHub Actions
            </Text>
          </Box>

          {/* 项目链接 */}
          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={3}>
              项目链接
            </Text>
            <Link 
              href="https://github.com/SelecTHU/SelecTHU" 
              isExternal
              display="flex"
              alignItems="center"
              color="teal.500"
              _hover={{ color: "teal.600" }}
            >
              <FaGithub style={{ marginRight: '8px' }} />
              GitHub 仓库
            </Link>
          </Box>


          {/* 开发团队 */}
          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={3}>
              开发团队
            </Text>
            <List spacing={2}>
              {teamMembers.map((member, index) => (
                <ListItem key={index} color="gray.700">
                  {member}
                </ListItem>
              ))}
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