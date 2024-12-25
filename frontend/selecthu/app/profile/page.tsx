// frontend/selecthu/app/profile/page.tsx
"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Avatar,
  HStack,
  Select,
  useToast,
  Grid,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/layout/Navbar";

import { signOut } from "next-auth/react"

interface User {
  nickname: string;
  avatar: string; // base64字符串或图片URL
  department: string;
  grade: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User>({
    nickname: "User", // 设置默认昵称为 "User"
    avatar: "/default-avatar.png", // 设置默认头像路径，可根据实际情况调整
    department: "",
    grade: "",
  });
  const [newNickname, setNewNickname] = useState("User");
  const [newDepartment, setNewDepartment] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    // 从localStorage中获取用户信息
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      setNewNickname(parsedUser.nickname || "User");
      setNewDepartment(parsedUser.department);
      setNewGrade(parsedUser.grade);
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    // 处理头像上传
    if (avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Avatar = reader.result as string;
        const updatedUser: User = {
          ...user,
          nickname: newNickname.trim() || "User", // 确保昵称不为空
          department: newDepartment.trim(),
          grade: newGrade,
          avatar: base64Avatar,
        };
        // 更新localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast({
          title: "保存成功",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      };
      reader.readAsDataURL(avatarFile);
    } else {
      const updatedUser: User = {
        ...user,
        nickname: newNickname.trim() || "User", // 确保昵称不为空
        department: newDepartment.trim(),
        grade: newGrade,
      };
      // 更新localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast({
        title: "保存成功",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {

    // 清除localStorage中的用户信息
    localStorage.removeItem("user");
    // 跳转到登录界面
    router.push("/");
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Navbar />

      <Box p={4}>
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          {/* 左侧区域：头像和基本信息 */}
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <VStack spacing={6} align="start" bg={useColorModeValue("white", "gray.700")} p={6} borderRadius="md" boxShadow="md">
              {/* 头像设置 */}
              <FormControl>
                <FormLabel>头像</FormLabel>
                <HStack spacing={4}>
                  <Avatar size="xl" src={user.avatar} name={user.nickname} />
                  <Input type="file" accept="image/*" onChange={handleAvatarChange} />
                </HStack>
              </FormControl>

              {/* 昵称设置 */}
              <FormControl>
                <FormLabel>昵称</FormLabel>
                <Input
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="请输入昵称"
                />
              </FormControl>

              {/* 院系修改 */}
              <FormControl>
                <FormLabel>院系</FormLabel>
                <Input
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  placeholder="请输入院系"
                />
              </FormControl>

              {/* 年级修改 */}
              <FormControl>
                <FormLabel>年级</FormLabel>
                <Select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  placeholder="请选择年级"
                >
                  <option value="大一">大一</option>
                  <option value="大二">大二</option>
                  <option value="大三">大三</option>
                  <option value="大四">大四</option>
                  <option value="其他">其他</option>
                </Select>
              </FormControl>

              {/* 保存按钮 */}
              <Button colorScheme="teal" onClick={handleSave} width="full">
                保存
              </Button>

              {/* 退出登录按钮 */}
              <Button colorScheme="red" onClick={() => { signOut(); router.push("/login") } } width="full">
                退出登录
              </Button>
            </VStack>
          </GridItem>

          {/* 右侧区域：其他信息或占位 */}
          <GridItem colSpan={{ base: 12, md: 8 }}>
            {/* 您可以在这里添加更多内容，例如用户详细信息、活动记录等 */}
            <Box bg={useColorModeValue("white", "gray.700")} p={6} borderRadius="md" boxShadow="md">
              <VStack align="start" spacing={4}>
                <Box fontSize="xl" fontWeight="bold">个人信息</Box>
                <Box>
                  <strong>昵称:</strong> {user.nickname}
                </Box>
                <Box>
                  <strong>院系:</strong> {user.department || "未填写"}
                </Box>
                <Box>
                  <strong>年级:</strong> {user.grade || "未填写"}
                </Box>
                {/* 其他信息可以在这里添加 */}
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
