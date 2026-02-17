
import React, { useState, useEffect } from 'react';
import { Course, AdmissionForm, AdmissionStatus } from '../types';
import PhotoModule from '../components/PhotoModule';
import { Search, Save, Send, Printer, Info, CheckCircle, Clock, XCircle, ChevronRight, BookOpen, Heart } from 'lucide-react';
import { formatNIC, formatMobile, isValidNIC, isValidMobile } from '../utils';

interface AdmissionsProps {
  courses: Course[];
  onSubmit: (formData: AdmissionForm) => void;
  onSaveDraft: (formData: AdmissionForm) => void;
  admissions: AdmissionForm[];
}

const Admissions: React.FC<AdmissionsProps> = ({ courses, onSubmit, onSaveDraft, admissions }) => {
  const [activeTab, setActiveTab] = useState<'apply' | 'track'>('apply');
  const [trackCnic, setTrackCnic] = useState('');
  const [trackedForm, setTrackedForm] = useState<AdmissionForm | null>(null);
  
  const [formData, setFormData] = useState<Partial<AdmissionForm>>({
    firstName: '',
    lastName: '',
    cnic: '',
    dob: '',
    gender: 'Female',
    qualification: '',
    occupation: '',
    guardianName: '',
    whatsapp: '+92',
    guardianWhatsapp: '+92',
    relation: '',
    address: '',
    email: '',
    courseId: '',
    photo: '',
    status: 'Pending',
    isDraft: true
  });

  const handleTrack = () => {
    const formatted = formatNIC(trackCnic);
    const form = admissions.find(a => a.cnic === formatted);
    setTrackedForm(form || null);
    if (!form) alert("No admission record found for this CNIC.");
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'cnic', 'dob', 'guardianName', 'whatsapp', 'address', 'courseId', 'photo'];
    const missing = required.filter(key => !formData[key as keyof AdmissionForm]);
    
    if (missing.length === 0) {
      if (!isValidNIC(formData.cnic || '')) {
        alert("Please enter a valid CNIC (12345-1234567-1)");
        return ['cnic'];
      }
      if (!isValidMobile(formData.whatsapp || '')) {
        alert("Please enter a valid WhatsApp number (+92 followed by 10 digits)");
        return ['whatsapp'];
      }
    }
    
    return missing;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = validateForm();
    if (missing.length > 0) {
      if (missing.length === 1 && (missing[0] === 'cnic' || missing[0] === 'whatsapp')) return; // Already alerted
      alert(`Please complete the following fields: ${missing.join(', ')}`);
      return;
    }
    onSubmit({ ...formData } as AdmissionForm);
    alert("Application submitted successfully! As a non-profit, we charge zero fees.");
    setFormData({ isDraft: true, status: 'Pending', photo: '', gender: 'Female', whatsapp: '+92', guardianWhatsapp: '+92' });
  };

  const handlePrint = () => {
    window.print();
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50/50 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all shadow-sm text-slate-900 placeholder:text-slate-400 font-medium";
  const labelClasses = "text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-teal-50 overflow-hidden no-print">
        <div className="flex border-b border-gray-100 bg-slate-50/30">
          <button 
            onClick={() => setActiveTab('apply')}
            className={`flex-1 py-4 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all ${
              activeTab === 'apply' ? 'text-teal-700 bg-white shadow-inner' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Apply Admission
          </button>
          <button 
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-4 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all ${
              activeTab === 'track' ? 'text-teal-700 bg-white shadow-inner' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Track Status
          </button>
        </div>

        <div className="p-6 md:p-14">
          {activeTab === 'apply' ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-8 md:mb-12 p-6 md:p-8 bg-emerald-50 rounded-[1.5rem] md:rounded-[2rem] border border-emerald-100 flex flex-col sm:flex-row items-center gap-4 md:gap-6 shadow-sm">
                 <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                    <Heart className="w-6 h-6 md:w-8 md:h-8 fill-emerald-600" />
                 </div>
                 <div className="text-center sm:text-left">
                    <h4 className="font-black text-emerald-900 uppercase text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] mb-1">Free Skills Initiative</h4>
                    <p className="text-emerald-700 text-xs md:text-sm leading-relaxed">Akbar Khan Institute is a non-profit center dedicated to community empowerment. No tuition or admission fees are charged.</p>
                 </div>
              </div>

              <div className="mb-10 md:mb-14 flex flex-col lg:flex-row gap-8 md:gap-16 items-start">
                <div className="w-full lg:w-1/3">
                  <h3 className="text-base md:text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-100 shrink-0">1</span>
                    Personal Photo
                  </h3>
                  <PhotoModule 
                    initialPhoto={formData.photo} 
                    onPhotoSaved={(photo) => setFormData(prev => ({ ...prev, photo }))} 
                  />
                  <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm">
                    <p className="text-[10px] md:text-[11px] text-blue-700 flex gap-2 md:gap-3 leading-relaxed font-medium">
                      <Info className="w-4 h-4 md:w-5 md:h-5 shrink-0 text-blue-400" />
                      Upload a passport-sized photo using the camera or gallery.
                    </p>
                  </div>
                </div>

                <div className="w-full lg:w-2/3 space-y-8 md:space-y-10">
                  <h3 className="text-base md:text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-100 shrink-0">2</span>
                    Applicant Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                    <div className="space-y-1">
                      <label className={labelClasses}>First Name</label>
                      <input 
                        type="text" required
                        className={inputClasses}
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClasses}>Last Name</label>
                      <input 
                        type="text" required
                        className={inputClasses}
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClasses}>CNIC / B-Form</label>
                      <input 
                        type="text" required
                        placeholder="00000-0000000-0"
                        className={`${inputClasses} font-mono`}
                        value={formData.cnic}
                        onChange={(e) => setFormData(prev => ({ ...prev, cnic: formatNIC(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClasses}>Date of Birth</label>
                      <input 
                        type="date" required
                        className={inputClasses}
                        value={formData.dob}
                        onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClasses}>Gender</label>
                      <select 
                        className={inputClasses}
                        value={formData.gender}
                        onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'Male' | 'Female' }))}
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className={labelClasses}>Qualification</label>
                      <input 
                        type="text"
                        placeholder="e.g. Matric / Intermediate"
                        className={inputClasses}
                        value={formData.qualification}
                        onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-10 md:pt-14 space-y-8 md:space-y-10">
                <h3 className="text-base md:text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-100 shrink-0">3</span>
                  Guardian & Contact Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                   <div className="space-y-1">
                    <label className={labelClasses}>Guardian Name</label>
                    <input 
                      type="text" required
                      className={inputClasses}
                      value={formData.guardianName}
                      onChange={(e) => setFormData(prev => ({ ...prev, guardianName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Guardian Occupation</label>
                    <input 
                      type="text"
                      className={inputClasses}
                      value={formData.occupation}
                      onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Relation</label>
                    <input 
                      type="text"
                      className={inputClasses}
                      value={formData.relation}
                      onChange={(e) => setFormData(prev => ({ ...prev, relation: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Your WhatsApp</label>
                    <input 
                      type="text" required
                      placeholder="+923000000000"
                      className={`${inputClasses} font-mono`}
                      value={formData.whatsapp}
                      onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: formatMobile(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClasses}>Guardian WhatsApp</label>
                    <input 
                      type="text"
                      placeholder="+923000000000"
                      className={`${inputClasses} font-mono`}
                      value={formData.guardianWhatsapp}
                      onChange={(e) => setFormData(prev => ({ ...prev, guardianWhatsapp: formatMobile(e.target.value) }))}
                    />
                  </div>
                   <div className="space-y-1">
                    <label className={labelClasses}>Email Address</label>
                    <input 
                      type="email"
                      className={inputClasses}
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={labelClasses}>Residential Address</label>
                  <textarea 
                    rows={3} required
                    placeholder="Enter full address for institutional records"
                    className={inputClasses}
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-10 md:pt-14 space-y-8 md:space-y-10">
                <h3 className="text-base md:text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-100 shrink-0">4</span>
                  Course Selection
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
                  <div className="space-y-1">
                    <label className={labelClasses}>Apply for Course</label>
                    <select 
                      required
                      className={inputClasses}
                      value={formData.courseId}
                      onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
                    >
                      <option value="">Select a course...</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.mode})</option>
                      ))}
                    </select>
                  </div>
                  <div className="p-5 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                    <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed font-bold">
                      Institutional Grant: All students are eligible for 100% tuition coverage under our non-profit vocational training mandate.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 md:mt-20 flex flex-col sm:flex-row gap-3 md:gap-4 pt-8 md:pt-10 border-t border-slate-100">
                <button 
                  type="submit"
                  className="w-full sm:flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-teal-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl md:rounded-2xl hover:bg-teal-700 shadow-xl transition-all active:scale-95 order-1 sm:order-2"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" /> Submit Application
                </button>
                <div className="flex gap-2 order-2 sm:order-1 sm:flex-1">
                   <button 
                    type="button"
                    onClick={() => onSaveDraft(formData as AdmissionForm)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-slate-100 text-slate-700 font-black uppercase text-[10px] tracking-widest rounded-xl md:rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button 
                    type="button"
                    onClick={handlePrint}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-4 border-2 border-teal-600 text-teal-600 font-black uppercase text-[10px] tracking-widest rounded-xl md:rounded-2xl hover:bg-teal-50 transition-all"
                  >
                    <Printer className="w-4 h-4" /> Print
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="max-w-2xl mx-auto py-4 md:py-10">
              <div className="text-center mb-8 md:mb-12">
                <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 md:mb-3">Track Status</h3>
                <p className="text-sm text-slate-500 font-medium">Verify your application progress using your CNIC or B-Form.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-10 md:mb-14">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="00000-0000000-0"
                    className={`${inputClasses} pl-12`}
                    value={trackCnic}
                    onChange={(e) => setTrackCnic(formatNIC(e.target.value))}
                  />
                </div>
                <button 
                  onClick={handleTrack}
                  className="px-8 py-4 bg-teal-800 text-white font-black uppercase text-[10px] tracking-widest rounded-xl md:rounded-2xl hover:bg-teal-900 shadow-xl transition-all active:scale-95"
                >
                  Check Status
                </button>
              </div>

              {trackedForm && (
                <div className="bg-slate-50 rounded-[2rem] p-6 md:p-10 border border-slate-100 animate-fadeIn shadow-inner">
                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-10 gap-4">
                      <div>
                        <h4 className="text-xl md:text-2xl font-black text-slate-800">{trackedForm.firstName} {trackedForm.lastName}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          {trackedForm.regNumber ? `Reg Number: ${trackedForm.regNumber}` : `Application ID: #${trackedForm.id}`}
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm shrink-0 ${
                        trackedForm.status === 'Approved' ? 'bg-emerald-500 text-white' : 
                        trackedForm.status === 'Rejected' ? 'bg-rose-500 text-white' : 
                        'bg-amber-400 text-slate-900'
                      }`}>
                        {trackedForm.status === 'Approved' ? <CheckCircle className="w-3.5 h-3.5" /> :
                         trackedForm.status === 'Rejected' ? <XCircle className="w-3.5 h-3.5" /> :
                         <Clock className="w-3.5 h-3.5" />}
                        {trackedForm.status}
                      </div>
                   </div>

                   <div className="space-y-6 md:space-y-8">
                      <div className="flex items-center gap-4 md:gap-5">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white flex items-center justify-center shadow-md text-teal-600 shrink-0">
                          <BookOpen className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Course</p>
                          <p className="font-black text-slate-800 text-base md:text-lg truncate">{courses.find(c => c.id === trackedForm.courseId)?.name || 'Unknown Course'}</p>
                        </div>
                      </div>

                      <div className="pt-6 md:pt-8 border-t border-slate-200">
                        <h5 className="font-black text-slate-800 uppercase text-[10px] md:text-xs tracking-[0.2em] mb-6">Application Milestone</h5>
                        <div className="space-y-6">
                           <div className="flex gap-4 md:gap-5">
                              <div className="relative shrink-0">
                                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-teal-600 ring-4 ring-teal-50"></div>
                                <div className="absolute top-4 left-1.5 md:left-2 w-[1px] md:w-[2px] h-10 md:h-12 bg-slate-200"></div>
                              </div>
                              <div>
                                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Phase 1</p>
                                <p className="text-xs md:text-sm font-black text-slate-800">Application Received</p>
                                <p className="text-[10px] md:text-xs text-slate-500 mt-1">Institutional records have been logged.</p>
                              </div>
                           </div>
                           {trackedForm.status !== 'Pending' && (
                            <div className="flex gap-4 md:gap-5">
                                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-teal-600 ring-4 ring-teal-50 shrink-0"></div>
                                <div>
                                  <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Phase 2</p>
                                  <p className="text-xs md:text-sm font-black text-slate-800">{trackedForm.status === 'Approved' ? 'Verified & Approved' : 'Reviewed & Rejected'}</p>
                                  {trackedForm.regNumber && <p className="text-[9px] md:text-xs text-teal-600 font-black mt-1 uppercase tracking-widest">ID: {trackedForm.regNumber}</p>}
                                </div>
                            </div>
                           )}
                        </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admissions;
