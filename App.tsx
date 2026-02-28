
import React, { useState, useEffect, useMemo } from 'react';
import { getDB, saveDB } from './db';
import { Course, Product, AdmissionForm, User, Instructor, ExamResult, SessionSchedule, NewsAlert, UserProgress, AttendanceRecord, Quiz, DiscussionPost, AdmissionWithdrawal, AdmissionStatus } from './types';
import Sidebar from './components/Sidebar';
import LiveStatusBar from './components/LiveStatusBar';
import MainNav from './components/MainNav';
import NotificationTicker from './components/NotificationTicker';
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
import { useLiveSession } from './components/LiveSessionContext';
import { supabase } from './lib/supabase';
import { Mail, MapPin, Phone, ShieldCheck, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [intendedPage, setIntendedPage] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const { terminateSession } = useLiveSession();

  const refreshData = async () => {
    try {
      setDbStatus('checking');
      const db = await getDB();
      const { data: regData, error: regError } = await supabase
        .from('admission_withdrawal')
        .select('*')
        .order('enrollment_serial', { ascending: false });
      
      if (regError) console.error("Register sync error:", regError);

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

    const channel = supabase
      .channel('public:session_schedules')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_schedules' }, () => {
        refreshData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const activeOrNextSession = useMemo(() => {
    let baseSchedules = schedules;
    if (currentUser?.role === 'student' && currentUser.courseId) {
      baseSchedules = schedules.filter(s => s.courseId === currentUser.courseId);
    }
    const live = baseSchedules.find(s => s.status === 'Live');
    if (live) return live;
    return baseSchedules
      .filter(s => s.status === 'Scheduled')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0] || null;
  }, [schedules, currentUser]);

  const sessionDisplayName = useMemo(() => {
    if (!activeOrNextSession) return "Institutional Feed";
    const course = courses.find(c => c.id === activeOrNextSession.courseId);
    return course ? course.name : activeOrNextSession.topic;
  }, [activeOrNextSession, courses]);

  const handlePageChange = (page: string) => {
    if ((page === 'admin' || page === 'lms') && !currentUser) {
      setIntendedPage(page);
      setAuthView('login');
      setIsAuthOpen(true);
    } else {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
    setIsSidebarOpen(false);
  };

  const handleLoginTrigger = () => {
    setAuthView('login');
    setIsAuthOpen(true);
  };

  const handleSignupTrigger = () => {
    setAuthView('signup');
    setIsAuthOpen(true);
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

  const handleLogout = async () => {
    // If instructor/admin, check for active live session and end it
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'instructor')) {
      const activeSession = schedules.find(s => s.status === 'Live');
      if (activeSession) {
        // If admin, we can end any session. If instructor, we end their course session.
        const shouldEnd = currentUser.role === 'admin' || activeSession.courseId === currentUser.courseId;
        
        if (shouldEnd) {
          try {
            const numericId = parseInt(activeSession.id);
            if (!isNaN(numericId)) {
                await supabase
                  .from('session_schedules')
                  .update({ status: 'Completed' })
                  .eq('id', numericId);
                
                terminateSession();
            }
          } catch (err) {
            console.error("Failed to end session on logout", err);
          }
        }
      }
    }

    setCurrentUser(null);
    localStorage.removeItem('ak_user');
    setCurrentPage('home');
    setIsSidebarOpen(false);
    refreshData();
  };

  const handleAddCourse = async (courseData: Partial<Course>) => {
    const { error } = await supabase.from('courses').insert({
      name: courseData.name,
      instructor_name: courseData.instructorName,
      duration: courseData.duration,
      status: courseData.status,
      mode: courseData.mode,
      description: courseData.description,
      thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e'
    });
    if (error) alert("Sync Error: " + error.message);
    else await refreshData();
  };

  const handleRemoveCourse = async (id: string) => {
    if (!confirm("Remove this course?")) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) alert("Sync Error: " + error.message);
    else await refreshData();
  };

  const handleCreateStudentAccount = async (regEntry: any): Promise<any> => {
    const defaultPassword = 'stu123';
    const username = regEntry.reg_number.replace(/\//g, '').toLowerCase();
    const { data: admData, error: admError } = await supabase
      .from('admission_forms')
      .select('email, dob, first_name, last_name')
      .eq('id', regEntry.admission_id)
      .single();

    if (admError || !admData) return null;

    const { data: existingUser } = await supabase.from('users_table').select('*').eq('username', username).maybeSingle();
    if (existingUser) return existingUser;

    const { data: newUser, error: userErr } = await supabase.from('users_table').insert({
      username: username,
      password: defaultPassword,
      first_name: admData.first_name,
      last_name: admData.last_name,
      role: 'student',
      reg_number: regEntry.reg_number,
      email: admData.email,
      dob: admData.dob
    }).select().single();

    if (userErr) return null;
    await refreshData();
    return newUser;
  };

  const handleUpdateAdmission = async (id: string, status: AdmissionStatus, remarks?: string) => {
    const { data: adm, error: fetchErr } = await supabase.from('admission_forms').select('*').eq('id', id).single();
    if (fetchErr || !adm) return;

    const { error: updateErr } = await supabase.from('admission_forms').update({ status, remarks }).eq('id', id);
    if (updateErr) return;

    if (status === 'Approved') {
      const { data: regEntry, error: regErr } = await supabase.from('admission_withdrawal').insert({
        admission_id: id,
        student_name: `${adm.first_name} ${adm.last_name}`,
        cnic: adm.cnic,
        course_id: adm.course_id,
        status: 'Active'
      }).select().single();
      if (regErr) return;
      await handleCreateStudentAccount(regEntry);
    }
    await refreshData();
  };

  const handleUpdateRegisterStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('admission_withdrawal').update({ status }).eq('id', id);
    if (!error) await refreshData();
  };

  const handleAddInstructor = async (data: any) => {
    const { data: user, error: userErr } = await supabase.from('users_table').insert({
      username: data.username,
      password: data.password,
      first_name: data.name.split(' ')[0],
      last_name: data.name.split(' ').slice(1).join(' '),
      role: 'instructor',
      email: data.email,
      dob: data.dob
    }).select().single();

    if (userErr) return;
    await supabase.from('instructors').insert({
      user_id: user.id,
      name: data.name,
      qualification: data.qualification,
      subject: data.subject,
      class_assignment: data.classAssignment,
      image: 'https://picsum.photos/seed/faculty/200/200'
    });
    await refreshData();
  };

  const handleRemoveInstructor = async (id: string) => {
    const { error } = await supabase.from('instructors').delete().eq('id', id);
    if (!error) await refreshData();
  };

  const handleAddResult = async (data: any) => {
    const { error } = await supabase.from('exam_results').insert({
      student_id: data.studentId,
      exam_type: data.examType,
      paper_total: data.paperTotal,
      paper_obtained: data.paperObtained,
      practical_total: data.practicalTotal,
      practical_obtained: data.practicalObtained,
      assignment_total: data.assignmentTotal,
      assignment_obtained: data.assignmentObtained,
      remarks: data.remarks
    });
    if (!error) await refreshData();
  };

  const handleRemoveResult = async (id: string) => {
    const { error } = await supabase.from('exam_results').delete().eq('id', id);
    if (!error) await refreshData();
  };

  const handleAddAlert = async (data: any) => {
    const { error } = await supabase.from('news_alerts').insert({
      category: data.category,
      title: data.title,
      content: data.content,
      action_text: data.actionText,
      action_page: data.actionPage,
      expires_at: data.expiresAt,
      priority: data.priority || 'Normal'
    });
    if (!error) await refreshData();
  };

  const handleRemoveAlert = async (id: string) => {
    const { error } = await supabase.from('news_alerts').delete().eq('id', id);
    if (!error) await refreshData();
  };

  const handleBuyCourse = async (courseId: string) => {
    if (!currentUser) {
      handleLoginTrigger();
      return;
    }
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    if (confirm(`Purchase ${course.name} for PKR ${course.price}?`)) {
      // Simulate payment processing
      const newPurchasedCourses = [...(currentUser.purchasedCourses || []), courseId];
      
      const { error } = await supabase.from('users_table').update({
        purchased_courses: newPurchasedCourses
      }).eq('id', currentUser.id);

      if (error) {
        alert("Purchase failed: " + error.message);
      } else {
        alert("Purchase successful! You can now access this course in the LMS.");
        await refreshData();
      }
    }
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-primary rounded-full animate-spin mb-6"></div>
          <p className="type-label tracking-[0.4em]">Establishing Secure Connection...</p>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <Home courses={courses} products={products} instructors={instructors} onApply={() => handlePageChange('admissions')} onBuy={() => handlePageChange('sales')} onBuyCourse={handleBuyCourse} onExploreCourses={() => handlePageChange('courses')} onDonateClick={() => handlePageChange('donate')} onLoginClick={handleLoginTrigger} onSignupClick={() => handlePageChange('admissions')} />;
      case 'about': return <About instructors={instructors} />;
      case 'donate': return <Donate />;
      case 'results': return <Results admissions={admissions} results={results} courses={courses} />;
      case 'courses':
        return (
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="mb-16"><h2 className="type-h2">Available Programs</h2><p className="type-body mt-4">Browse our current technical and vocational offerings.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {courses.map(course => <CourseCard key={course.id} course={course} onApply={() => handlePageChange('admissions')} onBuy={handleBuyCourse} />)}
            </div>
          </div>
        );
      case 'sales': return <Sales products={products} onBuy={() => {}} isAdmin={currentUser?.role === 'admin'} onAddProduct={async (p) => {
        const { error } = await supabase.from('products').insert({ name: p.name, price: p.price, image: p.image, slogan: p.slogan, description: p.description, stock_status: p.stockStatus, is_featured: p.isFeatured, category: p.category });
        if (error) {
          console.error("Error adding product:", error);
          // Fallback if columns don't exist
          await supabase.from('products').insert({ name: p.name, price: p.price, image: p.image, slogan: p.slogan, description: p.description });
        }
        refreshData();
      }} onUpdateProduct={async (p) => {
        const { error } = await supabase.from('products').update({ name: p.name, price: p.price, image: p.image, slogan: p.slogan, description: p.description, stock_status: p.stockStatus, is_featured: p.isFeatured, category: p.category }).eq('id', p.id);
        if (error) {
          console.error("Error updating product:", error);
          // Fallback if columns don't exist
          await supabase.from('products').update({ name: p.name, price: p.price, image: p.image, slogan: p.slogan, description: p.description }).eq('id', p.id);
        }
        refreshData();
      }} />;
      case 'admissions':
        return <Admissions admissions={admissions} courses={courses} onSignupClick={handleSignupTrigger}
          onSubmit={(f) => {
            const payload = { first_name: f.firstName, last_name: f.lastName, cnic: f.cnic, dob: f.dob, gender: f.gender, qualification: f.qualification, occupation: f.occupation, guardian_name: f.guardianName, whatsapp: f.whatsapp, guardian_whatsapp: f.guardian_whatsapp || f.guardianWhatsapp, relation: f.relation, address: f.address, email: f.email, course_id: f.courseId || null, photo: f.photo, status: 'Pending', is_draft: false };
            supabase.from('admission_forms').insert(payload).then(() => refreshData());
          }} 
          onSaveDraft={(f) => {
            const payload = { first_name: f.firstName, last_name: f.lastName, cnic: f.cnic, dob: f.dob, gender: f.gender, qualification: f.qualification, occupation: f.occupation, guardian_name: f.guardianName, whatsapp: f.whatsapp, guardian_whatsapp: f.guardian_whatsapp || f.guardianWhatsapp, relation: f.relation, address: f.address, email: f.email, course_id: f.courseId || null, photo: f.photo, status: 'Pending', is_draft: true };
            supabase.from('admission_forms').insert(payload).then(() => refreshData());
          }} 
        />;
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
            admissionWithdrawal={admissionWithdrawal} 
            onAddCourse={handleAddCourse} 
            onRemoveCourse={handleRemoveCourse} 
            onUpdateAdmission={handleUpdateAdmission} 
            onUpdateRegisterStatus={handleUpdateRegisterStatus} 
            onAddInstructor={handleAddInstructor} 
            onRemoveInstructor={handleRemoveInstructor} 
            onAddResult={handleAddResult} 
            onRemoveResult={handleRemoveResult} 
            onAddAlert={handleAddAlert}
            onRemoveAlert={handleRemoveAlert}
            onPageChange={handlePageChange} 
            onRefreshData={refreshData} 
            onCreateStudentAccount={handleCreateStudentAccount} 
          />
        ) : ( <div className="p-12 text-center type-label text-brand-accent">Access Restricted</div> );
      case 'lms':
        return <LMS externalUser={currentUser} onLogout={handleLogout} onPageChange={handlePageChange} onRefreshData={refreshData} onLoginClick={handleLoginTrigger} dbData={{ courses, products, admissions, currentUser, instructors, results, attendance, schedules, alerts, users: usersList, quizzes, discussions, progress, register: admissionWithdrawal }} />;
      default:
        return <Home courses={courses} products={products} instructors={instructors} onApply={() => handlePageChange('admissions')} onBuy={() => {}} onExploreCourses={() => handlePageChange('courses')} onDonateClick={() => handlePageChange('donate')} onLoginClick={handleLoginTrigger} onSignupClick={() => handlePageChange('admissions')} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-slate flex flex-col">
      <header className="sticky top-0 z-50 no-print flex flex-col shadow-sm shrink-0">
          <NotificationTicker 
            liveSession={activeOrNextSession?.status === 'Live' ? activeOrNextSession : null} 
            sessionName={sessionDisplayName} 
          />
          <LiveStatusBar 
            session={activeOrNextSession}
            sessionName={sessionDisplayName}
            onJoinNow={() => handlePageChange('lms')} 
            onToggleSidebar={() => setIsSidebarOpen(true)}
            onLogoClick={() => handlePageChange('home')}
          />
          <MainNav currentPage={currentPage} setCurrentPage={handlePageChange} currentUser={currentUser} />
        </header>

        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} currentPage={currentPage} setCurrentPage={handlePageChange} currentUser={currentUser} onLogout={handleLogout} onLoginClick={handleLoginTrigger} />

        <main className="relative z-0 flex-grow">{renderPage()}</main>
        
        {/* Harmonized Institutional Footer */}
        <footer className="relative bg-brand-dark text-white pt-16 pb-10 px-6 no-print overflow-hidden border-t border-brand-primary/10">
            
            {/* Subtle Background Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none font-urdu text-5xl md:text-7xl lg:text-9xl flex items-center justify-center whitespace-nowrap overflow-hidden">
              اکبر خان ٹیکنیکل انسٹیٹیوٹ
            </div>

            <div className="container max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
                
                {/* Branding Lockup - Simplified Hierarchy */}
                <div className="space-y-6">
                  <div className="flex flex-col items-start">
                     <span className="text-[8px] font-black text-brand-primary uppercase tracking-[0.4em] mb-2 opacity-60">Sovereign Institution</span>
                     <h2 className="font-outfit text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                      Akbar Khan <br className="hidden md:block"/>
                      Technical & Vocational <br className="hidden md:block"/>
                      <span className="text-brand-primary">Institute Mardan</span>
                     </h2>
                     
                     <div className="mt-6 flex items-center gap-3 px-4 py-1.5 rounded-lg border border-brand-accent/30 bg-brand-accent/5">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-brand-accent">
                          Regd. Trade Testing Board
                        </span>
                     </div>
                  </div>
                </div>

                {/* Information Modules - Uniform Sizing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <h4 className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Connect</h4>
                      <div className="space-y-3">
                         <a href="tel:03155241756" className="flex items-center gap-3 text-sm font-medium text-teal-100/80 hover:text-white transition-colors">
                            <Phone className="w-4 h-4 text-brand-primary/60" /> 0315-5241756
                         </a>
                         <div className="flex items-center gap-3 text-sm font-medium text-teal-100/80">
                            <Mail className="w-4 h-4 text-brand-primary/60" /> admin@aktvi.edu.pk
                         </div>
                         <div className="flex items-center gap-3 text-sm font-medium text-teal-100/80">
                            <Globe className="w-4 h-4 text-brand-primary/60" /> aktvi.edu.pk
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Campus</h4>
                      <a href="https://maps.app.goo.gl/ngzW4XdB3LwC2gEW6" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group cursor-pointer">
                         <MapPin className="w-4 h-4 text-brand-primary/60 shrink-0 mt-0.5 group-hover:text-brand-primary transition-colors" />
                         <p className="text-sm font-medium text-teal-100/80 leading-relaxed group-hover:text-white transition-colors">
                            2nd Floor, BAAZ PLAZA,<br/>
                            Gujar Garhi Bypass, Charsadda chowk<br/>
                            Mardan, KP, Pakistan.
                         </p>
                      </a>
                   </div>
                </div>
              </div>

              {/* Bottom Utility Bar - Symmetric Balance */}
              <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'online' ? 'bg-brand-primary' : 'bg-brand-accent'} animate-pulse`}></div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-teal-100/30">
                        Sync: {dbStatus.toUpperCase()}
                      </span>
                   </div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-teal-100/30">
                      AK-EDU PROTOCOL V1.0
                   </span>
                </div>
                
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-teal-100/20">
                  © 2024 AK FOUNDATION MARDAN • EMPOWERING THROUGH SKILL
                </p>
              </div>
            </div>
          </footer>

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} users={usersList} initialView={authView} />
    </div>
  );
};

export default App;
