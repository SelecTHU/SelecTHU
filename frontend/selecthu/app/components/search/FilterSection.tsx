// app/components/search/FilterSection.tsx
"use client";

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  HStack,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

export interface Filter {
  type: string;
  value: string;
}

interface FilterSectionProps {
  selectedFilters: Filter[];
  addFilter: (filter: Filter) => void;
  searchCoursesAction: () => Promise<object>;
}

const filterOptions = [
  { label: "课程名称", value: "courseName" },
  { label: "开课院系", value: "department" },
  { label: "课程属性", value: "courseAttribute" },
  { label: "开课时间", value: "classTime" },
  { label: "授课教师", value: "instructor" },
];

const FilterSection: React.FC<FilterSectionProps> = ({ selectedFilters, addFilter, searchCoursesAction }) => {
  // 当前选中的筛选类型
  const [activeFilter, setActiveFilter] = useState<string>("");

  // 当前输入的筛选值
  const [inputValue, setInputValue] = useState<string>("");

  const boxBg = useColorModeValue("white", "gray.800");
  const filterBg = useColorModeValue("gray.100", "gray.700");

  // 处理筛选类型选择
  const handleFilterSelect = (type: string) => {
    setActiveFilter(type);
    setInputValue(""); // 切换类型时重置输入值
  };

  // 处理添加筛选条件
  const handleAddFilter = () => {
    if (activeFilter && inputValue.trim() !== "") {
      addFilter({ type: activeFilter, value: inputValue.trim() });
      setActiveFilter(""); // 添加后重置筛选类型
      setInputValue("");
    }
  };

  // 根据选择的筛选类型渲染对应的输入控件
  const renderFilterInput = () => {
    switch (activeFilter) {
      case "courseName":
        return (
          <FormControl mt={4}>
            <FormLabel>课程名称</FormLabel>
            <HStack>
              <Input
                placeholder="请输入课程名称"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                flex="1"
              />
              <Button
                colorScheme="blue"
                onClick={ async () => {
                    handleAddFilter()
                    const res = await searchCoursesAction()
                    console.log(res)
                }}
                isDisabled={inputValue.trim() === ""}
              >
                添加
              </Button>
            </HStack>
          </FormControl>
        );
      case "department":
        return (
          <FormControl mt={4}>
            <FormLabel>开课院系</FormLabel>
            <HStack>
              <Select
                placeholder="选择院系"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                flex="1"
              >
                <option value="computer">计算机学院</option>
                <option value="electrical">电气学院</option>
                <option value="mechanical">机械学院</option>
                {/* 其他院系选项 */}
              </Select>
              <Button
                colorScheme="blue"
                onClick={handleAddFilter}
                isDisabled={inputValue.trim() === ""}
              >
                添加
              </Button>
            </HStack>
          </FormControl>
        );
      case "courseAttribute":
        return (
          <FormControl mt={4}>
            <FormLabel>课程属性</FormLabel>
            <HStack>
              <Select
                placeholder="选择课程属性"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                flex="1"
              >
                <option value="mandatory">必修</option>
                <option value="elective">选修</option>
                {/* 其他属性选项 */}
              </Select>
              <Button
                colorScheme="blue"
                onClick={handleAddFilter}
                isDisabled={inputValue.trim() === ""}
              >
                添加
              </Button>
            </HStack>
          </FormControl>
        );
      case "classTime":
        return (
          <FormControl mt={4}>
            <FormLabel>开课时间</FormLabel>
            <HStack>
              <Input
                type="datetime-local"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                flex="1"
              />
              <Button
                colorScheme="blue"
                onClick={handleAddFilter}
                isDisabled={inputValue.trim() === ""}
              >
                添加
              </Button>
            </HStack>
          </FormControl>
        );
      case "instructor":
        return (
          <FormControl mt={4}>
            <FormLabel>授课教师</FormLabel>
            <HStack>
              <Input
                placeholder="请输入教师姓名"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                flex="1"
              />
              <Button
                colorScheme="blue"
                onClick={handleAddFilter}
                isDisabled={inputValue.trim() === ""}
              >
                添加
              </Button>
            </HStack>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      bg={boxBg}
      p={4}
      borderRadius="md"
      boxShadow="md"
      mb={4}
    >
      {/* 筛选类型选择部分 */}
      <HStack spacing={0} justify="flex-start" width="100%">
        {filterOptions.map((filter, index) => (
          <Box key={filter.value} textAlign="center">
            <Button
              variant={activeFilter === filter.value ? "solid" : "ghost"}
              colorScheme="blue"
              onClick={() => handleFilterSelect(filter.value)}
              size="sm"
            >
              {filter.label}
            </Button>
            {/* 除了最后一个选项，添加竖线分隔 */}
            {index < filterOptions.length - 1 && (
              <Divider
                orientation="vertical"
                height="24px"
                mx={2}
                borderColor={filterBg}
                display="inline-block"
                verticalAlign="middle"
              />
            )}
          </Box>
        ))}
      </HStack>

      {/* 横线分隔 */}
      <Divider my={4} />

      {/* 动态显示的输入控件 */}
      {renderFilterInput()}
    </Box>
  );
};

export default FilterSection;
