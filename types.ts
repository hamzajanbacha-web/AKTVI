
export type CourseStatus = 'Active' | 'Pending' | 'Scheduled' | 'Postponed' | 'active' | 'scheduled' | 'frozen';
export type AdmissionStatus = 'Pending' | 'Approved' | 'Rejected';
export type RegisterStatus = 'Approved' | 'Suspended' | 'Active' | 'Certified' | 'Rusticated';
export type ExamType = '1st Term' | '2nd Term' | 'Final Exam' | 'Board Exam';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';
export type ScheduleStatus = 'Scheduled' | 'Live' | 'Completed';
export type AlertCategory = 'Admission' | 'Result' | 'Schedule' | 'Urgent';

export interface Course {
  id: string;
  name: string; 
  thumbnail?: string; 
  instructorName: string;
  instructorImage: string;
  content: string;
  description: string;
  duration: string;
  status: CourseStatus;
  mode?: 'ON CAMPUS' | 'ONLINE';
  category?: string;
  // Fix: Added optional modules array for curriculum tracking in LMS.tsx
  modules?: {
    id: string;
    title: string;
    duration: string;
  }[];
}

export interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  dob: string;
  role: 'admin' | 'student' | 'instructor';
  email?: string;
  regNumber?: string;
  points?: number;
  badges?: string[];
}

export interface AdmissionForm {
  id: string;
  firstName: string;
  lastName: string;
  cnic: string;
  dob: string;
  gender: 'Male' | 'Female';
  qualification: string;
  occupation: string;
  guardianName: string;
  whatsapp: string;
  guardianWhatsapp: string;
  relation: string;
  address: string;
  email: string;
  courseId: string;
  photo?: string;
  status: AdmissionStatus;
  isDraft: boolean;
  // Fix: Added optional regNumber as it is used for tracking and result lookups in Results.tsx
  regNumber?: string;
}

export interface AdmissionWithdrawal {
  id: string;
  admissionId: string;
  enrollmentSerial: number;
  regNumber: string;
  studentName: string;
  cnic: string;
  courseId: string;
  admissionDate: string;
  withdrawalDate?: string;
  status: RegisterStatus;
  remarks?: string;
}

export interface NewsAlert {
  id: string;
  category: AlertCategory;
  title: string;
  content: string;
  actionText: string;
  actionPage: string;
  expiresAt: string;
  priority: 'Normal' | 'High';
}

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  slogan: string;
  description: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  examType: ExamType;
  paperTotal: number;
  paperObtained: number;
  practicalTotal: number;
  practicalObtained: number;
  assignmentTotal: number;
  assignmentObtained: number;
  position: string;
  remarks: string;
  datePublished: string;
}

export interface SessionSchedule {
  id: string;
  courseId: string;
  topic: string;
  startTime: string;
  status: ScheduleStatus;
}

/**
 * Fix: Added missing interfaces requested by components across the application
 */

export interface Instructor {
  id: string;
  userId: string;
  name: string;
  qualification: string;
  subject: string;
  classAssignment: string;
  image: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: any[];
}

export interface DiscussionPost {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userRole: string;
  title: string;
  content: string;
  timestamp: string;
  replies: any[];
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedModules: string[];
  percentage: number;
}

export interface ClassroomParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isHandRaised: boolean;
  isLive: boolean;
  isSpeaking: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'instructor' | 'student';
  text: string;
  userName: string;
  timestamp: string;
}
