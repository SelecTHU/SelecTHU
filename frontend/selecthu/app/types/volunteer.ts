// types/volunteer.ts

// 基础志愿接口
export interface Volunteer {
  id: string;
  type: 'required' | 'limited' | 'optional' | 'sports';
  priority: 1 | 2 | 3;
}

// 带计数的志愿接口
export interface VolunteerWithCount extends Volunteer {
  remaining: number;
}
