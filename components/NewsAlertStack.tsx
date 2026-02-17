
import React, { useState, useEffect } from 'react';
import { Megaphone, GraduationCap, Trophy, Clock, X, ChevronRight, BellRing, Sparkles } from 'lucide-react';
import { NewsAlert, AlertCategory } from '../types';

interface NewsAlertStackProps {
  alerts: NewsAlert[];
  onAction: (page: string) => void;
  forceMinimize?: boolean;
}

const NewsAlertStack: React.FC<NewsAlertStackProps> = ({ alerts, onAction, forceMinimize = false }) => {
  const [minimizedIds, setMinimizedIds] = useState<Set<string>>(new Set());
  const [showHub, setShowHub] = useState(false);

  // Auto-show hub if there are minimized alerts
  useEffect(() => {
    setShowHub(minimizedIds.size > 0 || forceMinimize);
  }, [minimizedIds, forceMinimize]);

  const validAlerts = alerts.filter(a => new Date(a.expiresAt).getTime() > Date.now());
  const activeAlerts = forceMinimize 
    ? [] 
    : validAlerts.filter(a => !minimizedIds.has(a.id));

  const handleMinimize = (id: string) => {
    setMinimizedIds(prev => new Set(prev).add(id));
  };

  const restoreAll = () => {
    if (forceMinimize) return; // Cannot restore if forced to stay minimized
    setMinimizedIds(new Set());
  };

  const getCategoryTheme = (cat: AlertCategory) => {
    switch (cat) {
      case 'Admission': return { color: 'emerald', icon: <GraduationCap className="w-5 h-5" /> };
      case 'Result': return { color: 'amber', icon: <Trophy className="w-5 h-5" /> };
      case 'Schedule': return { color: 'teal', icon: <Clock className="w-5 h-5" /> };
      case 'Urgent': return { color: 'rose', icon: <Megaphone className="w-5 h-5" /> };
      default: return { color: 'gray', icon: <BellRing className="w-5 h-5" /> };
    }
  };

  if (alerts.length === 0) return null;

  const shouldShowHub = forceMinimize 
    ? validAlerts.length > 0 
    : (minimizedIds.size > 0 || (validAlerts.length > 0 && activeAlerts.length === 0));

  return (
    <div className="fixed bottom-8 right-8 z-[200] no-print flex flex-col items-end gap-4">
      {/* Alert Stack */}
      <div className="flex flex-col gap-4 max-w-sm pointer-events-none">
        {activeAlerts.map((alert, idx) => {
          const theme = getCategoryTheme(alert.category);
          const colorClass = 
            alert.category === 'Admission' ? 'border-emerald-500 bg-emerald-50/90' :
            alert.category === 'Result' ? 'border-amber-500 bg-amber-50/90' :
            alert.category === 'Schedule' ? 'border-teal-500 bg-teal-50/90' :
            'border-rose-500 bg-rose-50/90';

          const accentClass = 
            alert.category === 'Admission' ? 'text-emerald-600' :
            alert.category === 'Result' ? 'text-amber-600' :
            alert.category === 'Schedule' ? 'text-teal-600' :
            'text-rose-600';

          const btnClass = 
            alert.category === 'Admission' ? 'bg-emerald-600 hover:bg-emerald-700' :
            alert.category === 'Result' ? 'bg-amber-600 hover:bg-amber-700' :
            alert.category === 'Schedule' ? 'bg-teal-600 hover:bg-teal-700' :
            'bg-rose-600 hover:bg-rose-700';

          return (
            <div 
              key={alert.id}
              className={`pointer-events-auto relative w-80 md:w-96 p-6 rounded-[2rem] border-2 shadow-2xl backdrop-blur-md animate-slideInRight transition-all duration-500 hover:scale-[1.02] ${colorClass}`}
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              <button 
                onClick={() => handleMinimize(alert.id)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-800 hover:bg-white/50 rounded-full transition-all"
                title="Hide to side"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl bg-white shadow-sm shrink-0 ${accentClass}`}>
                  {theme.icon}
                </div>
                <div className="flex-1 pr-4">
                   <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${accentClass}`}>{alert.category} Flash</span>
                      {alert.priority === 'High' && <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></div>}
                   </div>
                   <h4 className="text-sm font-black text-gray-900 leading-tight uppercase mb-1">{alert.title}</h4>
                   <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">{alert.content}</p>
                   
                   <button 
                    onClick={() => onAction(alert.actionPage)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg active:scale-95 ${btnClass}`}
                   >
                     {alert.actionText} <ChevronRight className="w-3.5 h-3.5" />
                   </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* News Hub Button (Minimized Alerts Tray) */}
      {shouldShowHub && (
        <button 
          onClick={restoreAll}
          className={`group relative w-16 h-16 bg-teal-900 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-90 border-2 border-white ring-4 ring-teal-900/10 animate-scaleIn ${forceMinimize ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-600 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-lg animate-bounce">
            {validAlerts.length}
          </div>
          <BellRing className="w-6 h-6 group-hover:animate-swing" />
          <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
          
          {/* Label Tooltip */}
          <div className="absolute right-20 bg-teal-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
             {forceMinimize ? 'News Hub (Paused during Login)' : 'Restore Breaking News Hub'}
          </div>
        </button>
      )}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes swing {
          0% { transform: rotate(0); }
          25% { transform: rotate(15deg); }
          50% { transform: rotate(-15deg); }
          100% { transform: rotate(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .group-hover\\:animate-swing {
          animation: swing 0.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsAlertStack;
