
import { supabase } from './lib/supabase';
import { Course, Product, User, AdmissionForm, Instructor, ExamResult, AttendanceRecord, SessionSchedule, NewsAlert, Quiz, DiscussionPost, AdmissionWithdrawal } from './types';

// Helper to map DB User to Frontend User
export const mapUser = (dbUser: any, courseId?: string): User => ({
  id: dbUser.id.toString(),
  username: dbUser.username,
  firstName: dbUser.first_name,
  lastName: dbUser.last_name,
  password: dbUser.password,
  dob: dbUser.dob,
  role: dbUser.role,
  email: dbUser.email,
  regNumber: dbUser.reg_number,
  courseId: courseId, // Point 6: Attached courseId
  points: dbUser.points,
  badges: dbUser.badges || []
});

// Helper to map DB Admission to Frontend Admission
export const mapAdmission = (dbAdm: any): AdmissionForm => ({
  id: dbAdm.id.toString(),
  firstName: dbAdm.first_name || '',
  lastName: dbAdm.last_name || '',
  cnic: dbAdm.cnic || '',
  dob: dbAdm.dob || '',
  gender: dbAdm.gender || 'Female',
  qualification: dbAdm.qualification || '',
  occupation: dbAdm.occupation || '',
  guardianName: dbAdm.guardian_name || '',
  whatsapp: dbAdm.whatsapp || '',
  guardianWhatsapp: dbAdm.guardian_whatsapp || '',
  relation: dbAdm.relation || '',
  address: dbAdm.address || '',
  email: dbAdm.email || '',
  courseId: dbAdm.course_id?.toString() || '',
  photo: dbAdm.photo || '',
  status: dbAdm.status || 'Pending',
  isDraft: dbAdm.is_draft === true,
  regNumber: dbAdm.reg_number || ''
});

// Helper to map DB Course to Frontend Course
export const mapCourse = (dbCourse: any): Course => ({
  id: dbCourse.id.toString(),
  name: dbCourse.name,
  thumbnail: dbCourse.thumbnail,
  instructorName: dbCourse.instructor_name,
  instructorImage: dbCourse.instructor_image,
  content: dbCourse.content,
  description: dbCourse.description,
  duration: dbCourse.duration,
  status: dbCourse.status,
  mode: dbCourse.mode,
  category: dbCourse.category
});

export const getDB = async () => {
  const [
    coursesRes,
    productsRes,
    admissionsRes,
    registerRes,
    resultsRes,
    schedulesRes,
    alertsRes,
    usersRes,
    instructorsRes,
    attendanceRes,
    quizzesRes,
    discussionsRes
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

  const registerData = registerRes.data || [];
  const usersData = usersRes.data || [];
  
  // Point 6: Cross-reference users with the register to find courseIds
  const users = usersData.map(u => {
    const regEntry = registerData.find(r => r.reg_number === u.reg_number);
    return mapUser(u, regEntry?.course_id?.toString());
  });

  const rawCurrentUser = JSON.parse(localStorage.getItem('ak_user') || 'null');
  let currentUser = null;
  if (rawCurrentUser) {
     const regEntry = registerData.find(r => r.reg_number === rawCurrentUser.reg_number);
     currentUser = mapUser(rawCurrentUser, regEntry?.course_id?.toString());
  }

  return { 
    courses: (coursesRes.data || []).map(mapCourse), 
    products: (productsRes.data || []).map(p => ({ ...p, id: p.id.toString(), stockStatus: p.stock_status, isFeatured: p.is_featured, category: p.category })), 
    admissions: (admissionsRes.data || []).map(mapAdmission), 
    register: registerData.map(r => ({ ...r, id: r.id.toString(), admission_id: r.admission_id?.toString(), course_id: r.course_id?.toString() })),
    currentUser: currentUser, 
    results: (resultsRes.data || []).map(r => ({ ...r, id: r.id.toString() })), 
    schedules: (schedulesRes.data || []).map(s => ({ ...s, id: s.id.toString(), courseId: s.course_id?.toString() })), 
    alerts: (alertsRes.data || []).map(a => ({ ...a, id: a.id.toString() })), 
    users: users,
    instructors: (instructorsRes.data || []).map(i => ({ ...i, id: i.id.toString(), userId: i.user_id?.toString() })),
    attendance: (attendanceRes.data || []).map(a => ({ ...a, id: a.id.toString(), courseId: a.course_id?.toString() })),
    quizzes: (quizzesRes.data || []).map(q => ({ ...q, id: q.id.toString(), courseId: q.course_id?.toString() })),
    discussions: (discussionsRes.data || []).map(d => ({ ...d, id: d.id.toString(), courseId: d.course_id?.toString(), userId: d.user_id?.toString() })),
    progress: []
  };
};

export const saveDB = async (key: string, data: any) => {
  if (key === 'ak_user') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};
