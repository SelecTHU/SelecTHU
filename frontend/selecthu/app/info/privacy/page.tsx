"use client";

import { Box, Flex, Text, VStack, Divider } from "@chakra-ui/react";

export default function PrivacyPage() {
  const privacyContent = [
    {
      title: "信息收集",
      content: `我们收集的信息类型包括：
        • 账号信息：您的清华大学统一身份认证信息
        • 使用数据：您在使用本服务时的选课记录、操作历史等
        • 设备信息：浏览器类型、访问时间、设备型号等基本信息`
    },
    {
      title: "信息使用",
      content: `我们使用收集的信息：
        • 提供选课模拟和课程推荐服务
        • 改进和优化用户体验
        • 进行必要的系统维护和故障排除
        • 开展匿名统计和学术研究`
    },
    {
      title: "信息保护",
      content: `我们采取以下措施保护您的信息：
        • 使用加密技术保护数据传输和存储
        • 严格限制访问权限，只有授权人员才能访问用户数据
        • 定期进行安全评估和系统升级
        • 所有数据存储在清华大学校内服务器`
    },
    {
      title: "信息共享",
      content: `在以下情况下，我们可能会共享您的信息：
        • 经过您的明确授权
        • 根据法律法规要求必须提供
        • 向大模型服务提供商提供必要的课程信息（不包含个人身份信息）`
    },
    {
      title: "用户权利",
      content: `您对自己的个人信息拥有以下权利：
        • 访问和查看个人信息
        • 更正或更新个人信息
        • 删除个人信息
        • 拒绝或限制信息处理
        • 导出个人数据`
    },
    {
      title: "Cookie 使用",
      content: `我们使用 Cookie 技术：
        • 维持用户登录状态
        • 记住用户偏好设置
        • 提供个性化服务
        • 改善网站性能
        • 使用你的曲奇`
    },
    {
      title: "隐私政策更新",
      content: `我们保留随时更新本隐私政策的权利：
        • 重大变更会通过网站公告通知
        • 继续使用本服务即表示同意更新后的隐私政策
        • 更新记录将在本页面保持透明`
    },
    {
      title: "联系我们",
      content: `如果您对隐私政策有任何疑问：
        • 请访问我们的 GitHub 仓库提交 Issue
        • 或通过团队成员的 GitHub 账号联系我们`
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
              隐私条款
            </Text>
            <Text fontSize="md" color="gray.600" mt={2}>
              生效日期：2024年12月25日
            </Text>
          </Box>

          <Text color="gray.700" lineHeight="tall">
            SelecTHU（以下简称“我们”）非常重视用户的隐私保护。本隐私政策说明我们如何收集、使用和保护您的个人信息。
            使用我们的服务即表示您同意本隐私政策的内容。
          </Text>

          <Divider />

          {/* 隐私政策详细内容 */}
          {privacyContent.map((section, index) => (
            <Box key={index}>
              <Text fontSize="xl" fontWeight="semibold" mb={3}>
                {section.title}
              </Text>
              <Text 
                color="gray.700" 
                whiteSpace="pre-line" 
                lineHeight="tall"
              >
                {section.content}
              </Text>
              {index < privacyContent.length - 1 && <Divider mt={4} />}
            </Box>
          ))}

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
