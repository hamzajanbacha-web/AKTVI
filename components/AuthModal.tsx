
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { X, Lock, User as UserIcon, Calendar, KeyRound, ArrowLeft, AlertCircle, ShieldCheck, UserPlus, Mail, Fingerprint, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { mapUser } from '../db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  users: User[];
  initialView?: 'login' | 'signup' | 'forgot' | 'change-old';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, users, initialView = 'login' }) => {
  const [view, setView] = useState<'login' | 'forgot' | 'change' | 'change-old' | 'signup'>(initialView);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [dob, setDob] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync view when initialView changes or modal reopens
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setError(null);
    }
  }, [isOpen, initialView]);

  // Signup hypothetical fields
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    cnic: '',
    mobile: ''
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      const { data, error: dbError } = await supabase
        .from('users_table')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle();

      if (dbError) {
        console.error("Database Login Error:", dbError);
        setError("System error. Please try again later.");
      } else if (!data) {
        setError("Invalid username or password.");
      } else {
        onLogin(mapUser(data));
      }
    } catch (err) {
      setError("Unable to connect to the authentication server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      const { data, error: dbError } = await supabase
        .from('users_table')
        .select('*')
        .eq('username', username)
        .eq('dob', dob)
        .maybeSingle();

      if (dbError || !data) {
        setError("Verification failed. Username and Date of Birth do not match.");
      } else {
        setView('change');
      }
    } catch (err) {
      setError("Verification error.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOldPasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error: dbError } = await supabase
        .from('users_table')
        .update({ password: newPassword })
        .eq('username', username)
        .eq('password', oldPassword)
        .select();

      if (dbError || !data || data.length === 0) {
        setError("Incorrect username or current password.");
      } else {
        alert("Password updated successfully! Please login with your new credentials.");
        resetForm('login');
      }
    } catch (err) {
      setError("Password update failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsProcessing(true);
    try {
      const { error: dbError } = await supabase
        .from('users_table')
        .update({ password: newPassword })
        .eq('username', username);

      if (dbError) {
        setError("Unable to change password. Contact administrator.");
      } else {
        alert("Password updated successfully! Please login with your new password.");
        resetForm('login');
      }
    } catch (err) {
      setError("System error during password change.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Sign Up Request Received. Institutional accounts are normally created upon admission approval. Our team will review your details.");
    resetForm('login');
  };

  const resetForm = (newView: typeof view) => {
    setView(newView);
    setNewPassword('');
    setConfirmPassword('');
    setOldPassword('');
    setUsername('');
    setPassword('');
    setDob('');
    setError(null);
  };

  if (!isOpen) return null;

  const inputClasses = "w-full pl-10 pr-4 py-3 rounded-xl bg-teal-950 border border-teal-800 outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-teal-400 font-medium transition-all shadow-inner disabled:opacity-50";
  const standardInputClasses = "w-full px-4 py-3 rounded-xl bg-teal-950 border border-teal-800 outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-teal-400 font-medium transition-all shadow-inner disabled:opacity-50";
  const labelSmall = "text-[10px] font-black text-teal-800 uppercase tracking-widest ml-1";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-scaleIn">
        <div className="bg-teal-700 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-6 h-6 text-teal-200" />
            <h2 className="text-2xl font-bold uppercase tracking-tight">
              {view === 'login' && 'Portal Login'}
              {view === 'forgot' && 'Reset Password'}
              {view === 'change' && 'New Password'}
              {view === 'change-old' && 'Update Password'}
              {view === 'signup' && 'Create Account'}
            </h2>
          </div>
          <p className="text-teal-100 text-xs font-bold uppercase tracking-widest opacity-80">
            Institutional Access Control
          </p>
        </div>

        <div className="p-8 bg-teal-50/30">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <p className="text-xs font-bold text-rose-600 uppercase tracking-tight">{error}</p>
            </div>
          )}

          {view === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className={labelSmall}>Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
                  <input 
                    type="text" required
                    disabled={isProcessing}
                    className={inputClasses}
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelSmall}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
                  <input 
                    type="password" required
                    disabled={isProcessing}
                    className={inputClasses}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-teal-800 text-white font-black uppercase text-xs tracking-[0.2em] rounded-xl hover:bg-teal-950 shadow-xl transition-all active:scale-95 border border-white/5 disabled:bg-teal-900/50"
              >
                {isProcessing ? 'Verifying...' : 'Sign In'}
              </button>
              
              <div className="flex flex-col gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => resetForm('forgot')}
                  className="text-center text-[10px] font-black text-teal-600 uppercase tracking-widest hover:text-teal-800"
                >
                  Forgot Password?
                </button>
                <button 
                  type="button"
                  onClick={() => resetForm('change-old')}
                  className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-teal-600 flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Change Password
                </button>
              </div>

              {/* Added Sign Up Prompt */}
              <div className="pt-6 border-t border-teal-100 mt-4 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Don't have an account? 
                  <button 
                    type="button"
                    onClick={() => resetForm('signup')} 
                    className="ml-2 text-teal-600 font-black hover:text-teal-800 transition-colors"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          ) : view === 'signup' ? (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className={labelSmall}>Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
                  <input type="text" required className={inputClasses} placeholder="Enter your full name" value={signupData.fullName} onChange={e => setSignupData({...signupData, fullName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelSmall}>CNIC / B-Form</label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
                  <input type="text" required className={inputClasses} placeholder="00000-0000000-0" value={signupData.cnic} onChange={e => setSignupData({...signupData, cnic: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelSmall}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
                  <input type="email" required className={inputClasses} placeholder="your@email.com" value={signupData.email} onChange={e => setSignupData({...signupData, email: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelSmall}>Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
                  <input type="tel" required className={inputClasses} placeholder="+92XXXXXXXXXX" value={signupData.mobile} onChange={e => setSignupData({...signupData, mobile: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-emerald-700 shadow-xl transition-all active:scale-95 mt-4">
                Request Account
              </button>
              <button 
                type="button"
                onClick={() => resetForm('login')}
                className="w-full text-center text-[10px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Already have an account? Login
              </button>
            </form>
          ) : view === 'forgot' ? (
            <form onSubmit={handleForgotSubmit} className="space-y-6">
               <div className="space-y-1.5">
                <label className={labelSmall}>Account Username</label>
                <input 
                  type="text" required
                  disabled={isProcessing}
                  className={standardInputClasses}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelSmall}>Date of Birth</label>
                <div className="relative">
                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
                   <input 
                    type="date" required
                    disabled={isProcessing}
                    className={inputClasses}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-teal-800 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-teal-950 shadow-xl transition-all active:scale-95 disabled:bg-teal-900/50"
              >
                {isProcessing ? 'Verifying...' : 'Verify Identity'}
              </button>
              <button 
                type="button"
                onClick={() => setView('login')}
                className="w-full text-center text-[10px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
            </form>
          ) : view === 'change-old' ? (
            <form onSubmit={handleOldPasswordChangeSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className={labelSmall}>Username</label>
                <input 
                  type="text" required
                  disabled={isProcessing}
                  className={standardInputClasses}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelSmall}>Current Password</label>
                <input 
                  type="password" required
                  disabled={isProcessing}
                  className={standardInputClasses}
                  placeholder="Current Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelSmall}>New Password</label>
                <input 
                  type="password" required
                  disabled={isProcessing}
                  className={standardInputClasses}
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelSmall}>Confirm New Password</label>
                <input 
                  type="password" required
                  disabled={isProcessing}
                  className={standardInputClasses}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-teal-800 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-teal-950 shadow-xl mt-2 transition-all active:scale-95 disabled:bg-teal-900/50"
              >
                {isProcessing ? 'Updating...' : 'Update Password'}
              </button>
              <button 
                type="button"
                onClick={() => setView('login')}
                className="w-full text-center text-[10px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-1.5">
                <label className={labelSmall}>New Password</label>
                <input 
                  type="password" required
                  disabled={isProcessing}
                  className={standardInputClasses}
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelSmall}>Confirm Password</label>
                <input 
                  type="password" required
                  disabled={isProcessing}
                  className={standardInputClasses}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-teal-800 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-teal-950 shadow-xl transition-all active:scale-95 disabled:bg-teal-900/50"
              >
                {isProcessing ? 'Saving...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
