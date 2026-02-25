
import React, { useState, useEffect } from 'react';
import { Menu, Radio } from 'lucide-react';
import { SessionSchedule } from '../types';

interface LiveStatusBarProps {
  session: SessionSchedule | null;
  sessionName: string;
  onJoinNow: () => void;
  onToggleSidebar: () => void;
  onLogoClick: () => void;
}

const LiveStatusBar: React.FC<LiveStatusBarProps> = ({ 
  session, 
  sessionName, 
  onJoinNow, 
  onToggleSidebar, 
  onLogoClick
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!session || session.status === 'Live') {
      setTimeLeft('');
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const target = new Date(session.startTime).getTime();
      const difference = target - now;

      if (difference <= 0 || isNaN(difference)) {
        setTimeLeft('');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const isLive = session?.status === 'Live';

  return (
    <div className="relative flex w-full no-print bg-brand-dark h-14 md:h-20 items-center justify-between border-b border-brand-primary/10 shadow-lg font-inter px-4 md:px-8">
      
      {/* Branding Section */}
      <div className="flex items-center gap-3 md:gap-5">
        <button 
          className="flex items-center gap-3 group transition-transform active:scale-95"
          onClick={onLogoClick}
          title="Institutional Home"
        >
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl border border-brand-primary/20 overflow-hidden shadow-2xl group-hover:border-brand-primary transition-all text-white flex items-center justify-center bg-white/5">
             <img 
                src="https://picsum.photos/seed/akbarlogo/200/200" 
                alt="AKTVI Logo" 
                className="w-full h-full object-cover"
              />
          </div>
          <div className="hidden sm:flex flex-col items-start leading-none">
            <span className="text-[8px] md:text-[9px] font-black text-brand-primary/60 uppercase tracking-[0.3em] mb-1">Institutional</span>
            <span className="text-sm md:text-lg font-black text-white tracking-tighter uppercase font-outfit">AKTVI MARDAN</span>
          </div>
        </button>
      </div>

      {/* Dynamic Session Tracking Center */}
      <div className="flex items-center gap-3 md:gap-10">
        <div className="flex items-center gap-3 md:gap-6 pr-3 md:pr-10 border-r border-white/5">
          
          <div className="relative flex items-center justify-center shrink-0">
            {isLive ? (
              <>
                <div className="absolute w-4 h-4 rounded-full bg-brand-accent/40 animate-ping"></div>
                <Radio className="relative w-4 h-4 text-brand-accent" />
              </>
            ) : (
              <div className="w-2 h-2 rounded-full bg-brand-primary/40"></div>
            )}
          </div>
          
          <div className="flex flex-col items-start leading-tight max-w-[100px] md:max-w-[220px]">
            <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-1 ${isLive ? 'text-brand-accent' : 'text-brand-primary'}`}>
              {isLive ? 'LIVE SESSION' : 'NEXT CLASS'}
            </span>
            <span className="text-[10px] md:text-sm font-bold text-white truncate w-full">
              {sessionName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isLive && timeLeft && (
              <div className="hidden sm:flex px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                 <span className="text-[9px] font-mono font-bold text-teal-200 tracking-tighter uppercase">T-MINUS {timeLeft}</span>
              </div>
            )}

            {isLive && (
              <button 
                onClick={onJoinNow}
                className="px-3 md:px-6 py-1.5 md:py-2.5 bg-brand-accent text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-700 transition-all shadow-[0_0_15px_#BE185D44] active:scale-95 whitespace-nowrap"
              >
                Join Now
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Toggle - HIDDEN ON DESKTOP */}
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2.5 md:p-4 text-brand-primary/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90"
        >
          <Menu className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
};

export default LiveStatusBar;
