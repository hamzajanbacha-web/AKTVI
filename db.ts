
import { supabase } from './lib/supabase';
import { Course, Product, User, AdmissionForm, Instructor, ExamResult, AttendanceRecord, SessionSchedule, NewsAlert, Quiz, DiscussionPost, AdmissionWithdrawal } from './types';

// Helper to map DB User to Frontend User
export const mapUser = (dbUser: any): User => ({
  id: dbUser.id,
  username: dbUser.username,
  firstName: dbUser.first_name,
  lastName: dbUser.last_name,
  password: dbUser.password,
  dob: dbUser.dob,
  role: dbUser.role,
  email: dbUser.email,
  regNumber: dbUser.reg_number,
  points: dbUser.points,
  badges: dbUser.badges
});

// Helper to map DB Admission to Frontend Admission
export const mapAdmission = (dbAdm: any): AdmissionForm => ({
  id: dbAdm.id,
  firstName: dbAdm.first_name,
  lastName: dbAdm.last_name,
  cnic: dbAdm.cnic,
  dob: dbAdm.dob,
  gender: dbAdm.gender,
  qualification: dbAdm.qualification,
  occupation: dbAdm.occupation,
  guardianName: dbAdm.guardian_name,
  whatsapp: dbAdm.whatsapp,
  guardianWhatsapp: dbAdm.guardian_whatsapp,
  relation: dbAdm.relation,
  address: dbAdm.address,
  email: dbAdm.email,
  courseId: dbAdm.course_id,
  photo: dbAdm.photo,
  status: dbAdm.status,
  isDraft: dbAdm.is_draft,
  regNumber: dbAdm.reg_number
});

export const getDB = async () => {
  const [
    { data: courses },
    { data: products },
    { data: admissions },
    { data: register },
    { data: results },
    { data: schedules },
    { data: alerts },
    { data: users },
    { data: instructors },
    { data: attendance },
    { data: quizzes },
    { data: discussions }
  ] = await Promise.all([
    supabase.from('courses').select('*'),
    supabase.from('products').select('*'),
    supabase.from('admission_forms').select('*'),
    supabase.from('admission_withdrawal').select('*'),
    supabase.from('exam_results').select('*'),
    supabase.from('session_schedules').select('*'),
    supabase.from('news_alerts').select('*'),
    supabase.from('users_table').select('*'),
    supabase.from('instructors').select('*'),
    supabase.from('attendance_records').select('*'),
    supabase.from('quizzes').select('*'),
    supabase.from('discussion_posts').select('*')
  ]);
  
  const currentUser = JSON.parse(localStorage.getItem('ak_user') || 'null');

  return { 
    courses: courses || [], 
    products: products || [], 
    admissions: (admissions || []).map(mapAdmission), 
    register: register || [],
    currentUser: currentUser ? mapUser(currentUser) : null, 
    results: results || [], 
    schedules: schedules || [], 
    alerts: alerts || [], 
    users: (users || []).map(mapUser),
    instructors: instructors || [],
    attendance: attendance || [],
    quizzes: quizzes || [],
    discussions: discussions || [],
    progress: []
  };
};

export const saveDB = async (key: string, data: any) => {
  if (key === 'ak_user') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};
