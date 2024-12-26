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
import { signOut } from "next-auth/react"

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

  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Navbar />
      <Container maxW="md" py={8}>
        <VStack
          spacing={8}
          align="stretch"
          bg={bgColor}
          p={8}
          borderRadius="xl"
          boxShadow="xl"
          border="1px"
          borderColor={borderColor}
        >
          <FormControl>
            <VStack spacing={4} align="center">
              <Avatar size="2xl" src={user.avatar} name={user.nickname} />
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                display="none"
                id="avatar-upload"
              />
              <Button
                as="label"
                htmlFor="avatar-upload"
                colorScheme="teal"
                variant="outline"
                size="sm"
                cursor="pointer"
              >
                更换头像
              </Button>
            </VStack>
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">昵称</FormLabel>
            <Input
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              placeholder="请输入昵称"
              size="lg"
              borderRadius="md"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">院系</FormLabel>
            <Input
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="请输入院系"
              size="lg"
              borderRadius="md"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold">年级</FormLabel>
            <Select
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value)}
              placeholder="请选择年级"
              size="lg"
              borderRadius="md"
            >
              <option value="大一">大一</option>
              <option value="大二">大二</option>
              <option value="大三">大三</option>
              <option value="大四">大四</option>
              <option value="其他">其他</option>
            </Select>
          </FormControl>

          <VStack spacing={4} pt={4}>
            <Button
              colorScheme="teal"
              onClick={handleSave}
              width="full"
              size="lg"
              borderRadius="md"
            >
              保存
            </Button>
            <Button
              colorScheme="red"
              onClick={() => { signOut(); router.push("/login") } }
              width="full"
              size="lg"
              borderRadius="md"
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
