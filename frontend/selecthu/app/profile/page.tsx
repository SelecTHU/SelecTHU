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
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/layout/Navbar";

interface User {
  nickname: string;
  avatar: string;
  department: string;
  grade: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User>({
    nickname: "User",
    avatar: "/default-avatar.png",
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
    if (avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Avatar = reader.result as string;
        const updatedUser: User = {
          ...user,
          nickname: newNickname.trim() || "User",
          department: newDepartment.trim(),
          grade: newGrade,
          avatar: base64Avatar,
        };
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
        nickname: newNickname.trim() || "User",
        department: newDepartment.trim(),
        grade: newGrade,
      };
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
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Navbar />
      
      <Container maxW="container.md" py={8}>
        <VStack
          spacing={6}
          align="stretch"
          bg={useColorModeValue("white", "gray.700")}
          p={8}
          borderRadius="lg"
          boxShadow="xl"
          w="100%"
        >
          {/* 头像设置 */}
          <FormControl>
            <FormLabel fontSize="lg" fontWeight="medium">头像</FormLabel>
            <VStack spacing={4} align="center">
              <Avatar size="2xl" src={user.avatar} name={user.nickname} />
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                width="auto"
                p={1}
              />
            </VStack>
          </FormControl>

          {/* 昵称设置 */}
          <FormControl>
            <FormLabel fontSize="lg" fontWeight="medium">昵称</FormLabel>
            <Input
              size="lg"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              placeholder="请输入昵称"
            />
          </FormControl>

          {/* 院系修改 */}
          <FormControl>
            <FormLabel fontSize="lg" fontWeight="medium">院系</FormLabel>
            <Input
              size="lg"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="请输入院系"
            />
          </FormControl>

          {/* 年级修改 */}
          <FormControl>
            <FormLabel fontSize="lg" fontWeight="medium">年级</FormLabel>
            <Select
              size="lg"
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

          <VStack spacing={4} mt={6}>
            {/* 保存按钮 */}
            <Button
              colorScheme="teal"
              onClick={handleSave}
              size="lg"
              width="100%"
              height="48px"
            >
              保存
            </Button>

            {/* 退出登录按钮 */}
            <Button
              colorScheme="red"
              onClick={handleLogout}
              size="lg"
              width="100%"
              height="48px"
              variant="outline"
            >
              退出登录
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}