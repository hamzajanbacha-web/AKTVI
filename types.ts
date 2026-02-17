
export type CourseStatus = 'Active' | 'Pending' | 'Scheduled' | 'Postponed' | 'active' | 'scheduled' | 'frozen';
export type AdmissionStatus = 'Pending' | 'Approved' | 'Rejected';
export type ExamType = '1st Term' | '2nd Term' | 'Final Exam' | 'Board Exam';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';
export type ScheduleStatus = 'Scheduled' | 'Live' | 'Completed';
export type AlertCategory = 'Admission' | 'Result' | 'Schedule' | 'Urgent';

export interface Course {
  id: string;
  name?: string; 
  title?: string;
  thumbnail?: string; 
  image?: string;
  instructorName: string;
  instructorImage: string;
  content: string;
  description: string;
  duration: string;
  status: CourseStatus;
  mode?: 'ON CAMPUS' | 'ONLINE';
  category?: 'Vocational' | 'Technical' | 'Creative' | 'Professional';
  modules?: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
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

export interface Instructor {
  id: string;
  userId: string; // link to User table
  name: string;
  qualification: string;
  subject: string;
  classAssignment: string;
  image: string;
}

export interface ExamResult {
  id: string;
  studentId: string; // matches regNumber or admissionId
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

export interface AttendanceRecord {
  id: string;
  studentId: string; // matches User.regNumber
  courseId: string;  // matches Course.id
  date: string;      // YYYY-MM-DD
  status: AttendanceStatus;
  joinTime: string;
  durationMinutes: number;
  remarks?: string; // For manual overrides
}

export interface SessionSchedule {
  id: string;
  courseId: string;
  topic: string;
  startTime: string; // ISO string
  status: ScheduleStatus;
}

export interface NewsAlert {
  id: string;
  category: AlertCategory;
  title: string;
  content: string;
  actionText: string;
  actionPage: string;
  expiresAt: string; // ISO
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

export interface AdmissionForm {
  id: string;
  regNumber?: string; // assigned on approval
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
}

export interface ChatMessage {
  id: string;
  role: 'instructor' | 'student';
  text: string;
  userName: string;
  timestamp: string;
}

export interface ClassroomParticipant {
  id: string;
  name: string;
  role: 'instructor' | 'student';
  avatar?: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isHandRaised: boolean;
  isLive: boolean;
  isSpeaking: boolean;
}

// LMS Enhanced Features
export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedModuleIds: string[];
  quizScores: { quizId: string; score: number }[];
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
  replies: DiscussionReply[];
}

export interface DiscussionReply {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}
