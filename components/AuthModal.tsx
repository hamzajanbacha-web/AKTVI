
import React, { useState } from 'react';
import { User } from '../types';
import { X, Lock, User as UserIcon, Calendar, KeyRound, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { mapUser } from '../db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  users: User[];
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, users }) => {
  const [view, setView] = useState<'login' | 'forgot' | 'change' | 'change-old'>('login');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [dob, setDob] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Query database directly for the user
      const { data, error: dbError } = await supabase
        .from('users_table')
        .select('*')
        .eq('username', userId)
        .eq('password', password)
        .single();

      if (dbError || !data) {
        setError("Invalid username or password");
      } else {
        onLogin(mapUser(data));
      }
    } catch (err) {
      setError("Database connection error");
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
        .eq('username', userId)
        .eq('dob', dob)
        .single();

      if (dbError || !data) {
        setError("Verification failed. User ID and Date of Birth do not match.");
      } else {
        setView('change');
      }
    } catch (err) {
      setError("Verification error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOldPasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (newPassword !== verifyPassword) {
      setError("New passwords do not match.");
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
        .eq('username', userId)
        .eq('password', oldPassword)
        .select();

      if (dbError || !data || data.length === 0) {
        setError("Verification failed. Incorrect User ID or Old Password.");
      } else {
        alert("Password updated successfully! Please login with your new credentials.");
        setView('login');
      }
    } catch (err) {
      setError("Update failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== verifyPassword) {
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
        .eq('username', userId);

      if (dbError) {
        setError("Update failed");
      } else {
        alert("Password updated successfully! Please login with your new password.");
        setView('login');
      }
    } catch (err) {
      setError("System error");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = (newView: typeof view) => {
    setView(newView);
    setNewPassword('');
    setVerifyPassword('');
    setOldPassword('');
    setError(null);
  };

  if (!isOpen) return null;

  const inputClasses = "w-full pl-10 pr-4 py-3 rounded-xl bg-teal-950 border border-teal-800 outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-teal-400 font-medium transition-all shadow-inner disabled:opacity-50";
  const standardInputClasses = "w-full px-4 py-3 rounded-xl bg-teal-950 border border-teal-800 outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-teal-400 font-medium transition-all shadow-inner disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-scaleIn">
        <div className="bg-teal-700 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-6 h-6 text-teal-200" />
            <h2 className="text-2xl font-bold uppercase tracking-tight">
              {view === 'login' && 'Portal Entry'}
              {view === 'forgot' && 'Reset Access'}
              {view === 'change' && 'New Credential'}
              {view === 'change-old' && 'Update Cipher'}
            </h2>
          </div>
          <p className="text-teal-100 text-xs font-bold uppercase tracking-widest opacity-80">
            Institutional Authentication Layer
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
                <label className="text-[10px] font-black text-teal-800 uppercase tracking-widest ml-1">Credential ID</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
                  <input 
                    type="text" required
                    disabled={isProcessing}
                    className={inputClasses}
                    placeholder="Enter Username"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-teal-800 uppercase tracking-widest ml-1">Access Key</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
                  <input 
                    type="password" required
                    disabled={isProcessing}
                    className={inputClasses}
                    placeholder="••••••••"
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
                {isProcessing ? 'Verifying...' : 'Authenticate Session'}
              </button>
              <div className="flex flex-col gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => resetForm('forgot')}
                  className="text-center text-[10px] font-black text-teal-600 uppercase tracking-widest hover:text-teal-800"
                >
                  Forgot Key? (Verify via DOB)
                </button>
                <button 
                  type="button"
                  onClick={() => resetForm('change-old')}
                  className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-teal-600 flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Rotate Password
                </button>
              </div>
            </form>
          ) : view === 'forgot' ? (
            <form onSubmit={handleForgotSubmit} className="space-y-6">
               <div className="space-y-1.5">
                <label className="text-[10px] font-black text-teal-800 uppercase tracking-widest ml-1">Confirm Identity ID</label>
                <input 
                  type="text" required
                  disabled={isProcessing}
                  className={standardInputClasses}
                  placeholder="Username"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-teal-800 uppercase tracking-widest ml-1">Date of Birth</label>
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
                {isProcessing ? 'Verifying...' : 'Verify & Proceed'}
              </button>
              <button 
                type="button"
                onClick={() => setView('login')}
                className="w-full text-center text-[10px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Entry
              </button>
            </form>
          ) : view === 'change-old' ? (
            <form onSubmit={handleOldPasswordChangeSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-teal-800 uppercase tracking-widest ml-1">User ID</label>
                <input 
                  type="text" required
                  disabled={isProcessing}
                  className={standardInputClasses}
                  placeholder="Username"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-teal-800 uppercase tracking-widest ml-1">Current Password</label>
                <input 
                  type="password" required
                  disabled={isProcessing}
                  className={standardInputClasses}
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-teal-800 uppercase tracking-widest ml-1">New Access Key</label>
                <input 
                  type="password" required
                  disabled={isProcessing}
                  className={standardInputClasses}
                  placeholder="Min. 6 chars"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-teal-800 uppercase tracking-widest ml-1">Verify Key</label>
                <input 
                  type="password" required
                  disabled={isProcessing}
                  className={standardInputClasses}
                  placeholder="Repeat new key"
                  value={verifyPassword}
                  onChange={(e) => setVerifyPassword(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-teal-800 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-teal-950 shadow-xl mt-2 transition-all active:scale-95 disabled:bg-teal-900/50"
              >
                {isProcessing ? 'Updating...' : 'Update Key'}
              </button>
              <button 
                type="button"
                onClick={() => setView('login')}
                className="w-full text-center text-[10px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Entry
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-teal-800 uppercase tracking-widest ml-1">New Access Key</label>
                <input 
                  type="password" required
                  disabled={isProcessing}
                  className={standardInputClasses}
                  placeholder="Min. 6 chars"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-teal-800 uppercase tracking-widest ml-1">Confirm Access Key</label>
                <input 
                  type="password" required
                  disabled={isProcessing}
                  className={standardInputClasses}
                  placeholder="••••••••"
                  value={verifyPassword}
                  onChange={(e) => setVerifyPassword(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-teal-800 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-teal-950 shadow-xl transition-all active:scale-95 disabled:bg-teal-900/50"
              >
                {isProcessing ? 'Saving...' : 'Change Key'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
