
import React, { useState, useMemo } from 'react';
import { Course, AdmissionForm, Instructor, User, ExamResult, ExamType, AttendanceRecord, SessionSchedule, NewsAlert, UserProgress, DiscussionPost } from '../types';
import { Settings, Plus, Trash2, CheckCircle, XCircle, Users, BookOpen, Globe, UserPlus, Shield, ClipboardList, Search, Activity, BarChart3, MessageSquare, UserCircle, X, ShieldAlert, FileCheck, GraduationCap, AlertTriangle } from 'lucide-react';

interface AdminProps {
  courses: Course[];
  admissions: AdmissionForm[];
  instructors: Instructor[];
  users: User[];
  results: ExamResult[];
  schedules: SessionSchedule[];
  alerts: NewsAlert[];
  progress: UserProgress[];
  attendance: AttendanceRecord[];
  discussions: DiscussionPost[];
  admissionWithdrawal: any[]; // Permanent Register Data
  onUpdateCourse: (course: Course) => void;
  onRemoveCourse: (id: string) => void;
  onAddCourse: (course: Course) => void;
  onUpdateAdmission: (id: string, status: 'Approved' | 'Rejected') => void;
  onUpdateRegisterStatus: (id: string, status: string) => void; // New action
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
  progress, attendance, discussions, admissionWithdrawal = [],
  onUpdateCourse, onRemoveCourse, onAddCourse, onUpdateAdmission, onUpdateRegisterStatus,
  onAddInstructor, onUpdateInstructor, onRemoveInstructor, onAddResult, onRemoveResult,
  onUpdateSchedules, onUpdateAlerts, onPageChange
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'admissions' | 'register' | 'faculty' | 'results' | 'analytics'>('courses');
  
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showFacultyForm, setShowFacultyForm] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<{instructor: Instructor, user: User} | null>(null);

  const [courseForm, setCourseForm] = useState<Partial<Course>>({ name: '', instructorName: '', duration: '', status: 'Active', mode: 'ON CAMPUS', content: '', description: '', thumbnail: 'https://picsum.photos/seed/course/800/600', instructorImage: 'https://picsum.photos/seed/inst/200/200' });
  const [facultyForm, setFacultyForm] = useState({ name: '', qualification: '', subject: '', classAssignment: '', image: 'https://picsum.photos/seed/faculty/200/200', username: '', password: '', dob: '1990-01-01' });
  const [resultForm, setResultForm] = useState<Partial<ExamResult>>({ studentId: '', examType: '1st Term', paperTotal: 100, paperObtained: 0, practicalTotal: 50, practicalObtained: 0, assignmentTotal: 25, assignmentObtained: 0, position: '', remarks: '' });

  const [searchQuery, setSearchQuery] = useState('');

  const filteredRegister = useMemo(() => {
    return admissionWithdrawal.filter(reg => 
      reg.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.reg_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.cnic?.includes(searchQuery)
    );
  }, [admissionWithdrawal, searchQuery]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-500 text-white';
      case 'Suspended': return 'bg-amber-500 text-white';
      case 'Rusticated': return 'bg-rose-600 text-white';
      case 'Certified': return 'bg-blue-600 text-white';
      case 'Approved': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

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
                 <span className="text-[8px] md:text-[9px] font-black text-emerald-600 uppercase tracking-widest">Command Center</span>
              </div>
           </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner w-full md:w-auto overflow-x-auto no-scrollbar">
           <div className="flex overflow-x-auto no-scrollbar w-full sm:w-auto gap-1">
              {[
                { id: 'courses', label: 'Curriculum' },
                { id: 'faculty', label: 'Faculty' },
                { id: 'results', label: 'Exam' },
                { id: 'admissions', label: 'Inbound' },
                { id: 'register', label: 'Permanent Register' },
                { id: 'analytics', label: 'Insights' }
              ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-widest flex-1 sm:flex-none ${activeTab === tab.id ? 'bg-white shadow-xl text-teal-800' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {tab.label}
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

      {activeTab === 'register' && (
        <div className="space-y-6 md:space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">Institutional Student Register</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Permanent Student Lifecycle Registry</p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search Reg# / Name / CNIC" 
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs shadow-sm outline-none focus:ring-2 focus:ring-teal-500"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="p-5 md:p-6">Registry ID (Reg #)</th>
                    <th className="p-5 md:p-6">Student Identity</th>
                    <th className="p-5 md:p-6">Course Enrollment</th>
                    <th className="p-5 md:p-6">Lifecycle Status</th>
                    <th className="p-5 md:p-6">Command Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRegister.map(reg => (
                    <tr key={reg.id} className="text-[11px] md:text-sm hover:bg-slate-50 transition-colors">
                      <td className="p-5 md:p-6">
                        <span className="font-black text-teal-800 font-mono tracking-tighter">{reg.reg_number}</span>
                        <div className="text-[8px] font-bold text-slate-300 uppercase mt-0.5">Serial: {reg.enrollment_serial}</div>
                      </td>
                      <td className="p-5 md:p-6">
                        <div className="font-black text-slate-900 uppercase tracking-tight">{reg.student_name}</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{reg.cnic}</div>
                      </td>
                      <td className="p-5 md:p-6">
                        <span className="font-black text-slate-600 uppercase text-[10px]">{courses.find(c => c.id === reg.course_id)?.name || 'N/A'}</span>
                      </td>
                      <td className="p-5 md:p-6">
                        <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(reg.status)}`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="p-5 md:p-6">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onUpdateRegisterStatus(reg.id, 'Active')}
                            title="Set Active"
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                            <Activity className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => onUpdateRegisterStatus(reg.id, 'Suspended')}
                            title="Suspend"
                            className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => onUpdateRegisterStatus(reg.id, 'Rusticated')}
                            title="Rusticate"
                            className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => onUpdateRegisterStatus(reg.id, 'Certified')}
                            title="Issue Certification"
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRegister.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
                        <Shield className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No Register Records Found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics, Courses, Faculty tabs logic... (unchanged from previous version except layout consistency) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 md:space-y-8 animate-fadeIn">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Total Enrolled', value: admissionWithdrawal.length, icon: <Users className="text-teal-600" /> },
                { label: 'Applications', value: admissions.length, icon: <ClipboardList className="text-blue-600" /> },
                { label: 'Active Learners', value: admissionWithdrawal.filter(r => r.status === 'Active').length, icon: <Activity className="text-emerald-600" /> },
                { label: 'Forum Topics', value: discussions.length, icon: <MessageSquare className="text-purple-600" /> }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-teal-50 shadow-sm">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-teal-50 rounded-xl">{stat.icon}</div>
                      <BarChart3 className="w-4 h-4 text-teal-400" />
                   </div>
                   <p className="text-xl md:text-2xl font-black text-teal-950">{stat.value}</p>
                   <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Rest of the Admin sections (Courses, Faculty, Admissions, Results) as previously defined... */}
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

      {activeTab === 'admissions' && (
        <div className="space-y-6 md:space-y-8">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">Inbound Enrollment Applications</h2>
           </div>
           
           <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="overflow-x-auto scrollbar-hide">
               <table className="w-full text-left min-w-[700px]">
                 <thead className="bg-slate-50 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                   <tr>
                     <th className="p-5 md:p-6">Applicant Profile</th>
                     <th className="p-5 md:p-6">Choice</th>
                     <th className="p-5 md:p-6">Contact</th>
                     <th className="p-5 md:p-6">Status</th>
                     <th className="p-5 md:p-6">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {admissions.map(adm => (
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
                          <span className={`px-2.5 py-1.5 rounded-xl text-[7px] md:text-[8px] font-black uppercase tracking-widest shadow-sm ${adm.status === 'Approved' ? 'bg-emerald-500 text-white' : adm.status === 'Rejected' ? 'bg-rose-500 text-white' : 'bg-amber-400 text-slate-900'}`}>
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
                    ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      )}

      {/* Modals... (unchanged) */}
    </div>
  );
};

export default Admin;
