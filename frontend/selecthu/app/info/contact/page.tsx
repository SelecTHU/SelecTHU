"use client";

import { 
  Box, 
  Flex, 
  Text, 
  VStack, 
  Link, 
  Divider, 
  List, 
  ListItem,
  SimpleGrid,
  Icon
} from "@chakra-ui/react";
import { FaGithub, FaUser, FaCode } from "react-icons/fa";

export default function ContactPage() {
  const teamContacts = [
    {
      name: "ZaytsevZY",
      role: "前端开发",
      github: "https://github.com/ZaytsevZY"
    },
    {
      name: "Syllina", 
      role: "前端开发",
      github: "https://github.com/Syllina"
    },
    {
      name: "ShYuF",
      role: "后端开发", 
      github: "https://github.com/ShYuF"
    },
    {
      name: "TalkIsCheap22",
      role: "API开发",
      github: "https://github.com/TalkIsCheap22" 
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
              联系我们
            </Text>
            <Text fontSize="md" color="gray.600" mt={2}>
              SelecTHU 开发团队联系方式
            </Text>
          </Box>

          <Divider />

          {/* 项目仓库 */}
          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={3}>
              项目仓库
            </Text>
            <Link 
              href="https://github.com/SelecTHU/SelecTHU" 
              isExternal
              display="flex"
              alignItems="center"
              color="teal.500"
              _hover={{ color: "teal.600" }}
            >
              <Icon as={FaGithub} mr={2} />
              GitHub: SelecTHU/SelecTHU
            </Link>
          </Box>

          {/* 团队成员联系方式 */}
          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={4}>
              团队成员
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {teamContacts.map((member, index) => (
                <Box 
                  key={index} 
                  p={4} 
                  borderRadius="md" 
                  borderWidth="1px"
                  borderColor="gray.200"
                  _hover={{ boxShadow: "sm" }}
                >
                  <VStack align="stretch" spacing={2}>
                    <Flex align="center">
                      <Icon as={FaUser} color="teal.500" mr={2} />
                      <Text fontWeight="bold">{member.name}</Text>
                    </Flex>
                    <Flex align="center">
                      <Icon as={FaCode} color="teal.500" mr={2} />
                      <Text color="gray.600">{member.role}</Text>
                    </Flex>
                    <Link 
                      href={member.github} 
                      isExternal
                      display="flex"
                      alignItems="center"
                      color="teal.500"
                      _hover={{ color: "teal.600" }}
                    >
                      <Icon as={FaGithub} mr={2} />
                      {member.github.replace('https://github.com/', '@')}
                    </Link>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* 问题反馈 */}
          <Box>
            <Text fontSize="xl" fontWeight="semibold" mb={3}>
              问题反馈
            </Text>
            <Text color="gray.700">
              如果您在使用过程中遇到任何问题，欢迎：
            </Text>
            <List spacing={2} mt={2}>
              <ListItem>
                1. 在 GitHub 仓库提交 Issue
              </ListItem>
              <ListItem>
                2. 通过 GitHub 联系开发团队成员
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