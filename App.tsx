
import React, { useState, useEffect, useMemo } from 'react';
import { getDB, saveDB, mapUser, mapAdmission } from './db';
import { Course, Product, AdmissionForm, User, Instructor, ExamResult, SessionSchedule, NewsAlert, UserProgress, AttendanceRecord, Quiz, DiscussionPost, AdmissionWithdrawal } from './types';
import Navbar from './components/Navbar';
import NotificationTicker from './components/NotificationTicker';
import LiveStatusBar from './components/LiveStatusBar';
import NewsAlertStack from './components/NewsAlertStack';
import AuthModal from './components/AuthModal';
import CourseCard from './components/CourseCard';
import Home from './pages/Home';
import Sales from './pages/Sales';
import Admissions from './pages/Admissions';
import Results from './pages/Results';
import Admin from './pages/Admin';
import LMS from './pages/LMS';
import About from './pages/About';
import Donate from './pages/Donate';
import { LiveSessionProvider } from './components/LiveSessionContext';
import { supabase } from './lib/supabase';
import { Activity, Wifi, WifiOff } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [intendedPage, setIntendedPage] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionForm[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [schedules, setSchedules] = useState<SessionSchedule[]>([]);
  const [alerts, setAlerts] = useState<NewsAlert[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [discussions, setDiscussions] = useState<DiscussionPost[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [admissionWithdrawal, setAdmissionWithdrawal] = useState<AdmissionWithdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  const refreshData = async () => {
    try {
      setDbStatus('checking');
      const db = await getDB();
      const { data: regData } = await supabase.from('admission_withdrawal').select('*').order('enrollment_serial', { ascending: false });
      
      setCourses(db.courses);
      setProducts(db.products);
      setAdmissions(db.admissions);
      setCurrentUser(db.currentUser);
      setInstructors(db.instructors);
      setResults(db.results);
      setSchedules(db.schedules);
      setAlerts(db.alerts);
      setUsersList(db.users);
      setProgress(db.progress);
      setAttendance(db.attendance);
      setDiscussions(db.discussions);
      setQuizzes(db.quizzes);
      setAdmissionWithdrawal(regData || []);
      setDbStatus('online');
    } catch (err) {
      console.error("Database connection failed", err);
      setDbStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const nextSession = useMemo(() => {
    const live = schedules.find(s => s.status === 'Live');
    if (live) return live;
    const future = schedules
      .filter(s => s.status === 'Scheduled' && new Date(s.startTime).getTime() > Date.now())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    return future.length > 0 ? future[0] : null;
  }, [schedules]);

  const handlePageChange = (page: string) => {
    if ((page === 'lms' || page === 'admin') && !currentUser) {
      setIntendedPage(page);
      setIsAuthOpen(true);
    } else {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    saveDB('ak_user', user);
    setIsAuthOpen(false);
    if (intendedPage) {
      setCurrentPage(intendedPage);
      setIntendedPage(null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ak_user');
    setCurrentPage('home');
  };

  const mapAdmissionToDB = (form: AdmissionForm) => ({
    first_name: form.firstName,
    last_name: form.lastName,
    cnic: form.cnic,
    dob: form.dob,
    gender: form.gender,
    qualification: form.qualification,
    occupation: form.occupation,
    guardian_name: form.guardianName,
    whatsapp: form.whatsapp,
    guardian_whatsapp: form.guardianWhatsapp,
    relation: form.relation,
    address: form.address,
    email: form.email,
    course_id: form.courseId || null, // Ensure empty string becomes NULL for foreign key
    photo: form.photo,
    status: 'Pending',
    is_draft: form.isDraft
  });

  const handleSubmitAdmission = async (form: AdmissionForm) => {
    const dbPayload = mapAdmissionToDB(form);
    const { error } = await supabase.from('admission_forms').insert(dbPayload);
    if (error) {
      console.error("Submission error:", error);
      alert(`Registration failed: ${error.message}`);
    } else {
      alert("Application submitted successfully!");
      refreshData();
    }
  };

  const handleUpdateAdmission = async (id: string, status: 'Approved' | 'Rejected') => {
    const { data: admission, error: fetchError } = await supabase
      .from('admission_forms')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !admission) return;

    await supabase.from('admission_forms').update({ status }).eq('id', id);

    if (status === 'Approved') {
      const { error: regError } = await supabase.from('admission_withdrawal').insert({
        admission_id: id,
        student_name: `${admission.first_name} ${admission.last_name}`,
        cnic: admission.cnic,
        course_id: admission.course_id,
        status: 'Active'
      });
      if (regError) console.error("Permanent Register Error:", regError);
    }
    
    refreshData();
  };

  const handleUpdateRegisterStatus = async (id: string, status: string) => {
    await supabase.from('admission_withdrawal').update({ status }).eq('id', id);
    refreshData();
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-800 rounded-full animate-spin mb-4"></div>
          <p className="text-teal-800 font-black uppercase tracking-widest text-[10px]">Accessing Core Database...</p>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <Home 
            courses={courses} 
            products={products} 
            instructors={instructors}
            onApply={() => handlePageChange('admissions')} 
            onBuy={() => handlePageChange('sales')}
            onExploreCourses={() => handlePageChange('courses')}
            onDonateClick={() => handlePageChange('donate')}
          />
        );
      case 'about':
        return <About instructors={instructors} />;
      case 'donate':
        return <Donate />;
      case 'results':
        return <Results admissions={admissions} results={results} courses={courses} />;
      case 'courses':
        return (
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 uppercase text-center tracking-tighter">Empowering Skills for Women</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {courses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onApply={() => handlePageChange('admissions')} 
                />
              ))}
            </div>
          </div>
        );
      case 'sales':
        return <Sales products={products} onBuy={() => {}} />;
      case 'admissions':
        return <Admissions admissions={admissions} courses={courses} onSubmit={handleSubmitAdmission} onSaveDraft={() => {}} />;
      case 'admin':
        return currentUser?.role === 'admin' ? (
          <Admin 
            courses={courses} 
            admissions={admissions}
            instructors={instructors}
            users={usersList}
            results={results}
            schedules={schedules}
            alerts={alerts}
            progress={progress}
            attendance={attendance}
            discussions={discussions}
            admissionWithdrawal={admissionWithdrawal}
            onUpdateCourse={() => {}} 
            onAddCourse={() => {}}
            onRemoveCourse={() => {}}
            onUpdateAdmission={handleUpdateAdmission}
            onUpdateRegisterStatus={handleUpdateRegisterStatus}
            onAddInstructor={() => {}} 
            onUpdateInstructor={() => {}}
            onRemoveInstructor={() => {}}
            onAddResult={() => {}}
            onRemoveResult={() => {}}
            onUpdateSchedules={() => {}}
            onUpdateAlerts={() => {}}
            onPageChange={handlePageChange}
          />
        ) : (
          <div className="p-12 text-center font-black uppercase text-rose-600">Access Restricted to Admin Personnel</div>
        );
      case 'lms':
        return (
          <LMS 
            externalUser={currentUser} 
            onLogout={handleLogout} 
            onPageChange={handlePageChange}
            dbData={{
              courses,
              products,
              admissions,
              currentUser,
              instructors,
              results,
              attendance,
              schedules,
              alerts,
              users: usersList,
              quizzes,
              discussions,
              progress
            }}
          />
        );
      default:
        return <Home courses={courses} products={products} instructors={instructors} onApply={() => handlePageChange('admissions')} onBuy={() => {}} onExploreCourses={() => handlePageChange('courses')} onDonateClick={() => handlePageChange('donate')} />;
    }
  };

  return (
    <LiveSessionProvider>
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 no-print flex flex-col">
          <LiveStatusBar 
            nextSession={nextSession}
            courses={courses}
            onJoinNow={() => handlePageChange('lms')} 
          />
          <Navbar 
            currentPage={currentPage}
            setCurrentPage={handlePageChange}
            onLoginClick={() => setIsAuthOpen(true)}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
          <NotificationTicker />
        </header>
        
        <main>{renderPage()}</main>

        <footer className="bg-teal-900 text-white py-12 px-4 border-t border-teal-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-full overflow-hidden border-2 border-teal-500">
                  <img src="https://picsum.photos/seed/akbarlogo/100/100" alt="Logo" />
               </div>
               <span className="font-bold text-sm uppercase tracking-widest">AKTVI Institutional Core</span>
            </div>
            
            <div className="flex items-center gap-3 bg-black/20 p-3 rounded-2xl border border-white/5">
              {dbStatus === 'online' ? (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Database Core: Online</span>
                </>
              ) : (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">Database Core: Offline</span>
                </>
              )}
            </div>
          </div>
        </footer>

        {isAuthOpen && (
          <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)} 
            onLogin={handleLogin}
            users={usersList}
          />
        )}
      </div>
    </LiveSessionProvider>
  );
};

export default App;
