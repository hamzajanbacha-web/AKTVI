
import React from 'react';
import { SessionSchedule } from '../types';

interface NotificationTickerProps {
  liveSession: SessionSchedule | null;
  sessionName: string;
}

const NotificationTicker: React.FC<NotificationTickerProps> = ({ liveSession, sessionName }) => {
  return (
    <div className="bg-brand-dark text-white py-2 overflow-hidden whitespace-nowrap relative z-40 no-print border-b border-brand-primary/20 shadow-inner">
      <div className="w-full overflow-hidden">
        <div className="animate-marquee inline-block font-outfit">
          {liveSession && (
            <span className="mx-12 text-[10px] md:text-[12px] font-black uppercase tracking-[0.15em] text-white">
              <span className="bg-brand-accent px-3 py-1 rounded-md animate-pulse mr-3 shadow-[0_0_20px_#BE185D]">LIVE NOW</span>
              {sessionName}: {liveSession.topic} • 
            </span>
          )}
          <span className="mx-12 text-[10px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-white/90">
             ANNOUNCEMENT: <span className="text-white bg-brand-accent px-3 py-0.5 rounded-md shadow-[0_0_15px_#BE185D66]">ADMISSIONS OPEN</span> FOR FALL 2024 • 100% FREE TECHNICAL EDUCATION FOR WOMEN • 
          </span>
          <span className="mx-12 text-[10px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-white/90">
             ANNOUNCEMENT: <span className="text-white bg-brand-accent px-3 py-0.5 rounded-md shadow-[0_0_15px_#BE185D66]">ADMISSIONS OPEN</span> FOR FALL 2024 • 100% FREE TECHNICAL EDUCATION FOR WOMEN • 
          </span>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NotificationTicker;
