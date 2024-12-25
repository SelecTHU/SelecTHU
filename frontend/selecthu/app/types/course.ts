// app/types/course.ts

export interface TimeSlot {
  day: number;      // 星期几，1代表周一，依此类推
  start: number;    // 开始节次
  duration: number; // 持续节次数
}

export interface Selection {
    b: number[],
    x: number[],
    r: number[],
    t: number[],
    total: number,
}

export interface Course {
  id: string;
  name: string;
  teacher: string;          // 原有属性
  classroom?: string;        // 原有属性
  type: string;             // 原有属性
  credits: number;          // 原有属性
  timeSlots: TimeSlot[];    // 原有属性
  capacity: number;         // 新增属性

  // 新增属性
  department: string;
  time: string;
  teachingInfo: string;
  teacherInfo: string;
  comments: string[];
  courseNumber: string;
  sequenceNumber: string;

  selection: Selection;
  volType: "required" | "limited" | "optional" | "sports";
}
