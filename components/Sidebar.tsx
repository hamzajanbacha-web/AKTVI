
import React from 'react';
import { X, BookOpen, ShoppingBag, FileText, Settings, GraduationCap, Info, ClipboardList, Coins, LogIn, LogOut, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentUser: any;
  onLogout: () => void;
  onLoginClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentPage, setCurrentPage, currentUser, onLogout, onLoginClick }) => {
  const navLinks = [
    { name: 'Home', id: 'home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'About', id: 'about', icon: <Info className="w-5 h-5" /> },
    { name: 'Courses', id: 'courses', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Collections', id: 'sales', icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Admissions', id: 'admissions', icon: <FileText className="w-5 h-5" /> },
    { name: 'Results', id: 'results', icon: <ClipboardList className="w-5 h-5" /> },
    { name: 'LMS', id: 'lms', icon: <GraduationCap className="w-5 h-5" /> },
    { name: 'Support', id: 'donate', icon: <Coins className="w-5 h-5" /> },
  ];

  if (currentUser?.role === 'admin') {
    navLinks.push({ name: 'Admin Control', id: 'admin', icon: <Settings className="w-5 h-5" /> });
  }

  const handleNavClick = (id: string) => {
    setCurrentPage(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay Backdrop - Ultra Thin Blur */}
      <div 
        className={`fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-[1px] transition-opacity duration-300 no-print ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Navigation Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[110] w-64 md:w-72 bg-white transform transition-transform duration-300 ease-out no-print shadow-[-5px_0_20px_rgba(0,0,0,0.05)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full font-outfit">
          {/* Minimalist Header */}
          <div className="p-5 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center p-0.5">
                <img src="https://picsum.photos/seed/akbarlogo/200/200" alt="Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-300">Hub</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-900 active:scale-90 active:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Compact Nav List with Live Interactivity */}
          <nav className="flex-grow overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-hide">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden active:scale-[0.97] ${
                  currentPage === link.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
                }`}
              >
                <div className={`transition-all duration-300 ${
                  currentPage === link.id ? 'text-white' : 'text-slate-300 group-hover:text-slate-900 group-hover:scale-110'
                }`}>
                  {React.cloneElement(link.icon as React.ReactElement, {
                    className: "w-4 h-4"
                  })}
                </div>
                <span className={`text-[9.5px] font-bold uppercase tracking-[0.12em] transition-all duration-200 ${
                  currentPage === link.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                }`}>
                  {link.name}
                </span>

                {/* Active Indicator Dot */}
                {currentPage === link.id && (
                  <div className="absolute right-3 w-1 h-1 rounded-full bg-white/50 animate-pulse" />
                )}
              </button>
            ))}
          </nav>

          {/* Minimalist Bottom Section */}
          <div className="p-4 border-t border-slate-50 bg-slate-50/20">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-4 px-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">User Profile</p>
                    <p className="text-[11px] font-bold text-slate-800 truncate leading-none">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin' : 'lms')}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-lg hover:bg-black transition-all text-[9px] font-black uppercase tracking-widest shadow-sm active:scale-95 active:shadow-inner"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 text-rose-500 text-[8px] font-black uppercase tracking-widest hover:text-rose-700 transition-all active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="w-full flex items-center justify-center gap-2 bg-[#E0218A] text-white py-3.5 rounded-xl hover:opacity-90 transition-all text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#E0218A]/20 active:scale-95 active:shadow-inner"
              >
                <LogIn className="w-3.5 h-3.5" />
                LMS Portal
              </button>
            )}
            
            <div className="mt-4 flex items-center justify-center">
              <span className="text-[6px] text-slate-200 font-black uppercase tracking-[0.5em]">
                AKTI SYSTEM V1.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
