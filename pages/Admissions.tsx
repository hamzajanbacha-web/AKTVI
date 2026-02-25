
import React, { useState } from 'react';
import { Course, AdmissionForm } from '../types';
import PhotoModule from '../components/PhotoModule';
import { Search, Send, Printer, Heart } from 'lucide-react';
import { formatNIC, isValidNIC } from '../utils';

interface AdmissionsProps {
  courses: Course[];
  onSubmit: (formData: AdmissionForm) => void;
  onSaveDraft: (formData: AdmissionForm) => void;
  admissions: AdmissionForm[];
  onSignupClick?: () => void;
}

const Admissions: React.FC<AdmissionsProps> = ({ courses, onSubmit, admissions }) => {
  const [activeTab, setActiveTab] = useState<'apply' | 'track'>('apply');
  const [trackCnic, setTrackCnic] = useState('');
  const [trackedForm, setTrackedForm] = useState<AdmissionForm | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const initialFormData: Partial<AdmissionForm> = {
    firstName: '', lastName: '', cnic: '', dob: '', gender: 'Female', qualification: '', 
    occupation: '', guardianName: '', whatsapp: '+92', guardianWhatsapp: '+92', 
    relation: '', address: '', email: '', courseId: '', photo: '', status: 'Pending', isDraft: true
  };

  const [formData, setFormData] = useState<Partial<AdmissionForm>>(initialFormData);

  const handleTrack = () => {
    const formatted = formatNIC(trackCnic);
    const form = admissions.find(a => a.cnic === formatted);
    setTrackedForm(form || null);
    if (!form) alert("No admission record found for this CNIC.");
  };

  const validateForm = (isDraft: boolean = false) => {
    const newErrors: Record<string, string> = {};
    if (!isDraft) {
      if (!formData.firstName) newErrors.firstName = "Required";
      if (!formData.cnic || !isValidNIC(formData.cnic)) newErrors.cnic = "Invalid CNIC";
      if (!formData.courseId) newErrors.courseId = "Select course";
      if (!formData.photo) newErrors.photo = "Photo required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm(false)) {
      onSubmit({ ...formData } as AdmissionForm);
      alert("Application Submitted Successfully");
      setFormData(initialFormData);
    }
  };

  const labelClasses = "text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block";
  // Theming inputs to match AuthModal: bg-brand-input (Teal 950)
  const inputBase = "w-full px-4 py-3.5 rounded-xl border-2 border-brand-dark/10 bg-brand-input text-white font-inter font-semibold focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all shadow-inner placeholder:text-teal-700";

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-teal-50 overflow-hidden no-print">
        <div className="flex border-b border-gray-100 bg-brand-slate">
          <button onClick={() => setActiveTab('apply')} className={`flex-1 py-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'apply' ? 'text-brand-primary bg-white shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}>Apply Admission</button>
          <button onClick={() => setActiveTab('track')} className={`flex-1 py-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'track' ? 'text-brand-primary bg-white shadow-inner' : 'text-slate-400 hover:text-slate-600'}`}>Track Status</button>
        </div>

        <div className="p-8 md:p-16">
          {activeTab === 'apply' ? (
            <form onSubmit={handleSubmit} noValidate className="space-y-12">
              <div className="p-8 bg-brand-primary/5 rounded-[2rem] border border-brand-primary/10 flex items-center gap-6">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm shrink-0">
                    <Heart className="w-8 h-8 fill-brand-primary" />
                 </div>
                 <div>
                    <h4 className="type-label text-brand-dark mb-1 tracking-[0.3em]">Free Skills Initiative</h4>
                    <p className="text-slate-600 text-sm font-inter font-medium">No fees are charged for any vocational training track.</p>
                 </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-16">
                <div className="lg:w-1/3">
                  <h3 className="type-h3 text-brand-dark mb-6 flex items-center gap-3"><span className="w-10 h-10 rounded-2xl bg-brand-dark text-white flex items-center justify-center shadow-lg font-outfit">1</span> Photo</h3>
                  <PhotoModule initialPhoto={formData.photo} onPhotoSaved={photo => setFormData({...formData, photo})} />
                </div>
                <div className="lg:w-2/3 space-y-10">
                  <div className="space-y-6">
                    <h3 className="type-h3 text-brand-dark flex items-center gap-3"><span className="w-10 h-10 rounded-2xl bg-brand-dark text-white flex items-center justify-center shadow-lg font-outfit">2</span> Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClasses}>First Name</label><input type="text" className={inputBase} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} /></div>
                      <div><label className={labelClasses}>Last Name</label><input type="text" className={inputBase} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} /></div>
                      <div><label className={labelClasses}>CNIC / B-Form</label><input type="text" className={`${inputBase} font-mono`} placeholder="00000-0000000-0" value={formData.cnic} onChange={e => setFormData({...formData, cnic: formatNIC(e.target.value)})} /></div>
                      <div><label className={labelClasses}>Date of Birth</label><input type="date" className={inputBase} value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} /></div>
                      <div><label className={labelClasses}>Gender</label><select className={inputBase} value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as 'Male' | 'Female'})}><option value="Female">Female</option><option value="Male">Male</option></select></div>
                      <div><label className={labelClasses}>Select Track</label><select className={inputBase} value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})}><option value="" className="bg-brand-dark">Choose Program...</option>{courses.map(c => <option key={c.id} value={c.id} className="bg-brand-dark">{c.name}</option>)}</select></div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="type-h3 text-brand-dark flex items-center gap-3"><span className="w-10 h-10 rounded-2xl bg-brand-dark text-white flex items-center justify-center shadow-lg font-outfit">3</span> Contact & Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClasses}>WhatsApp Number</label><input type="text" className={inputBase} placeholder="+92" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} /></div>
                      <div><label className={labelClasses}>Email Address</label><input type="email" className={inputBase} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                      <div className="md:col-span-2"><label className={labelClasses}>Home Address</label><input type="text" className={inputBase} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="type-h3 text-brand-dark flex items-center gap-3"><span className="w-10 h-10 rounded-2xl bg-brand-dark text-white flex items-center justify-center shadow-lg font-outfit">4</span> Education & Occupation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClasses}>Qualification</label><input type="text" className={inputBase} value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} /></div>
                      <div><label className={labelClasses}>Current Occupation</label><input type="text" className={inputBase} value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} /></div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="type-h3 text-brand-dark flex items-center gap-3"><span className="w-10 h-10 rounded-2xl bg-brand-dark text-white flex items-center justify-center shadow-lg font-outfit">5</span> Guardian Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClasses}>Guardian Name</label><input type="text" className={inputBase} value={formData.guardianName} onChange={e => setFormData({...formData, guardianName: e.target.value})} /></div>
                      <div><label className={labelClasses}>Guardian WhatsApp</label><input type="text" className={inputBase} placeholder="+92" value={formData.guardianWhatsapp} onChange={e => setFormData({...formData, guardianWhatsapp: e.target.value})} /></div>
                      <div className="md:col-span-2"><label className={labelClasses}>Relation to Applicant</label><input type="text" className={inputBase} value={formData.relation} onChange={e => setFormData({...formData, relation: e.target.value})} /></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-12 flex flex-col md:flex-row gap-4">
                 <button type="submit" className="flex-1 py-5 bg-brand-accent text-white font-black uppercase text-[11px] tracking-[0.25em] rounded-2xl hover:bg-rose-700 shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"><Send className="w-4 h-4" /> Submit Enrollment</button>
                 <button type="button" onClick={() => window.print()} className="px-10 py-5 border-2 border-brand-dark text-brand-dark font-black uppercase text-[11px] tracking-[0.25em] rounded-2xl hover:bg-brand-slate transition-all flex items-center justify-center gap-3"><Printer className="w-4 h-4" /> Print Form</button>
              </div>
            </form>
          ) : (
            <div className="max-w-2xl mx-auto py-10">
              <div className="text-center mb-12">
                <h3 className="type-h2 text-brand-dark mb-4">Track Application</h3>
                <p className="type-body">Verify your status using your CNIC or B-Form serial.</p>
              </div>
              <div className="flex gap-4 mb-16">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 w-5 h-5" />
                  <input type="text" placeholder="00000-0000000-0" className={`${inputBase} pl-12 font-mono`} value={trackCnic} onChange={e => setTrackCnic(formatNIC(e.target.value))} />
                </div>
                <button onClick={handleTrack} className="px-10 py-4 bg-brand-dark text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-black shadow-xl transition-all active:scale-95">Verify</button>
              </div>
              {trackedForm && (
                <div className="bg-brand-slate rounded-[2.5rem] p-10 border border-slate-200 animate-fadeIn">
                   <div className="flex justify-between items-center mb-10">
                      <div>
                        <h4 className="text-2xl font-outfit font-black text-brand-dark uppercase leading-none">{trackedForm.firstName} {trackedForm.lastName}</h4>
                        <p className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{trackedForm.regNumber || 'ID: #' + trackedForm.id}</p>
                      </div>
                      <div className={`px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm flex items-center gap-2 ${trackedForm.status === 'Approved' ? 'bg-brand-primary text-white' : trackedForm.status === 'Rejected' ? 'bg-brand-accent text-white' : 'bg-amber-400 text-slate-900'}`}>{trackedForm.status}</div>
                   </div>
                   <div className="pt-8 border-t border-slate-200">
                      <p className={labelClasses}>Allocated Vocational Track</p>
                      <p className="text-lg font-outfit font-bold text-brand-dark uppercase">{courses.find(c => c.id === trackedForm.courseId)?.name || 'Technical Module'}</p>
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
