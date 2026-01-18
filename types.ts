
export interface User {
  username: string; // This represents the Course Code
  fullName: string; // Full name of the lecturer
  password?: string;
}

export interface Student {
  id: string;
  name: string;
  matricNo: string;
  department: string;
}

export interface AttendanceRecord {
  [courseId: string]: {
    [studentId: string]: number; // stores number of weeks attended (max 14)
  };
}

export interface College {
  id: string;
  name: string;
  departments: Department[];
}

export interface Department {
  id: string;
  name: string;
  isEngineering?: boolean;
  subDepartments?: { name: string; list: string[] }[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  level: number;
  departmentId: string;
}

export enum AppState {
  LOGIN,
  SIGNUP,
  COLLEGES,
  DEPARTMENTS,
  LEVELS,
  COURSES,
  ATTENDANCE
}
