
import React, { useState } from 'react';
import { Heart, ShieldCheck, Sparkles, Smartphone, Landmark, QrCode, ArrowRight, X, Coins, Users } from 'lucide-react';

const Donate: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const donationTiers = [
    { amount: '5,000', label: 'Student Kit', desc: 'Provide essential stationery and basic fabric tools for one student.' },
    { amount: '15,000', label: 'Monthly Scholarship', desc: 'Full monthly tuition and resource coverage for a specialized vocational course.' },
    { amount: '50,000', label: 'Empowerment Grant', desc: 'Sponsor a student for an entire 6-month diploma including certification fees.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-teal-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <Heart className="w-4 h-4 fill-emerald-400" /> Fuel a Future
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-tight">
            Your Contribution is <br/><span className="text-emerald-400">Her Transformation</span>
          </h1>
          <p className="text-xl md:text-2xl text-teal-100 font-urdu max-w-3xl mx-auto leading-relaxed mb-12">
            آپ کا عطیہ کسی مستحق خاتون کے لیے باعزت روزگار اور روشن مستقبل کی بنیاد بن سکتا ہے۔
          </p>
          <button 
            onClick={() => setShowModal(true)}
            className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-[0.3em] rounded-2xl shadow-2xl transition-all active:scale-95"
          >
            Donate to the Cause
          </button>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {donationTiers.map((tier, idx) => (
            <div 
              key={idx} 
              onClick={() => setShowModal(true)}
              className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer active:scale-95"
            >
              <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-lg mb-8 group-hover:scale-110 transition-transform">
                <Coins className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">{tier.amount} PKR</h3>
              <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-6">{tier.label}</p>
              <p className="text-slate-500 text-sm leading-relaxed italic mb-8">"{tier.desc}"</p>
              <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:gap-4 transition-all">
                Contribute Now <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-teal-50/50 border-y border-teal-100">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-12">
           <h2 className="text-xs font-black text-teal-600 uppercase tracking-[0.5em]">The Ripple Effect</h2>
           <p className="text-3xl md:text-4xl font-black text-teal-900 leading-tight">
             "At Akbar Khan Institute, we don't just provide charity; we provide dignity. By supporting our institutional infrastructure, you ensure that every student has access to the best machinery and digital tools."
           </p>
           <div className="flex items-center justify-center gap-8 pt-8">
             <div className="flex flex-col items-center">
               <ShieldCheck className="w-10 h-10 text-teal-800 mb-2" />
               <span className="text-[10px] font-black uppercase text-slate-400">100% Transparency</span>
             </div>
             <div className="flex flex-col items-center">
               <Users className="w-10 h-10 text-teal-800 mb-2" />
               <span className="text-[10px] font-black uppercase text-slate-400">Verified Impact</span>
             </div>
           </div>
        </div>
      </section>

      {/* Modal Gateway */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-scaleIn">
            <div className="bg-teal-900 p-8 text-white relative">
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Contribution Portal</h2>
              <p className="text-teal-300 text-xs font-bold uppercase tracking-widest opacity-80">Institutional Support & Development</p>
            </div>

            <div className="p-10 space-y-6">
              <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">EasyPaisa / JazzCash</p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">+92 315 5241325</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100 group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">HBL Account Transfer</p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">Hamza Bacha (Mardan)</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase">Account details provided on contact.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-110 transition-transform">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">Verified Donation</p>
                  <p className="text-sm text-slate-500 leading-tight">Please send a screenshot of your transaction to our mobile number for verification.</p>
                </div>
              </div>
              
              <div className="pt-6 text-center">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">A project of Akbar Khan Foundation</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Donate;
