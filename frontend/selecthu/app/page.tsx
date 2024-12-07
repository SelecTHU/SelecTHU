"use client";

// 引入必要的React hooks和Chakra UI组件
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // 初始化路由器和状态变量
  const router = useRouter();
  const [account, setAccount] = useState(""); // 账号状态
  const [password, setPassword] = useState(""); // 密码状态
  const [remember, setRemember] = useState(false); // 记住密码复选框状态

  // 处理登录按钮点击事件
  const handleLogin = () => {
    router.push("/main"); // 登录后跳转到主页
  };

  useEffect(() => {
    async function fetchTest() {
      let res = await fetch("http://localhost:8080/api/v1/backend-db-status/")
      let data = await res.json()
      return data
    }

    fetchTest().then(data => console.log(data));
  }, []);

  return (
    // 整体页面容器：居中布局，浅蓝色背景
    <Flex
      minHeight="100vh"
      width="100%"
      direction="column"
      alignItems="center"
      justifyContent="center"
      bg="brand.50"
      pb={8}
    >


      {/* 登录表单白色卡片容器 */}
      <Box
        bg="white"
        p={8}
        maxWidth="400px"
        width="90%"
        borderRadius="md"
        boxShadow="lg"
        mb={6}
      >
        {/* 表单内容垂直排列 */}
        <VStack spacing={4} align="stretch">
          {/* 登录标题 */}
          <Text fontWeight="bold" fontSize="2xl" textAlign="center" mb={4} color="brand.500">
            SelecTHU · 清华选课助手
          </Text>
          {/* 账号输入框 */}
          <FormControl id="account">
            <FormLabel>账号</FormLabel>
            <Input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="请输入账号"
            />
          </FormControl>
          {/* 密码输入框 */}
          <FormControl id="password">
            <FormLabel>密码</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </FormControl>
          {/* 记住密码复选框 */}
          <Flex alignItems="center" justifyContent="space-between">
            <Checkbox
              isChecked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              colorScheme="purpleAccent"
            >
              记住密码
            </Checkbox>
          </Flex>
          {/* 登录按钮 */}
          <Button colorScheme="brand" onClick={handleLogin}>
            登录
          </Button>
        </VStack>
      </Box>

      {/* 页脚链接部分 */}
      <Flex
        justifyContent="center"
        color="gray.500"
        fontSize="sm"
        flexWrap="wrap"
      >
        <Link href="/info/about" mx={2}>关于我们</Link>
        <Text mx={2}>|</Text>
        <Link href="/info/contact" mx={2}>联系我们</Link>
        <Text mx={2}>|</Text>
        <Link href="/info/help" mx={2}>帮助中心</Link>
        <Text mx={2}>|</Text>
        <Link href="/info/privacy" mx={2}>隐私条款</Link>
        <Text mx={2}>|</Text>
        <Link href="/info/agreement" mx={2}>用户协议</Link>
        <Text mx={2}>|</Text>
        <Link href="/info/other" mx={2}>其他</Link>
      </Flex>

      {/* 版权信息 */}
      <Text
        textAlign="center"
        color="gray.500"
        fontSize="sm"
        mt={4}
      >
        @清华大学软件学院
      </Text>
    </Flex>
  );
}
