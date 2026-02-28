
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, Course, AdmissionWithdrawal, Instructor, ChatMessage, InstitutionalResource, CourseModule, SessionSchedule } from '../types';
import { useLiveSession } from '../components/LiveSessionContext';
import { supabase } from '../lib/supabase';
import { GoogleGenAI } from "@google/genai";
import { 
  MessageSquare, GraduationCap, Monitor, BarChart3, 
  Trophy, BookOpen, Send, VideoOff,
  Power, Mic, MicOff, Video,
  Maximize2, Minimize2, RefreshCcw, Zap, ZapOff, 
  Users, Star, ScreenShare, PlayCircle, Settings2,
  Ghost, Download, FileText, CheckCircle2, ChevronRight, Layout,
  Loader2, Sparkles, BrainCircuit, HelpCircle, X, Sliders, Palette, Wand2,
  Camera, Volume2, VolumeX, User as UserIcon, ShieldAlert, ShieldCheck, Activity,
  Wifi, Signal, Link, Calendar, Clock, Pipette, Image as ImageIcon, Radio, XCircle
} from 'lucide-react';

// Initialize Gemini safely
const getAI = () => {
  const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

const ai = getAI();

// --- GEMINI AI TUTOR MODULE ---
const GeminiTutor: React.FC<{ course?: Course }> = ({ course }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResponse('');
    
    try {
      if (!ai) {
        setResponse("AI Tutor is currently offline. Please check system configuration.");
        return;
      }
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an expert tutor at Akbar Khan Technical Institute. 
                   The student is currently studying: ${course?.name || 'Technical Skills'}.
                   Course Description: ${course?.description || 'Vocational training'}.
                   Answer the following question clearly and encouragingly: ${query}`,
      });
      setResponse(result.text || "I couldn't generate an answer right now.");
    } catch (err) {
      setResponse("System connection lost. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-900 to-brand-dark rounded-[2rem] p-6 text-white shadow-2xl border border-white/10 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="p-2 bg-white/10 rounded-xl animate-pulse">
          <BrainCircuit className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest leading-none">AI Tutor</h4>
          <p className="text-[8px] font-bold text-teal-400 uppercase tracking-widest mt-1">24/7 API Protocol</p>
        </div>
      </div>
      
      <div className="flex-grow min-h-0 mb-4 bg-white/5 rounded-2xl p-4 text-[11px] font-inter leading-relaxed text-teal-50 border border-white/5 overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="flex items-center gap-2 opacity-50">
            <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
          </div>
        ) : response ? (
          <div className="animate-fadeIn">{response}</div>
        ) : (
          <p className="opacity-40 italic">Ask me anything about your current module or career path...</p>
        )}
      </div>

      <form onSubmit={askGemini} className="relative shrink-0">
        <input 
          value={query} 
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask something..." 
          className="w-full bg-white/10 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-[11px] outline-none focus:border-emerald-500 transition-all"
        />
        <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-emerald-500 hover:text-emerald-400 transition-all">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

// --- CHAT MODULE ---
const ChatRoom: React.FC<{ user: User }> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: user.role === 'admin' ? 'instructor' : 'student',
      text: input,
      userName: user.firstName ? `${user.firstName} ${user.lastName}` : user.username,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInput('');
  };

  return (
    <div className="bg-white rounded-[2rem] border border-teal-100 shadow-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-teal-50 flex items-center justify-between bg-teal-50/20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-teal-900">Live Feedback</span>
        </div>
      </div>
      <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-hide bg-slate-50/10">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-10">
             <MessageSquare className="w-10 h-10 mb-2" />
             <p className="text-[8px] font-black uppercase">Start discussion</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.userName === (user.firstName ? `${user.firstName} ${user.lastName}` : user.username) ? 'items-end' : 'items-start'}`}>
            <div className={`px-4 py-2 rounded-xl text-[11px] font-medium leading-relaxed max-w-[85%] ${msg.role === 'instructor' ? 'bg-teal-900 text-teal-50' : 'bg-white text-slate-800 border border-slate-100'}`}>{msg.text}</div>
            <span className="text-[7px] font-black text-slate-400 mt-1 uppercase tracking-widest">{msg.userName}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-teal-50 flex gap-2 shrink-0">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." className="flex-grow bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-[11px] outline-none focus:border-teal-600 transition-all text-slate-800" />
        <button type="submit" className="p-2.5 bg-teal-900 text-white rounded-lg"><Send className="w-3.5 h-3.5" /></button>
      </form>
    </div>
  );
};

// --- STAGE CONTROL CENTER (SIDEBAR) ---
const StageControlCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { 
    imageSettings, updateImageSettings, chromaKey, toggleChromaKey, updateChromaKeySettings,
    activeStream, cycleCamera, toggleTorch, isTorchOn, zoomLevel, setZoom 
  } = useLiveSession();

  const sectionLabel = "text-[9px] font-black text-white/40 uppercase tracking-widest mb-4 block border-b border-white/10 pb-1";
  const controlGroup = "space-y-4 mb-8 bg-black/40 p-4 rounded-2xl border border-white/5";
  const sliderLabel = "flex justify-between items-center text-[10px] font-bold text-white/90 mb-2 uppercase";

  const backgrounds = [
    { name: 'Academy', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200' },
    { name: 'Studio', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200' },
    { name: 'Modern', url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=1200' }
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 z-[105] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed inset-y-0 left-0 z-[110] w-72 md:w-80 bg-slate-950/70 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-500 ease-in-out flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
             <Sliders className="w-5 h-5 text-emerald-400" />
             <h3 className="text-sm font-black text-white uppercase tracking-tighter">Stage Management</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-grow p-6 overflow-y-auto scrollbar-hide space-y-2">
          
          {/* CHROMA KEY SETTINGS */}
          <div className={controlGroup}>
            <div className="flex items-center justify-between mb-4">
               <span className={sectionLabel + " mb-0 border-b-0 pb-0"}>Chroma Key Engine</span>
               <button 
                 onClick={() => toggleChromaKey(!chromaKey.active)}
                 className={`w-10 h-5 rounded-full transition-all relative ${chromaKey.active ? 'bg-emerald-500' : 'bg-white/10'}`}
               >
                 <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${chromaKey.active ? 'right-1' : 'left-1'}`} />
               </button>
            </div>
            
            {chromaKey.active && (
              <div className="space-y-4 animate-fadeIn">
                 <div>
                    <div className={sliderLabel}><span>Similarity Range</span><span className="text-emerald-400">{chromaKey.similarity}%</span></div>
                    <input type="range" min="0" max="100" value={chromaKey.similarity} onChange={e => updateChromaKeySettings({similarity: parseInt(e.target.value)})} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                 </div>
                 <div>
                    <div className={sliderLabel}><span>Edge Smoothing</span><span className="text-emerald-400">{chromaKey.smoothness}%</span></div>
                    <input type="range" min="0" max="100" value={chromaKey.smoothness} onChange={e => updateChromaKeySettings({smoothness: parseInt(e.target.value)})} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                 </div>
                 <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-white/60 uppercase">Key Color</span>
                    <input type="color" value={chromaKey.keyColor} onChange={e => updateChromaKeySettings({keyColor: e.target.value})} className="bg-transparent border-0 w-8 h-8 cursor-pointer rounded-lg overflow-hidden" />
                 </div>
                 <div>
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-3 block">Virtual Environment</span>
                    <div className="grid grid-cols-3 gap-2">
                       {backgrounds.map((bg) => (
                         <button 
                           key={bg.name}
                           onClick={() => toggleChromaKey(true, bg.url)}
                           className={`aspect-video rounded-lg border-2 overflow-hidden transition-all ${chromaKey.bgImage === bg.url ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-white/10'}`}
                         >
                           <img src={bg.url} className="w-full h-full object-cover" />
                         </button>
                       ))}
                       <label className="aspect-video rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-all">
                          <ImageIcon className="w-4 h-4 text-white/20" />
                          <input type="file" className="hidden" accept="image/*" />
                       </label>
                    </div>
                 </div>
              </div>
            )}
          </div>

          <div className={controlGroup}>
            <span className={sectionLabel}>Hardware & Optics</span>
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={cycleCamera} disabled={!activeStream} className="flex flex-col items-center gap-2 p-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all disabled:opacity-30 border border-white/10">
                   <RefreshCcw className="w-4 h-4 text-emerald-400" />
                   <span className="text-[8px] font-black uppercase tracking-widest">Cycle Cam</span>
                </button>
                <button onClick={toggleTorch} disabled={!activeStream} className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all disabled:opacity-30 border border-white/10 ${isTorchOn ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-white/5 text-white/60'}`}>
                   {isTorchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                   <span className="text-[8px] font-black uppercase tracking-widest">{isTorchOn ? 'Flash On' : 'Flash Off'}</span>
                </button>
            </div>
            <div>
              <div className={sliderLabel}><span>Optical Zoom</span><span className="text-emerald-400">{zoomLevel.toFixed(1)}x</span></div>
              <input type="range" min="1" max="5" step="0.1" value={zoomLevel} onChange={e => setZoom(parseFloat(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>
          </div>
          <div className={controlGroup}>
            <span className={sectionLabel}>Color Correction</span>
            <div className="space-y-4">
              <div>
                <div className={sliderLabel}><span>Brightness</span><span className="text-emerald-400">{imageSettings.brightness}%</span></div>
                <input type="range" min="0" max="200" value={imageSettings.brightness} onChange={e => updateImageSettings({ brightness: parseInt(e.target.value) })} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </div>
              <div>
                <div className={sliderLabel}><span>Contrast</span><span className="text-emerald-400">{imageSettings.contrast}%</span></div>
                <input type="range" min="0" max="200" value={imageSettings.contrast} onChange={e => updateImageSettings({ contrast: parseInt(e.target.value) })} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </div>
              <div>
                <div className={sliderLabel}><span>Saturation</span><span className="text-emerald-400">{imageSettings.saturate}%</span></div>
                <input type="range" min="0" max="200" value={imageSettings.saturate} onChange={e => updateImageSettings({ saturate: parseInt(e.target.value) })} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 shrink-0 border-t border-white/10">
           <button onClick={() => { updateImageSettings({ brightness: 100, contrast: 100, saturate: 100, hueRotate: 0, blur: 0 }); toggleChromaKey(false); setZoom(1); }} className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl">
              Reset All Filters
           </button>
        </div>
      </div>
    </>
  );
};

// --- STUDENT LIST ITEM ---
const StudentListItem: React.FC<{ 
  student: any; 
  isInstructor: boolean; 
  onSpotlight: () => void;
  isSpotlighted: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}> = ({ student, isInstructor, onSpotlight, isSpotlighted, isMuted, isVideoOn, onToggleMute, onToggleVideo }) => {
  return (
    <div className={`flex items-center justify-between p-3 rounded-2xl transition-all border ${isSpotlighted ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-500/10' : 'bg-white border-slate-100 hover:border-teal-100'}`}>
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
           <img src={student.photo || `https://picsum.photos/seed/${student.id}/200/200`} className={`w-full h-full object-cover transition-all ${isVideoOn ? '' : 'grayscale opacity-30'}`} />
           {!isVideoOn && <div className="absolute inset-0 flex items-center justify-center bg-black/10"><VideoOff className="w-3 h-3 text-slate-400" /></div>}
        </div>
        <div>
           <p className="text-[10px] font-black text-slate-900 uppercase truncate max-w-[120px]">{student.student_name || student.firstName}</p>
           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Authorized Feed</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={onToggleMute} className={`p-2 rounded-lg transition-all ${isMuted ? 'bg-rose-500 text-white' : 'bg-slate-50 text-slate-500 hover:bg-teal-50 hover:text-teal-600'}`}>{isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}</button>
        <button onClick={onToggleVideo} className={`p-2 rounded-lg transition-all ${isVideoOn ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-500 hover:bg-teal-50 hover:text-teal-600'}`}>{isVideoOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}</button>
        {isInstructor && (
           <button onClick={onSpotlight} title="Spotlight User" className={`p-2 rounded-lg transition-all ${isSpotlighted ? 'bg-amber-400 text-white' : 'bg-slate-50 text-slate-500 hover:bg-teal-50 hover:text-teal-600'}`}><Star className={`w-3.5 h-3.5 ${isSpotlighted ? 'fill-current' : ''}`} /></button>
        )}
      </div>
    </div>
  );
};

// --- STAGE FEED WRAPPER (Prevents transmission disturbance) ---
const StageFeed: React.FC<{ 
  mode: string; 
  videoRef: React.RefObject<HTMLVideoElement | null>;
  screenRef: React.RefObject<HTMLVideoElement | null>;
  mediaUrl: string | null;
  activeStream: MediaStream | null;
  screenStream: MediaStream | null;
  isMuted: boolean;
  style?: React.CSSProperties;
  className?: string;
}> = ({ mode, videoRef, screenRef, mediaUrl, activeStream, screenStream, isMuted, style, className }) => {
  useEffect(() => {
    if (videoRef.current && activeStream) videoRef.current.srcObject = activeStream;
  }, [activeStream, mode]);

  useEffect(() => {
    if (screenRef.current && screenStream) screenRef.current.srcObject = screenStream;
  }, [screenStream, mode]);

  if (mode === 'screen') return <video ref={screenRef} autoPlay playsInline className={className} />;
  if (mode === 'media' && mediaUrl) return <video src={mediaUrl} autoPlay controls className={className} />;
  if (mode === 'camera' && activeStream) return <video ref={videoRef} autoPlay playsInline muted={isMuted} style={style} className={className} />;
  
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 space-y-6">
       <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse"></div>
          <Activity className="w-20 h-20 text-emerald-400 relative" />
       </div>
       <div>
          <h3 className="text-white text-xl font-black uppercase tracking-widest mb-2">Synchronizing Feed</h3>
          <p className="text-teal-400/60 text-[10px] font-bold uppercase tracking-widest">Institutional Master Node Active</p>
       </div>
    </div>
  );
};

// --- MAIN CLASSROOM STAGE ---
const InstitutionalClassroom: React.FC<{ 
  user: User; 
  register: AdmissionWithdrawal[]; 
  schedules: SessionSchedule[];
  course?: Course;
  allCourses: Course[];
  onRefreshData: () => Promise<void>;
  selectedRecording?: SessionSchedule | null;
  onClearRecording?: () => void;
}> = ({ user, register, schedules, course, allCourses, onRefreshData, selectedRecording, onClearRecording }) => {
  const { 
    startCamera, activeStream, screenStream, isMuted, isCameraOff,
    toggleMute, toggleCamera, startScreenShare, terminateSession, sessionMode, playMediaFile, mediaUrl,
    imageSettings, chromaKey
  } = useLiveSession();
  
  const [showControlSidebar, setShowControlSidebar] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [spotlightedId, setSpotlightedId] = useState<string | null>(null);
  const [isSwapped, setIsSwapped] = useState(false);
  const [studentStates, setStudentStates] = useState<Record<string, { isMuted: boolean, isVideoOn: boolean }>>({});
  
  // Go Live State
  const [selectedCourseId, setSelectedCourseId] = useState(user.courseId || '');
  const [sessionTopic, setSessionTopic] = useState('');
  const [isStartingLive, setIsStartingLive] = useState(false);
  const [isEndingLive, setIsEndingLive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const mainStageRef = useRef<HTMLDivElement>(null);

  const isInstructor = user.role === 'admin' || user.role === 'instructor';
  
  const activeSession = useMemo(() => {
    if (user.role === 'student') {
      return schedules.find(s => s.status === 'Live' && s.courseId?.toString() === user.courseId?.toString());
    }
    // For instructors, prioritize the session for the course they have selected or are assigned to
    return schedules.find(s => 
      s.status === 'Live' && 
      (s.courseId?.toString() === selectedCourseId || s.courseId?.toString() === user.courseId?.toString())
    ) || schedules.find(s => s.status === 'Live');
  }, [schedules, user, selectedCourseId]);

  const isLiveNow = !!activeSession;

  const userSchedules = useMemo(() => {
    return schedules
      .filter(s => s.courseId?.toString() === user.courseId?.toString())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [schedules, user.courseId]);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!mainStageRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await mainStageRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) { console.error("FS failed", err); }
  };

  const currentSpotlight = useMemo(() => {
    if (!spotlightedId) return null;
    return register.find(r => r.id.toString() === spotlightedId.toString());
  }, [spotlightedId, register]);

  const filterStyle = {
    filter: `brightness(${imageSettings.brightness}%) contrast(${imageSettings.contrast}%) saturate(${imageSettings.saturate}%) hue-rotate(${imageSettings.hueRotate}deg) blur(${imageSettings.blur}px)`
  };

  const handleGoLive = async () => {
    if (!selectedCourseId || !sessionTopic.trim()) {
      alert("Please select a course and enter a topic.");
      return;
    }
    setIsStartingLive(true);
    try {
      const { error } = await supabase.from('session_schedules').insert({
        course_id: selectedCourseId,
        topic: sessionTopic,
        status: 'Live',
        start_time: new Date().toISOString()
      });
      if (error) throw error;
      await onRefreshData();
      await startCamera();
    } catch (err: any) {
      alert("Failed to go live: " + err.message);
    } finally {
      setIsStartingLive(false);
    }
  };

  const handleEndSession = async () => {
    if (!activeSession) return;
    
    setIsEndingLive(true);
    try {
      // Use the numeric ID for the update
      const numericId = parseInt(activeSession.id);
      if (isNaN(numericId)) throw new Error("Invalid session ID format");

      const { error } = await supabase
        .from('session_schedules')
        .update({ status: 'Completed' })
        .eq('id', numericId);
      
      if (error) throw error;
      
      // Stop local media first
      terminateSession();
      
      // Refresh global state
      await onRefreshData();
      
      // Reset local topic
      setSessionTopic('');
    } catch (err: any) {
      console.error("End session error:", err);
    } finally {
      setIsEndingLive(false);
    }
  };

  const displayCourse = useMemo(() => {
    if (activeSession) {
      return allCourses.find(c => c.id.toString() === activeSession.courseId?.toString()) || course;
    }
    return course;
  }, [activeSession, allCourses, course]);

  const renderPrimaryContent = () => {
    if (selectedRecording) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
          <video 
            src={selectedRecording.video_url} 
            controls 
            autoPlay 
            className="w-full h-full object-cover"
            poster={selectedRecording.thumbnail_url}
          />
          <button 
            onClick={onClearRecording}
            className="absolute top-4 left-4 p-3 bg-black/50 text-white rounded-xl hover:bg-black/80 transition-all z-50 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
          >
            <XCircle className="w-4 h-4" /> Close Recording
          </button>
        </div>
      );
    }

    const isActive = sessionMode !== 'idle' || isLiveNow;
    if (!isActive) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 md:p-16 bg-gradient-to-br from-slate-950 via-teal-950/20 to-slate-950 overflow-hidden">
           <div className="max-w-3xl w-full space-y-12 animate-fadeIn">
              <div className="text-center">
                 <span className="px-4 py-1.5 bg-brand-primary text-white text-[9px] font-black rounded-full uppercase tracking-widest mb-6 inline-block shadow-lg">Stage Standby</span>
                 <h3 className="text-4xl md:text-5xl font-outfit font-black text-white uppercase tracking-tighter leading-none mb-4">
                    {displayCourse?.name || 'Authorized Technical Track'}
                 </h3>
                 <p className="text-teal-100/40 text-sm font-medium mb-8">No live transmission currently active. Review your module broadcast window.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {userSchedules.length > 0 ? userSchedules.slice(0, 4).map((sch, i) => (
                    <div key={sch.id} className="p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:bg-white/10 transition-all group">
                       <div className="flex items-start justify-between mb-4">
                          <div className="p-2.5 bg-teal-500/10 rounded-xl text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
                             <Calendar className="w-4 h-4" />
                          </div>
                          <span className="text-[8px] font-black text-teal-500/50 uppercase tracking-widest">Slot {i+1}</span>
                       </div>
                       <h4 className="text-white text-sm font-bold uppercase tracking-tight mb-2 truncate">{sch.topic}</h4>
                       <div className="flex items-center gap-2 text-teal-100/40">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                             {new Date(sch.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} @ {new Date(sch.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                    </div>
                 )) : (
                    <div className="col-span-2 p-12 bg-white/5 rounded-[3rem] border border-dashed border-white/10 text-center">
                       <Ghost className="w-10 h-10 text-white/5 mx-auto mb-4" />
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Module synchronization in progress</p>
                    </div>
                 )}
              </div>
              <div className="pt-8 text-center border-t border-white/5"><p className="text-[8px] font-black text-teal-500 uppercase tracking-[0.5em] opacity-40">AK-EDU LMS ENGINE v2.5</p></div>
           </div>
        </div>
      );
    }

    if (isSwapped && spotlightedId) {
      return (
        <div className="relative w-full h-full bg-slate-900 group">
           <img src={`https://picsum.photos/seed/${spotlightedId}/1920/1080`} className={`w-full h-full object-cover transition-all ${studentStates[spotlightedId]?.isVideoOn ? '' : 'blur-3xl opacity-20'}`} />
        </div>
      );
    }

    return (
      <StageFeed 
        mode={sessionMode} videoRef={videoRef} screenRef={screenVideoRef} 
        mediaUrl={mediaUrl} activeStream={activeStream} screenStream={screenStream} 
        isMuted={isMuted} style={filterStyle} className="w-full h-full object-cover bg-black"
      />
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-slate-50 overflow-hidden relative">
      <StageControlCenter isOpen={showControlSidebar} onClose={() => setShowControlSidebar(false)} />

      <div className="flex-grow flex flex-col h-full p-4 lg:p-6 space-y-4 overflow-hidden">
        <div className="w-full max-w-[1920px] mx-auto shrink-0 relative">
          <div ref={mainStageRef} className={`relative w-full aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white group transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[1000] !rounded-none !border-0 max-h-none' : 'max-h-[80vh]'}`}>
             
             {chromaKey.active && chromaKey.bgImage && (
               <img src={chromaKey.bgImage} className="absolute inset-0 w-full h-full object-cover opacity-100 z-0 animate-fadeIn" />
             )}

             <div className="absolute inset-0 flex items-center justify-center z-10">
                {renderPrimaryContent()}
             </div>

             {spotlightedId && (
               <button onClick={() => setIsSwapped(!isSwapped)} className="absolute top-4 right-4 w-32 md:w-56 aspect-video bg-black/80 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl z-[50] group/spot hover:border-emerald-500 transition-all active:scale-95 ring-4 ring-black/10">
                 {isSwapped ? (
                    <StageFeed 
                       mode={sessionMode} videoRef={videoRef} screenRef={screenVideoRef} 
                       mediaUrl={mediaUrl} activeStream={activeStream} screenStream={screenStream} 
                       isMuted={isMuted} style={{...filterStyle, width:'100%', height:'100%', objectFit:'cover'}} className="w-full h-full"
                    />
                 ) : (
                    <div className="relative w-full h-full">
                       <img src={`https://picsum.photos/seed/${spotlightedId}/400/225`} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/spot:opacity-100 transition-opacity">
                          <RefreshCcw className="w-6 h-6 text-white" />
                       </div>
                    </div>
                 )}
                 <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-md border border-white/5">
                    <span className="text-[7px] text-white font-black uppercase tracking-widest">{isSwapped ? 'Host Content' : currentSpotlight?.student_name}</span>
                 </div>
               </button>
             )}

             <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-40 shadow-2xl scale-90 sm:scale-100 ring-1 ring-white/10">
                 <button 
                   onClick={() => {
                     if (isInstructor && isLiveNow) {
                       handleEndSession();
                     } else if (activeStream) {
                       terminateSession();
                     } else {
                       startCamera();
                     }
                   }} 
                   disabled={isEndingLive}
                   className={`p-2.5 md:p-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 ${activeStream || isLiveNow ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white shadow-lg`}
                 >
                   {isEndingLive ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                 </button>
                <button onClick={toggleMute} disabled={!activeStream} className={`p-2.5 md:p-3 rounded-xl transition-all disabled:opacity-20 ${isMuted ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button onClick={toggleCamera} disabled={!activeStream} className={`p-2.5 md:p-3 rounded-xl transition-all disabled:opacity-20 ${isCameraOff ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  {isCameraOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </button>
                <div className="w-[1px] h-6 bg-white/10 mx-1" />
                <button onClick={startScreenShare} className="p-2.5 md:p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all shadow-lg" title="Share Screen"><ScreenShare className="w-4 h-4" /></button>
                <label className="p-2.5 md:p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all cursor-pointer shadow-lg" title="Share Media">
                  <PlayCircle className="w-4 h-4" /><input type="file" className="hidden" accept="video/*" onChange={e => e.target.files?.[0] && playMediaFile(e.target.files[0])} />
                </label>
                <button onClick={startCamera} className="p-2.5 md:p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all shadow-lg" title="Switch to Camera"><Video className="w-4 h-4" /></button>
                <div className="w-[1px] h-6 bg-white/10 mx-1" />
                <button onClick={toggleFullscreen} className="p-2.5 md:p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all shadow-lg flex items-center justify-center">
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
             </div>
          </div>
        </div>

        {isInstructor && !isLiveNow && sessionMode === 'idle' && (
          <div className="w-full max-w-[1920px] mx-auto bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm animate-fadeIn">
             <div className="flex flex-col md:flex-row items-end gap-6">
                <div className="flex-1 space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Class for Broadcast</label>
                   <select 
                     value={selectedCourseId}
                     onChange={e => setSelectedCourseId(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-brand-primary transition-all"
                   >
                     <option value="" disabled>Select a course...</option>
                     {allCourses.map(c => (
                       <option key={c.id} value={c.id}>{c.name}</option>
                     ))}
                   </select>
                </div>
                <div className="flex-[2] space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Topic / Agenda</label>
                   <input 
                     type="text"
                     placeholder="Enter the topic for this live session..."
                     value={sessionTopic}
                     onChange={e => setSessionTopic(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-brand-primary transition-all"
                   />
                </div>
                <button 
                  onClick={handleGoLive}
                  disabled={isStartingLive}
                  className="px-8 py-3.5 bg-brand-primary hover:bg-teal-700 text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg flex items-center gap-3 disabled:opacity-50 shrink-0"
                >
                  {isStartingLive ? <Loader2 className="w-4 h-4 animate-spin" /> : <Monitor className="w-4 h-4" />}
                  Go Live Now
                </button>
             </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 border-b border-slate-200 shrink-0">
           <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1">Interactive Stage</h2>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{displayCourse?.name || user.courseId || 'Technical Vocational Track'}</span>
                 <span className="text-[10px] text-slate-400">•</span>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1"><Users className="w-3 h-3" /> {register.length} Enrolled</span>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <button onClick={() => setShowControlSidebar(true)} className="px-6 py-2.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-teal-700 transition-all shadow-lg flex items-center gap-2"><Wand2 className="w-4 h-4" /> Stage Controls</button>
           </div>
        </div>

        <div className="flex flex-col space-y-2 py-4 flex-grow overflow-y-auto scrollbar-hide bg-slate-100/30 rounded-3xl p-4">
           <div className="flex items-center justify-between mb-4 px-2"><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Class Participants</h3></div>
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
             {register.map(student => (
               <StudentListItem 
                  key={student.id} student={student} isInstructor={isInstructor} 
                  onSpotlight={() => { setSpotlightedId(spotlightedId === student.id ? null : student.id); setIsSwapped(true); }}
                  isSpotlighted={spotlightedId === student.id}
                  isMuted={studentStates[student.id]?.isMuted || false}
                  isVideoOn={studentStates[student.id]?.isVideoOn || false}
                  onToggleMute={() => setStudentStates(prev => ({...prev, [student.id]:{...prev[student.id], isMuted:!prev[student.id]?.isMuted}}))}
                  onToggleVideo={() => setStudentStates(prev => ({...prev, [student.id]:{...prev[student.id], isVideoOn:!prev[student.id]?.isVideoOn}}))}
               />
             ))}
           </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[380px] shrink-0 h-full p-4 lg:p-6 bg-slate-100/50 border-l border-slate-200 flex-col gap-4 overflow-hidden">
         <div className="flex-1 min-h-0"><ChatRoom user={user} /></div>
         <div className="shrink-0 h-[300px]"><GeminiTutor course={course} /></div>
      </div>
    </div>
  );
};

// --- PROFILE / DASHBOARD VIEW ---
const StudentsCornerView: React.FC<{ user: User; dbData: any; onPlayRecording: (recording: SessionSchedule) => void; selectedCourseId: string | null }> = ({ user, dbData, onPlayRecording, selectedCourseId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'ai' | 'resources' | 'recordings'>('overview');
  const currentCourse = useMemo(() => dbData.courses.find((c: Course) => c.id.toString() === selectedCourseId?.toString()), [dbData.courses, selectedCourseId]);

  const recordings = useMemo(() => {
    return dbData.schedules.filter((s: SessionSchedule) => s.status === 'Completed' && s.video_url && s.courseId?.toString() === selectedCourseId?.toString());
  }, [dbData.schedules, selectedCourseId]);

  return (
    <div className="flex flex-col h-full bg-white font-inter overflow-hidden">
       <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-center gap-4 no-print shrink-0 overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: 'Overview', icon: <Layout className="w-4 h-4" /> },
            { id: 'curriculum', label: 'Curriculum', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'ai', label: 'AI Tutor', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'resources', label: 'Library', icon: <FileText className="w-4 h-4" /> },
            { id: 'recordings', label: 'Recorded Lectures', icon: <Video className="w-4 h-4" /> }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-teal-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-teal-900'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
       </div>
       <div className="flex-grow p-6 md:p-12 overflow-y-auto bg-slate-50/20 scrollbar-hide">
          {activeTab === 'overview' && (
            <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="text-center md:text-left">
                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.4em] mb-2">Institutional Record: 2024</p>
                    <h2 className="text-4xl md:text-6xl font-outfit font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">Peace, {user.firstName}</h2>
                    <p className="text-slate-400 text-lg font-light">Your technical track is <span className="text-teal-600 font-bold italic">{currentCourse?.name || 'Authorized'}</span>.</p>
                 </div>
                 <div className="shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden grayscale">
                   <img src={`https://picsum.photos/seed/${user.username}/400/400`} className="w-full h-full object-cover" />
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm"><BarChart3 className="w-10 h-10 text-teal-600 mb-4" /><p className="text-4xl font-black text-slate-900">45%</p><p className="text-[8px] font-black mt-2 text-slate-400 uppercase tracking-widest">Mastery</p></div>
                 <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm"><Trophy className="w-10 h-10 text-amber-500 mb-4" /><p className="text-4xl font-black text-amber-600">{user.points || 120}</p><p className="text-[8px] font-black mt-2 text-slate-400 uppercase tracking-widest">Merit</p></div>
                 <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm"><Star className="w-10 h-10 text-emerald-500 mb-4" /><p className="text-4xl font-black text-emerald-600">{user.badges?.length || 3}</p><p className="text-[8px] font-black mt-2 text-slate-400 uppercase tracking-widest">Badges</p></div>
              </div>
            </div>
          )}
          {activeTab === 'curriculum' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
               <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 mb-10">
                  <div className="p-4 bg-teal-900 text-white rounded-xl"><Layout className="w-8 h-8" /></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">{currentCourse?.name || 'Vocational Track'}</h3>
                    <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Faculty Lead: {currentCourse?.instructorName || 'Academy Master'}</p>
                  </div>
               </div>
               <div className="space-y-4">
                  {(currentCourse?.modules || [
                    {id:'1', title:'Foundation & Setup', duration:'2 Weeks'},
                    {id:'2', title:'Core Implementation', duration:'4 Weeks'}
                  ]).map((mod, i) => (
                    <div key={mod.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <span className="text-3xl font-black text-slate-100 font-outfit">{(i+1).toString().padStart(2, '0')}</span>
                          <div><p className="text-base font-black text-slate-800 uppercase leading-none mb-1">{mod.title}</p><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{mod.duration}</p></div>
                       </div>
                       <button className="px-6 py-2 bg-teal-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Start</button>
                    </div>
                  ))}
               </div>
            </div>
          )}
          {activeTab === 'ai' && <div className="max-w-2xl mx-auto h-full"><GeminiTutor course={currentCourse} /></div>}
          {activeTab === 'resources' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(currentCourse?.resources || [
                    {id:'r1', title:'Module 1: Safety Guidelines', type:'PDF', url:'#'},
                    {id:'r2', title:'Module 2: Tool Identification', type:'VIDEO', url:'#'},
                    {id:'r3', title:'Module 3: Technical Drawings', type:'PDF', url:'#'},
                    {id:'r4', title:'Module 4: Practical Assessment', type:'ZIP', url:'#'}
                  ]).map((res) => (
                    <div key={res.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-teal-500 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all">
                             {res.type === 'PDF' ? <FileText className="w-5 h-5" /> : res.type === 'VIDEO' ? <PlayCircle className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-800 uppercase leading-none mb-1">{res.title}</p>
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{res.type} Resource</p>
                          </div>
                       </div>
                       <a href={res.url} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-teal-900 hover:text-white transition-all">
                          <Download className="w-4 h-4" />
                       </a>
                    </div>
                  ))}
               </div>
            </div>
          )}
          {activeTab === 'recordings' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
               {recordings.length === 0 ? (
                 <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                   <Video className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                   <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No Recordings Available</h3>
                   <p className="text-xs font-bold text-slate-400 mt-2">Past sessions will appear here.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {recordings.map((rec) => (
                     <div key={rec.id} onClick={() => onPlayRecording(rec)} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group cursor-pointer hover:border-teal-500 hover:shadow-xl transition-all">
                       <div className="aspect-video bg-slate-100 relative overflow-hidden">
                         {rec.thumbnail_url ? (
                           <img src={rec.thumbnail_url} alt={rec.topic} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center bg-slate-800">
                             <Video className="w-12 h-12 text-slate-600" />
                           </div>
                         )}
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                           <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                             <PlayCircle className="w-6 h-6 text-white" />
                           </div>
                         </div>
                       </div>
                       <div className="p-6">
                         <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2">{new Date(rec.startTime).toLocaleDateString()}</p>
                         <h4 className="text-lg font-black text-slate-900 leading-tight">{rec.topic}</h4>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}
       </div>
    </div>
  );
};

// --- MAIN LMS COMPONENT ---
const LMS: React.FC<{ externalUser: User | null; onLogout: () => void; onPageChange: (p: string) => void; onRefreshData: () => Promise<void>; onLoginClick: () => void; dbData: any; }> = ({ externalUser, onRefreshData, onLoginClick, dbData }) => {
  const [activeStage, setActiveStage] = useState<'classroom' | 'corner'>('classroom');
  const [selectedRecording, setSelectedRecording] = useState<SessionSchedule | null>(null);
  const effectiveUser = externalUser;
  
  const isAuthorized = useMemo(() => {
    if (!effectiveUser) return false;
    if (effectiveUser.role === 'admin' || effectiveUser.role === 'instructor') return true;
    if (effectiveUser.purchasedCourses && effectiveUser.purchasedCourses.length > 0) return true;
    const reg = dbData.register.find((r: AdmissionWithdrawal) => r.regNumber === effectiveUser.regNumber);
    return !!(reg && (reg.status === 'Active' || reg.status === 'Approved') && reg.courseId);
  }, [effectiveUser, dbData.register]);

  const availableCourseIds = useMemo(() => {
    const ids = new Set<string>();
    if (effectiveUser?.courseId) ids.add(effectiveUser.courseId);
    if (effectiveUser?.purchasedCourses) {
      effectiveUser.purchasedCourses.forEach(id => ids.add(id));
    }
    return Array.from(ids);
  }, [effectiveUser]);

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(availableCourseIds[0] || null);

  useEffect(() => {
    if (!selectedCourseId && availableCourseIds.length > 0) {
      setSelectedCourseId(availableCourseIds[0]);
    }
  }, [availableCourseIds, selectedCourseId]);

  const filteredRegister = useMemo(() => {
    if (!effectiveUser) return [];
    if (effectiveUser.role === 'admin') return dbData.register;
    return dbData.register.filter((r: AdmissionWithdrawal) => r.courseId?.toString() === selectedCourseId?.toString());
  }, [effectiveUser, dbData.register, selectedCourseId]);

  const currentCourse = useMemo(() => dbData.courses.find((c: Course) => c.id.toString() === selectedCourseId?.toString()), [dbData.courses, selectedCourseId]);

  if (!effectiveUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand-slate p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center shadow-2xl border border-teal-100">
           <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center text-teal-600 mx-auto mb-8"><UserIcon className="w-10 h-10" /></div>
           <h2 className="text-2xl font-outfit font-black text-slate-900 uppercase tracking-tighter mb-4">Authentication Required</h2>
           <p className="text-slate-500 text-sm leading-relaxed mb-10">Please log in to your institutional account to access the Learning Management System.</p>
           <button onClick={onLoginClick} className="w-full py-4 bg-teal-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-teal-800 transition-all">Log In Now</button>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand-slate p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center shadow-2xl border border-rose-100">
           <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8"><ShieldAlert className="w-10 h-10" /></div>
           <h2 className="text-2xl font-outfit font-black text-slate-900 uppercase tracking-tighter mb-4">Access Restricted</h2>
           <p className="text-slate-500 text-sm leading-relaxed mb-10">Verification pending. Please wait for institutional approval.</p>
           <button onClick={() => window.location.reload()} className="w-full py-4 bg-teal-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Refresh Profile</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col font-inter min-h-screen">
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between shadow-sm no-print shrink-0 sticky top-0 z-40">
         <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 gap-2">
            <button onClick={() => setActiveStage('classroom')} className={`flex items-center gap-3 px-8 py-2.5 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest ${activeStage === 'classroom' ? 'bg-teal-900 text-white shadow-lg' : 'text-slate-400 hover:text-teal-900'}`}><Monitor className="w-4 h-4" /> Academic Stage</button>
            <button onClick={() => setActiveStage('corner')} className={`flex items-center gap-3 px-8 py-2.5 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest ${activeStage === 'corner' ? 'bg-teal-900 text-white shadow-lg' : 'text-slate-400 hover:text-teal-900'}`}><GraduationCap className="w-4 h-4" /> Module Content</button>
         </div>
         {availableCourseIds.length > 1 && (
           <select 
             value={selectedCourseId || ''} 
             onChange={(e) => setSelectedCourseId(e.target.value)}
             className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
           >
             {availableCourseIds.map(id => {
               const c = dbData.courses.find((course: Course) => course.id.toString() === id.toString());
               return <option key={id} value={id}>{c?.name || 'Unknown Course'}</option>;
             })}
           </select>
         )}
      </div>
      <main className="flex-grow bg-slate-50/50 relative">
         {activeStage === 'classroom' ? <InstitutionalClassroom user={effectiveUser} register={filteredRegister} schedules={dbData.schedules} course={currentCourse} allCourses={dbData.courses} onRefreshData={onRefreshData} selectedRecording={selectedRecording} onClearRecording={() => setSelectedRecording(null)} /> : <StudentsCornerView user={effectiveUser} dbData={dbData} onPlayRecording={(recording) => { setSelectedRecording(recording); setActiveStage('classroom'); }} selectedCourseId={selectedCourseId} />}
      </main>
    </div>
  );
};

export default LMS;
