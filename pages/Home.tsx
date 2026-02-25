
import React from 'react';
import { Product, Course, Instructor } from '../types';
import CourseCard from '../components/CourseCard';
import { MapPin, Sparkles, Coins, LogIn, UserPlus, GraduationCap } from 'lucide-react';

interface HomeProps {
  courses: Course[];
  products: Product[];
  instructors: Instructor[];
  onApply: (courseId: string) => void;
  onBuy: (product: Product) => void;
  onExploreCourses: () => void;
  onDonateClick: () => void;
  onLoginClick: () => void;
  onSignupClick?: () => void;
}

const Home: React.FC<HomeProps> = ({ 
  courses, 
  onApply, 
  onExploreCourses, 
  onDonateClick, 
  onLoginClick, 
  onSignupClick 
}) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Deep Teal Theme matching Login Portal */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden py-24 bg-brand-dark">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=2400" 
            alt="Technical Education" 
            className="w-full h-full object-cover scale-105 opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/70 via-brand-dark/95 to-brand-dark"></div>
        </div>

        <div className="container max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <div className="w-full max-w-4xl flex flex-col items-center text-center">
            <div className="mb-10 md:mb-14">
              <span className="type-label text-brand-primary mb-6 block tracking-[0.5em] teal-glow">Empowering Underprivileged Women</span>
              <h1 className="type-h1 text-white">
                Skill,<br/>
                Independence,<br/>
                <span className="text-brand-accent font-script crimson-glow italic leading-[1] mt-6 block lowercase">
                  Dignity.
                </span>
              </h1>
            </div>

            <p className="max-w-2xl text-teal-100/80 text-lg md:text-2xl font-light leading-relaxed mb-16 font-outfit px-4">
              Providing high-quality <span className="text-white font-bold border-b-2 border-brand-accent pb-1">free technical training</span> for women in Mardan, building futures through skill.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl px-6">
              <button onClick={() => onApply('any')} className="px-10 py-5 bg-brand-accent text-white font-black uppercase text-[11px] tracking-[0.25em] rounded-2xl transition-all shadow-2xl hover:bg-rose-700 active:scale-95">Enroll Free Today</button>
              <button onClick={onLoginClick} className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black uppercase text-[11px] tracking-[0.25em] rounded-2xl transition-all hover:bg-white/20 active:scale-95 flex items-center justify-center gap-3"><LogIn className="w-4 h-4" /> Student Portal</button>
              <button onClick={() => onApply('any')} className="px-10 py-5 bg-brand-primary/20 backdrop-blur-md border border-brand-primary/30 text-white font-black uppercase text-[11px] tracking-[0.25em] rounded-2xl transition-all hover:bg-brand-primary/30 active:scale-95 flex items-center justify-center gap-3"><UserPlus className="w-4 h-4" /> Register</button>
            </div>
          </div>
        </div>
      </section>

      {/* Urdu Branding Section */}
      <section className="bg-white py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="px-12 py-10 bg-brand-slate rounded-[4rem] border border-slate-200 inline-block shadow-sm">
            <div className="text-4xl sm:text-6xl md:text-7xl font-urdu font-bold text-brand-dark">
              تعلیم، ہنر، با عزت روزگار - بالکل مفت
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Mission */}
      <section className="py-24 md:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                 <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-brand-slate border border-slate-200 rounded-full text-brand-primary type-label">
                    <Sparkles className="w-4 h-4" /> REGD. Trade Testing Board
                 </div>
                 <h2 className="type-h2 text-brand-dark leading-[0.9]">
                   Skill is the <br/><span className="text-brand-accent">Real Dignity</span>
                 </h2>
                 <p className="text-xl text-slate-600 leading-relaxed font-inter">
                   AKTVI Mardan is more than an institute. It's a gateway to self-reliance. We provide the tools, the technology, and the mentorship—everything else is up to her.
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    <div className="p-10 bg-brand-slate rounded-[3rem] border border-slate-100 transition-all hover:border-brand-primary/30">
                       <p className="text-5xl font-black text-brand-dark font-outfit tracking-tighter">500+</p>
                       <p className="type-label mt-4 text-slate-400">Graduates</p>
                    </div>
                    <div className="p-10 bg-brand-slate rounded-[3rem] border border-slate-100 transition-all hover:border-brand-accent/30">
                       <p className="text-5xl font-black text-brand-accent font-outfit tracking-tighter">100%</p>
                       <p className="type-label mt-4 text-slate-400">Free Admissions</p>
                    </div>
                 </div>
                 <button onClick={onDonateClick} className="flex items-center justify-center gap-4 px-12 py-6 bg-brand-dark text-white font-black uppercase text-xs tracking-[0.2em] rounded-3xl hover:bg-black transition-all shadow-2xl w-full sm:w-auto">
                   <Coins className="w-5 h-5" /> Support a Student
                 </button>
              </div>
              <div className="relative">
                 <div className="rounded-[4rem] md:rounded-[6rem] overflow-hidden shadow-3xl border-[12px] border-white ring-1 ring-slate-100">
                    <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200" alt="Student Empowerment" className="w-full h-full object-cover" />
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-primary/5 blur-3xl rounded-full"></div>
              </div>
           </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-24 bg-brand-slate">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="type-h2 text-brand-dark">Vocational Tracks</h2>
              <p className="type-body mt-4 max-w-xl text-slate-500">Industry-recognized diploma programs focusing on fashion, beauty, and digital skills.</p>
            </div>
            <button onClick={onExploreCourses} className="type-label text-brand-primary border-b-2 border-brand-primary pb-1 hover:text-brand-accent hover:border-brand-accent transition-all">View All Modules</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.slice(0, 4).map(course => (
              <CourseCard key={course.id} course={course} onApply={onApply} />
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Location */}
      <section className="py-32 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="type-h2 text-white">Institutional <br/><span className="text-brand-primary">Headquarters</span></h2>
              <div className="space-y-10">
                <a href="https://maps.app.goo.gl/ngzW4XdB3LwC2gEW6" target="_blank" rel="noopener noreferrer" className="flex items-start gap-8 group cursor-pointer">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 shadow-xl group-hover:bg-brand-primary/20 transition-colors"><MapPin className="w-8 h-8 text-brand-primary" /></div>
                  <div>
                    <h4 className="type-label text-brand-primary mb-3 tracking-[0.3em]">Campus Address</h4>
                    <p className="text-teal-100 text-xl md:text-2xl leading-relaxed font-outfit group-hover:text-white transition-colors">
                      2nd Floor, BAAZ PLAZA, <br/>Gujar Garhi Bypass, Mardan.
                    </p>
                  </div>
                </a>
                <div className="flex items-start gap-8">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 shadow-xl"><GraduationCap className="w-8 h-8 text-brand-accent" /></div>
                  <div>
                    <h4 className="type-label text-brand-accent mb-3 tracking-[0.3em]">Recognition</h4>
                    <p className="text-teal-100 text-xl md:text-2xl leading-relaxed font-outfit">
                      Accredited by Trade Testing Board (TTB) KP.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[4rem] overflow-hidden shadow-4xl h-[500px] md:h-[700px] border-[16px] border-white/5 grayscale hover:grayscale-0 transition-all duration-700">
              <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000" alt="Institute View" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
