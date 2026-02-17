
import React, { useState } from 'react';
import { Course, AdmissionForm, CourseStatus, Instructor, User, ExamResult, ExamType, AttendanceRecord, AttendanceStatus, SessionSchedule, ScheduleStatus, NewsAlert, AlertCategory, UserProgress, DiscussionPost } from '../types';
import { Settings, Plus, Edit2, Trash2, CheckCircle, XCircle, Users, BookOpen, Clock, Layout, UserPlus, Shield, ClipboardList, Search, Calendar, Filter, PieChart, Info, Play, Activity, Megaphone, BellRing, BarChart3, TrendingUp, MessageSquare, UserCircle, Save, LogOut, Heart, Globe, ArrowLeft, X } from 'lucide-react';
import { getDB, saveDB, getNextId } from '../db';

interface AdminProps {
  courses: Course[];
  admissions: AdmissionForm[];
  instructors: Instructor[];
  users: User[];
  results: ExamResult[];
  schedules: SessionSchedule[];
  alerts: NewsAlert[];
  // Fix: Added missing data props to avoid synchronous DB calls
  progress: UserProgress[];
  attendance: AttendanceRecord[];
  discussions: DiscussionPost[];
  onUpdateCourse: (course: Course) => void;
  onRemoveCourse: (id: string) => void;
  onAddCourse: (course: Course) => void;
  onUpdateAdmission: (id: string, status: 'Approved' | 'Rejected') => void;
  onAddInstructor: (instructor: Instructor, user: User) => void;
  onUpdateInstructor: (instructor: Instructor, user: User) => void;
  onRemoveInstructor: (id: string) => void;
  onAddResult: (result: ExamResult) => void;
  onRemoveResult: (id: string) => void;
  onUpdateSchedules: (schedules: SessionSchedule[]) => void;
  onUpdateAlerts: (alerts: NewsAlert[]) => void;
  onPageChange: (page: string) => void;
}

const Admin: React.FC<AdminProps> = ({ 
  courses, admissions, instructors, users, results, schedules, alerts,
  progress, attendance, discussions,
  onUpdateCourse, onRemoveCourse, onAddCourse, onUpdateAdmission,
  onAddInstructor, onUpdateInstructor, onRemoveInstructor, onAddResult, onRemoveResult,
  onUpdateSchedules, onUpdateAlerts, onPageChange
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'admissions' | 'faculty' | 'results' | 'attendance' | 'schedules' | 'alerts' | 'analytics'>('courses');
  
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showFacultyForm, setShowFacultyForm] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<{instructor: Instructor, user: User} | null>(null);

  // Fix: Removed incorrect synchronous call to getDB (which is async)
  const progressLogs: UserProgress[] = progress;
  const attendanceLogs: AttendanceRecord[] = attendance;

  const [courseForm, setCourseForm] = useState<Partial<Course>>({ name: '', instructorName: '', duration: '', status: 'Active', mode: 'ON CAMPUS', content: '', description: '', thumbnail: 'https://picsum.photos/seed/course/800/600', instructorImage: 'https://picsum.photos/seed/inst/200/200' });
  const [facultyForm, setFacultyForm] = useState({ name: '', qualification: '', subject: '', classAssignment: '', image: 'https://picsum.photos/seed/faculty/200/200', username: '', password: '', dob: '1990-01-01' });
  const [resultForm, setResultForm] = useState<Partial<ExamResult>>({ studentId: '', examType: '1st Term', paperTotal: 100, paperObtained: 0, practicalTotal: 50, practicalObtained: 0, assignmentTotal: 25, assignmentObtained: 0, position: '', remarks: '' });

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) onUpdateCourse({ ...editingCourse, ...courseForm } as Course);
    else onAddCourse({ ...courseForm, id: Date.now().toString() } as Course);
    setShowCourseForm(false);
  };

  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const instructor: Instructor = {
      id: editingFaculty?.instructor.id || '',
      userId: editingFaculty?.user.id || '',
      name: facultyForm.name,
      qualification: facultyForm.qualification,
      subject: facultyForm.subject,
      classAssignment: facultyForm.classAssignment,
      image: facultyForm.image
    };
    const user: User = { id: editingFaculty?.user.id || '', username: facultyForm.username, password: facultyForm.password, dob: facultyForm.dob, role: 'instructor' };
    if (editingFaculty) onUpdateInstructor(instructor, user);
    else onAddInstructor(instructor, user);
    setShowFacultyForm(false);
  };

  const handleResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddResult({ ...resultForm, id: Date.now().toString(), datePublished: new Date().toISOString() } as ExamResult);
    setShowResultForm(false);
    setResultForm({ studentId: '', examType: '1st Term', paperTotal: 100, paperObtained: 0, practicalTotal: 50, practicalObtained: 0, assignmentTotal: 25, assignmentObtained: 0, position: '', remarks: '' });
  };

  const inputClasses = "w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-slate-50";
  const labelClasses = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 gap-6 no-print">
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="p-3 bg-teal-900 text-white rounded-2xl shadow-xl shrink-0">
              <Settings className="w-6 h-6 md:w-8 md:h-8" />
           </div>
           <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Admin Portal</h1>
              <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[8px] md:text-[9px] font-black text-emerald-600 uppercase tracking-widest">Authority Control</span>
              </div>
           </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner w-full md:w-auto">
           <div className="flex overflow-x-auto no-scrollbar w-full sm:w-auto">
              {['courses', 'faculty', 'results', 'admissions', 'analytics'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab as any)} 
                  className={`px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-widest flex-1 sm:flex-none ${activeTab === tab ? 'bg-white shadow-xl text-teal-800' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {tab === 'analytics' ? 'Insights' : tab}
                </button>
              ))}
           </div>
           <div className="hidden sm:block w-px h-6 bg-gray-300 mx-1"></div>
           <button 
              onClick={() => onPageChange('home')}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-teal-800 text-white rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-teal-950 transition-all shadow-lg active:scale-95 w-full sm:w-auto"
           >
             <Globe className="w-4 h-4" /> Website
           </button>
        </div>
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-6 md:space-y-8 animate-fadeIn">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Active Students', value: admissions.filter(a => a.status === 'Approved').length, icon: <Users className="text-teal-600" /> },
                { label: 'Avg Progress', value: '68%', icon: <BarChart3 className="text-blue-600" /> },
                { label: 'Quiz Submissions', value: progressLogs.reduce((acc, p) => acc + (p.quizScores?.length || 0), 0), icon: <ClipboardList className="text-purple-600" /> },
                { label: 'Forum Topics', value: discussions.length, icon: <MessageSquare className="text-emerald-600" /> }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-teal-50 shadow-sm">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-teal-50 rounded-xl">{stat.icon}</div>
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                   </div>
                   <p className="text-xl md:text-2xl font-black text-teal-950">{stat.value}</p>
                   <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="space-y-6 md:space-y-8">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">Curriculum Registry</h2>
              <button onClick={() => { setShowCourseForm(true); setEditingCourse(null); setCourseForm({ status: 'Active', mode: 'ON CAMPUS' }); }} className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl hover:bg-teal-700 transition-all shadow-xl w-full sm:w-auto justify-center">
                <Plus className="w-4 h-4 md:w-5 md:h-5" /> Add Course
              </button>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course.id} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all duration-500 group">
                   <div>
                      <div className="flex items-center justify-between mb-4">
                         <span className={`text-[8px] md:text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${course.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{course.status}</span>
                         <span className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest">{course.duration}</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-slate-900 mb-1 leading-tight">{course.name}</h3>
                      <p className="text-[9px] md:text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-4">{course.instructorName}</p>
                   </div>
                   <div className="flex gap-2 pt-6 border-t border-slate-50">
                      <button onClick={() => { setEditingCourse(course); setCourseForm(course); setShowCourseForm(true); }} className="flex-1 flex items-center justify-center gap-1.5 p-3 bg-slate-50 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-teal-800 hover:text-white transition-all shadow-sm">Config</button>
                      <button onClick={() => onRemoveCourse(course.id)} className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'faculty' && (
        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">Faculty</h2>
            <button 
              onClick={() => { 
                setEditingFaculty(null); 
                setFacultyForm({ name: '', qualification: '', subject: '', classAssignment: '', image: 'https://picsum.photos/seed/faculty/200/200', username: '', password: '', dob: '1990-01-01' }); 
                setShowFacultyForm(true); 
              }} 
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl hover:bg-teal-700 shadow-xl w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4 md:w-5 md:h-5" /> Add Faculty
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map(inst => {
              const user = users.find(u => u.id === inst.userId);
              return (
                <div key={inst.id} className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-teal-50 shadow-sm text-center hover:shadow-xl transition-all duration-500">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-3xl mx-auto mb-4 md:mb-6 overflow-hidden border-4 border-teal-50 shadow-inner">
                    <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tight text-base md:text-lg">{inst.name}</h4>
                  <p className="text-[9px] md:text-[10px] font-black text-teal-600 uppercase tracking-widest mt-1">{inst.subject}</p>
                  <div className="mt-6 pt-6 border-t border-slate-50 flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingFaculty({ instructor: inst, user: user! });
                        setFacultyForm({ ...inst, username: user?.username || '', password: user?.password || '', dob: user?.dob || '1990-01-01' });
                        setShowFacultyForm(true);
                      }}
                      className="flex-1 p-3 bg-slate-50 text-slate-600 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-teal-800 hover:text-white transition-all shadow-sm"
                    >
                      Config
                    </button>
                    <button onClick={() => onRemoveInstructor(inst.id)} className="p-3 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(activeTab === 'results' || activeTab === 'admissions') && (
        <div className="space-y-6 md:space-y-8">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">{activeTab === 'results' ? 'Transcripts' : 'Enrollments'}</h2>
              {activeTab === 'results' && (
                <button onClick={() => setShowResultForm(true)} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl hover:bg-teal-700 shadow-xl w-full sm:w-auto">
                  <Plus className="w-4 h-4 md:w-5 md:h-5" /> Issue Result
                </button>
              )}
           </div>
           
           <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="overflow-x-auto scrollbar-hide">
               <table className="w-full text-left min-w-[700px]">
                 <thead className="bg-slate-50 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                   {activeTab === 'results' ? (
                     <tr>
                       <th className="p-5 md:p-6">Entity ID</th>
                       <th className="p-5 md:p-6">Exam Cycle</th>
                       <th className="p-5 md:p-6">Matrix (P/Pr/A)</th>
                       <th className="p-5 md:p-6">Agg. %</th>
                       <th className="p-5 md:p-6">Status</th>
                       <th className="p-5 md:p-6">Action</th>
                     </tr>
                   ) : (
                     <tr>
                       <th className="p-5 md:p-6">Subject Entity</th>
                       <th className="p-5 md:p-6">Selection</th>
                       <th className="p-5 md:p-6">Contact</th>
                       <th className="p-5 md:p-6">Status</th>
                       <th className="p-5 md:p-6">Action</th>
                     </tr>
                   )}
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {activeTab === 'results' ? (
                      results.map(res => {
                        const total = res.paperObtained + res.practicalObtained + res.assignmentObtained;
                        const possible = res.paperTotal + res.practicalTotal + res.assignmentTotal;
                        const perc = ((total / possible) * 100).toFixed(1);
                        return (
                          <tr key={res.id} className="text-[11px] md:text-sm hover:bg-slate-50 transition-colors">
                            <td className="p-5 md:p-6 font-black text-teal-800 uppercase tracking-tight">{res.studentId}</td>
                            <td className="p-5 md:p-6 font-bold text-slate-600">{res.examType}</td>
                            <td className="p-5 md:p-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{res.paperObtained} / {res.practicalObtained} / {res.assignmentObtained}</td>
                            <td className="p-5 md:p-6 font-black text-slate-900">{perc}%</td>
                            <td className="p-5 md:p-6"><span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest">{res.position}</span></td>
                            <td className="p-5 md:p-6"><button onClick={() => onRemoveResult(res.id)} className="text-rose-500 hover:scale-125 transition-transform"><Trash2 className="w-4 h-4" /></button></td>
                          </tr>
                        );
                      })
                    ) : (
                      admissions.map(adm => (
                        <tr key={adm.id} className="text-[11px] md:text-sm hover:bg-slate-50 transition-colors">
                          <td className="p-5 md:p-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                                {adm.photo ? <img src={adm.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><UserCircle className="w-5 h-5 text-slate-300" /></div>}
                              </div>
                              <div className="min-w-0">
                                <p className="font-black text-slate-900 uppercase tracking-tight truncate">{adm.firstName} {adm.lastName}</p>
                                <p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest truncate">{adm.cnic}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5 md:p-6 font-black text-teal-800 uppercase tracking-tight text-[9px] md:text-xs">{courses.find(c => c.id === adm.courseId)?.name}</td>
                          <td className="p-5 md:p-6 font-black text-slate-400 text-[9px] md:text-[10px] uppercase tracking-widest whitespace-nowrap">{adm.whatsapp}</td>
                          <td className="p-5 md:p-6">
                            <span className={`px-2.5 py-1.5 rounded-xl text-[7px] md:text-[8px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] shadow-sm whitespace-nowrap ${adm.status === 'Approved' ? 'bg-emerald-500 text-white' : adm.status === 'Rejected' ? 'bg-rose-500 text-white' : 'bg-amber-400 text-slate-900'}`}>
                              {adm.status}
                            </span>
                          </td>
                          <td className="p-5 md:p-6">
                            {adm.status === 'Pending' && (
                              <div className="flex gap-2">
                                <button onClick={() => onUpdateAdmission(adm.id, 'Approved')} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle className="w-4 h-4" /></button>
                                <button onClick={() => onUpdateAdmission(adm.id, 'Rejected')} className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><XCircle className="w-4 h-4" /></button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      )}

      {/* Responsive Modals */}
      {[
        { show: showFacultyForm, title: 'Mentor Config', subtitle: 'Identity Profile', onSubmit: handleFacultySubmit, onClose: () => setShowFacultyForm(false), 
          fields: (
            <>
              <div className="col-span-2 text-[9px] font-black text-teal-600 uppercase border-b border-teal-50 pb-2 mb-2 flex items-center gap-2"><UserCircle className="w-4 h-4" /> Personal Profile</div>
              <div className="col-span-2 sm:col-span-1"><label className={labelClasses}>Full Identity</label><input required className={inputClasses} value={facultyForm.name} onChange={e => setFacultyForm({...facultyForm, name: e.target.value})} /></div>
              <div className="col-span-2 sm:col-span-1"><label className={labelClasses}>Technical Skill</label><input required className={inputClasses} value={facultyForm.subject} onChange={e => setFacultyForm({...facultyForm, subject: e.target.value})} /></div>
              <div className="col-span-2 sm:col-span-1"><label className={labelClasses}>Academic Rank</label><input required className={inputClasses} value={facultyForm.qualification} onChange={e => setFacultyForm({...facultyForm, qualification: e.target.value})} /></div>
              <div className="col-span-2 sm:col-span-1"><label className={labelClasses}>Assignment Group</label><input required className={inputClasses} value={facultyForm.classAssignment} onChange={e => setFacultyForm({...facultyForm, classAssignment: e.target.value})} /></div>
              <div className="col-span-2 text-[9px] font-black text-teal-600 uppercase border-b border-teal-50 pb-2 mt-4 mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> Portal Credentials</div>
              <div className="col-span-2 sm:col-span-1"><label className={labelClasses}>Access ID</label><input required className={inputClasses} value={facultyForm.username} onChange={e => setFacultyForm({...facultyForm, username: e.target.value})} /></div>
              <div className="col-span-2 sm:col-span-1"><label className={labelClasses}>Access Key</label><input required type="password" className={inputClasses} value={facultyForm.password} onChange={e => setFacultyForm({...facultyForm, password: e.target.value})} /></div>
            </>
          )
        },
        { show: showResultForm, title: 'Transcript Generator', subtitle: 'Issue Grade Sheet', onSubmit: handleResultSubmit, onClose: () => setShowResultForm(false),
          fields: (
            <>
              <div className="col-span-2"><label className={labelClasses}>Student ID (AKTVI/XXXX/YYYY)</label><input required className={`${inputClasses} font-black uppercase`} value={resultForm.studentId} onChange={e => setResultForm({...resultForm, studentId: e.target.value})} /></div>
              <div className="col-span-2 sm:col-span-1"><label className={labelClasses}>Exam Cycle</label>
                <select className={inputClasses} value={resultForm.examType} onChange={e => setResultForm({...resultForm, examType: e.target.value as ExamType})}>
                  <option value="1st Term">1st Term</option><option value="2nd Term">2nd Term</option><option value="Final Exam">Final Exam</option><option value="Board Exam">Board Exam</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1"><label className={labelClasses}>Rank Position</label><input required className={inputClasses} value={resultForm.position} onChange={e => setResultForm({...resultForm, position: e.target.value})} /></div>
              <div className="col-span-2 p-5 bg-teal-50 rounded-2xl grid grid-cols-3 gap-3">
                 <div><label className={labelClasses}>Theory</label><input required type="number" className={inputClasses} value={resultForm.paperObtained} onChange={e => setResultForm({...resultForm, paperObtained: parseInt(e.target.value) || 0})} /></div>
                 <div><label className={labelClasses}>Practical</label><input required type="number" className={inputClasses} value={resultForm.practicalObtained} onChange={e => setResultForm({...resultForm, practicalObtained: parseInt(e.target.value) || 0})} /></div>
                 <div><label className={labelClasses}>Asgn.</label><input required type="number" className={inputClasses} value={resultForm.assignmentObtained} onChange={e => setResultForm({...resultForm, assignmentObtained: parseInt(e.target.value) || 0})} /></div>
              </div>
              <div className="col-span-2"><label className={labelClasses}>Faculty Remarks</label><input className={inputClasses} value={resultForm.remarks} onChange={e => setResultForm({...resultForm, remarks: e.target.value})} /></div>
            </>
          )
        },
        { show: showCourseForm, title: 'Curriculum Editor', subtitle: 'Asset Management', onSubmit: handleCourseSubmit, onClose: () => setShowCourseForm(false),
          fields: (
            <>
              <div className="col-span-2"><label className={labelClasses}>Institutional Name</label><input required className={inputClasses} value={courseForm.name} onChange={e => setCourseForm({...courseForm, name: e.target.value})} /></div>
              <div className="col-span-2 sm:col-span-1"><label className={labelClasses}>Assigned Mentor</label><input required className={inputClasses} value={courseForm.instructorName} onChange={e => setCourseForm({...courseForm, instructorName: e.target.value})} /></div>
              <div className="col-span-2 sm:col-span-1"><label className={labelClasses}>Time Frame</label><input required className={inputClasses} value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} /></div>
              <div className="col-span-2"><label className={labelClasses}>Vision Slogan</label><input required className={inputClasses} value={courseForm.content} onChange={e => setCourseForm({...courseForm, content: e.target.value})} /></div>
              <div className="col-span-2"><label className={labelClasses}>Asset Description</label><textarea required rows={3} className={inputClasses} value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} /></div>
            </>
          )
        }
      ].map((modal, i) => modal.show && (
        <div key={i} className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
           <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={modal.onClose}></div>
           <div className="relative bg-white w-full max-w-xl rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[95vh]">
              <div className="bg-teal-900 p-6 md:p-8 text-white shrink-0">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg md:text-2xl font-black uppercase tracking-tight">{modal.title}</h3>
                    <button onClick={modal.onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                 </div>
                 <p className="text-teal-400 text-[9px] font-black uppercase tracking-widest">{modal.subtitle}</p>
              </div>
              <div className="flex-grow overflow-y-auto p-6 md:p-10 scrollbar-hide">
                 <form onSubmit={modal.onSubmit} className="grid grid-cols-2 gap-4 md:gap-6">
                    {modal.fields}
                    <div className="col-span-2 mt-6 flex gap-3">
                       <button type="button" onClick={modal.onClose} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200">Cancel</button>
                       <button type="submit" className="flex-[2] py-4 bg-teal-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-black transition-all">Commit Changes</button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      ))}
      
      <style>{`
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Admin;
