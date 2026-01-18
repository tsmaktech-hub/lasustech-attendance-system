
import { College } from './types.ts';

export const LOGO_URL = "https://api.dicebear.com/7.x/initials/svg?seed=LASUSTECH&backgroundColor=0084ca&fontFamily=Arial&fontWeight=700";

export const COLLEGES: College[] = [
  {
    id: "eng",
    name: "College of Engineering",
    departments: [
      { id: "mech-eng", name: "Mechanical Engineering", isEngineering: true },
      { id: "mechtr-eng", name: "Mechatronics Engineering", isEngineering: true },
      { id: "chem-eng", name: "Chemical Engineering", isEngineering: true },
      { id: "elec-eng", name: "Elect/Electrical Engineering", isEngineering: true },
      { id: "civil-eng", name: "Civil Engineering", isEngineering: true },
      { id: "comp-eng", name: "Computer Engineering", isEngineering: true },
      { id: "agric-eng", name: "Agriculture Engineering", isEngineering: true },
      { id: "food-sci", name: "Food Science and Technology", isEngineering: true },
    ]
  },
  {
    id: "basic-sci",
    name: "College of Basic Science",
    departments: [
      { id: "comp-sci", name: "Computer Science" },
      { 
        id: "math-sci", 
        name: "Mathematics Science",
        subDepartments: [
          { name: "Mathematics", list: ["Mathematics"] },
          { name: "Industrial Mathematics", list: ["Industrial Mathematics"] },
          { name: "Statistics", list: ["Statistics"] }
        ]
      },
      { 
        id: "chem-sci", 
        name: "Chemical Science",
        subDepartments: [
          { name: "Chemistry", list: ["Chemistry"] },
          { name: "Industrial Chemistry", list: ["Industrial Chemistry"] },
          { name: "Biochemistry", list: ["Biochemistry"] }
        ]
      },
      { 
        id: "bio-sci", 
        name: "Biological Science",
        subDepartments: [
          { name: "Zoology", list: ["Zoology"] },
          { name: "Botany", list: ["Botany"] },
          { name: "Microbiology", list: ["Microbiology"] }
        ]
      },
    ]
  },
  {
    id: "applied-soc",
    name: "College of Applied Social-Science",
    departments: [
      { id: "econ", name: "Economics" },
      { id: "acc", name: "Accounting" },
      { id: "oim", name: "Office and Information Management (OIM)" },
      { id: "ins", name: "Insurance" },
      { id: "bank", name: "Banking and Finance" },
      { id: "act-sci", name: "Actuarial Science" },
      { id: "bus-admin", name: "Business Administration" },
      { id: "mass-comm", name: "Mass Communication" },
    ]
  },
  {
    id: "env",
    name: "College of Environmental",
    departments: [
      { id: "arch", name: "Architecture" },
      { id: "quan-surv", name: "Quantity Survey" },
      { id: "art-des", name: "Art and Design" },
      { id: "urb-plan", name: "Urban and Regional Planning" },
      { id: "est-mgt", name: "Estate Management" },
      { id: "build-tech", name: "Building Tech" },
    ]
  },
  {
    id: "agric",
    name: "College of Agriculture",
    departments: [
      { id: "ani-sci", name: "Department of Animal Science" },
      { id: "agric-econ", name: "Department of Agricultural Economics and Extension" },
      { id: "agron", name: "Department of Agronomy" },
      { id: "fish-wild", name: "Department of Fisheries and Wildlife Management" },
    ]
  }
];

export const ENGINEERING_100L_COURSES = [
  { code: "GET102", name: "Engineering graphics and solid modelling" },
  { code: "CHM102", name: "General chemistry II" },
  { code: "CHM108", name: "General practical chemistry II" },
  { code: "MTH102", name: "Elementary mathematics II" },
  { code: "PHY102", name: "General practical II" },
  { code: "PHY108", name: "General practical physics II" },
  { code: "STA112", name: "Probability" },
  { code: "PHY104", name: "General physics IV" },
  { code: "YOR102", name: "Communication in Yoruba" },
];
