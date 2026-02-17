
import React, { useState } from 'react';
import { Menu, X, User as UserIcon, LogIn, ShoppingBag, BookOpen, FileText, Settings, GraduationCap, Info, ClipboardList, Heart, LogOut, Coins, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onLoginClick: () => void;
  currentUser: any;
  onLogout: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, currentUser, onLogout, currentPage, setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'home', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'About', id: 'about', icon: <Info className="w-5 h-5" /> },
    { name: 'Courses', id: 'courses', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Sales', id: 'sales', icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Admissions', id: 'admissions', icon: <FileText className="w-5 h-5" /> },
    { name: 'Results', id: 'results', icon: <ClipboardList className="w-5 h-5" /> },
    { name: 'LMS Portal', id: 'lms', icon: <GraduationCap className="w-5 h-5" /> },
    { name: 'Donate', id: 'donate', icon: <Coins className="w-5 h-5" /> },
  ];

  if (currentUser?.role === 'admin') {
    navLinks.push({ name: 'Admin', id: 'admin', icon: <Settings className="w-5 h-5" /> });
  }

  const handlePortalAction = () => {
    if (!currentUser) {
      onLoginClick();
    } else {
      setCurrentPage(currentUser.role === 'admin' ? 'admin' : 'lms');
    }
  };

  return (
    <nav className="bg-white shadow-sm no-print">
      {/* Row 1: Institutional Branding */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-6">
          <div className="flex justify-between items-center">
            <div 
              className="flex items-center gap-3 md:gap-8 cursor-pointer" 
              onClick={() => setCurrentPage('home')}
            >
              {/* Circular Logo */}
              <div className="w-10 h-10 md:w-24 md:h-24 rounded-full border-2 md:border-4 border-teal-600 p-0.5 md:p-1 flex items-center justify-center overflow-hidden bg-white shadow-lg shrink-0">
                <img src="https://picsum.photos/seed/akbarlogo/200/200" alt="Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              
              <div className="flex flex-col text-left md:text-center">
                <div className="flex items-center gap-2">
                   <span className="text-[10px] md:text-2xl font-black text-gray-900 uppercase tracking-tight leading-tight">
                    Akbar Khan Technical and Vocational Institute (Regd. TTB).
                  </span>
                  <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[8px] font-black uppercase">
                    <Heart className="w-2 h-2 fill-emerald-700" /> Free Education
                  </div>
                </div>
                
                {/* Urdu Branding - Hidden on Mobile, Shown on Desktop */}
                <div className="hidden md:block text-lg md:text-4xl leading-relaxed mt-1 md:mt-2 text-teal-700">
                   <span className="text-xs md:text-sm font-black align-middle opacity-60">(REGD. TTB)</span>
                   <span className="font-urdu align-middle mr-2">اکبر خان ٹیکنیکل اینڈ ووکیشنل انسٹیٹیوٹ</span>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-teal-600 hover:bg-gray-100 transition-colors"
              >
                <span className="sr-only">Open menu</span>
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Navigation Links */}
      <div className="hidden md:block bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-1 lg:space-x-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setCurrentPage(link.id)}
                  className={`px-4 py-2 text-xs lg:text-sm font-bold uppercase tracking-widest transition-all rounded-md ${
                    currentPage === link.id 
                      ? 'text-teal-700 bg-teal-50' 
                      : 'text-gray-500 hover:text-teal-600 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Authorized User</span>
                    <span className="text-xs font-bold text-teal-700">{currentUser.username}</span>
                  </div>
                  <button
                    onClick={handlePortalAction}
                    className="flex items-center space-x-2 bg-teal-700 text-white px-5 py-2 rounded-lg hover:bg-teal-800 transition-all text-[10px] font-black uppercase tracking-widest shadow-md"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Enter Portal</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePortalAction}
                  className="flex items-center space-x-2 bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-all text-xs font-black uppercase tracking-widest shadow-md"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Portal Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-[60] w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full border-2 border-teal-600 flex items-center justify-center bg-white overflow-hidden p-0.5">
                <img src="https://picsum.photos/seed/akbarlogo/100/100" alt="Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="ml-2">
                <div className="font-bold text-gray-800 text-[10px] leading-tight uppercase">Akbar Khan Institute</div>
                <div className="text-[8px] font-bold text-emerald-600 uppercase">Non-Profit / Free Skills</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4 flex-grow overflow-y-auto">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentPage(link.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  currentPage === link.id
                    ? 'bg-teal-50 text-teal-600 font-bold uppercase tracking-widest text-xs'
                    : 'text-gray-600 hover:bg-gray-50 font-medium text-sm'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-100">
              {currentUser ? (
                <div className="space-y-4">
                  <div className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Session</div>
                  <div className="flex items-center space-x-3 px-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{currentUser.username}</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      handlePortalAction();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-4 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors font-bold uppercase text-xs tracking-widest shadow-lg"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Enter Portal</span>
                  </button>

                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium text-sm"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout Account</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handlePortalAction();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-4 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors font-bold uppercase text-xs tracking-widest shadow-lg"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Portal Login / Sign Up</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
