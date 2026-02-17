
import { supabase } from './lib/supabase';
import { Course, Product, User, AdmissionForm, Instructor, ExamResult, AttendanceRecord, SessionSchedule, NewsAlert, Quiz, DiscussionPost } from './types';

export const getDB = async () => {
  // Fetch all core institutional tables
  const { data: courses } = await supabase.from('courses').select('*');
  const { data: products } = await supabase.from('products').select('*');
  const { data: admissions } = await supabase.from('admission_forms').select('*');
  const { data: register } = await supabase.from('admission_withdrawal').select('*');
  const { data: results } = await supabase.from('exam_results').select('*');
  const { data: schedules } = await supabase.from('session_schedules').select('*');
  const { data: alerts } = await supabase.from('news_alerts').select('*');
  const { data: users } = await supabase.from('users_table').select('*');
  
  const currentUser = JSON.parse(localStorage.getItem('ak_user') || 'null');

  return { 
    courses: courses || [], 
    products: products || [], 
    admissions: admissions || [], 
    register: register || [],
    currentUser, 
    results: results || [], 
    schedules: schedules || [], 
    alerts: alerts || [], 
    users: users || [],
    instructors: [], // To be fetched from instructors table if needed
    attendance: [],
    quizzes: [],
    discussions: [],
    progress: []
  };
};

export const saveDB = async (key: string, data: any) => {
  if (key === 'ak_user') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};
