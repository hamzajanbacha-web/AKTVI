
import React from 'react';
import { Instructor } from '../types';
import { Award, Users, GraduationCap, ShieldCheck, Target, Compass, Sparkles, Heart } from 'lucide-react';

interface AboutProps {
  instructors: Instructor[];
}

const About: React.FC<AboutProps> = ({ instructors }) => {
  return (
    <div className="flex flex-col">
      {/* Vision & Mission Hero Section */}
      <section className="relative py-24 bg-teal-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-400 blur-[150px] rounded-full translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-fadeIn">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">
                <Target className="w-4 h-4" /> Institutional Horizon
              </div>
              
              <div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-tight">
                  Our Vision
                </h2>
                <p className="text-xl md:text-2xl text-teal-100 font-medium leading-relaxed italic border-l-4 border-emerald-500 pl-8">
                  "To empower underprivileged women through accessible education and skill development, fostering a generation of leaders who uplift their families and communities, thereby transforming society at large."
                </p>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-teal-950 bg-teal-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://picsum.photos/seed/student${i}/100/100`} alt="Graduate" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-xs font-black uppercase tracking-widest text-teal-400">
                  Impacted 500+ Lives
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-8 md:p-14 border border-white/10 shadow-2xl relative group">
              <Compass className="absolute -top-6 -right-6 w-20 h-20 text-emerald-500/20 group-hover:rotate-45 transition-transform duration-1000" />
              <h3 className="text-2xl font-black uppercase tracking-widest text-emerald-400 mb-8 flex items-center gap-4">
                <Sparkles className="w-6 h-6" /> Our Mission
              </h3>
              <p className="text-teal-50 text-lg leading-relaxed font-medium">
                At <span className="text-emerald-400 font-black">Akbar Khan Technical and Vocational Institute (Regd. TTB).</span>, we are dedicated to providing free, high-quality training in Fashion Designing, Digital Marketing, IT Skills, and English Language. 
              </p>
              <div className="h-px w-full bg-white/10 my-8"></div>
              <p className="text-teal-200 leading-relaxed italic">
                Our holistic approach combines skill development with career counseling and motivational support, respecting local cultural and ethnic boundaries. We aim to create a sustainable model that enables our students to thrive as self-sufficient leaders, contributing to the economic and social fabric of our province and country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-xs font-black text-teal-600 uppercase tracking-[0.4em] mb-4">Board of Directors</h2>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tighter">Organizational Leadership</h1>
            <div className="w-24 h-2 bg-teal-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: 'Hamza Bacha', role: 'Managing Director', icon: <Award className="w-12 h-12" />, desc: 'Driving excellence in vocational education for the community.' },
              { name: 'Aman Baig Akbar', role: 'Financial Support', icon: <Heart className="w-12 h-12" />, desc: 'Ensuring sustainable growth and support for our students.' },
              { name: 'Ishtiaq Ali', role: 'Co-founder & Advisor', icon: <GraduationCap className="w-12 h-12" />, desc: 'Pioneering technical frameworks for modern learning.' }
            ].map((leader, idx) => (
              <div key={idx} className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 text-center hover:shadow-teal-100 hover:-translate-y-2 transition-all duration-500">
                <div className="w-24 h-24 bg-teal-50 text-teal-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  {leader.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">{leader.name}</h3>
                <p className="text-xs text-teal-600 uppercase tracking-[0.3em] font-black mb-6">{leader.role}</p>
                <p className="text-gray-500 text-sm italic leading-relaxed">"{leader.desc}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-24 bg-teal-50/50 border-y border-teal-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-xs font-black text-teal-400 uppercase tracking-[0.4em] mb-4">Educational Pillars</h2>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Our Esteemed Faculty</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">Dedicated professionals committed to student success and community transformation.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {instructors.map(inst => (
              <div key={inst.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                <div className="relative mb-6">
                  <div className="w-full aspect-square rounded-[2rem] overflow-hidden bg-gray-100 shadow-inner">
                    <img src={inst.image} alt={inst.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-teal-800 text-white text-[10px] font-black rounded-full uppercase shadow-xl whitespace-nowrap tracking-widest border border-white/10">
                    {inst.subject}
                  </div>
                </div>
                <div className="text-center pt-4">
                  <h4 className="font-black text-gray-900 mb-1 uppercase tracking-tight">{inst.name}</h4>
                  <p className="text-[11px] text-gray-500 mb-4 line-clamp-2 italic font-medium">"{inst.qualification}"</p>
                  <div className="text-[9px] text-teal-800 font-black uppercase tracking-[0.2em] bg-teal-100/50 py-2 px-4 rounded-xl inline-block">
                    Batch: {inst.classAssignment}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default About;
