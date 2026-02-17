
import React, { useState } from 'react';
import { Course } from '../types';
import { Clock, MapPin, Globe, CheckCircle, Heart } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onApply: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onApply }) => {
  const [showDescription, setShowDescription] = useState(false);

  const statusColors = {
    Active: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Scheduled: 'bg-blue-100 text-blue-700',
    Postponed: 'bg-red-100 text-red-700'
  };

  return (
    <div 
      className="relative bg-white rounded-xl shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
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
           <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${statusColors[course.status as keyof typeof statusColors]}`}>
            {course.status}
          </span>
          <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase flex items-center gap-1 shadow-lg">
            <Heart className="w-2.5 h-2.5 fill-white" />
            100% FREE
          </span>
          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-full text-teal-700 uppercase flex items-center gap-1">
            {course.mode === 'ON CAMPUS' ? <MapPin className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
            {course.mode}
          </span>
        </div>
        
        {/* Instructor Oval */}
        <div className="absolute -bottom-6 right-4 w-12 h-16 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
          <img src={course.instructorImage} alt={course.instructorName} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="p-5 pt-8 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{course.name}</h3>
        <p className="text-xs text-teal-600 font-medium mb-3 flex items-center">
          <CheckCircle className="w-3 h-3 mr-1" />
          Instructor: {course.instructorName}
        </p>
        
        <div className="flex flex-col gap-1 mb-4 flex-grow">
           <p className="text-sm text-gray-500 line-clamp-1 italic">"{course.content}"</p>
           <div className="flex items-center text-xs text-gray-400 font-medium">
             <Clock className="w-3 h-3 mr-1" /> {course.duration}
           </div>
        </div>

        <div className="mt-auto relative z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onApply(course.id);
            }}
            className="w-full py-2.5 bg-teal-600 text-white rounded-lg font-semibold text-sm hover:bg-teal-700 transition-colors shadow-sm"
          >
            Apply for Free
          </button>
        </div>
      </div>

      {/* Hover Description Tooltip Style */}
      {showDescription && (
        <div className="absolute top-0 left-0 right-0 bottom-[72px] bg-teal-900/95 backdrop-blur-sm p-6 flex flex-col justify-center text-white animate-fadeIn transition-opacity duration-300 z-0">
           <div className="mb-3 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase inline-block self-start">Free Non-Profit Course</div>
           <h4 className="text-lg font-bold mb-2">Description</h4>
           <p className="text-sm leading-relaxed mb-4 overflow-y-auto">{course.description}</p>
           <div className="h-1 w-12 bg-emerald-400 rounded-full shrink-0"></div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
