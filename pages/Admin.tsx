
import React, { useState, useRef } from 'react';
import { 
  Course, AdmissionForm, Instructor, User, ExamResult, 
  SessionSchedule, NewsAlert, AdmissionStatus
} from '../types';
import { 
  Settings, Plus, Trash2, CheckCircle, XCircle, 
  BarChart3, Eye, Printer, Edit3, Mail, 
  Video, UserMinus, UserX, UserCheck, FileText, Download, User as UserIcon, Phone, MapPin, Briefcase, GraduationCap
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminProps {
  courses: Course[];
  admissions: AdmissionForm[];
  instructors: Instructor[];
  users: User[];
  results: ExamResult[];
  schedules: SessionSchedule[];
  alerts: NewsAlert[];
  admissionWithdrawal: any[];
  onAddCourse: (course: Partial<Course>) => Promise<void>;
  onRemoveCourse: (id: string) => Promise<void>;
  onUpdateAdmission: (id: string, status: AdmissionStatus, remarks?: string) => Promise<void>;
  onUpdateRegisterStatus: (id: string, status: string) => Promise<void>; 
  onAddInstructor: (instructorData: any) => Promise<void>;
  onRemoveInstructor: (id: string) => Promise<void>;
  onAddResult: (result: Partial<ExamResult>) => Promise<void>;
  onRemoveResult: (id: string) => Promise<void>;
  onPageChange: (page: string) => void;
  onRefreshData: () => Promise<void>;
  onCreateStudentAccount: (regEntry: any) => Promise<any>;
  onAddAlert: (alert: Partial<NewsAlert>) => Promise<void>;
  onRemoveAlert: (id: string) => Promise<void>;
}

const Admin: React.FC<AdminProps> = ({ 
  courses, admissions, instructors, admissionWithdrawal = [], results, alerts = [],
  onAddCourse, onRemoveCourse, onUpdateAdmission, onUpdateRegisterStatus,
  onAddInstructor, onRemoveInstructor, onAddResult, onRemoveResult,
  onAddAlert, onRemoveAlert,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'admissions' | 'register' | 'faculty' | 'results' | 'analytics' | 'news'>('courses');
  const [isSyncing, setIsSyncing] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [emailLog, setEmailLog] = useState<string[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  // Local Form States
  const [courseForm, setCourseForm] = useState<Partial<Course>>({ name: '', instructorName: '', thumbnail: '', duration: '', status: 'Active', mode: 'ON CAMPUS', description: '' });
  const [facultyForm, setFacultyForm] = useState({ name: '', username: '', password: '', email: '', qualification: '', subject: '', assignment: '' });
  const [resultForm, setResultForm] = useState<Partial<ExamResult>>({ studentId: '', examType: 'Final Exam', paperTotal: 100, paperObtained: 0, practicalTotal: 50, practicalObtained: 0, remarks: '' });
  const [scheduleForm, setScheduleForm] = useState({ courseId: '', topic: '', startTime: '' });
  const [alertForm, setAlertForm] = useState<Partial<NewsAlert>>({ category: 'Urgent', title: '', content: '', actionText: 'Learn More', actionPage: 'home', priority: 'Normal', expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] });

  const logEmail = (msg: string) => {
    setEmailLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)]);
  };

  const typeLabel = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]";
  const idCell = "font-mono font-bold text-teal-800 tracking-tighter";
  const masterLabel = "text-[9px] font-black text-teal-600 uppercase tracking-widest mb-1 block";
  const masterValue = "text-sm font-bold text-slate-900 uppercase";

  const handlePrint = () => {
    window.print();
  };

  const handleCourseSubmit = async () => {
    setIsSyncing(true);
    try {
      if (selectedItem) {
        await supabase.from('courses').update({
          name: courseForm.name,
          instructor_name: courseForm.instructorName,
          thumbnail: courseForm.thumbnail,
          duration: courseForm.duration,
          status: courseForm.status,
          mode: courseForm.mode,
          description: courseForm.description
        }).eq('id', selectedItem.id);
      } else {
        await onAddCourse(courseForm);
      }
      setModalType(null);
      onRefreshData();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFacultySubmit = async () => {
    setIsSyncing(true);
    try {
      await onAddInstructor({
        ...facultyForm,
        classAssignment: facultyForm.assignment,
        dob: '2000-01-01'
      });
      setModalType(null);
      onRefreshData();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResultSubmit = async () => {
    setIsSyncing(true);
    try {
      await onAddResult(resultForm);
      setModalType(null);
      onRefreshData();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAlertSubmit = async () => {
    setIsSyncing(true);
    try {
      await onAddAlert(alertForm);
      setModalType(null);
      setAlertForm({ category: 'Urgent', title: '', content: '', actionText: 'Learn More', actionPage: 'home', priority: 'Normal', expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] });
      onRefreshData();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleScheduleSubmit = async () => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('session_schedules').insert({
        course_id: scheduleForm.courseId,
        topic: scheduleForm.topic,
        start_time: scheduleForm.startTime,
        status: 'Scheduled'
      });
      if (error) throw error;
      setModalType(null);
      onRefreshData();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleApproveAdmission = async (adm: AdmissionForm) => {
    if (!confirm(`Approve ${adm.firstName}? This will create a student account and send an email.`)) return;
    setIsSyncing(true);
    try {
      await onUpdateAdmission(adm.id, 'Approved');
      logEmail(`SYSTEM: Credentials & Welcome Kit sent to ${adm.email}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRejectAdmission = async (adm: AdmissionForm) => {
    const remarks = prompt("Enter rejection remarks for student:");
    if (remarks === null) return;
    setIsSyncing(true);
    try {
      await onUpdateAdmission(adm.id, 'Rejected', remarks);
      logEmail(`SYSTEM: Rejection Notice sent to ${adm.email}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateRegisterStatusWithNotification = async (reg: any, newStatus: string) => {
    setIsSyncing(true);
    try {
      await onUpdateRegisterStatus(reg.id, newStatus);
      const email = admissions.find(a => a.id === reg.admission_id)?.email || 'N/A';
      logEmail(`NOTIFY: Student status changed to ${newStatus}. Alert sent to ${email}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const MasterStudentView = ({ data, isEnrolled = false }: { data: any, isEnrolled?: boolean }) => {
    // Merge data from admission form if it's a register entry
    const admissionData = isEnrolled 
      ? admissions.find(a => a.id.toString() === data.admission_id?.toString()) 
      : data;

    if (!admissionData) return <div className="p-10 text-center">Data Not Found</div>;

    return (
      <div className="space-y-10 print:space-y-6" id="printable-master-record">
        {/* Header Profile Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-slate-100">
            <div className="relative w-40 h-52 shrink-0 rounded-2xl overflow-hidden border-4 border-white shadow-2xl ring-1 ring-slate-100 bg-slate-100 flex items-center justify-center">
               {admissionData.photo ? (
                 <img src={admissionData.photo} className="w-full h-full object-cover" />
               ) : (
                 <UserIcon className="w-16 h-16 text-slate-300" />
               )}
               {isEnrolled && (
                <div className="absolute bottom-0 inset-x-0 bg-teal-900/90 py-2 text-center">
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">Enrolled</span>
                </div>
              )}
           </div>
           
           <div className="flex-grow space-y-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
                  {admissionData.firstName} {admissionData.lastName}
                </h2>
                <p className="text-xs font-bold text-teal-600 uppercase tracking-[0.2em]">{courses.find(c => c.id === admissionData.courseId)?.name || 'Technical Vocational Track'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {isEnrolled && (
                   <>
                    <div><span className={masterLabel}>Reg Number</span><p className="text-sm font-mono font-black text-teal-900">{data.reg_number}</p></div>
                    <div><span className={masterLabel}>Serial</span><p className="text-sm font-mono font-black text-slate-400">#{data.enrollment_serial}</p></div>
                    <div><span className={masterLabel}>Current Status</span><span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest">{data.status}</span></div>
                   </>
                 )}
                 {!isEnrolled && (
                   <>
                    <div><span className={masterLabel}>Form ID</span><p className="text-sm font-mono font-black text-slate-400">#{admissionData.id}</p></div>
                    <div><span className={masterLabel}>Application Status</span><span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest">{admissionData.status}</span></div>
                   </>
                 )}
              </div>
           </div>
        </div>

        {/* Bio Grid */}
        <div className="space-y-10">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div><span className={masterLabel}>CNIC / B-Form</span><p className={masterValue}>{admissionData.cnic}</p></div>
              <div><span className={masterLabel}>Date of Birth</span><p className={masterValue}>{new Date(admissionData.dob).toLocaleDateString()}</p></div>
              <div><span className={masterLabel}>Gender</span><p className={masterValue}>{admissionData.gender}</p></div>
              <div><span className={masterLabel}>Qualification</span><p className={masterValue}>{admissionData.qualification}</p></div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-8 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="col-span-2 md:col-span-1"><span className={masterLabel}>Guardian Name</span><p className={masterValue}>{admissionData.guardianName}</p></div>
              <div><span className={masterLabel}>Relation</span><p className={masterValue}>{admissionData.relation}</p></div>
              <div><span className={masterLabel}>Father's Occupation</span><p className={masterValue}>{admissionData.occupation}</p></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-4 bg-teal-50/50 rounded-2xl">
                 <Phone className="w-5 h-5 text-teal-600" />
                 <div><span className={masterLabel}>Student WhatsApp</span><p className={masterValue}>{admissionData.whatsapp}</p></div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-teal-50/50 rounded-2xl">
                 <Phone className="w-5 h-5 text-teal-600" />
                 <div><span className={masterLabel}>Guardian Contact</span><p className={masterValue}>{admissionData.guardianWhatsapp}</p></div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-teal-50/50 rounded-2xl">
                 <Mail className="w-5 h-5 text-teal-600" />
                 <div><span className={masterLabel}>Email Address</span><p className="text-xs font-bold text-slate-900 lowercase">{admissionData.email}</p></div>
              </div>
           </div>

           <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex gap-4">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <div><span className={masterLabel}>Permanent Address</span><p className="text-sm font-medium text-slate-600 leading-relaxed">{admissionData.address}</p></div>
           </div>
        </div>

        {/* Action Bar (Hidden in Print) */}
        <div className="flex gap-4 pt-10 no-print border-t border-slate-100">
           <button onClick={handlePrint} className="flex-1 py-4 bg-brand-dark text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3">
              <Printer className="w-4 h-4" /> Print Master Form
           </button>
           <button onClick={() => alert("PDF Export Synchronizing...")} className="flex-1 py-4 bg-white border-2 border-brand-dark text-brand-dark rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-3">
              <Download className="w-4 h-4" /> Download Digital PDF
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      <div className="fixed bottom-10 left-10 z-[200] space-y-3 pointer-events-none">
         {emailLog.map((log, i) => (
           <div key={i} className="px-6 py-3.5 bg-brand-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl animate-slideInLeft border border-white/10 flex items-center gap-3">
              <Mail className="w-4 h-4 text-emerald-400" /> {log}
           </div>
         ))}
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
        <div className="flex items-center gap-6">
           <div className="p-5 bg-teal-950 text-white rounded-3xl shadow-2xl border border-white/10"><Settings className="w-10 h-10" /></div>
           <div>
              <h1 className="text-4xl font-outfit font-black text-slate-900 tracking-tighter uppercase leading-none">Admin Control</h1>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div> Secure Infrastructure v2.5
                </span>
              </div>
           </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-2 rounded-[2rem] border border-slate-200 shadow-inner overflow-x-auto max-w-full scrollbar-hide no-print">
           {['courses', 'faculty', 'results', 'admissions', 'register', 'news', 'analytics'].map(tab => (
             <button 
               key={tab} onClick={() => setActiveTab(tab as any)} 
               className={`px-8 py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em] whitespace-nowrap ${activeTab === tab ? 'bg-white shadow-xl text-teal-900 border border-slate-100' : 'text-slate-400 hover:text-slate-700'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <main className="animate-fadeIn min-h-[60vh]">
         {activeTab === 'news' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="type-label">Flash News Command Center</h3>
                  <p className="text-sm text-slate-500 font-inter mt-1">Manage institutional alerts and public announcements.</p>
                </div>
                <button 
                  onClick={() => { setModalType('news'); }}
                  className="flex items-center gap-2 px-6 py-3 bg-teal-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all"
                >
                  <Plus className="w-4 h-4" /> Broadcast News
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {alerts.map(alert => (
                  <div key={alert.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          alert.priority === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-teal-100 text-teal-700'
                        }`}>
                          {alert.category} • {alert.priority}
                        </span>
                        <button onClick={() => onRemoveAlert(alert.id)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{alert.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">{alert.content}</p>
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expires: {new Date(alert.expiresAt).toLocaleDateString()}</span>
                        <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest">{alert.actionText} → {alert.actionPage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
         )}
         {activeTab === 'courses' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="type-label">Module Registry</h3>
                  <p className="text-sm text-slate-500 font-inter mt-1">Manage vocational tracks and syllabus.</p>
                </div>
                <button 
                  onClick={() => { setCourseForm({ name: '', instructorName: '', thumbnail: '', duration: '', status: 'Active', mode: 'ON CAMPUS', description: '' }); setSelectedItem(null); setModalType('course'); }}
                  className="flex items-center gap-2 px-6 py-3 bg-teal-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all"
                >
                  <Plus className="w-4 h-4" /> Add New Course
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map(course => (
                  <div key={course.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          course.status === 'Live' ? 'bg-rose-100 text-rose-600 animate-pulse' :
                          course.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {course.status}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => { setSelectedItem(course); setCourseForm(course); setModalType('course'); }} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-teal-900 transition-all"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => onRemoveCourse(course.id)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{course.name}</h4>
                    <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-6">{course.instructorName}</p>
                    <div className="mt-auto pt-6 border-t border-slate-50 flex gap-2">
                        <button onClick={() => { setScheduleForm({ ...scheduleForm, courseId: course.id }); setModalType('schedule'); }} className="flex-1 py-3 bg-brand-slate text-teal-800 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-teal-50 transition-all flex items-center justify-center gap-2">
                          <Video className="w-3.5 h-3.5" /> Schedule Live
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
         )}
         {activeTab === 'faculty' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="type-label">Academic Staff</h3>
                  <p className="text-sm text-slate-500 font-inter mt-1">Faculty management and LMS credentials.</p>
                </div>
                <button onClick={() => { setFacultyForm({ name: '', username: '', password: '', email: '', qualification: '', subject: '', assignment: '' }); setModalType('faculty'); }} className="flex items-center gap-2 px-6 py-3 bg-teal-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">
                  <Plus className="w-4 h-4" /> Recruit Instructor
                </button>
              </div>
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className={`p-8 ${typeLabel}`}>Instructor</th>
                        <th className={`p-8 ${typeLabel}`}>Subject</th>
                        <th className={`p-8 ${typeLabel}`}>Assignment</th>
                        <th className={`p-8 ${typeLabel} text-right`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {instructors.map(inst => (
                        <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-8">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shadow-sm">
                                    {inst.image ? (
                                      <img src={inst.image} className="w-full h-full object-cover" />
                                    ) : (
                                      <UserIcon className="w-6 h-6 text-slate-300" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{inst.name}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{inst.qualification}</p>
                                  </div>
                              </div>
                            </td>
                            <td className="p-8"><span className="px-4 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-widest">{inst.subject}</span></td>
                            <td className="p-8 font-inter text-xs text-slate-500 font-medium">{inst.class_assignment}</td>
                            <td className="p-8 text-right">
                              <div className="flex justify-end gap-3">
                                <button className="p-2.5 bg-slate-100 rounded-xl text-slate-400 hover:text-teal-900"><Edit3 className="w-4 h-4" /></button>
                                <button onClick={() => onRemoveInstructor(inst.id)} className="p-2.5 bg-slate-100 rounded-xl text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
         )}
         {activeTab === 'results' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="type-label">Examination Registry</h3>
                  <p className="text-sm text-slate-500 font-inter mt-1">Student performance and transcript records.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setResultForm({ studentId: '', examType: 'Final Exam', paperTotal: 100, paperObtained: 0, practicalTotal: 50, practicalObtained: 0, remarks: '' }); setModalType('result'); }} className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl"><Plus className="w-4 h-4" /> Add Result</button>
                </div>
              </div>
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className={`p-8 ${typeLabel}`}>Reg #</th>
                        <th className={`p-8 ${typeLabel}`}>Exam</th>
                        <th className={`p-8 ${typeLabel}`}>Score</th>
                        <th className={`p-8 ${typeLabel}`}>Status</th>
                        <th className={`p-8 ${typeLabel} text-right`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {results.map(res => (
                        <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className={`p-8 ${idCell}`}>{res.studentId}</td>
                            <td className="p-8 text-[10px] font-black text-slate-900 uppercase tracking-widest">{res.examType}</td>
                            <td className="p-8">
                              <div className="flex flex-col">
                                  <span className="text-xs font-black text-teal-900">{(res.paperObtained + res.practicalObtained)} / {(res.paperTotal + res.practicalTotal)}</span>
                                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Points</span>
                              </div>
                            </td>
                            <td className="p-8"><span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest">Graded</span></td>
                            <td className="p-8 text-right">
                              <div className="flex justify-end gap-3">
                                <button onClick={() => onRemoveResult(res.id)} className="p-2.5 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
         )}
         {activeTab === 'admissions' && (
            <div className="space-y-8">
              <div>
                <h3 className="type-label">Inbound Applications</h3>
                <p className="text-sm text-slate-500 font-inter mt-1">Review and process candidate admission forms.</p>
              </div>
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className={`p-8 ${typeLabel}`}>Applicant</th>
                        <th className={`p-8 ${typeLabel}`}>Course</th>
                        <th className={`p-8 ${typeLabel}`}>WhatsApp</th>
                        <th className={`p-8 ${typeLabel} text-right`}>Decision Hub</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {admissions.filter(a => a.status === 'Pending').map(adm => (
                        <tr key={adm.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-8">
                              <div className="flex items-center gap-4">
                                  <img src={adm.photo || 'https://via.placeholder.com/100'} className="w-12 h-12 rounded-xl object-cover" />
                                  <div>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{adm.firstName} {adm.lastName}</p>
                                    <p className="text-[9px] font-mono text-slate-400 mt-1">{adm.cnic}</p>
                                  </div>
                              </div>
                            </td>
                            <td className="p-8 font-inter text-xs font-bold text-teal-800 uppercase tracking-widest">
                              {courses.find(c => c.id === adm.courseId)?.name || 'Technical Track'}
                            </td>
                            <td className="p-8 font-mono text-xs text-slate-500">{adm.whatsapp}</td>
                            <td className="p-8 text-right">
                              <div className="flex justify-end gap-3">
                                  <button onClick={() => { setSelectedItem(adm); setModalType('view_master'); }} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"><Eye className="w-4 h-4" /> Full View</button>
                                  <button onClick={() => handleApproveAdmission(adm)} className="p-3 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-700 hover:text-white transition-all"><CheckCircle className="w-5 h-5" /></button>
                                  <button onClick={() => handleRejectAdmission(adm)} className="p-3 bg-rose-100 text-rose-700 rounded-xl hover:bg-rose-700 hover:text-white transition-all"><XCircle className="w-5 h-5" /></button>
                              </div>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
         )}
         {activeTab === 'register' && (
            <div className="space-y-8">
              <div>
                <h3 className="type-label">Permanent Student Register</h3>
                <p className="text-sm text-slate-500 font-inter mt-1">Lifecycle management for active student records.</p>
              </div>
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className={`p-8 ${typeLabel}`}>Reg #</th>
                        <th className={`p-8 ${typeLabel}`}>Student</th>
                        <th className={`p-8 ${typeLabel}`}>Status</th>
                        <th className={`p-8 ${typeLabel} text-right`}>Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {admissionWithdrawal.map(reg => (
                        <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className={`p-8 ${idCell}`}>{reg.reg_number}</td>
                            <td className="p-8">
                              <p className="text-xs font-black text-slate-900 uppercase">{reg.student_name}</p>
                              <p className="text-[9px] font-mono text-slate-400 mt-1">{reg.cnic}</p>
                            </td>
                            <td className="p-8">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                reg.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                reg.status === 'Suspended' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                              }`}>
                                {reg.status}
                              </span>
                            </td>
                            <td className="p-8 text-right">
                              <div className="flex justify-end gap-2">
                                  <button onClick={() => { setSelectedItem(reg); setModalType('view_student_master'); }} className="px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl hover:text-teal-900 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border border-slate-200"><Eye className="w-4 h-4" /> View Record</button>
                                  <button onClick={() => updateRegisterStatusWithNotification(reg, 'Active')} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"><UserCheck className="w-3.5 h-3.5 mr-1 inline" /> Activate</button>
                                  <button onClick={() => updateRegisterStatusWithNotification(reg, 'Suspended')} className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all"><UserMinus className="w-3.5 h-3.5 mr-1 inline" /> Suspend</button>
                                  <button onClick={() => updateRegisterStatusWithNotification(reg, 'Rusticated')} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"><UserX className="w-3.5 h-3.5 mr-1 inline" /> Rusticate</button>
                              </div>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
         )}
         {activeTab === 'analytics' && (
           <div className="p-24 text-center bg-white rounded-[4rem] border border-slate-100 shadow-inner flex flex-col items-center no-print">
              <BarChart3 className="w-20 h-20 text-slate-200 mb-8" />
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Institutional Analytics</h3>
              <p className="text-lg text-slate-400 font-inter mt-4 max-w-md">Performance reporting and data visualization modules are currently being synchronized.</p>
           </div>
         )}
      </main>

      {/* MODAL SYSTEM */}
      {modalType && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 no-print">
           <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setModalType(null)}></div>
           <div className="relative bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl animate-scaleIn flex flex-col max-h-[90vh]">
              <div className="bg-teal-900 p-10 text-white flex justify-between items-center shrink-0">
                 <div>
                   <h2 className="text-2xl font-black uppercase tracking-widest leading-none">
                     {modalType === 'course' && (selectedItem ? 'Edit Course' : 'Create Course')}
                     {modalType === 'faculty' && 'Recruit Faculty'}
                     {modalType === 'result' && 'Performance Entry'}
                     {modalType === 'schedule' && 'Schedule Live Class'}
                     {modalType === 'news' && 'Flash News Command Center'}
                     {modalType === 'view_master' && 'Admission Application Master'}
                     {modalType === 'view_student_master' && 'Permanent Student Record'}
                   </h2>
                   <p className="text-[10px] font-bold text-teal-300 uppercase tracking-widest mt-2 opacity-60">AKTVI Master Protocol v2.5</p>
                 </div>
                 <button onClick={() => setModalType(null)} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all"><XCircle className="w-6 h-6" /></button>
              </div>
              
              <div className="p-10 overflow-y-auto scrollbar-hide flex-grow">
                 {modalType === 'course' && (
                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2"><label className={typeLabel}>Course Name</label><input type="text" value={courseForm.name} onChange={e => setCourseForm({...courseForm, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs" /></div>
                         <div className="space-y-2"><label className={typeLabel}>Instructor</label><input type="text" value={courseForm.instructorName} onChange={e => setCourseForm({...courseForm, instructorName: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs" /></div>
                      </div>
                      <div className="space-y-2"><label className={typeLabel}>Course Thumbnail URL</label><input type="text" value={courseForm.thumbnail} onChange={e => setCourseForm({...courseForm, thumbnail: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs" placeholder="https://images.unsplash.com/..." /></div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2"><label className={typeLabel}>Duration</label><input type="text" value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs" /></div>
                         <div className="space-y-2"><label className={typeLabel}>Status</label>
                           <select value={courseForm.status} onChange={e => setCourseForm({...courseForm, status: e.target.value as any})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs">
                             <option value="Active">Active</option>
                             <option value="Pending">Pending</option>
                             <option value="Live">Live</option>
                             <option value="Discarded">Discarded</option>
                           </select>
                         </div>
                      </div>
                      <div className="space-y-2"><label className={typeLabel}>Description</label><textarea value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-medium text-sm h-32" /></div>
                      <button onClick={handleCourseSubmit} className="w-full py-5 bg-teal-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Commit Changes</button>
                   </div>
                 )}

                 {modalType === 'news' && (
                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className={typeLabel}>Category</label>
                           <select value={alertForm.category} onChange={e => setAlertForm({...alertForm, category: e.target.value as any})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs">
                             <option value="Urgent">Urgent</option>
                             <option value="Admission">Admission</option>
                             <option value="Result">Result</option>
                             <option value="Schedule">Schedule</option>
                           </select>
                         </div>
                         <div className="space-y-2">
                           <label className={typeLabel}>Priority</label>
                           <select value={alertForm.priority} onChange={e => setAlertForm({...alertForm, priority: e.target.value as any})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs">
                             <option value="Normal">Normal</option>
                             <option value="High">High</option>
                           </select>
                         </div>
                      </div>
                      <div className="space-y-2"><label className={typeLabel}>Alert Title</label><input type="text" value={alertForm.title} onChange={e => setAlertForm({...alertForm, title: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs" placeholder="e.g. ADMISSIONS OPEN 2024" /></div>
                      <div className="space-y-2"><label className={typeLabel}>Alert Content</label><textarea value={alertForm.content} onChange={e => setAlertForm({...alertForm, content: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-medium text-sm h-24" placeholder="Enter the detailed announcement..." /></div>
                      <div className="grid grid-cols-3 gap-4">
                         <div className="space-y-2"><label className={typeLabel}>Action Text</label><input type="text" value={alertForm.actionText} onChange={e => setAlertForm({...alertForm, actionText: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs" /></div>
                         <div className="space-y-2"><label className={typeLabel}>Action Page</label><input type="text" value={alertForm.actionPage} onChange={e => setAlertForm({...alertForm, actionPage: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs" /></div>
                         <div className="space-y-2"><label className={typeLabel}>Expires At</label><input type="date" value={alertForm.expiresAt} onChange={e => setAlertForm({...alertForm, expiresAt: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs" /></div>
                      </div>
                      <button onClick={handleAlertSubmit} className="w-full py-5 bg-teal-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Broadcast Announcement</button>
                   </div>
                 )}

                 {modalType === 'faculty' && (
                   <div className="space-y-6">
                      <div className="space-y-2"><label className={typeLabel}>Full Name</label><input type="text" value={facultyForm.name} onChange={e => setFacultyForm({...facultyForm, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs" /></div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2"><label className={typeLabel}>Username</label><input type="text" value={facultyForm.username} onChange={e => setFacultyForm({...facultyForm, username: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs" /></div>
                         <div className="space-y-2"><label className={typeLabel}>Password</label><input type="text" value={facultyForm.password} onChange={e => setFacultyForm({...facultyForm, password: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className={typeLabel}>Subject / Course</label>
                           <select 
                             value={facultyForm.subject} 
                             onChange={e => setFacultyForm({...facultyForm, subject: e.target.value})} 
                             className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs outline-none focus:border-teal-500"
                           >
                             <option value="">Select Subject...</option>
                             {courses.map(c => (
                               <option key={c.id} value={c.name}>{c.name}</option>
                             ))}
                           </select>
                         </div>
                         <div className="space-y-2">
                           <label className={typeLabel}>Batch / Class Assignment</label>
                           <select 
                             value={facultyForm.assignment} 
                             onChange={e => setFacultyForm({...facultyForm, assignment: e.target.value})} 
                             className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs outline-none focus:border-teal-500"
                           >
                             <option value="">Select Assignment...</option>
                             {courses.map(c => (
                               <option key={c.id} value={c.name}>{c.name}</option>
                             ))}
                           </select>
                         </div>
                      </div>
                      <button onClick={handleFacultySubmit} className="w-full py-5 bg-teal-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Recruit & Provision Account</button>
                   </div>
                 )}

                 {modalType === 'result' && (
                   <div className="space-y-6">
                      <div className="space-y-2"><label className={typeLabel}>Student Reg #</label><input type="text" value={resultForm.studentId} onChange={e => setResultForm({...resultForm, studentId: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono font-bold text-xs" /></div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2"><label className={typeLabel}>Paper (Obtained/Total)</label><div className="flex gap-2"><input type="number" value={resultForm.paperObtained} onChange={e => setResultForm({...resultForm, paperObtained: parseInt(e.target.value)})} className="w-1/2 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold" /><input type="number" value={resultForm.paperTotal} onChange={e => setResultForm({...resultForm, paperTotal: parseInt(e.target.value)})} className="w-1/2 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold" /></div></div>
                         <div className="space-y-2"><label className={typeLabel}>Practical (Obtained/Total)</label><div className="flex gap-2"><input type="number" value={resultForm.practicalObtained} onChange={e => setResultForm({...resultForm, practicalObtained: parseInt(e.target.value)})} className="w-1/2 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold" /><input type="number" value={resultForm.practicalTotal} onChange={e => setResultForm({...resultForm, practicalTotal: parseInt(e.target.value)})} className="w-1/2 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold" /></div></div>
                      </div>
                      <button onClick={handleResultSubmit} className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Record Performance</button>
                   </div>
                 )}

                 {modalType === 'schedule' && (
                   <div className="space-y-6">
                      <div className="space-y-2"><label className={typeLabel}>Lecture Topic</label><input type="text" value={scheduleForm.topic} onChange={e => setScheduleForm({...scheduleForm, topic: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs" /></div>
                      <div className="space-y-2"><label className={typeLabel}>Broadcast Time</label><input type="datetime-local" value={scheduleForm.startTime} onChange={e => setScheduleForm({...scheduleForm, startTime: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-xs" /></div>
                      <button onClick={handleScheduleSubmit} className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Broadast Schedule</button>
                   </div>
                 )}

                 {modalType === 'view_master' && selectedItem && (
                   <MasterStudentView data={selectedItem} isEnrolled={false} />
                 )}

                 {modalType === 'view_student_master' && selectedItem && (
                   <MasterStudentView data={selectedItem} isEnrolled={true} />
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Hidden Printable Container */}
      <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-16">
          <div className="text-center mb-12 border-b-2 border-slate-900 pb-8">
             <h1 className="text-4xl font-black uppercase tracking-tighter">Akbar Khan Technical & Vocational Institute</h1>
             <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Institutional Master Record • Gujar Garhi Mardan</p>
          </div>
          {modalType?.includes('master') && selectedItem && (
             <MasterStudentView data={selectedItem} isEnrolled={modalType === 'view_student_master'} />
          )}
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @media print {
          body * { visibility: hidden; }
          .print\:block, .print\:block * { visibility: visible; }
          .print\:block { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Admin;
