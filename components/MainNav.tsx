
import React from 'react';
import { User } from '../types';

interface MainNavProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentUser: User | null;
}

const MainNav: React.FC<MainNavProps> = ({ currentPage, setCurrentPage, currentUser }) => {
  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Courses', id: 'courses' },
    { name: 'Collections', id: 'sales' },
    { name: 'Admissions', id: 'admissions' },
    { name: 'Results', id: 'results' },
    { name: 'LMS', id: 'lms' },
    { name: 'Support', id: 'donate' },
  ];

  // Conditionally add Admin link for authorized users
  if (currentUser?.role === 'admin') {
    navLinks.push({ name: 'Admin', id: 'admin' });
  }

  return (
    <nav className="hidden lg:flex w-full bg-white border-b border-slate-100 px-8 no-print shadow-sm overflow-x-auto scrollbar-hide">
      <div className="container max-w-7xl mx-auto flex h-14 items-center justify-center gap-2">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setCurrentPage(link.id)}
            className={`h-full px-6 flex items-center justify-center transition-all duration-200 relative text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap
              ${currentPage === link.id 
                ? 'text-brand-dark' 
                : 'text-slate-400 hover:text-brand-primary hover:bg-brand-slate'
              }
            `}
          >
            {link.name}
            
            {/* Active Indicator Underline */}
            {currentPage === link.id && (
              <div className="absolute bottom-0 left-6 right-6 h-[3px] bg-brand-primary rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MainNav;
