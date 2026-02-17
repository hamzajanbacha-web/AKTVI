
import React, { useState, useEffect } from 'react';
import { Activity, Calendar, ArrowRight, Clock } from 'lucide-react';
import { SessionSchedule, Course } from '../types';

interface LiveStatusBarProps {
  nextSession?: SessionSchedule | null;
  courses: Course[];
  onJoinNow: () => void;
}

const LiveStatusBar: React.FC<LiveStatusBarProps> = ({ nextSession, courses, onJoinNow }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  const course = courses.find(c => c.id === nextSession?.courseId);

  useEffect(() => {
    if (!nextSession || nextSession.status !== 'Scheduled') return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(nextSession.startTime).getTime();
      const diff = start - now;

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(timer);
        // Status should technically transition to Live here or on refresh
      } else {
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextSession]);

  if (!nextSession) return null;

  const isLive = nextSession.status === 'Live';

  return (
    <div className="bg-teal-950 text-white py-2.5 relative z-[60] no-print border-b border-white/5 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8">
        
        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
            isLive ? 'bg-rose-600 animate-pulse' : 'bg-teal-800 border border-white/10'
          }`}>
            {isLive ? <Activity className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            {isLive ? 'Live Now' : 'Scheduled'}
          </div>
          
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-tight leading-none text-white/90">
              {course?.name || "Technical Session"}: {nextSession.topic}
            </span>
            {!isLive && (
              <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest mt-0.5">
                Starts in: {timeLeft}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        {isLive && (
          <button 
            onClick={onJoinNow}
            className="flex items-center gap-2 bg-white text-teal-950 px-6 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all shadow-xl active:scale-95 group animate-scaleIn"
          >
            Enter Classroom <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveStatusBar;
