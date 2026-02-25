
import React from 'react';
import { Instructor } from '../types';
import { Target, Compass, Sparkles, Heart } from 'lucide-react';

interface AboutProps {
  instructors: Instructor[];
}

const About: React.FC<AboutProps> = ({ instructors }) => {
  return (
    <div className="flex flex-col bg-white">
      {/* Branding Header */}
      <section className="bg-white border-b border-slate-100 py-20 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center">
             <div className="relative mb-8">
               <div className="absolute inset-0 bg-teal-400 blur-3xl opacity-10 rounded-full scale-150 animate-pulse"></div>
               <div className="relative w-32 h-32 rounded-full border-4 border-teal-600 p-1 bg-white shadow-2xl overflow-hidden">
                 <img src="https://picsum.photos/seed/akbarlogo/200/200" alt="Logo" className="w-full h-full object-cover rounded-full" />
               </div>
             </div>
             <h1 className="text-xl md:text-3xl font-outfit font-black text-slate-900 uppercase tracking-tighter mb-4">
               Akbar Khan Technical and Vocational Institute
             </h1>
             <div className="text-4xl md:text-6xl font-urdu text-teal-800 drop-shadow-sm mb-6">
                اکبر خان ٹیکنیکل اینڈ ووکیشنل انسٹیٹیوٹ
             </div>
             <div className="flex items-center gap-2 px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
               <Heart className="w-4 h-4 fill-emerald-700" /> Free Education for All
             </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-teal-950 rounded-[3rem] p-12 md:p-16 border border-teal-900 shadow-2xl text-white">
              <div className="flex items-center gap-4 mb-10"><Target className="w-10 h-10 text-emerald-400" /><h4 className="text-2xl font-outfit font-black uppercase tracking-widest">Our Vision</h4></div>
              <p className="text-xl md:text-2xl font-inter font-medium leading-relaxed italic opacity-90">To empower underprivileged women through accessible education and skill development, fostering a generation of leaders who uplift their families.</p>
            </div>
            <div className="bg-white rounded-[3rem] p-12 md:p-16 border border-slate-100 shadow-xl">
              <div className="flex items-center gap-4 mb-10"><Compass className="w-10 h-10 text-teal-600" /><h4 className="text-2xl font-outfit font-black uppercase tracking-widest text-slate-900">Our Mission</h4></div>
              <p className="text-lg text-slate-600 font-inter font-medium leading-relaxed">Providing high-quality training in Fashion, IT, and Language while ensuring a holistic approach to career counseling and cultural sensitivity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section className="py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20"><h2 className="type-h2">Educational Pillars</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {instructors.map(inst => (
              <div key={inst.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 group text-center">
                <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden bg-slate-50 mb-6 border border-slate-100">
                  <img src={inst.image} alt={inst.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h4 className="text-lg font-outfit font-black text-slate-900 uppercase tracking-tight">{inst.name}</h4>
                <p className="text-[11px] font-inter font-medium text-slate-500 italic mt-2">"{inst.qualification}"</p>
                <div className="mt-6 pt-4 border-t border-slate-50"><span className="type-label text-teal-800 bg-teal-50 px-4 py-2 rounded-xl">{inst.subject}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
