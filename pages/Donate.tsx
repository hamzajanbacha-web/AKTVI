
import React, { useState } from 'react';
import { Heart, ShieldCheck, Sparkles, Smartphone, Landmark, QrCode, ArrowRight, X, Coins, Users, GraduationCap } from 'lucide-react';

const Donate: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const donationTiers = [
    { 
      amount: '5,000', 
      label: 'Student Kit', 
      desc: 'Provide essential stationery and basic fabric tools for one student.',
      emoji: '🎒'
    },
    { 
      amount: '10,000', 
      label: 'Monthly Sponsor', 
      desc: 'Cover training and utility costs for a month.',
      emoji: '🏫' 
    },
    { 
      amount: '30,000', 
      label: 'Full Scholarship', 
      desc: 'Sponsor a student for an entire 6-month diploma course.',
      emoji: '🎓'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#050B18] overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#E0218A]/5 blur-[150px] rounded-full translate-x-1/2"></div>
        </div>
        
        <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center animate-fadeIn">
          <div className="mb-8 md:mb-12">
            <span className="text-[#34D399] text-[10px] md:text-xs font-black uppercase tracking-[0.6em] md:tracking-[0.8em] block mb-2">
              FUEL THE FUTURE
            </span>
          </div>

          <h1 className="flex flex-col items-center mb-10">
            <span className="font-serif-footer text-5xl md:text-8xl text-white font-medium leading-[1.1] tracking-tight mb-2">
              Your Contribution
            </span>
            <span className="font-script text-5xl md:text-8xl text-[#34D399] magenta-glow lowercase mt-1">
              Changes Destinies
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-2xl font-light leading-relaxed max-w-2xl mx-auto mb-16">
            Help us keep high-quality technical education 100% free for underprivileged women.
          </p>

          <button 
            onClick={() => setShowModal(true)}
            className="group relative px-12 py-5 bg-transparent border-2 border-emerald-500 text-emerald-400 font-black uppercase text-xs tracking-[0.3em] rounded-2xl transition-all hover:bg-emerald-500 hover:text-white shadow-[0_0_20px_rgba(52,211,153,0.1)] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Donate to the Cause <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* Urdu Philosophy Section */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block px-8 py-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <p className="text-3xl md:text-5xl font-urdu text-teal-950 leading-loose">
              آپ کا عطیہ کسی مستحق خاتون کے لیے باعزت روزگار اور روشن مستقبل کی بنیاد بن سکتا ہے۔
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 md:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-fadeIn text-left">
                 <span className="text-[#BE185D] text-[10px] md:text-xs font-black uppercase tracking-[0.5em] block mb-2">
                    OUR IMPACT
                 </span>
                 <h2 className="flex flex-col text-5xl md:text-7xl font-outfit font-black text-[#0B1121] leading-[0.9] tracking-tighter">
                    The Future You 
                    <span className="font-script text-[#BE185D] italic mt-2 lowercase leading-tight">Fund</span>
                 </h2>
                 <p className="text-slate-500 text-lg md:text-2xl font-light leading-relaxed max-w-xl">
                    Every contribution directly funds the high-tech equipment and specialized trainers required to keep our institute the best in the region.
                 </p>
                 <div className="pt-6">
                   <button 
                    onClick={() => setShowModal(true)}
                    className="px-10 py-5 bg-[#0B1121] text-white font-black uppercase text-[11px] md:text-xs tracking-[0.2em] rounded-full shadow-2xl hover:bg-black transition-all active:scale-95"
                   >
                     SUPPORT OUR MISSION
                   </button>
                 </div>
              </div>
              
              <div className="relative">
                 <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-50 rounded-full blur-3xl opacity-50"></div>
                 <div className="relative rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-3xl border-8 border-white group">
                    <img 
                      src="https://images.unsplash.com/photo-1581092921461-7d15ce89a306?auto=format&fit=crop&q=80&w=1200" 
                      alt="Institutional Impact" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1121]/40 to-transparent"></div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Updated Donation Tiers Section Matching the Screenshot */}
      <section className="py-24 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Support Tiers</h2>
             <h3 className="text-3xl md:text-5xl font-outfit font-black text-slate-900 uppercase tracking-tighter">Choose Your Impact</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {donationTiers.map((tier, idx) => (
              <div 
                key={idx} 
                className="relative bg-[#F0FDFB] p-10 md:p-14 rounded-[3.5rem] border-2 border-[#14B8A6] flex flex-col items-center text-center shadow-xl shadow-teal-900/5 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Visual Icon Matching Screenshot style (Emoji placeholder for building) */}
                <div className="text-6xl mb-10 transform transition-transform group-hover:scale-110">
                   {tier.emoji}
                </div>

                <h3 className="text-2xl md:text-3xl font-outfit font-black text-[#0B1121] mb-2">
                  {tier.label}
                </h3>
                
                <p className="font-serif-footer text-3xl md:text-4xl text-[#0D7A70] mb-8 font-medium">
                  PKR {tier.amount}
                </p>

                <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-[220px] mb-12 font-medium">
                  {tier.desc}
                </p>

                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full max-w-[200px] py-4 bg-[#0D7A70] text-white font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-xl shadow-teal-900/10 hover:bg-[#0A665D] transition-all active:scale-95"
                >
                  DONATE NOW
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 bg-teal-50/30 border-y border-teal-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="w-10 h-10 text-teal-800 mb-3" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Secure Portal</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="w-10 h-10 text-teal-800 mb-3" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Verified NGO</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Sparkles className="w-10 h-10 text-teal-800 mb-3" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Direct Impact</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Heart className="w-10 h-10 text-teal-800 mb-3" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Community Built</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Gateway */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
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
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">A project of Akbar Khan Institute</p>
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Donate;
