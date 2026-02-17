
import React, { useState, useEffect, useMemo } from 'react';
import { getDB, saveDB, getNextId } from './db';
import { Course, Product, AdmissionForm, User, Instructor, ExamResult, SessionSchedule, NewsAlert, UserProgress, AttendanceRecord, Quiz, DiscussionPost } from './types';
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
  // Added missing data states
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [discussions, setDiscussions] = useState<DiscussionPost[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    try {
      const db = await getDB();
      setCourses(db.courses);
      setProducts(db.products);
      setAdmissions(db.admissions);
      setCurrentUser(db.currentUser);
      setInstructors(db.instructors);
      setResults(db.results);
      setSchedules(db.schedules);
      setAlerts(db.alerts);
      setUsersList(db.users);
      // Synchronize missing data states
      setProgress(db.progress);
      setAttendance(db.attendance);
      setDiscussions(db.discussions);
      setQuizzes(db.quizzes);
    } catch (err) {
      console.error("Database connection failed", err);
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

  // Database Handlers (Refactored for Supabase)
  const handleUpdateCourse = async (updatedCourse: Course) => {
    const { id, ...data } = updatedCourse;
    await supabase.from('courses').update(data).eq('id', id);
    refreshData();
  };

  const handleAddCourse = async (newCourse: Course) => {
    await supabase.from('courses').insert(newCourse);
    refreshData();
  };

  const handleRemoveCourse = async (id: string) => {
    await supabase.from('courses').delete().eq('id', id);
    refreshData();
  };

  const handleSubmitAdmission = async (form: AdmissionForm) => {
    const { id, ...data } = form;
    await supabase.from('admission_forms').insert({ ...data, status: 'Pending', is_draft: false });
    refreshData();
  };

  const handleUpdateAdmission = async (id: string, status: 'Approved' | 'Rejected') => {
    const studentIdPart = id.slice(0, 4);
    const yearPart = new Date().getFullYear();
    const regNumber = status === 'Approved' ? `AKTVI/${studentIdPart}/${yearPart}` : null;
    await supabase.from('admission_forms').update({ status, reg_number: regNumber }).eq('id', id);
    refreshData();
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-800 rounded-full animate-spin mb-4"></div>
          <p className="text-teal-800 font-black uppercase tracking-widest text-[10px]">Accessing Institute Archives...</p>
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
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 uppercase">Empowering Skills for the Future</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover professional vocational courses designed to build financial independence for women.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
            onUpdateCourse={handleUpdateCourse}
            onAddCourse={handleAddCourse}
            onRemoveCourse={handleRemoveCourse}
            onUpdateAdmission={handleUpdateAdmission}
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
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50">
             <div className="p-12 bg-white rounded-[3rem] shadow-xl border border-slate-100 text-center">
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-4">Access Restricted</h2>
                <p className="text-slate-500 mb-8 font-medium">Administrative clearance is required to view this portal.</p>
                <button 
                  onClick={() => handlePageChange('home')} 
                  className="px-8 py-3 bg-teal-800 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-teal-950 transition-all"
                >
                  Return to Home
                </button>
             </div>
          </div>
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
        
        <main className="transition-all">
          {renderPage()}
        </main>

        <NewsAlertStack 
          alerts={alerts} 
          onAction={(page) => handlePageChange(page)} 
          forceMinimize={isAuthOpen}
        />

        <footer className="bg-teal-900 text-white py-12 px-4 no-print border-t border-teal-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-teal-500">
                  <img src="https://picsum.photos/seed/akbarlogo/100/100" alt="Logo" />
                </div>
                <div className="ml-3">
                  <span className="font-bold text-sm block leading-tight">Akbar Khan Technical and Vocational Institute (Regd. TTB).</span>
                </div>
              </div>
              <p className="text-teal-200 text-xs font-urdu leading-relaxed">
                اکبر خان فاؤنڈیشن پسماندہ خواتین کو مفت اعلیٰ معیار کی تکنیکی تعلیم فراہم کرتی ہے، جو سرٹیفکیٹس سے آگے مستقبل کی تعمیر کرتی ہے۔
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6 border-b border-teal-800 pb-2">Institutional Info</h4>
              <div className="space-y-3 text-sm text-teal-100">
                <p><span className="font-bold">MD:</span> Hamza Bacha</p>
                <p><span className="font-bold">Finance:</span> Aman Baig Akbar</p>
                <p><span className="font-bold">Advisor:</span> Ishtiaq Ali</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6 border-b border-teal-800 pb-2">Quick Contact</h4>
              <div className="space-y-3 text-sm text-teal-100">
                <p>Mobile: +92 315 5241325</p>
                <p>Email: hamzajanbacha@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-teal-800 text-center text-[10px] text-teal-500 uppercase tracking-widest">
            © 2024 Akbar Khan Technical and Vocational Institute (Regd. TTB).
          </div>
        </footer>

        {isAuthOpen && (
          <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => {
              setIsAuthOpen(false);
              setIntendedPage(null);
            }} 
            onLogin={handleLogin}
            users={usersList}
          />
        )}
      </div>
    </LiveSessionProvider>
  );
};

export default App;
