"use client";

import { 
  Box, 
  Flex, 
  Text, 
  VStack, 
  Divider, 
  List, 
  ListItem,
  Link,
  Icon 
} from "@chakra-ui/react";
import { FaExternalLinkAlt, FaCode, FaBook, FaGraduationCap } from "react-icons/fa";

export default function OtherPage() {
  const relatedLinks = [
    {
      title: "清华大学教务处",
      url: "https://academic.tsinghua.edu.cn",
      description: "清华大学教务处官方网站，提供选课、成绩查询等服务",
      icon: FaGraduationCap
    },
    {
      title: "网络学堂",
      url: "https://learn.tsinghua.edu.cn",
      description: "清华大学网络学堂，用于课程资料获取和作业提交",
      icon: FaBook
    }
  ];

  const resources = [
    {
      category: "开发文档",
      items: [
        "React 18.0+ 前端框架",
        "Next.js 14 服务端框架",
        "Chakra UI 组件库",
        "TypeScript 类型系统"
      ]
    },
    {
      category: "技术支持",
      items: [
        "源代码开放获取",
        "技术文档完整",
        "问题追踪系统",
        "持续集成部署"
      ]
    },
    {
      category: "更新日志",
      items: [
        "2024.12 - v1.0.0 正式版发布",
        "2024.11 - v0.9.0 Beta测试版",
        "2024.10 - v0.5.0 Alpha测试版",
        "2024.09 - 项目启动"
      ]
    }
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
              其他信息
            </Text>
            <Text fontSize="md" color="gray.600" mt={2}>
              相关链接与补充说明
            </Text>
          </Box>

          <Divider />

          {/* 相关链接 */}
          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={3}>
              相关链接
            </Text>
            <VStack spacing={4} align="stretch">
              {relatedLinks.map((link, index) => (
                <Box 
                  key={index}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  _hover={{ boxShadow: "sm" }}
                >
                  <Flex align="center" mb={2}>
                    <Icon as={link.icon} color="teal.500" mr={2} />
                    <Link 
                      href={link.url}
                      isExternal
                      color="teal.500"
                      fontWeight="semibold"
                      display="flex"
                      alignItems="center"
                    >
                      {link.title}
                      <Icon as={FaExternalLinkAlt} ml={2} boxSize={3} />
                    </Link>
                  </Flex>
                  <Text color="gray.600" fontSize="sm">
                    {link.description}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* 技术资源 */}
          {resources.map((section, index) => (
            <Box key={index}>
              <Text fontSize="xl" fontWeight="semibold" mb={3}>
                {section.category}
              </Text>
              <List spacing={2}>
                {section.items.map((item, itemIndex) => (
                  <ListItem 
                    key={itemIndex}
                    color="gray.700"
                    display="flex"
                    alignItems="center"
                  >
                    <Icon as={FaCode} color="teal.500" mr={2} />
                    {item}
                  </ListItem>
                ))}
              </List>
              {index < resources.length - 1 && <Divider mt={4} />}
            </Box>
          ))}

          {/* 声明 */}
          <Box bg="gray.50" p={4} borderRadius="md" mt={4}>
            <Text color="gray.600" fontSize="sm">
              声明：本项目是清华大学软件学院2024年春季学期《软件工程》课程的大作业项目。
              所有功能仅供学习参考使用，请以教务系统为准进行实际选课操作。
            </Text>
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