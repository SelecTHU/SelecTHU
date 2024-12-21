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
import { Course } from "../types/course";

import { useToast } from "@chakra-ui/react";

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


// 示例课程数据
const sampleCourses: Course[] = [
  {
    id: "1",
    name: "高等数学",
    teacher: "张教授",
    classroom: "教学楼A101",
    type: "required",
    credits: 4,
    timeSlots: [
      { day: 1, start: 1, duration: 2 }, // 周一1-2节
      { day: 3, start: 1, duration: 2 }, // 周三1-2节
    ],
    department: "数学与统计学院",
    time: "周一 08:00-10:00 / 周三 08:00-10:00",
    teachingInfo: "教室：教学楼A101，投影仪、白板",
    teacherInfo: "电子邮箱：zhang@example.com",
    comments: [
      "课程内容深入，适合打好数学基础。",
      "老师讲解详细，有助于理解复杂概念。",
    ],
    courseNumber: "MATH101",
    sequenceNumber: "001",
  },
  {
    id: "2",
    name: "线性代数",
    teacher: "李教授",
    classroom: "教学楼B202",
    type: "required",
    credits: 3,
    timeSlots: [
      { day: 2, start: 3, duration: 2 }, // 周二3-4节
      { day: 4, start: 3, duration: 2 }, // 周四3-4节
    ],
    department: "数学与统计学院",
    time: "周二 10:00-12:00 / 周四 10:00-12:00",
    teachingInfo: "教室：教学楼B202，配备计算机实验环境",
    teacherInfo: "电子邮箱：li@example.com",
    comments: [
      "逻辑严谨，理论性强。",
      "课程安排合理，适合数学爱好者。",
    ],
    courseNumber: "MATH102",
    sequenceNumber: "002",
  },
  {
    id: "3",
    name: "大学物理",
    teacher: "王教授",
    classroom: "理科楼C303",
    type: "limited",
    credits: 4,
    timeSlots: [
      { day: 1, start: 6, duration: 2 }, // 周一6-7节
      { day: 3, start: 6, duration: 2 }, // 周三6-7节
    ],
    department: "物理学院",
    time: "周一 14:00-16:00 / 周三 14:00-16:00",
    teachingInfo: "教室：理科楼C303，物理实验室",
    teacherInfo: "电子邮箱：wang@example.com",
    comments: [
      "理论与实验相结合",
      "实验课程丰富多样",
    ],
    courseNumber: "PHYS101",
    sequenceNumber: "003",
  },
  {
    id: "4",
    name: "程序设计",
    teacher: "陈教授",
    classroom: "计算机楼D404",
    type: "optional",
    credits: 3,
    timeSlots: [
      { day: 2, start: 6, duration: 3 }, // 周二6-8节
    ],
    department: "计算机科学与技术学院",
    time: "周二 14:00-17:00",
    teachingInfo: "教室：计算机楼D404，编程实验室",
    teacherInfo: "电子邮箱：chen@example.com",
    comments: [
      "注重实践能力培养",
      "配有助教答疑",
    ],
    courseNumber: "CS101",
    sequenceNumber: "004",
  },
  {
    id: "5",
    name: "羽毛球",
    teacher: "刘教授",
    classroom: "体育馆",
    type: "sports",
    credits: 1,
    timeSlots: [
      { day: 5, start: 3, duration: 2 }, // 周五3-4节
    ],
    department: "体育学院",
    time: "周五 10:00-12:00",
    teachingInfo: "场地：体育馆羽毛球场",
    teacherInfo: "电子邮箱：liu@example.com",
    comments: [
      "适合初学者",
      "器材齐全",
    ],
    courseNumber: "PE101",
    sequenceNumber: "005",
  },
];

import { Volunteer as VolunteerType } from "../types/volunteer";

interface Volunteer extends VolunteerType {}

export default function MainPage() {
  // 管理可用课程列表（备选清单）
  const [availableCourses, setAvailableCourses] = useState<Course[]>(sampleCourses);

  // 管理已选课程列表（课程表中的课程）
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  // 更新志愿相关状态
  const [availableVolunteers, setAvailableVolunteers] = useState<Volunteer[]>([
    { id: '1', type: 'required', priority: 1 },
    { id: '2', type: 'required', priority: 2 },
  ]);

  const [courseVolunteers, setCourseVolunteers] = useState<{
    [courseId: string]: Volunteer[];
  }>({});

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isExporting, setIsExporting] = useState(false);

  const toast = useToast();



  // 添加新的处理方法
  const handleVolunteerDrop = (courseId: string, volunteer: Volunteer) => {
    const course = selectedCourses.find(c => c.id === courseId);
    if (!course || course.type !== volunteer.type) return;

    setCourseVolunteers(prev => ({
      ...prev,
      [courseId]: [...(prev[courseId] || []), volunteer]
    }));

    setAvailableVolunteers(prev => 
      prev.filter(v => v.id !== volunteer.id)
    );
  };

  const handleVolunteerRemove = (courseId: string, volunteerId: string) => {
    const volunteer = courseVolunteers[courseId]?.find(v => v.id === volunteerId);
    if (!volunteer) return;

    setCourseVolunteers(prev => ({
      ...prev,
      [courseId]: prev[courseId].filter(v => v.id !== volunteerId)
    }));

    setAvailableVolunteers(prev => [...prev, volunteer]);
  };

  const handleVolunteerDrag = (volunteer: Volunteer) => {  // 新增这个处理函数
    if (!selectedCourses || selectedCourses.length === 0) return;
    
    // 这里可以添加逻辑来决定要将志愿分配给哪个课程
    // 比如可以使用最后选中的课程或其他逻辑
    const targetCourseId = selectedCourses[selectedCourses.length - 1].id;
    handleVolunteerDrop(targetCourseId, volunteer);
  };

  // 新增处理志愿返回的函数
  const handleVolunteerReturn = (volunteer: Volunteer) => {
    // 找到包含这个志愿的课程
    const courseId = Object.entries(courseVolunteers).find(
      ([_, volunteers]) => volunteers.some(v => v.id === volunteer.id)
    )?.[0];

    if (courseId) {
      handleVolunteerRemove(courseId, volunteer.id);
    }
  };

  // 颜色数组，确保颜色名称与 Chakra UI 的颜色方案一致
  const colors = [
    "blue",
    "green",
    "red",
    "yellow",
    "purple",
    "teal",
    "orange",
    "pink",
    "cyan",
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
  const addCourseToTable = (course: Course) => {
    setSelectedCourses((prevSelectedCourses) => {
      // 检查课程是否已添加，避免重复添加
      if (!prevSelectedCourses.some((c) => c.id === course.id)) {
        // 如果未添加过，将课程添加到已选课程列表
        return [...prevSelectedCourses, course];
      }
      // 如果已存在，返回原列表
      return prevSelectedCourses;
    });

    // 从备选清单中删除该课程
    setAvailableCourses((prevAvailableCourses) =>
      prevAvailableCourses.filter((c) => c.id !== course.id)
    );
  };

  // 从备选清单中删除课程的方法（用于删除按钮）
  const deleteCourse = (courseId: string) => {
    setAvailableCourses((prevAvailableCourses) =>
      prevAvailableCourses.filter((c) => c.id !== courseId)
    );
  };

  // 将课程从已选课程移动到备选清单
  const moveCourseToAvailable = (course: Course) => {
    const volunteers = courseVolunteers[course.id] || [];
    
    setAvailableVolunteers(prev => [...prev, ...volunteers]);
    
    setCourseVolunteers(prev => {
      const newState = { ...prev };
      delete newState[course.id];
      return newState;
    });

    setSelectedCourses(prev =>
      prev.filter(c => c.id !== course.id)
    );

    setAvailableCourses(prev => {
      if (!prev.some(c => c.id === course.id)) {
        return [...prev, course];
      }
      return prev;
    });
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
const exportToPNG = async () => {
  setIsExporting(true);
  const courseTableElement = document.querySelector('.course-table');
  
  if (!courseTableElement) {
    toast({
      title: "导出失败",
      description: "未找到课程表元素",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    setIsExporting(false);
    return;
  }

  try {
    // 创建一个包装元素来确保完整捕获
    const wrapper = document.createElement('div');
    wrapper.style.padding = '20px';
    wrapper.style.background = 'white';
    wrapper.appendChild(courseTableElement.cloneNode(true));
    document.body.appendChild(wrapper);

    const canvas = await html2canvas(wrapper, {
      scale: 2, // 提高清晰度
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: true,
      foreignObjectRendering: true,
      // 设置更大的渲染范围以确保捕获完整内容
      width: wrapper.offsetWidth,
      height: wrapper.offsetHeight,
      windowWidth: wrapper.offsetWidth,
      windowHeight: wrapper.offsetHeight
    });

    // 清理临时元素
    document.body.removeChild(wrapper);

    // 创建下载链接
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
                availableVolunteers={availableVolunteers}
                onVolunteerDrag={handleVolunteerDrag}
                onVolunteerRemove={handleVolunteerRemove}
                onVolunteerReturn={handleVolunteerReturn}
              />
            </GridItem>
            {/* 调整后的选课阶段卡片区域 */}
            <GridItem colSpan={3}>
              <StatusCard
                title="选课阶段"
                content="预选阶段：2024-02-20 ~ 2024-02-25"
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
                    size="sm" // 调整按钮大小
                    w="100%"
                    rounded="md"
                  >
                    列表查看
                  </Button>
                </Flex>
              </Box>
            </GridItem>

            {/* 右侧区域占位 */}
            <GridItem colSpan={4} />

            {/* 课程表区域 */}
            <GridItem colSpan={8}>
              <CourseTable
                selectedCourses={selectedCourses}
                addCourseToTable={addCourseToTable}
                getCourseColor={getCourseColor}
                courseVolunteers={courseVolunteers}
                onVolunteerDrop={handleVolunteerDrop}
                onVolunteerRemove={handleVolunteerRemove}
              />
            </GridItem>

            {/* 右侧面板 */}
            <GridItem colSpan={4}>
              <Grid gap={4}>
                <TeachingPlan />
                <CourseList
                  availableCourses={availableCourses}
                  addCourseToTable={addCourseToTable}
                  deleteCourse={deleteCourse}
                  moveCourseToAvailable={moveCourseToAvailable}
                  getCourseColor={getCourseColor} // 传递 getCourseColor 函数
                />
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