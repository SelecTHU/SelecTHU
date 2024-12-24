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

// 示例课程数据
const sampleCourses: Course[] = [
  {
    id: "1",
    name: "高等数学",
    teacher: "张教授",
    classroom: "教学楼A101",
    type: "必修",
    credits: 4,
    timeSlots: [
      { day: 1, start: 1, duration: 2 }, // 周一1-2节
      { day: 3, start: 3, duration: 3 }, // 周三3-5节
    ],
    department: "数学与统计学院",
    time: "周一 08:00-10:00 / 周三 09:00-12:00",
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
    type: "必修",
    credits: 3,
    timeSlots: [
      { day: 2, start: 4, duration: 2 }, // 周二4-5节
      { day: 4, start: 1, duration: 1 }, // 周四1节
    ],
    department: "数学与统计学院",
    time: "周二 14:00-16:00 / 周四 09:00-10:00",
    teachingInfo: "教室：教学楼B202，配备计算机实验环境",
    teacherInfo: "电子邮箱：li@example.com",
    comments: [
      "逻辑严谨，理论性强。",
      "课程安排合理，适合数学爱好者。",
    ],
    courseNumber: "MATH102",
    sequenceNumber: "002",
  },
  // 可以添加更多课程，确保每个课程对象包含所有必需的属性
];

export default function MainPage() {
  // 管理可用课程列表（备选清单）
  const [availableCourses, setAvailableCourses] = useState<Course[]>(sampleCourses);

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