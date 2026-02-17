
import { Course, Product, User, AdmissionForm, Instructor, ExamResult, AttendanceRecord, SessionSchedule, NewsAlert, Quiz, DiscussionPost } from './types';

// Helper to simulate SQL Auto-Increment IDs in localStorage
export const getNextId = (key: string, collection: any[]): string => {
  const lastId = localStorage.getItem(`${key}_last_id`);
  const nextId = lastId ? parseInt(lastId) + 1 : (collection.length > 0 ? Math.max(...collection.map(item => parseInt(item.id) || 0)) + 1 : 1);
  localStorage.setItem(`${key}_last_id`, nextId.toString());
  return nextId.toString();
};

export const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    name: 'Fashion Designing',
    thumbnail: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
    instructorName: 'Sarah Ahmed',
    instructorImage: 'https://picsum.photos/seed/sarah/100/100',
    content: 'Pattern Making, Textile Arts, Tailoring',
    description: 'Master the art of garment construction and design from scratch.',
    duration: '6 Months',
    status: 'Active',
    mode: 'ON CAMPUS',
    modules: [
      { id: 'm1', title: 'History of Fashion', duration: '1 Week' },
      { id: 'm2', title: 'Basic Sketching', duration: '2 Weeks' },
      { id: 'm3', title: 'Pattern Cutting', duration: '4 Weeks' }
    ]
  },
  {
    id: '2',
    name: 'Digital Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    instructorName: 'Zainab Bibi',
    instructorImage: 'https://picsum.photos/seed/zainab/100/100',
    content: 'SEO, Social Media, Content Creation',
    description: 'Learn to build a digital presence and grow businesses online.',
    duration: '3 Months',
    status: 'Active',
    mode: 'ONLINE',
    modules: [
      { id: 'dm1', title: 'Intro to SEO', duration: '1 Week' },
      { id: 'dm2', title: 'Social Media Management', duration: '3 Weeks' }
    ]
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'q1',
    courseId: '1',
    title: 'Fashion Basics Quiz',
    questions: [
      { id: 'qs1', question: 'What is a "toile" in fashion design?', options: ['A finished garment', 'A test version of a garment', 'A type of fabric', 'A sewing machine part'], correctIndex: 1 },
      { id: 'qs2', question: 'Which fiber is natural?', options: ['Polyester', 'Nylon', 'Cotton', 'Spandex'], correctIndex: 2 }
    ]
  }
];

export const INITIAL_DISCUSSIONS: DiscussionPost[] = [
  {
    id: 'dp1',
    courseId: '1',
    userId: '1',
    userName: 'Admin',
    userRole: 'admin',
    title: 'Welcome to the Fashion Design Forum!',
    content: 'Feel free to share your sketches here and ask for feedback.',
    timestamp: new Date().toISOString(),
    replies: [
      { id: 'dr1', userId: '2', userName: 'Student One', content: 'Thank you! Excited to learn.', timestamp: new Date().toISOString() }
    ]
  }
];

export const INITIAL_INSTRUCTORS: Instructor[] = [
  {
    id: '1',
    userId: '3',
    name: 'Sarah Ahmed',
    qualification: 'Masters in Fashion Design',
    subject: 'Fashion Designing',
    classAssignment: 'Batch A',
    image: 'https://picsum.photos/seed/sarah/200/200'
  },
  {
    id: '2',
    userId: '4',
    name: 'Zainab Bibi',
    qualification: 'MBA Marketing',
    subject: 'Digital Marketing',
    classAssignment: 'Batch B',
    image: 'https://picsum.photos/seed/zainab/200/200'
  }
];

export const INITIAL_ADMISSIONS: AdmissionForm[] = [
  {
    id: '1',
    regNumber: 'AKTVI/0001/2024',
    firstName: 'Test',
    lastName: 'Student',
    cnic: '16101-1234567-1',
    dob: '2000-01-01',
    gender: 'Female',
    qualification: 'Bachelors',
    occupation: 'Student',
    guardianName: 'Test Guardian',
    whatsapp: '+923155241325',
    guardianWhatsapp: '+923155241325',
    relation: 'Father',
    address: 'Mardan, Pakistan',
    email: 'test@example.com',
    courseId: '1',
    photo: 'https://picsum.photos/seed/student/200/250',
    status: 'Approved',
    isDraft: false
  }
];

export const INITIAL_RESULTS: ExamResult[] = [
  {
    id: '1',
    studentId: 'AKTVI/0001/2024',
    examType: '1st Term',
    paperTotal: 100,
    paperObtained: 85,
    practicalTotal: 50,
    practicalObtained: 42,
    assignmentTotal: 25,
    assignmentObtained: 22,
    position: '1st',
    remarks: 'Excellent Performance',
    datePublished: new Date().toISOString()
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: '1',
    studentId: 'AKTVI/0001/2024',
    courseId: '1',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    joinTime: '09:15 AM',
    durationMinutes: 120
  }
];

export const INITIAL_SCHEDULES: SessionSchedule[] = [
  {
    id: '1',
    courseId: '1',
    topic: 'Intro to Pattern Making',
    startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    status: 'Scheduled'
  }
];

export const INITIAL_ALERTS: NewsAlert[] = [
  {
    id: '1',
    category: 'Admission',
    title: 'Admissions Open!',
    content: 'Fall 2024 Batch enrollment has started for Fashion Designing and IT.',
    actionText: 'Apply Now',
    actionPage: 'admissions',
    expiresAt: new Date(Date.now() + 604800000).toISOString(),
    priority: 'High'
  },
  {
    id: '2',
    category: 'Result',
    title: 'Final Exam Results',
    content: 'Batch-A results for 1st Semester are now live on the portal.',
    actionText: 'View DMC',
    actionPage: 'results',
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    priority: 'Normal'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Bridal Gown - Royal Crimson',
    price: '45,000 PKR',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=800',
    slogan: 'Elegance for your special day.',
    description: 'Hand-embroidered bridal wear designed by our top fashion graduates.'
  }
];

export const MOCK_USERS: User[] = [
  { id: '1', username: 'admin', password: 'password123', dob: '1990-01-01', role: 'admin', points: 500, badges: ['Elite'] },
  { id: '2', username: 'student', password: 'password123', dob: '2000-01-01', role: 'student', regNumber: 'AKTVI/0001/2024', points: 150, badges: ['First Steps'] },
  { id: '3', username: 'sarah', password: 'password123', dob: '1985-05-15', role: 'instructor' },
  { id: '4', username: 'zainab', password: 'password123', dob: '1992-10-20', role: 'instructor' }
];

export const getDB = () => {
  const courses = JSON.parse(localStorage.getItem('ak_courses') || JSON.stringify(INITIAL_COURSES));
  const products = JSON.parse(localStorage.getItem('ak_products') || JSON.stringify(INITIAL_PRODUCTS));
  const admissions = JSON.parse(localStorage.getItem('ak_admissions') || JSON.stringify(INITIAL_ADMISSIONS));
  const currentUser = JSON.parse(localStorage.getItem('ak_user') || 'null');
  const instructors = JSON.parse(localStorage.getItem('ak_instructors') || JSON.stringify(INITIAL_INSTRUCTORS));
  const results = JSON.parse(localStorage.getItem('ak_results') || JSON.stringify(INITIAL_RESULTS));
  const attendance = JSON.parse(localStorage.getItem('ak_attendance') || JSON.stringify(INITIAL_ATTENDANCE));
  const schedules = JSON.parse(localStorage.getItem('ak_schedules') || JSON.stringify(INITIAL_SCHEDULES));
  const alerts = JSON.parse(localStorage.getItem('ak_alerts') || JSON.stringify(INITIAL_ALERTS));
  const users = JSON.parse(localStorage.getItem('ak_users_table') || JSON.stringify(MOCK_USERS));
  const quizzes = JSON.parse(localStorage.getItem('ak_quizzes') || JSON.stringify(INITIAL_QUIZZES));
  const discussions = JSON.parse(localStorage.getItem('ak_discussions') || JSON.stringify(INITIAL_DISCUSSIONS));
  const progress = JSON.parse(localStorage.getItem('ak_progress') || '[]');
  
  return { courses, products, admissions, currentUser, instructors, results, attendance, schedules, alerts, users, quizzes, discussions, progress };
};

export const saveDB = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};
