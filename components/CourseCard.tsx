
import React, { useState } from 'react';
import { Course } from '../types';
import { Clock, MapPin, Globe, CheckCircle, Heart, Lock, PlayCircle } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onApply: (courseId: string) => void;
  onBuy?: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onApply, onBuy }) => {
  const [showDescription, setShowDescription] = useState(false);

  const statusColors = {
    Active: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Scheduled: 'bg-blue-100 text-blue-700',
    Postponed: 'bg-red-100 text-red-700',
    active: 'bg-green-100 text-green-700',
    scheduled: 'bg-blue-100 text-blue-700',
    frozen: 'bg-slate-100 text-slate-700',
    Live: 'bg-rose-100 text-rose-700',
    Discarded: 'bg-slate-100 text-slate-700'
  };

  return (
    <div 
      className="relative bg-white rounded-2xl shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full border border-slate-100"
      onMouseEnter={() => setShowDescription(true)}
      onMouseLeave={() => setShowDescription(false)}
    >
      <div className="relative h-48 overflow-hidden shrink-0">
        <img 
          src={course.thumbnail} 
          alt={course.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
           <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${statusColors[course.status as keyof typeof statusColors] || 'bg-slate-100 text-slate-700'}`}>
            {course.status}
          </span>
          {course.isPremium ? (
            <span className="bg-amber-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1 shadow-lg">
              <Lock className="w-2.5 h-2.5 fill-white" /> PREMIUM - PKR {course.price}
            </span>
          ) : (
            <span className="bg-emerald-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1 shadow-lg">
              <Heart className="w-2.5 h-2.5 fill-white" /> 100% FREE
            </span>
          )}
        </div>
        
        <div className="absolute -bottom-6 right-4 w-12 h-16 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
          <img src={course.instructorImage} alt={course.instructorName} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="p-5 pt-8 flex flex-col flex-grow">
        <h3 className="text-lg font-outfit font-black text-slate-800 mb-1 uppercase tracking-tight leading-tight">{course.name}</h3>
        <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-3 flex items-center">
          <CheckCircle className="w-3.5 h-3.5 mr-1" /> {course.instructorName}
        </p>
        
        <div className="flex flex-col gap-1 mb-4 flex-grow">
           <p className="text-sm text-slate-500 line-clamp-2 italic font-inter leading-relaxed">"{course.content}"</p>
           <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
             <Clock className="w-3 h-3 mr-1" /> {course.duration}
           </div>
        </div>

        {course.isPremium ? (
          <button 
            onClick={(e) => { e.stopPropagation(); onBuy && onBuy(course.id); }}
            className="w-full py-3 bg-amber-500 text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-amber-600 transition-all shadow-sm"
          >
            Buy Now
          </button>
        ) : (
          <button 
            onClick={(e) => { e.stopPropagation(); onApply(course.id); }}
            className="w-full py-3 bg-teal-800 text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-teal-950 transition-all shadow-sm"
          >
            Enroll for Free
          </button>
        )}
      </div>

      {showDescription && (
        <div className="absolute top-0 left-0 right-0 bottom-[72px] bg-teal-900/95 backdrop-blur-sm p-8 flex flex-col justify-center text-white animate-fadeIn transition-opacity duration-300 z-50">
           <div className="mb-4 px-3 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-full uppercase inline-block self-start tracking-widest">Syllabus Overview</div>
           <h4 className="text-xl font-outfit font-black mb-3 uppercase tracking-tight">{course.name}</h4>
           <p className="text-sm font-inter leading-relaxed mb-6 opacity-90 line-clamp-4">{course.description}</p>
           {course.isPremium && course.previewVideoUrl && (
              <a href={course.previewVideoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors mt-2">
                <PlayCircle className="w-4 h-4" /> Watch Preview
              </a>
           )}
           <div className="h-1 w-12 bg-emerald-400 rounded-full mt-4"></div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
