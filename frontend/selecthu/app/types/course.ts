// app/types/course.ts

export interface TimeSlot {
  day: number;       // 星期几，1代表周一，依此类推
  start: number;     // 开始节次
  duration: number;  // 持续节次数
  weeks?: number[];   // 上课周次数组，例如 [1, 2, 3, ..., 16]
}

export interface Course {
  id: string;
  name: string;
  teacher: string;           // 任课教师
  classroom?: string;        // 教室
  type: string;              // 课程属性
  credits: number;           // 学分
  timeSlots: TimeSlot[];     // 上课时间段

  // 新增属性
  department: string;        // 所属部门
  courseGroup?: string;       // 所属课组
  time: string;              // 上课时间描述
  teachingInfo: string;      // 教学信息
  teacherInfo: string;       // 教师信息
  comments: string[];        // 备注
  courseNumber: string;      // 课程号
  sequenceNumber: string;    // 课序号
  announcements?: Announcement[]; // 可选，若有公告需求
}

export interface Announcement {
  title: string;
  date: string; // 使用 ISO 格式的日期字符串，例如 "2024-09-18T09:30:00"
}