
import React, { useState, useEffect } from 'react';
import { Product, Course, Instructor } from '../types';
import CourseCard from '../components/CourseCard';
import ProductCard from '../components/ProductCard';
import { MapPin, Phone, Mail, Award, Users, BookOpen, GraduationCap, ChevronLeft, ChevronRight, Star, Sparkles, Sun, Circle, Heart, ShieldCheck, Coins } from 'lucide-react';

interface HomeProps {
  courses: Course[];
  products: Product[];
  instructors: Instructor[];
  onApply: (courseId: string) => void;
  onBuy: (product: Product) => void;
  onExploreCourses: () => void;
  onDonateClick: () => void;
}

const Home: React.FC<HomeProps> = ({ courses, products, instructors, onApply, onBuy, onExploreCourses, onDonateClick }) => {
  const [facultyIndex, setFacultyIndex] = useState(0);

  useEffect(() => {
    if (instructors.length === 0) return;
    const interval = setInterval(() => {
      setFacultyIndex((prev) => (prev + 1) % instructors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [instructors]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=2400" 
            alt="Academic Environment" 
            className="w-full h-full object-cover scale-100 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/60 via-white/30 to-teal-50/50"></div>
          <div className="absolute inset-0 backdrop-blur-[2px]"></div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
          <div className="w-full max-w-5xl bg-white/20 backdrop-blur-[6px] border border-white/40 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 shadow-2xl flex flex-col items-center text-center animate-fadeIn">
            
            {/* Circular Logo */}
            <div className="relative mb-6 md:mb-10">
              <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-20 rounded-full scale-150"></div>
              <div className="relative w-24 h-24 md:w-44 md:h-44 rounded-full border-4 border-white p-1 md:p-1.5 shadow-2xl bg-white shrink-0 transition-transform duration-700 hover:rotate-6">
                <img src="https://picsum.photos/seed/akbarlogo/200/200" alt="Institute Logo" className="w-full h-full object-cover rounded-full" />
              </div>
            </div>

            {/* Institutional Name */}
            <div className="mb-6 md:mb-10 space-y-3 md:space-y-4">
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-1">
                 <div className="h-px w-4 md:w-8 bg-teal-800/30"></div>
                 <span className="text-emerald-800 text-[8px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em]">100% Free • Non-Profit</span>
                 <div className="h-px w-4 md:w-8 bg-teal-800/30"></div>
              </div>
              <h2 className="text-sm md:text-2xl font-black text-teal-950 uppercase tracking-tight md:tracking-[0.2em] drop-shadow-sm leading-tight px-2">
                Akbar Khan Technical and Vocational Institute (Regd. TTB).
              </h2>
              <div 
                className="text-3xl sm:text-5xl md:text-8xl font-urdu font-bold leading-relaxed text-teal-900 px-4"
                style={{ 
                  textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 0 4px 12px rgba(0,0,0,0.1)' 
                }}
              >
                اکبر خان ٹیکنیکل اینڈ ووکیشنل انسٹیٹیوٹ
              </div>
            </div>

            {/* Glass Slogan Bar */}
            <div className="bg-teal-950/70 backdrop-blur-md px-6 py-5 md:px-16 md:py-10 rounded-[2rem] border border-white/20 shadow-xl mb-8 md:mb-12 group hover:scale-[1.01] transition-transform duration-500">
              <div className="flex items-center gap-3 mb-2 md:mb-4 justify-center">
                <div className="h-px w-8 md:w-12 bg-emerald-400/50"></div>
                <Heart className="w-4 h-4 text-emerald-300 animate-pulse fill-emerald-300" />
                <div className="h-px w-8 md:w-12 bg-emerald-400/50"></div>
              </div>
              <p className="text-xl sm:text-3xl md:text-5xl font-urdu text-white leading-relaxed tracking-wide drop-shadow-lg">
                تعلیم، ہنر، با عزت روزگار - بالکل مفت
              </p>
              <p className="text-emerald-300 text-[8px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.5em] mt-2 md:mt-4 opacity-90">
                Empowering Women with Zero Tuition Fees
              </p>
            </div>

            {/* Strategic Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 w-full sm:w-auto">
               <button 
                onClick={() => onApply('any')}
                className="group relative px-8 md:px-12 py-4 md:py-5 bg-teal-600 text-white font-black uppercase text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] rounded-xl md:rounded-2xl transition-all overflow-hidden shadow-2xl shadow-teal-900/20 w-full sm:w-auto"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <span className="relative z-10 flex items-center justify-center gap-2">
                   Free Enrollment <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </span>
               </button>
               <button 
                onClick={onDonateClick}
                className="px-8 md:px-12 py-4 md:py-5 bg-white text-teal-950 border-2 border-teal-950 font-black uppercase text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] rounded-xl md:rounded-2xl transition-all shadow-lg hover:bg-teal-50 w-full sm:w-auto"
               >
                 Fuel a Future
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Empowerment & Donation Highlights */}
      <section className="py-12 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
                    <Sparkles className="w-3.5 h-3.5" /> Institutional Philanthropy
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
                   Your Support Feeds <br/><span className="text-teal-600">Her Ambition</span>
                 </h2>
                 <p className="text-base md:text-lg text-slate-600 leading-relaxed italic">
                   "At Akbar Khan Institute, we transform charity into self-sufficiency. Every donation directly funds the high-end machinery and professional instructors needed to turn a student into a skilled entrepreneur."
                 </p>
                 <div className="grid grid-cols-2 gap-4 md:gap-6 pt-2 md:pt-4">
                    <div className="p-5 md:p-6 bg-teal-50 rounded-2xl md:rounded-3xl border border-teal-100">
                       <p className="text-xl md:text-2xl font-black text-teal-900">500+</p>
                       <p className="text-[9px] md:text-[10px] font-black text-teal-400 uppercase tracking-widest mt-1">Lives Empowered</p>
                    </div>
                    <div className="p-5 md:p-6 bg-emerald-50 rounded-2xl md:rounded-3xl border border-emerald-100">
                       <p className="text-xl md:text-2xl font-black text-emerald-900">100%</p>
                       <p className="text-[9px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Tuition-Free</p>
                    </div>
                 </div>
                 <button 
                  onClick={onDonateClick}
                  className="flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-teal-950 text-white font-black uppercase text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] rounded-xl md:rounded-2xl hover:bg-black transition-all shadow-xl w-full sm:w-auto"
                 >
                   <Coins className="w-4 h-4 md:w-5 md:h-5" /> Support Our Students
                 </button>
              </div>
              <div className="relative order-1 lg:order-2">
                 <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
                 <div className="relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl aspect-[4/5] md:aspect-auto md:h-[600px] border-4 md:border-8 border-white">
                    <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200" alt="Student Impact" className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 md:bottom-10 left-4 md:left-10 right-4 md:right-10 p-4 md:p-8 bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl">
                       <p className="text-white text-base md:text-lg font-urdu leading-normal text-center">
                         آپ کا تعاون ان خواتین کے خوابوں کو حقیقت کا روپ دے سکتا ہے۔
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-12 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 uppercase tracking-tight">Our Professional Free Courses</h2>
            <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto mb-6 px-4">Providing underprivileged women with high-quality technical training at zero cost to foster financial independence.</p>
            <div className="w-16 md:w-24 h-1 md:h-1.5 bg-emerald-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {courses.slice(0, 4).map(course => (
              <CourseCard key={course.id} course={course} onApply={onApply} />
            ))}
          </div>
          <div className="mt-10 text-center md:hidden">
             <button onClick={onExploreCourses} className="text-[10px] font-black text-teal-600 uppercase tracking-widest border-b-2 border-teal-600 pb-1">View All Modules</button>
          </div>
        </div>
      </section>

      {/* Faculty scroller */}
      {instructors.length > 0 && (
        <section className="py-12 md:py-24 bg-teal-50/50 border-y border-teal-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">World-Class Mentorship</h2>
              <p className="text-teal-600 font-black uppercase tracking-widest text-[9px] md:text-xs">Learn from the very best in the industry - absolutely free</p>
              <div className="w-12 md:w-16 h-1 bg-teal-600 mx-auto rounded-full mt-4 md:mt-6"></div>
            </div>
            <div className="relative max-w-3xl mx-auto">
              <div className="overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] bg-white shadow-2xl border border-teal-50">
                <div className="flex flex-col md:flex-row items-center p-8 md:p-16 gap-8 md:gap-12 animate-fadeIn">
                  <div className="w-40 h-40 md:w-56 md:h-56 rounded-2xl md:rounded-[2.5rem] border-4 md:border-8 border-teal-50 p-1 md:p-1.5 overflow-hidden shrink-0 shadow-xl">
                    <img src={instructors[facultyIndex].image} alt={instructors[facultyIndex].name} className="w-full h-full object-cover rounded-xl md:rounded-[2rem]" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-1 md:mb-2 uppercase tracking-tight">{instructors[facultyIndex].name}</h3>
                    <p className="text-teal-600 font-black text-[10px] md:text-sm mb-4 md:mb-6 uppercase tracking-[0.2em] md:tracking-[0.3em]">{instructors[facultyIndex].subject}</p>
                    <p className="text-gray-600 italic mb-6 md:mb-10 text-sm md:text-lg leading-relaxed px-4 md:px-0">"{instructors[facultyIndex].qualification}"</p>
                    <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-teal-600 text-white text-[8px] md:text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
                      <GraduationCap className="w-4 h-4 md:w-5 md:h-5" /> Cohort: {instructors[facultyIndex].classAssignment}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-8 md:mt-12 gap-2 md:gap-4">
                {instructors.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setFacultyIndex(i)}
                    className={`h-2 md:h-2.5 rounded-full transition-all duration-700 ${facultyIndex === i ? 'bg-teal-600 w-10 md:w-16' : 'bg-teal-200 w-2 md:w-4 hover:bg-teal-300'}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Campus Location */}
      <section className="py-12 md:py-24 bg-teal-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="order-2 md:order-1 space-y-8 md:space-y-12">
              <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">Visit Our Campus</h2>
              <div className="flex items-start gap-4 md:gap-8 group">
                <div className="p-3 md:p-5 bg-emerald-500 text-teal-950 rounded-2xl md:rounded-[2rem] shadow-2xl group-hover:rotate-6 transition-transform shrink-0">
                  <MapPin className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                <div>
                  <h4 className="font-black text-[9px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.5em] text-emerald-400 mb-1 md:mb-3">Location</h4>
                  <p className="text-teal-50 text-base md:text-xl leading-relaxed font-medium">
                    2nd Floor, BAAZ PLAZA, <br className="hidden md:block"/>
                    Gujar Garhi Bypass, Charsadda Chowk, Mardan.
                  </p>
                </div>
              </div>
              <a 
                href="https://maps.app.goo.gl/qpBQZsywsAUpNhxb6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-white text-teal-950 font-black uppercase text-[10px] md:text-xs tracking-widest rounded-xl md:rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl w-full sm:w-auto"
              >
                <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                Navigate to Campus
              </a>
              
              <div className="pt-6 md:pt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                <div className="flex items-center gap-4 md:gap-5 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-900 text-emerald-400 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-emerald-500 group-hover:text-teal-950 transition-all shrink-0">
                    <Phone className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5 md:mb-1">Mobile</p>
                    <p className="font-bold text-white text-base md:text-lg">+92 315 5241325</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-5 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-900 text-emerald-400 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-emerald-500 group-hover:text-teal-950 transition-all shrink-0">
                    <Mail className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5 md:mb-1">Email</p>
                    <p className="font-bold text-white text-sm md:text-lg break-all">hamzajanbacha@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2 rounded-3xl md:rounded-[4rem] overflow-hidden shadow-3xl h-[300px] md:h-[600px] relative border-4 md:border-[12px] border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000" 
                alt="Campus View" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-teal-950/20"></div>
            </div>
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
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slowZoom 40s ease-out infinite alternate;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Home;
