// app/main/page.tsx

"use client";

import { useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  useColorModeValue,
  Button,
  Flex,
} from "@chakra-ui/react";
import Navbar from "../components/layout/Navbar";
import StatusCard from "../components/main/StatusCard";
import CourseTable from "../components/main/CourseTable";
import TeachingPlan from "../components/main/TeachingPlan";
import CourseList from "../components/main/CourseList";
import VolunteerCard from "../components/main/VolunteerCard";

// 引入 React DnD 所需的模块
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// 引入自定义拖拽层
import CustomDragLayer from "../components/main/CustomDragLayer";

// 引入统一的 Course 接口
import { Course, reverseCourseTypeMapping } from "../types/course";

import { useToast } from "@chakra-ui/react";

import { Volunteer, VolunteerWithCount } from '@/app/types/volunteer';

import { revalidatePath } from "next/cache"

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import CourseListView from "../components/main/CourseListView";
import { removeCourse, selectCourse, disSelectCourse, setCourseStatus, setCourseWish } from "@/app/search/actions"

export default function MainPage({favoriteCourses, selCourses, curriculum}) {
  // 管理可用课程列表（备选清单）
  const [availableCourses, setAvailableCourses] = useState<Course[]>(favoriteCourses);

  // 管理已选课程列表（课程表中的课程）
  const [selectedCourses, setSelectedCourses] = useState<Course[]>(selCourses);

  const [isListView, setIsListView] = useState(false);


  const generateInitialVolunteers = () => {
    const types: Array<'required' | 'limited' | 'optional' | 'sports'> = [
      'required', 
      'limited', 
      'optional', 
      'sports'
    ];
    
    let volunteers: VolunteerWithCount[] = [];
    
    types.forEach(type => {
      // 一志愿：每种类型1个
      volunteers.push({
        id: `${type}-1`,
        type: type,
        priority: 1,
        remaining: 1
      });
      
      // 二志愿：体育1个，其他2个
      volunteers.push({
        id: `${type}-2`,
        type: type,
        priority: 2,
        remaining: type === 'sports' ? 1 : 2
      });
      
      // 三志愿：每种类型只有一个，但无限次数
      volunteers.push({
        id: `${type}-3`,
        type: type,
        priority: 3,
        remaining: 99999
      });
    });
    
    return volunteers;
  };

  const getAvailableVolunteers = (selCourses) => {
    const initial = generateInitialVolunteers()
    return initial.map((volunteer) => {
        var rem = volunteer.remaining
        for (var course of selCourses) {
            if (volunteer.type == course.volType && volunteer.priority == +course.volNum) {
                rem = rem - 1
            }
        }
        return {
            ...volunteer,
            remaining: rem,
        }
    })
  }

    // 更新志愿相关状态
  const [availableVolunteers, setAvailableVolunteers] = useState<VolunteerWithCount[]>(
    generateInitialVolunteers()
  );

  const [courseVolunteer, setCourseVolunteer] = useState<{
    [courseId: string]: VolunteerWithCount;
  }>({});

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isExporting, setIsExporting] = useState(false);

  const toast = useToast();

  // 给某门课分配某个志愿
  const handleVolunteerDrop = async (courseId: string, volunteer: VolunteerWithCount) => {
    const course = selectedCourses.find(c => c.id === courseId);
    if (!course) return;
    // 添加类型转换
    const courseType = course.volType;
    if (courseType !== volunteer.type) return;

    setSelectedCourses((prev) => 
        prev.map((c) => {
            return c.id !== courseId ? c : { ...c, volNum: volunteer.priority };
        })
    )
    await setCourseWish(courseId, course.volType, volunteer.priority)

  };
  
  const handleVolunteerRemove = (courseId: string, volunteerId: string) => {};

  const handleVolunteerDrag = (volunteer: VolunteerWithCount) => {
    /* if (!selectedCourses || selectedCourses.length === 0) return;
    
    // 检查是否存在可以赋予的目标课程
    const targetCourseId = selectedCourses[selectedCourses.length - 1].id;
    const targetCourse = selectedCourses.find(c => c.id === targetCourseId);
    
    // 只有在有匹配的课程类型时才处理志愿
    if (targetCourse && targetCourse.type === volunteer.type) {
      // handleVolunteerDrop(targetCourseId, volunteer);
    } */
  };


  const handleVolunteerReturn = (volunteer: VolunteerWithCount) => {
    // 找到包含此志愿的课程
    const courseEntry = Object.entries(courseVolunteer).find(
      ([_, v]) => (
        v.type === volunteer.type && 
        v.priority === volunteer.priority
      )
    );
  
    if (courseEntry) {
      const [courseId] = courseEntry;
      
      // 从课程中移除志愿
      /* setCourseVolunteers(prev => ({
        ...prev,
        [courseId]: []
      })); */
     console.log("ERRORRR")
  
      // 返回志愿到志愿池
      setAvailableVolunteers(prev => {
        // 查找相同类型和优先级的志愿
        const existingIndex = prev.findIndex(v => 
          v.type === volunteer.type && 
          v.priority === volunteer.priority
        );
  
        if (existingIndex >= 0) {
          // 更新现有志愿的数量
          const updatedVolunteers = [...prev];
          updatedVolunteers[existingIndex] = {
            ...prev[existingIndex],
            remaining: prev[existingIndex].remaining + 1
          };
          return updatedVolunteers;
        } else if (volunteer.priority !== 3) {
          // 如果不存在且不是三志愿，添加新的志愿
          return [...prev, { ...volunteer, remaining: 1 }];
        }
        return prev;
      });
    }
  };

  
  // 颜色数组，确保颜色名称与 Chakra UI 的颜色方案一致
const colors = [
  "purple",
  "pink",
  "cyan",
  "teal",
  "orange",
  "gray",
];

  // 根据课程ID获取颜色
  const getCourseColor = (courseId: string): string => {
    // 使用哈希函数将课程ID映射到颜色数组的索引
    let hash = 0;
    for (let i = 0; i < courseId.length; i++) {
      hash = courseId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // 添加课程到课程表的方法
  const addCourseToTable = async (course: Course) => {
    // 检查时间冲突
    if (checkTimeConflict(course, selectedCourses)) {
      toast({
        title: "时间冲突",
        description: "选课失败：该课程与已选课程时间冲突",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    console.log("addCourseToTable: course", course)
    setSelectedCourses((prevSelectedCourses) => {
        const newCourse = {
            ...course,
            volNum: 3,
        }
        return [...prevSelectedCourses, newCourse]
    })
    setAvailableCourses((prevAvailableCourses) =>
        prevAvailableCourses.filter((c) => c.id !== course.id)
    );
    await selectCourse(course.id)
    await setCourseWish(course.id, course.volType, 3)

  };

  // 从备选清单中删除课程的方法（用于删除按钮）
  const deleteCourse = async (courseId: string) => {
    setAvailableCourses((prevAvailableCourses) =>
      prevAvailableCourses.filter((c) => c.id !== courseId)
    )
    await removeCourse(courseId)
  };

  // 将课程从已选课程移动到备选清单
  const moveCourseToAvailable = async (course: Course) => {
    setSelectedCourses((prev) =>
        prev.filter(c => c.id !== course.id)
    );
    setAvailableCourses((prev) =>
        [...prev, course]
    );
    await disSelectCourse(course.id)
  };

  // 导出为Excel文件
const exportToXLSX = () => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['时间', '周一', '周二', '周三', '周四', '周五'],
    ...Array(12).fill(0).map((_, index) => {
      const row = [`第${index + 1}节`];
      for (let day = 1; day <= 5; day++) {
        const coursesInSlot = selectedCourses.filter(course =>
          course.timeSlots.some(slot =>
            slot.day === day &&
            index + 1 >= slot.start &&
            index + 1 < slot.start + slot.duration
          )
        );
        row.push(coursesInSlot.map(course => course.name).join('\n'));
      }
      return row;
    })
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, "课程表");
  XLSX.writeFile(workbook, "课程表.xlsx");
  onClose();
};

// 导出为PNG图片
// 导出为PNG图片
const exportToPNG = async () => {
  setIsExporting(true);

  try {
    // 创建一个临时表格元素
    const tempTable = document.createElement('div');
    tempTable.style.padding = '20px';
    tempTable.style.background = 'white';
    tempTable.style.width = '800px'; // 设置固定宽度
    
    // 创建表格标题
    const title = document.createElement('h2');
    title.textContent = '课程表';
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    tempTable.appendChild(title);
    
    // 创建表格
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    
    // 创建表头
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['节次', '周一', '周二', '周三', '周四', '周五'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.border = '1px solid #ccc';
      th.style.padding = '8px';
      th.style.backgroundColor = '#f0f0f0';
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // 创建表格内容
    const tbody = document.createElement('tbody');
    for (let slot = 1; slot <= 12; slot++) {
      const row = document.createElement('tr');
      
      // 添加节次
      const slotCell = document.createElement('td');
      slotCell.textContent = `第${slot}节`;
      slotCell.style.border = '1px solid #ccc';
      slotCell.style.padding = '8px';
      slotCell.style.backgroundColor = '#f0f0f0';
      row.appendChild(slotCell);
      
      // 添加每天的课程
      for (let day = 1; day <= 5; day++) {
        const cell = document.createElement('td');
        cell.style.border = '1px solid #ccc';
        cell.style.padding = '8px';
        
        // 查找该时间段的课程
        const coursesInSlot = selectedCourses.filter(course =>
          course.timeSlots.some(timeSlot =>
            timeSlot.day === day &&
            slot >= timeSlot.start &&
            slot < timeSlot.start + timeSlot.duration
          )
        );
        
        // 添加课程信息
        if (coursesInSlot.length > 0) {
          cell.innerHTML = coursesInSlot.map(course => `
            <div style="margin-bottom: 4px;">
              <div style="font-weight: bold;">${course.name}</div>
              <div style="font-size: 0.9em;">${course.teacher}</div>
              <div style="font-size: 0.8em;">${course.classroom}</div>
            </div>
          `).join('');
        }
        
        row.appendChild(cell);
      }
      
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    tempTable.appendChild(table);
    
    // 添加到文档中
    document.body.appendChild(tempTable);
    
    // 使用html2canvas转换为图片
    const canvas = await html2canvas(tempTable, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false
    });
    
    // 移除临时元素
    document.body.removeChild(tempTable);
    
    // 下载图片
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `课程表_${timestamp}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();

    toast({
      title: "导出成功",
      description: "课程表已保存为PNG图片",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
  } catch (error) {
    console.error('导出PNG失败:', error);
    toast({
      title: "导出失败",
      description: "请稍后重试",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  } finally {
    setIsExporting(false);
  }
};

// 检查时间冲突的辅助函数
const checkTimeConflict = (course: Course, selectedCourses: Course[]): boolean => {
  for (const selectedCourse of selectedCourses) {
    for (const newSlot of course.timeSlots) {
      for (const existingSlot of selectedCourse.timeSlots) {
        if (newSlot.day === existingSlot.day) {
          const newStart = newSlot.start;
          const newEnd = newSlot.start + newSlot.duration;
          const existingStart = existingSlot.start;
          const existingEnd = existingSlot.start + existingSlot.duration;

          // 检查时间段是否重叠
          if (
            (newStart >= existingStart && newStart < existingEnd) ||
            (existingStart >= newStart && existingStart < newEnd)
          ) {
            return true; // 存在冲突
          }
        }
      }
    }
  }
  return false; // 无冲突
};

  // 定义统一的高度
  const cardHeight = "150px"; // 调整高度以匹配按钮区域的高度

  return (
    // 将整个应用包裹在 DndProvider 中，启用拖拽功能
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer /> {/* 添加自定义拖拽层 */}
      <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
        <Navbar />
        <Box p={4}>
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            {/* 添加志愿卡片 */}
            <GridItem colSpan={3}>
              <VolunteerCard
                height={cardHeight}
                availableVolunteers={getAvailableVolunteers(selectedCourses)}
                onVolunteerDrag={handleVolunteerDrag}
                onVolunteerRemove={handleVolunteerRemove}
                onVolunteerReturn={handleVolunteerReturn}
              />
            </GridItem>
            {/* 调整后的选课阶段卡片区域 */}
            <GridItem colSpan={3}>
              <StatusCard
                title="选课阶段"
                content="当前非选课阶段！"
                height={cardHeight} // 使用height属性
              />
            </GridItem>
            {/* 新增的按钮区域 */}
            <GridItem colSpan={2}>
              <Box
                bg={useColorModeValue("white", "gray.700")}
                rounded="md"
                p={4}
                shadow="sm"
                height={cardHeight} // 设置固定高度
                overflow="hidden" // 防止内容撑大
              >
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  height="100%"
                >
                  {/* 导出课表按钮 */}
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="sm" // 调整按钮大小
                    w="100%"
                    rounded="md"
                    mb={2}
                    onClick={onOpen}  // 修改这里
                  >
                    导出课表
                  </Button>
                  {/* 列表查看按钮 */}
                  <Button
                  variant="outline"
                  colorScheme="blue"
                  size="sm"
                  w="100%"
                  rounded="md"
                  onClick={() => setIsListView(!isListView)}
                >
                  {isListView ? "课表查看" : "列表查看"}
                </Button>
                </Flex>
              </Box>
            </GridItem>

            {/* 使用教程卡片 */}
            <GridItem colSpan={4}>
              <Box
                bg={useColorModeValue("white", "gray.700")}
                rounded="md"
                p={4}
                shadow="sm"
                height={cardHeight}
              >
                <Box>
                  <Box fontWeight="bold" mb={2}>使用教程：</Box>
                  <Box fontSize="sm">
                    <Box mb={1}>1. 在搜索课程界面进行选课，添加的课程会进入备选清单</Box>
                    <Box mb={1}>2. 点击加号或拖拽课程从备选清单进入课表，或拖拽课程从课表回到备选清单</Box>
                    <Box>3. 拖动志愿将志愿分配给对应的课程</Box>
                  </Box>
                </Box>
              </Box>
            </GridItem>

            {/* 课程表区域 */}
            <GridItem colSpan={8}>
              {isListView ? (
                <CourseListView
                  selectedCourses={selectedCourses}
                  getCourseColor={getCourseColor}
                  courseVolunteer={courseVolunteer}
                />
              ) : (
                <CourseTable
                  selectedCourses={selectedCourses}
                  addCourseToTable={addCourseToTable}
                  getCourseColor={getCourseColor}
                  courseVolunteer={courseVolunteer}
                  onVolunteerDrop={handleVolunteerDrop}
                  onVolunteerRemove={handleVolunteerRemove}

                />
              )}
            </GridItem>

          {/* 右侧面板 */}
          <GridItem colSpan={4}>
            <Grid gap={4} templateRows="auto 1fr">  {/* 添加 templateRows */}
              <GridItem>
                <TeachingPlan 
                  curriculum={curriculum} 
                  maxH="300px"  // 添加固定高度
                  overflow="auto"  // 添加滚动条
                />
              </GridItem>
              <GridItem>
                <CourseList
                  availableCourses={availableCourses}
                  addCourseToTable={addCourseToTable}
                  deleteCourse={deleteCourse}
                  moveCourseToAvailable={moveCourseToAvailable}
                  getCourseColor={getCourseColor}
                />
              </GridItem>
            </Grid>
          </GridItem>
          </Grid>
        </Box>
      </Box>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>选择导出格式</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} width="100%">
              <Button
                colorScheme="blue"
                width="100%"
                onClick={exportToXLSX}
              >
                导出为 Excel (XLSX)
              </Button>
              <Button
                colorScheme="blue"
                width="100%"
                onClick={exportToPNG}
              >
                导出为图片 (PNG)
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

    </DndProvider>
  );
}
