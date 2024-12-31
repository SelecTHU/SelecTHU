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
  searchCoursesAction: (filters: Filter[]) => Promise<any>;
}

const filterOptions = [
  { label: "课程名称", value: "courseName" },
  { label: "开课院系", value: "department" },
  // { label: "课程属性", value: "courseAttribute" },
  // { label: "开课时间", value: "classTime" },
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
      const filter = { type: activeFilter, value: inputValue.trim() };
      addFilter(filter);
      return [...selectedFilters, filter];
      setActiveFilter(""); // 添加后重置筛选类型
      setInputValue("");
    }
    return selectedFilters;
  };

  const handleSearch = async () => {
        const filters = handleAddFilter()
        console.log(filters)
        await searchCoursesAction(filters)
  }

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
                onClick={handleSearch}
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
                        <option value="建筑学院" title="建筑学院"> 建筑学院</option>
                        
                        <option value="城规系" title="城规系"> 城规系</option>
                        
                        <option value="建筑系" title="建筑系"> 建筑系</option>
                        
                        <option value="土木系" title="土木系"> 土木系</option>
                        
                        <option value="水利系" title="水利系"> 水利系</option>
                        
                        <option value="环境学院" title="环境学院"> 环境学院</option>
                        
                        <option value="机械系" title="机械系"> 机械系</option>
                        
                        <option value="精仪系" title="精仪系"> 精仪系</option>
                        
                        <option value="能动系" title="能动系"> 能动系</option>
                        
                        <option value="车辆学院" title="车辆学院"> 车辆学院</option>
                        
                        <option value="工业工程系" title="工业工程系"> 工业工程系</option>
                        
                        <option value="电机系" title="电机系"> 电机系</option>
                        
                        <option value="电子系" title="电子系"> 电子系</option>
                        
                        <option value="计算机系" title="计算机系"> 计算机系</option>
                        
                        <option value="自动化系" title="自动化系"> 自动化系</option>
                        
                        <option value="集成电路学院" title="集成电路学院"> 集成电路学院</option>
                        
                        <option value="航院" title="航院"> 航院</option>
                        
                        <option value="工物系" title="工物系"> 工物系</option>
                        
                        <option value="化工系" title="化工系"> 化工系</option>
                        
                        <option value="材料学院" title="材料学院"> 材料学院</option>
                        
                        <option value="数学系" title="数学系"> 数学系</option>
                        
                        <option value="物理系" title="物理系"> 物理系</option>
                        
                        <option value="化学系" title="化学系"> 化学系</option>
                        
                        <option value="生命学院" title="生命学院"> 生命学院</option>
                        
                        <option value="地学系" title="地学系"> 地学系</option>
                        
                        <option value="交叉信息院" title="交叉信息院"> 交叉信息院</option>
                        
                        <option value="高研院" title="高研院"> 高研院</option>
                        
                        <option value="经管学院" title="经管学院"> 经管学院</option>
                        
                        <option value="公管学院" title="公管学院"> 公管学院</option>
                        
                        <option value="金融学院" title="金融学院"> 金融学院</option>
                        
                        <option value="中文系" title="中文系"> 中文系</option>
                        
                        <option value="外文系" title="外文系"> 外文系</option>
                        
                        <option value="法学院" title="法学院"> 法学院</option>
                        
                        <option value="新闻学院" title="新闻学院"> 新闻学院</option>
                        
                        <option value="马克思主义学院" title="马克思主义学院"> 马克思主义学院</option>
                        
                        <option value="人文学院" title="人文学院"> 人文学院</option>
                        
                        <option value="社科学院" title="社科学院"> 社科学院</option>
                        
                        <option value="体育部" title="体育部"> 体育部</option>
                        
                        <option value="图书馆" title="图书馆"> 图书馆</option>
                        
                        <option value="艺教中心" title="艺教中心"> 艺教中心</option>
                        
                        <option value="美术学院" title="美术学院"> 美术学院</option>
                        
                        <option value="统计系" title="统计系"> 统计系</option>
                        
                        <option value="土水学院" title="土水学院"> 土水学院</option>
                        
                        <option value="建管系" title="建管系"> 建管系</option>
                        
                        <option value="天文系" title="天文系"> 天文系</option>
                        
                        <option value="安全学院" title="安全学院"> 安全学院</option>
                        
                        <option value="心理系" title="心理系"> 心理系</option>
                        
                        <option value="卫健学院" title="卫健学院"> 卫健学院</option>
                        
                        <option value="苏世民书院" title="苏世民书院"> 苏世民书院</option>
                        
                        <option value="建筑技术" title="建筑技术"> 建筑技术</option>
                        
                        <option value="核研院" title="核研院"> 核研院</option>
                        
                        <option value="教研院" title="教研院"> 教研院</option>
                        
                        <option value="训练中心" title="训练中心"> 训练中心</option>
                        
                        <option value="电工电子中心" title="电工电子中心"> 电工电子中心</option>
                        
                        <option value="学生部" title="学生部"> 学生部</option>
                        
                        <option value="武装部" title="武装部"> 武装部</option>
                        
                        <option value="教务处" title="教务处"> 教务处</option>
                        
                        <option value="研究生院" title="研究生院"> 研究生院</option>
                        
                        <option value="深研生院" title="深研生院"> 深研生院</option>
                        
                        <option value="校医院" title="校医院"> 校医院</option>
                        
                        <option value="医学院 " title="医学院 "> 医学院 </option>
                        
                        <option value="药学院" title="药学院"> 药学院</option>
                        
                        <option value="临床医学院" title="临床医学院"> 临床医学院</option>
                        
                        <option value="软件学院" title="软件学院"> 软件学院</option>
                        
                        <option value="网络研究院" title="网络研究院"> 网络研究院</option>
                        
                        <option value="地区研究院" title="地区研究院"> 地区研究院</option>
                        
                        <option value="航发院" title="航发院"> 航发院</option>
                        
                        <option value="语言中心" title="语言中心"> 语言中心</option>
                        
                        <option value="新雅书院" title="新雅书院"> 新雅书院</option>
                        
                        <option value="致理书院" title="致理书院"> 致理书院</option>
                        
                        <option value="日新书院" title="日新书院"> 日新书院</option>
                        
                        <option value="未央书院" title="未央书院"> 未央书院</option>
                        
                        <option value="行健书院" title="行健书院"> 行健书院</option>
                        
                        <option value="求真书院" title="求真书院"> 求真书院</option>
                        
                        <option value="为先书院" title="为先书院"> 为先书院</option>
                        
                        <option value="秀钟书院" title="秀钟书院"> 秀钟书院</option>
                        
                        <option value="笃实书院" title="笃实书院"> 笃实书院</option>
                        
                        <option value="工程师学院" title="工程师学院"> 工程师学院</option>
                        
                        <option value="数学教学中心" title="数学教学中心"> 数学教学中心</option>
                        
                        <option value="医学院" title="医学院"> 医学院</option>
                        
                        <option value="基础医学院" title="基础医学院"> 基础医学院</option>
                        
                        <option value="生医工程学院" title="生医工程学院"> 生医工程学院</option>
                        
                        <option value="国际研究生院" title="国际研究生院"> 国际研究生院</option>
                        
                        <option value="清华-伯克利深圳学院" title="清华-伯克利深圳学院"> 清华-伯克利深圳学院</option>
                        
                        <option value="清华大学全球创新学院" title="清华大学全球创新学院"> 清华大学全球创新学院</option>
                {/* 其他院系选项 */}
              </Select>
              <Button
                colorScheme="blue"
                onClick={handleSearch}
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
                onClick={handleSearch}
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
                onClick={handleSearch}
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
                onClick={handleSearch}
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
