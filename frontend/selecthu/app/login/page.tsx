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
import { handleLogin } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTest() {
      let res = await fetch(
        // "http://selecthu.shyuf.cn:8000/api/v1/backend-db-status/"
        process.env.BACKEND_URL + "/backend-db-status"
      );
      let data = await res.json();
      return data;
    }

    fetchTest().then((data) => console.log(data));
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
          <Text
            fontWeight="bold"
            fontSize="2xl"
            textAlign="center"
            mb={4}
            color="brand.500"
          >
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
                用户协议
              </Text>
            </Flex>
          </Flex>
          <Button
            colorScheme="brand"
            onClick={async () => {
              const res = await handleLogin();
              if (res?.error) {
                console.log(res.error);
              } else {
                router.push("/main");
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
        <Link href="/info/about" mx={2}>
          关于我们
        </Link>
        <Text mx={2}>|</Text>
        <Link href="/info/contact" mx={2}>
          联系我们
        </Link>
        <Text mx={2}>|</Text>
        <Link href="/info/help" mx={2}>
          帮助中心
        </Link>
        <Text mx={2}>|</Text>
        <Link href="/info/privacy" mx={2}>
          隐私条款
        </Link>
        <Text mx={2}>|</Text>
        <Link href="/info/agreement" mx={2}>
          用户协议
        </Link>
        <Text mx={2}>|</Text>
        <Link href="/info/other" mx={2}>
          其他
        </Link>
      </Flex>

      <Text textAlign="center" color="gray.500" fontSize="sm" mt={4}>
      © 2024 SelecTHU Team. All rights reserved.
</Text>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>用户条款</ModalHeader>
          <ModalCloseButton />
          <ModalBody css={{ whiteSpace: "pre-line" }}>
            <Text fontSize="sm" lineHeight="1.7">
              {`用户条款与服务协议

          生效日期：2024年12月25日

          欢迎使用SelecTHU清华选课助手（以下简称"本服务"）。请您在使用本服务前仔细阅读以下全部内容。

          1. 服务条款的确认和接纳
              1.1 本服务的所有权和运营权归清华大学软件学院所有。
              1.2 用户通过勾选"同意用户条款"并使用本服务，即表示用户完全接受本条款的所有内容。
              1.3 本协议可由运营团队随时更新，更新后的协议条款一旦公布即代替原来的条款。
              1.4 本协议的最终解释权归本服务运营团队所有。

          2. 服务内容与说明
              2.1 本服务为用户提供清华大学选课系统的模拟环境，包括但不限于选课模拟、课程查询等功能。
              2.2 本服务仅作为辅助工具，不会影响用户在教务系统中的实际选课情况。用户需要前往清华大学教务网站
                  (academic.tsinghua.edu.cn)进行正式选课。
              2.3 本服务的身份验证信息来源于清华大学网络学堂，课程信息来源于清华大学选课系统。
              2.4 本服务不保证与实际选课系统完全一致，所有功能仅供参考使用。
              2.5 本服务保留随时修改或中断服务而无需通知用户的权利。
              2.6 本服务不对因网络、系统故障、数据更新延迟等造成的任何损失承担责任。

          3. 用户隐私保护
              3.1 本服务将严格保护用户隐私信息，包括但不限于用户名、密码等账号信息。
              3.2 未经用户同意，本服务不会向任何第三方披露用户个人信息。
              3.3 在用户使用基于人工智能的课程推荐功能时，本服务会将必要的选课信息（如课程编号、课程名称等）
                  发送给相应的大模型服务提供商。这些信息不包含用户的个人身份信息。
              3.4 本服务承诺不会向任何组织或个人透露用户的个人身份信息。
              3.5 本服务会采取合理的技术手段保护用户的个人信息安全。

          4. 用户行为规范
              4.1 用户应遵守中华人民共和国相关法律法规。
              4.2 用户不得利用本服务进行任何可能对互联网或移动网正常运转造成不利影响的行为。
              4.3 用户不得利用本服务传播任何违法、有害、胁迫、骚扰、侵害、中伤、粗俗、猥亵等信息。
              4.4 用户不得尝试破解、修改或干扰本服务的正常运行。

          5. 知识产权声明
              5.1 本服务的所有内容，包括但不限于文字、图片、代码、界面设计、版面框架均受知识产权法律法规保护。
              5.2 未经本服务运营团队书面许可，用户不得复制、修改、传播或使用本服务的任何内容。

          6. 免责声明
              6.1 本服务仅供学习参考，不作为实际选课依据。
              6.2 本服务展示的课程信息可能存在延迟或不准确，用户应以教务系统显示的信息为准。
              6.3 用户因使用本服务而产生的任何直接、间接、偶然、特殊及后续的损害，本服务不承担任何责任。
              6.4 对于因不可抗力或非本服务可控的原因造成的服务中断或其他缺陷，本服务不承担任何责任。

          7. 协议终止
              7.1 本服务有权在用户违反本协议时终止对该用户的服务。
              7.2 用户可以随时停止使用本服务。

          8. 法律适用
              8.1 本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。
              8.2 如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。

          如果您对本协议有任何疑问，请联系我们的运营团队。

          电子邮件：chay22@mails.tsinghua.edu.cn`}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => setIsModalOpen(false)}
            >
              关闭
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
