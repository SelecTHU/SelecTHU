// app/login/page.tsx

"use client";

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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { handleLogin } from "./actions"

export default function LoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTest() {
      let res = await fetch("http://selecthu.shyuf.cn:8000/api/v1/backend-db-status/")
      let data = await res.json()
      return data
    }

    fetchTest().then(data => console.log(data));
  }, []);

  return (
    <Flex
      minHeight="100vh"
      width="100%"
      direction="column"
      alignItems="center"
      justifyContent="center"
      bg="brand.50"
      pb={8}
    >
      <Box
        bg="white"
        p={8}
        maxWidth="400px"
        width="90%"
        borderRadius="md"
        boxShadow="lg"
        mb={6}
      >
        <VStack spacing={4} align="stretch">
          <Text fontWeight="bold" fontSize="2xl" textAlign="center" mb={4} color="brand.500">
            SelecTHU · 清华选课助手
          </Text>
          <FormControl id="account">
            <FormLabel>账号</FormLabel>
            <Input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="请输入账号"
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>密码</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </FormControl>
          <Flex alignItems="center" justifyContent="space-between">
            <Checkbox
              isChecked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              colorScheme="purpleAccent"
            >
              记住密码
            </Checkbox>
            <Flex alignItems="center">
              <Checkbox
                isChecked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
                colorScheme="purpleAccent"
              >
                同意
              </Checkbox>
              <Text
                ml={1}
                color="blue.500"
                cursor="pointer"
                textDecoration="underline"
                onClick={() => setIsModalOpen(true)}
              >
                用户条款
              </Text>
            </Flex>
          </Flex>
          <Button 
            colorScheme="brand" 
            onClick={async () => {
              const res = await handleLogin()
              if (res?.error) {
                  console.log(res.error)
              }
              else {
                  router.push("/main")
              }
            }}
            isDisabled={!agreement}
          >
            登录
          </Button>
        </VStack>
      </Box>

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

      <Text
        textAlign="center"
        color="gray.500"
        fontSize="sm"
        mt={4}
      >
        @清华大学软件学院
      </Text>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>用户条款</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              1. 服务条款的确认和接纳
              <br /><br />
              本网站的各项内容和服务的所有权归清华大学软件学院所有。用户在接受本网站服务之前，请务必仔细阅读本条款。用户使用本网站的服务即表示用户完全接受本服务条款。
              <br /><br />
              2. 服务内容
              <br /><br />
              本网站为用户提供选课辅助服务。本网站保留随时修改或中断服务而不需告知用户的权利。
              <br /><br />
              3. 用户隐私制度
              <br /><br />
              本网站将严格保护用户隐私，未经用户同意不会向第三方披露用户个人信息。
              {/* 可以继续添加更多条款内容 */}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setIsModalOpen(false)}>
              关闭
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}