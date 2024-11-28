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

// 引入 React DnD 所需的模块
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// 引入自定义拖拽层
import CustomDragLayer from "../components/main/CustomDragLayer";

// 引入统一的 Course 接口
import { Course } from "../types/course";

// 实际课程数据
const realCourses: Course[] = [
  {
    id: "00782331",
    name: "京剧艺术赏析",
    teacher: "周梦梅",
    classroom: "蒙楼（艺教）多功能厅",
    type: "任选",
    credits: 1,
    timeSlots: [
      { day: 5, start: 4, duration: 1, weeks: [2, 4, 6, 8, 10, 12, 14, 16] }, // 周五第4节，2-16周
    ],
    department: "艺术学院", // 根据实际情况填写
    time: "周五 第4节 (2,4,6,8,10,12,14,16周)",
    teachingInfo: "教室：蒙楼（艺教）多功能厅",
    teacherInfo: "联系方式：zhou@example.com", // 根据实际情况填写
    comments: [
      "课程内容丰富，深入浅出地介绍京剧艺术。",
      "适合对中国传统文化感兴趣的学生。",
    ],
    courseNumber: "00782331",
    sequenceNumber: "90",
  },
  {
    id: "10721381",
    name: "三年级男生气排球",
    teacher: "张晨",
    classroom: "综合体育馆",
    type: "任选",
    credits: 0,
    timeSlots: [
      { day: 4, start: 1, duration: 1, weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }, // 周四第1节，1-16周
    ],
    department: "体育学院", // 根据实际情况填写
    time: "周四 第1节 (1-16周)",
    teachingInfo: "教室：综合体育馆",
    teacherInfo: "联系方式：zhang@example.com", // 根据实际情况填写
    comments: [
      "适合热爱排球运动的学生。",
      "课程注重团队协作与身体素质的培养。",
    ],
    courseNumber: "10721381",
    sequenceNumber: "2",
  },
  {
    id: "14203062",
    name: "美国社会与文化",
    teacher: "JONES MATTHEW ALEXANDER",
    classroom: "六教6B308",
    type: "任选",
    credits: 2,
    timeSlots: [
      { day: 3, start: 3, duration: 1, weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }, // 周三第3节，1-16周
    ],
    department: "社会科学学院", // 根据实际情况填写
    time: "周三 第3节 (1-16周)",
    teachingInfo: "教室：六教6B308",
    teacherInfo: "联系方式：jones@example.com", // 根据实际情况填写
    comments: [
      "深入探讨美国的社会结构与文化现象。",
      "适合对国际关系和文化研究感兴趣的学生。",
    ],
    courseNumber: "14203062",
    sequenceNumber: "90",
  },
  {
    id: "44100113",
    name: "计算机网络",
    teacher: "杨铮",
    classroom: "六教6A118",
    type: "必修",
    credits: 3,
    timeSlots: [
      { day: 3, start: 2, duration: 1, weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }, // 周三第2节，1-16周
    ],
    department: "计算机科学与技术学院", // 根据实际情况填写
    time: "周三 第2节 (1-16周)",
    teachingInfo: "教室：六教6A118",
    teacherInfo: "联系方式：yang@example.com", // 根据实际情况填写
    comments: [
      "课程涵盖计算机网络的基本原理与应用。",
      "适合希望深入理解网络技术的学生。",
    ],
    courseNumber: "44100113",
    sequenceNumber: "0",
  },
  {
    id: "44100203",
    name: "软件工程",
    teacher: "刘璘",
    classroom: "六教6A118",
    type: "必修",
    credits: 3,
    timeSlots: [
      { day: 4, start: 2, duration: 1, weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }, // 周四第2节，1-16周
    ],
    department: "计算机科学与技术学院", // 根据实际情况填写
    time: "周四 第2节 (1-16周)",
    teachingInfo: "教室：六教6A118",
    teacherInfo: "联系方式：liu@example.com", // 根据实际情况填写
    comments: [
      "系统介绍软件开发生命周期及工程实践。",
      "适合希望从事软件开发工作的学生。",
    ],
    courseNumber: "44100203",
    sequenceNumber: "0",
  },
  {
    id: "44100573",
    name: "计算机组成原理",
    teacher: "杨铮",
    classroom: "六教6A118",
    type: "必修",
    credits: 3,
    timeSlots: [
      { day: 1, start: 2, duration: 1, weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }, // 周一第2节，1-16周
    ],
    department: "计算机科学与技术学院", // 根据实际情况填写
    time: "周一 第2节 (1-16周)",
    teachingInfo: "教室：六教6A118",
    teacherInfo: "联系方式：yang@example.com", // 根据实际情况填写
    comments: [
      "介绍计算机系统的基本组成与工作原理。",
      "适合希望理解计算机底层结构的学生。",
    ],
    courseNumber: "44100573",
    sequenceNumber: "0",
  },
  {
    id: "44100593",
    name: "汇编与编译原理",
    teacher: "王朝坤",
    classroom: "六教6A216",
    type: "必修",
    credits: 3,
    timeSlots: [
      { day: 2, start: 2, duration: 1, weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }, // 周二第2节，1-16周
    ],
    department: "计算机科学与技术学院", // 根据实际情况填写
    time: "周二 第2节 (1-16周)",
    teachingInfo: "教室：六教6A216",
    teacherInfo: "联系方式：wang@example.com", // 根据实际情况填写
    comments: [
      "深入讲解汇编语言与编译器的设计原理。",
      "适合对编译原理和底层编程感兴趣的学生。",
    ],
    courseNumber: "44100593",
    sequenceNumber: "0",
  },
  {
    id: "44100662",
    name: "模型驱动的软件开发",
    teacher: "姜宇",
    classroom: "三教1103",
    type: "任选",
    credits: 2,
    timeSlots: [
      { day: 2, start: 3, duration: 1, weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }, // 周二第3节，1-16周
    ],
    department: "计算机科学与技术学院", // 根据实际情况填写
    time: "周二 第3节 (1-16周)",
    teachingInfo: "教室：三教1103",
    teacherInfo: "联系方式：jiang@example.com", // 根据实际情况填写
    comments: [
      "介绍模型驱动的软件开发方法与工具。",
      "适合希望提升软件设计与开发能力的学生。",
    ],
    courseNumber: "44100662",
    sequenceNumber: "0",
  },
];

// 学堂公告数据（可选，用于显示公告）
const announcements = [
  {
    title: '关于开展“开放交流时间”活动的通知',
    date: "2024/9/18 09:30:00",
  },
  {
    title: "微软Edge浏览器访问异常情况公告",
    date: "2024/9/14 09:53:00",
  },
  {
    title: "2024年网络学堂功能更新公告（2024年9月）",
    date: "2024/9/11 14:41:00",
  },
];

// 常用链接和业务咨询电话（可选，用于导航或页面底部）
const commonLinks = ["找教室", "找老师", "开放交流时间"];
const businessContacts = {
  serviceEmail: "learn2018tsinghua.edu.cn",
  serviceHotline: "010-62788122",
};

export default function MainPage() {
  // 管理可用课程列表（备选清单）
  const [availableCourses, setAvailableCourses] = useState<Course[]>(realCourses);

  // 管理已选课程列表（课程表中的课程）
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

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
    // 从已选课程中删除
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.filter((c) => c.id !== course.id)
    );

    // 添加回备选清单（如果尚未存在）
    setAvailableCourses((prevAvailableCourses) => {
      if (!prevAvailableCourses.some((c) => c.id === course.id)) {
        return [...prevAvailableCourses, course];
      }
      return prevAvailableCourses;
    });
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
            {/* 状态卡片区域 */}
            <GridItem colSpan={3}>
              <StatusCard
                title="志愿分配"
                content="第一轮志愿分配进行中..."
                height={cardHeight} // 使用height属性
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
                getCourseColor={getCourseColor} // 传递 getCourseColor 函数
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
    </DndProvider>
  );
}