
// Correctly import types from types.ts and constants from constants.ts
import { Student, Course, Department } from '../types';
import { COLLEGES, ENGINEERING_100L_COURSES } from '../constants';

const FIRST_NAMES = ["Abiola", "Bayo", "Chidi", "Daramola", "Efe", "Fadekemi", "Gbenga", "Hassan", "Ibrahim", "Jumoke", "Kayode", "Lekan", "Musa", "Nneka", "Olawale", "Patience", "Quasim", "Rofiat", "Segun", "Taiwo", "Uche", "Victoria", "Wale", "Yemi", "Zainab"];
const LAST_NAMES = ["Adebayo", "Bello", "Chukwu", "Dada", "Eze", "Fashola", "Gbadamosi", "Hamzat", "Idris", "Johnson", "Kehinde", "Lawal", "Mohammed", "Nwachukwu", "Okoro", "Popoola", "Raji", "Salami", "Tijani", "Usman", "Williams", "Yusuf", "Balogun", "Ojo", "Sanni"];

export const generateStudents = (departmentId: string): Student[] => {
  const students: Student[] = [];
  // Use departmentId as seed-ish for consistent generation if needed, or just random
  for (let i = 1; i <= 50; i++) {
    const fn = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const suffix = String(i).padStart(3, '0');
    const deptPrefix = departmentId.substring(0, 3).toUpperCase();
    students.push({
      id: `${departmentId}-student-${i}`,
      name: `${fn} ${ln}`,
      matricNo: `LASU/${deptPrefix}/2023/${suffix}`,
      department: departmentId
    });
  }
  return students;
};

export const generateCoursesForLevel = (dept: Department, level: number): Course[] => {
  if (dept.id.includes('eng') && level === 100) {
    return ENGINEERING_100L_COURSES.map(c => ({
      id: `${dept.id}-${level}-${c.code}`,
      code: c.code,
      name: c.name,
      level,
      departmentId: dept.id
    }));
  }

  // AI-like generation for other levels/depts
  const courses: Course[] = [];
  const count = level === 100 ? 8 : 6;
  const codes = [
    `${dept.id.substring(0, 3).toUpperCase()}${level + 0 + 2}`,
    `${dept.id.substring(0, 3).toUpperCase()}${level + 0 + 4}`,
    `${dept.id.substring(0, 3).toUpperCase()}${level + 0 + 6}`,
    `GST${level + 0 + 2}`,
    `MTH${level + 0 + 2}`,
    `STA${level + 0 + 2}`
  ];

  const genericNames = [
    "Introduction to Professionalism",
    "Advanced Theory & Practice",
    "Research Methodology",
    "Quantitative Techniques",
    "Applied Concepts II",
    "Ethics and Communication",
    "Special Projects II",
    "Global Perspectives"
  ];

  for (let i = 0; i < count; i++) {
    const code = codes[i] || `${dept.id.substring(0, 3).toUpperCase()}${level + 10 + i}`;
    courses.push({
      id: `${dept.id}-${level}-${code}`,
      code,
      name: `${dept.name} ${genericNames[i] || "Special Seminar"}`,
      level,
      departmentId: dept.id
    });
  }
  return courses;
};

export const getAttendance = () => {
  const data = localStorage.getItem('lasustech_attendance');
  return data ? JSON.parse(data) : {};
};

export const saveAttendance = (courseId: string, studentId: string, attended: boolean) => {
  const records = getAttendance();
  if (!records[courseId]) records[courseId] = {};
  
  const currentCount = records[courseId][studentId] || 0;
  // If checked, increment attendance (up to max 14 weeks)
  // Since we don't have a "week picker" in the MVP, we just assume "this week" toggle
  if (attended) {
    records[courseId][studentId] = Math.min(14, currentCount + 1);
  } else {
    records[courseId][studentId] = Math.max(0, currentCount - 1);
  }

  localStorage.setItem('lasustech_attendance', JSON.stringify(records));
};
