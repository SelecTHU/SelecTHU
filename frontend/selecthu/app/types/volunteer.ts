// types/volunteer.ts
export interface Volunteer {
    id: string;
    type: 'required' | 'limited' | 'optional' | 'sports';
    priority: 1 | 2 | 3;
    courseType?: string; // 用于匹配课程类型
  }
  
  // types/course.ts 补充课程类型属性
  interface Course {
    // ... 现有属性
    courseType: 'required' | 'limited' | 'optional' | 'sports';
  }