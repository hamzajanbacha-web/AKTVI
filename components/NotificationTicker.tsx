
import React from 'react';

const NotificationTicker: React.FC = () => {
  return (
    <div className="bg-teal-900 text-white py-2 overflow-hidden whitespace-nowrap relative z-40 no-print shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] border-b border-teal-800">
      <div className="max-w-7xl mx-auto overflow-hidden px-4">
        <div className="animate-marquee inline-block">
          <span className="mx-8 text-[11px] font-bold uppercase tracking-widest text-teal-100/90">Free Admissions 2024 are now OPEN for underprivileged women!</span>
          <span className="mx-8 text-sm font-medium text-emerald-400">•</span>
          <span className="mx-8 text-[11px] font-bold uppercase tracking-widest text-teal-100/90">Zero Tuition Fees for all Technical and Vocational Courses.</span>
          <span className="mx-8 text-sm font-medium text-emerald-400">•</span>
          <span className="mx-8 text-lg font-medium font-urdu align-middle">تعلیم اور ہنر - بالکل مفت</span>
          <span className="mx-8 text-sm font-medium text-emerald-400">•</span>
          <span className="mx-8 text-[11px] font-bold uppercase tracking-widest text-teal-100/90">Empowering lives through skills since inception. Visit us today!</span>
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
