
import { supabase } from './lib/supabase';
import { Course, Product, User, AdmissionForm, Instructor, ExamResult, AttendanceRecord, SessionSchedule, NewsAlert, Quiz, DiscussionPost } from './types';

// Migration Helper: This can be used once to move local data if needed
export const migrateToSupabase = async () => {
  console.log("Migration script ready for use.");
};

export const getDB = async () => {
  const { data: courses } = await supabase.from('courses').select('*, modules:course_modules(*)');
  const { data: products } = await supabase.from('products').select('*');
  const { data: admissions } = await supabase.from('admission_forms').select('*');
  const { data: instructors } = await supabase.from('instructors').select('*');
  const { data: results } = await supabase.from('exam_results').select('*');
  const { data: attendance } = await supabase.from('attendance_records').select('*');
  const { data: schedules } = await supabase.from('session_schedules').select('*');
  const { data: alerts } = await supabase.from('news_alerts').select('*');
  const { data: users } = await supabase.from('users_table').select('*');
  const { data: quizzes } = await supabase.from('quizzes').select('*, questions:quiz_questions(*)');
  const { data: discussions } = await supabase.from('discussion_posts').select('*, replies:discussion_replies(*)');
  const { data: progress } = await supabase.from('user_progress').select('*');
  
  const currentUser = JSON.parse(localStorage.getItem('ak_user') || 'null');

  return { 
    courses: courses || [], 
    products: products || [], 
    admissions: admissions || [], 
    currentUser, 
    instructors: instructors || [], 
    results: results || [], 
    attendance: attendance || [], 
    schedules: schedules || [], 
    alerts: alerts || [], 
    users: users || [], 
    quizzes: quizzes || [], 
    discussions: discussions || [], 
    progress: progress || [] 
  };
};

export const saveDB = async (key: string, data: any) => {
  // Sync core session state to local storage for persistence
  if (key === 'ak_user') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const getNextId = (key: string, collection: any[]): string => {
  // Supabase handles IDs automatically, but for legacy frontend logic we maintain this
  return (collection.length + 1).toString();
};
