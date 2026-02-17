
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, ClassroomParticipant, ChatMessage, Quiz, DiscussionPost, UserProgress } from '../types';
import { useLiveSession } from '../components/LiveSessionContext';
import { getDB, saveDB } from '../db';
import { 
  Camera, Mic, ScreenShare, Film, Power, 
  MessageSquare, GraduationCap, RefreshCcw, Sparkles, Monitor, BarChart3, 
  Trophy, BookOpen, Send, FileText, Download, UserCircle, Save, 
  Rocket, Maximize2, Zap, ZoomIn, Settings2, Activity, Users, Minimize2,
  ShieldCheck, LogOut, Sliders, Sun, MicOff, VideoOff, Layout, Hand, Globe, Settings,
  CheckCircle, ChevronRight, Clock, MessageCircle, Star, Medal
} from 'lucide-react';

// --- Sub-Components ---

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
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: user.role === 'admin' ? 'instructor' : 'student',
      text: input,
      userName: user.firstName ? `${user.firstName} ${user.lastName}` : user.username,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  return (
    <div className="bg-white rounded-[2rem] border border-teal-100 shadow-xl flex flex-col h-[400px] overflow-hidden">
      <div className="p-4 border-b border-teal-50 flex items-center justify-between bg-teal-50/30">
        <div className="flex items-center gap-2">
           <MessageSquare className="w-4 h-4 text-teal-600" />
           <span className="text-[10px] font-black text-teal-900 uppercase tracking-widest">Institutional Discourse</span>
        </div>
      </div>
      <div ref={scrollRef} className="flex-grow p-5 overflow-y-auto space-y-3 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.userName === (user.firstName ? `${user.firstName} ${user.lastName}` : user.username) ? 'items-end' : 'items-start'}`}>
            <div className={`px-4 py-2 rounded-2xl text-[11px] ${msg.role === 'instructor' ? 'bg-teal-900 text-teal-50 font-urdu leading-normal' : 'bg-teal-50 text-teal-900 shadow-sm'}`}>
              {msg.text}
            </div>
            <span className="text-[7px] font-black text-teal-300 mt-1 uppercase tracking-tight">{msg.userName} • {msg.timestamp}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="p-3 bg-teal-50/50 border-t border-teal-100 flex gap-2">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Type message..." 
          className="flex-grow bg-white border border-teal-100 rounded-xl px-4 py-2.5 text-xs outline-none shadow-inner text-teal-900 placeholder:text-teal-200" 
        />
        <button type="submit" className="p-2.5 bg-teal-800 text-white rounded-xl shadow-lg hover:bg-teal-950 transition-all">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

const MicroParticipantCard: React.FC<{ 
  participant: ClassroomParticipant; 
  onSpotlight?: (id: string) => void;
  onMute?: (id: string) => void;
  onToggleHand?: (id: string) => void;
  currentUserRole: string;
}> = ({ participant, onSpotlight, onMute, onToggleHand, currentUserRole }) => {
  const isAdminOrInstructor = currentUserRole === 'admin' || currentUserRole === 'instructor';
  
  return (
    <div className={`relative bg-white border rounded-[1.5rem] p-3 flex items-center gap-3 transition-all hover:shadow-lg ${participant.isHandRaised ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-400/20' : 'border-teal-50 shadow-sm'}`}>
      <div className="relative">
        <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-400 font-black overflow-hidden border border-teal-100">
          {participant.avatar ? <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" /> : participant.name[0]}
        </div>
        {participant.isHandRaised && (
          <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1 rounded-full shadow-lg animate-bounce">
            <Hand className="w-2.5 h-2.5" />
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-[10px] font-black text-teal-900 truncate uppercase tracking-tight">{participant.name}</p>
        <span className="text-[7px] text-teal-400 font-bold uppercase">{participant.role}</span>
      </div>
      <div className="flex gap-1">
        {isAdminOrInstructor && (
          <>
            <button onClick={() => onMute?.(participant.id)} className={`p-1.5 rounded-lg ${participant.isMuted ? 'text-rose-500 bg-rose-50' : 'text-teal-400 hover:bg-teal-50'}`} title="Mute Participant">
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onSpotlight?.(participant.id)} className="p-1.5 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all" title="Global Spotlight">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// --- Institutional Classroom (Live Stage) ---

const InstitutionalClassroom: React.FC<{ user: User }> = ({ user }) => {
  const { 
    sessionMode, activeStream, screenStream, isMuted, isCameraOff, isTorchOn, zoomLevel, imageSettings,
    chromaKey, toggleChromaKey,
    startCamera, cycleCamera, toggleTorch, startScreenShare, playMediaFile, terminateSession, 
    toggleMute, toggleCamera, setZoom, updateImageSettings
  } = useLiveSession();
  
  const [showHud, setShowHud] = useState(true);
  const [globalSpotlightId, setGlobalSpotlightId] = useState<string | null>(null);
  const [localSwapped, setLocalSwapped] = useState(false);
  
  const hudTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const miniVideoRef = useRef<HTMLVideoElement>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const isAdminOrInstructor = user.role === 'admin' || user.role === 'instructor';

  const [participants, setParticipants] = useState<ClassroomParticipant[]>([
    { id: 'instr-01', name: 'Instructor (Main)', role: 'instructor', isMuted: false, isCameraOff: false, isHandRaised: false, isLive: true, isSpeaking: false },
    { id: 'std-1', name: 'Sana Fatima', role: 'student', isMuted: true, isCameraOff: true, isHandRaised: false, isLive: true, isSpeaking: false },
    { id: 'std-2', name: 'Zoya Ahmed', role: 'student', isMuted: false, isCameraOff: false, isHandRaised: true, isLive: true, isSpeaking: true },
    { id: 'std-3', name: 'Hira Khan', role: 'student', isMuted: false, isCameraOff: false, isHandRaised: false, isLive: true, isSpeaking: false },
  ]);

  const resetHudTimer = () => {
    setShowHud(true);
    if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    hudTimerRef.current = setTimeout(() => {
      setShowHud(false);
    }, 3500);
  };

  useEffect(() => {
    resetHudTimer();
    return () => {
      if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const instructorSource = screenStream || activeStream;
    const spotlightSource = globalSpotlightId ? new MediaStream() : null; 

    if (mainVideoRef.current) {
      if (localSwapped && spotlightSource) {
        mainVideoRef.current.srcObject = spotlightSource;
      } else {
        mainVideoRef.current.srcObject = instructorSource;
      }
    }

    if (miniVideoRef.current) {
      if (localSwapped) {
        miniVideoRef.current.srcObject = instructorSource;
      } else {
        miniVideoRef.current.srcObject = spotlightSource;
      }
    }
  }, [activeStream, screenStream, localSwapped, globalSpotlightId]);

  const handleGlobalSpotlight = (id: string) => {
    if (!isAdminOrInstructor) return;
    setGlobalSpotlightId(prev => prev === id ? null : id);
    setLocalSwapped(false); 
  };

  const handleToggleHand = (id: string) => {
    setParticipants(prev => prev.map(p => 
      (p.id === id || (p.id === 'current-user-id' && id === 'current-user-id')) 
      ? { ...p, isHandRaised: !p.isHandRaised } 
      : p
    ));
  };

  const toggleFullScreen = () => {
    if (!stageContainerRef.current) return;
    if (!document.fullscreenElement) stageContainerRef.current.requestFullscreen();
    else document.exitFullscreen();
  };

  const togglePIP = async () => {
    if (!mainVideoRef.current) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await mainVideoRef.current.requestPictureInPicture();
    } catch (err) { console.warn("PIP failed", err); }
  };

  const filterStyle = `brightness(${imageSettings.brightness}%) contrast(${imageSettings.contrast}%) saturate(${imageSettings.saturate}%) blur(${imageSettings.blur}px)`;

  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => (b.isHandRaised ? 1 : 0) - (a.isHandRaised ? 1 : 0));
  }, [participants]);

  return (
    <div className="flex flex-col h-full bg-slate-950/5">
      <div className="p-4 md:p-8 flex-grow">
        <div 
          ref={stageContainerRef}
          onMouseMove={resetHudTimer}
          onTouchStart={resetHudTimer}
          className="relative w-full aspect-video bg-black overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] group border-4 md:border-[12px] border-white rounded-3xl md:rounded-[3rem] transition-all duration-700"
        >
          <button 
            onClick={toggleFullScreen} 
            className="absolute top-6 left-6 z-[140] p-3.5 bg-teal-950/40 hover:bg-teal-950/70 backdrop-blur-3xl rounded-2xl text-white shadow-2xl transition-all border border-white/10 active:scale-90" 
            title="Expansion Toggle"
          >
            <Maximize2 className="w-6 h-6" />
          </button>

          {sessionMode === 'camera' && (
            <div 
              className={`absolute top-8 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-6 px-8 py-3 bg-teal-950/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl transition-all duration-500 ${showHud ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12 pointer-events-none'}`}
            >
               <div className="flex items-center gap-4">
                  <Sun className="w-4 h-4 text-emerald-400" />
                  <input 
                    type="range" min="50" max="150" value={imageSettings.brightness} 
                    onChange={e => updateImageSettings({brightness: parseInt(e.target.value)})} 
                    className="w-24 md:w-40 h-1.5 accent-emerald-500 bg-white/10 appearance-none rounded-full cursor-pointer" 
                  />
               </div>
               <div className="w-px h-6 bg-white/10"></div>
               <div className="flex gap-2">
                 <button onClick={() => cycleCamera()} className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors" title="Switch Input"><RefreshCcw className="w-5 h-5" /></button>
                 <button onClick={() => toggleTorch()} className={`p-3 rounded-full transition-colors ${isTorchOn ? 'text-amber-400 bg-amber-400/20' : 'text-white/70 hover:text-white hover:bg-white/10'}`} title="Torch"><Zap className="w-5 h-5" /></button>
                 <button onClick={() => setZoom(zoomLevel === 1 ? 1.6 : 1)} className={`p-3 rounded-full transition-colors ${zoomLevel > 1 ? 'text-blue-400 bg-blue-400/20' : 'text-white/70 hover:text-white hover:bg-white/10'}`} title="Precision Zoom"><ZoomIn className="w-5 h-5" /></button>
                 <button 
                  onClick={() => toggleChromaKey(!chromaKey.active)} 
                  className={`p-3 rounded-full transition-colors ${chromaKey.active ? 'text-emerald-400 bg-emerald-400/10 shadow-inner' : 'text-white/70 hover:text-white hover:bg-white/10'}`} 
                  title="Virtual Backdrop"
                 >
                  <Layout className="w-5 h-5" />
                 </button>
               </div>
            </div>
          )}

          <div className="w-full h-full relative z-10 flex items-center justify-center bg-black">
            {sessionMode !== 'idle' ? (
              <video 
                ref={mainVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="max-w-full max-h-full object-contain transition-transform duration-1000 shadow-inner" 
                style={{ filter: filterStyle, transform: `scale(${zoomLevel})` }} 
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-teal-950 via-slate-900 to-black">
                <Sparkles className="w-20 h-20 text-teal-600/10 animate-pulse mb-8" />
                <GraduationCap className="w-20 h-20 text-teal-50/30" />
                <p className="text-white/30 text-[12px] font-black uppercase tracking-[1.5em] mt-10 font-urdu">The Academy Stage is Silent</p>
              </div>
            )}
            
            {globalSpotlightId && (
              <div 
                onClick={() => setLocalSwapped(!localSwapped)} 
                className="absolute top-10 right-8 w-1/4 aspect-video bg-black border-4 border-white/30 rounded-3xl shadow-3xl z-40 overflow-hidden cursor-pointer transition-all duration-700 hover:scale-105 hover:ring-4 hover:ring-emerald-400/40 group/mini"
              >
                <video ref={miniVideoRef} autoPlay playsInline muted className="w-full h-full object-contain opacity-80 group-hover/mini:opacity-100" />
                <div className="absolute inset-0 bg-teal-950/20 opacity-0 group-hover/mini:opacity-100 flex items-center justify-center transition-all">
                  <RefreshCcw className="w-8 h-8 text-white animate-spin-slow" />
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-xl backdrop-blur-xl border border-white/10">
                   <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">
                     {localSwapped ? "Global Broadcast Source" : (participants.find(p => p.id === globalSpotlightId)?.name || "Live Subject")}
                   </span>
                </div>
              </div>
            )}
          </div>

          <div 
            className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 p-2 bg-teal-950/90 backdrop-blur-3xl rounded-full border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.7)] transition-all duration-700 ${showHud ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}`}
          >
             {isAdminOrInstructor && (
               <>
                 <button onClick={() => startCamera()} className={`p-4 rounded-full transition-all flex items-center gap-3 ${sessionMode === 'camera' ? 'bg-emerald-500 text-teal-950 shadow-2xl' : 'text-white/60 hover:text-white hover:bg-white/10'}`} title="Go Live with Camera">
                    <Camera className="w-5 h-5" />
                    {sessionMode === 'camera' && <span className="text-[10px] font-black uppercase tracking-widest pr-2">Transmission Live</span>}
                 </button>
                 <button onClick={() => startScreenShare()} className={`p-4 rounded-full transition-all flex items-center gap-3 ${sessionMode === 'screen' ? 'bg-blue-500 text-white shadow-2xl' : 'text-white/60 hover:text-white hover:bg-white/10'}`} title="Broadcast Screen Share">
                    <ScreenShare className="w-5 h-5" />
                    {sessionMode === 'screen' && <span className="text-[10px] font-black uppercase tracking-widest pr-2">Desktop Stream</span>}
                 </button>
                 <button onClick={() => mediaInputRef.current?.click()} className={`p-4 rounded-full transition-all flex items-center gap-3 ${sessionMode === 'media' ? 'bg-purple-600 text-white shadow-2xl' : 'text-white/60 hover:text-white hover:bg-white/10'}`} title="Broadcast Media Resource">
                    <Film className="w-5 h-5" />
                    {sessionMode === 'media' && <span className="text-[10px] font-black uppercase tracking-widest pr-2">Resource File</span>}
                 </button>
                 <input ref={mediaInputRef} type="file" className="hidden" accept="video/*" onChange={e => e.target.files?.[0] && playMediaFile(e.target.files[0])} />
                 <div className="w-px h-8 bg-white/20 mx-2"></div>
               </>
             )}

             <button onClick={() => toggleMute()} className={`p-4 rounded-full transition-all ${isMuted ? 'bg-rose-600/20 text-rose-500 shadow-inner' : 'text-white/60 hover:text-white hover:bg-white/10'}`} title={isMuted ? "Audio Off" : "Audio On"}>
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
             </button>
             {!isAdminOrInstructor && (
                <button 
                  onClick={() => handleToggleHand('current-user-id')} 
                  className={`p-4 rounded-full transition-all flex items-center gap-2 ${participants.find(p => p.id === 'current-user-id')?.isHandRaised ? 'bg-amber-500 text-white shadow-2xl scale-110' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                  title="Raise Concern"
                >
                  <Hand className="w-5 h-5" />
                  {participants.find(p => p.id === 'current-user-id')?.isHandRaised && <span className="text-[10px] font-black uppercase tracking-widest pr-1">Notifying...</span>}
                </button>
             )}

             <div className="w-px h-8 bg-white/20 mx-2"></div>
             <button onClick={togglePIP} className="p-4 text-white/60 hover:text-white hover:bg-white/10 rounded-full" title="Detach Stage (PIP)"><Monitor className="w-5 h-5" /></button>
             
             {isAdminOrInstructor && (
               <>
                 <div className="w-px h-8 bg-white/20 mx-2"></div>
                 <button onClick={() => terminateSession()} className="p-4 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-all shadow-2xl ml-2" title="Cease Broadcast"><Power className="w-5 h-5" /></button>
               </>
             )}
          </div>
        </div>
      </div>

      <div className="px-8 md:px-12 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between px-4">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                <Users className="w-5 h-5 text-teal-600" /> Active Academy Peers
              </span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {sortedParticipants.map(p => (
               <MicroParticipantCard 
                  key={p.id} 
                  participant={p} 
                  onSpotlight={handleGlobalSpotlight} 
                  onToggleHand={handleToggleHand}
                  currentUserRole={user.role} 
                />
             ))}
           </div>
        </div>
        <aside className="space-y-8">
           <ChatRoom user={user} />
           <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl overflow-hidden relative group border border-white/5">
              <Sparkles className="absolute -top-4 -right-4 w-16 h-16 text-teal-400/20 group-hover:scale-125 transition-transform" />
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Study Resource</p>
              <h4 className="text-lg font-black uppercase mb-6 leading-tight">Professional Fashion Curricula</h4>
              <button className="w-full py-4 bg-white/10 hover:bg-teal-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all border border-white/10">
                <Download className="w-5 h-5" /> Institutional Handouts
              </button>
           </div>
        </aside>
      </div>
    </div>
  );
};

const StudentsCornerView: React.FC<{ user: User; dbData: any }> = ({ user, dbData }) => {
  const [activeFold, setActiveFold] = useState<'hub' | 'progress' | 'quizzes' | 'forum' | 'leaderboard' | 'resources'>('hub');
  const folds = [
    { id: 'hub', name: 'Identity', icon: <Rocket className="w-4 h-4" /> },
    { id: 'progress', name: 'Logbook', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'quizzes', name: 'Assessments', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'forum', name: 'Knowledge', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'leaderboard', name: 'Ranks', icon: <Trophy className="w-4 h-4" /> },
    { id: 'resources', name: 'Library', icon: <FileText className="w-4 h-4" /> },
  ];

  const userCourse = dbData.courses.find((c: any) => c.id === user.regNumber?.split('/')[1] || c.id === '1');
  const userQuizzes = dbData.quizzes.filter((q: Quiz) => q.courseId === userCourse?.id);
  const courseDiscussions = dbData.discussions.filter((d: DiscussionPost) => d.courseId === userCourse?.id);
  const topUsers = [...dbData.users].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 10);

  return (
    <div className="flex flex-col h-full bg-white">
       <div className="bg-slate-50 border-b border-teal-100 p-4 flex items-center justify-center gap-3 overflow-x-auto scrollbar-hide no-print">
          {folds.map(fold => (
            <button 
              key={fold.id} 
              onClick={() => setActiveFold(fold.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFold === fold.id ? 'bg-teal-900 text-white shadow-xl' : 'text-teal-900 hover:bg-teal-100'}`}
            >
              {fold.icon} {fold.name}
            </button>
          ))}
       </div>
       <div className="flex-grow p-6 md:p-12 animate-fadeIn overflow-y-auto bg-slate-50/10">
          
          {/* Identity Hub */}
          {activeFold === 'hub' && (
             <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center">
                   <h2 className="text-4xl md:text-5xl font-black text-teal-950 uppercase tracking-tighter">Salaam, {user.firstName || user.username}</h2>
                   <p className="text-teal-600 font-urdu text-3xl mt-4 leading-loose">تعلیمی پورٹل میں خوش آمدید۔</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="bg-white p-10 rounded-[3rem] text-center border border-teal-100 shadow-xl group hover:-translate-y-2 transition-transform">
                      <p className="text-5xl font-black text-teal-900">45%</p>
                      <p className="text-[11px] font-black text-teal-400 mt-3 uppercase tracking-widest">Syllabus Status</p>
                   </div>
                   <div className="bg-white p-10 rounded-[3rem] text-center border border-amber-100 shadow-xl group hover:-translate-y-2 transition-transform">
                      <p className="text-5xl font-black text-amber-600">{user.points || 0}</p>
                      <p className="text-[11px] font-black text-amber-400 mt-3 uppercase tracking-widest">Academy Gems</p>
                   </div>
                   <div className="bg-white p-10 rounded-[3rem] text-center border border-emerald-100 shadow-xl group hover:-translate-y-2 transition-transform">
                      <p className="text-5xl font-black text-emerald-600">{user.badges?.length || 0}</p>
                      <p className="text-[11px] font-black text-emerald-400 mt-3 uppercase tracking-widest">Merit Badges</p>
                   </div>
                </div>
                <div className="bg-teal-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                   <Sparkles className="absolute top-4 right-4 text-emerald-400/20 w-32 h-32" />
                   <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">Current Course</h3>
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20">
                         <BookOpen className="w-10 h-10 text-emerald-400" />
                      </div>
                      <div>
                         <p className="text-xl font-bold">{userCourse?.name || 'Technical Foundation'}</p>
                         <p className="text-teal-400 text-xs font-black uppercase tracking-widest mt-1">Mentor: {userCourse?.instructorName || 'Academy Faculty'}</p>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* Logbook Progress */}
          {activeFold === 'progress' && (
             <div className="max-w-4xl mx-auto space-y-8">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                   <BarChart3 className="text-teal-600" /> Academic Logbook
                </h3>
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-teal-50">
                   <div className="space-y-12">
                      {userCourse?.modules?.map((m: any, i: number) => (
                         <div key={m.id} className="flex gap-6 relative group">
                            {i < userCourse.modules.length - 1 && <div className="absolute left-6 top-12 bottom-0 w-[2px] bg-slate-100 group-last:hidden"></div>}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-lg ${i === 0 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                               {i === 0 ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                            </div>
                            <div className="flex-grow pt-1">
                               <p className={`text-lg font-black uppercase tracking-tight ${i === 0 ? 'text-slate-900' : 'text-slate-400'}`}>{m.title}</p>
                               <div className="flex items-center gap-4 mt-2">
                                  <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-lg">{m.duration}</span>
                                  {i === 0 && <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Completed</span>}
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {/* Assessments Quizzes */}
          {activeFold === 'quizzes' && (
             <div className="max-w-4xl mx-auto space-y-8">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                   <BookOpen className="text-teal-600" /> Skill Assessments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {userQuizzes.length > 0 ? userQuizzes.map((q: Quiz) => (
                      <div key={q.id} className="bg-white p-8 rounded-[2rem] border border-teal-50 shadow-xl hover:-translate-y-1 transition-transform flex flex-col justify-between">
                         <div>
                            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6">
                               <FileText className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{q.title}</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{q.questions.length} Question Units</p>
                         </div>
                         <button className="mt-8 w-full py-4 bg-teal-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-teal-950 transition-all shadow-lg">Start Assessment</button>
                      </div>
                   )) : (
                     <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <Rocket className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest">No Active Assessments Found</p>
                     </div>
                   )}
                </div>
             </div>
          )}

          {/* Knowledge Forum */}
          {activeFold === 'forum' && (
             <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                      <MessageSquare className="text-teal-600" /> Community Knowledge
                   </h3>
                   <button className="px-6 py-2.5 bg-teal-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">New Topic</button>
                </div>
                <div className="space-y-6">
                   {courseDiscussions.map((d: DiscussionPost) => (
                      <div key={d.id} className="bg-white p-8 rounded-[2rem] border border-teal-50 shadow-xl group cursor-pointer hover:border-teal-200 transition-all">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-teal-600">
                               <UserCircle className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{d.userName}</p>
                               <p className="text-[9px] font-black text-teal-500 uppercase tracking-widest">{d.userRole}</p>
                            </div>
                         </div>
                         <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:text-teal-700 transition-colors">{d.title}</h4>
                         <p className="text-sm text-slate-600 line-clamp-2 italic mb-6">"{d.content}"</p>
                         <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {d.replies.length} Responses</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(d.timestamp).toLocaleDateString()}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* Ranks Leaderboard */}
          {activeFold === 'leaderboard' && (
             <div className="max-w-4xl mx-auto space-y-8">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                   <Trophy className="text-amber-500" /> Institutional Merit Ranks
                </h3>
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-teal-50 overflow-hidden">
                   <div className="divide-y divide-slate-50">
                      {topUsers.map((u: User, i: number) => (
                         <div key={u.id} className="flex items-center gap-6 p-6 md:p-8 hover:bg-slate-50/50 transition-colors">
                            <div className="w-12 text-center flex-shrink-0">
                               {i < 3 ? (
                                  <Medal className={`w-8 h-8 mx-auto ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-400' : 'text-amber-700'}`} />
                               ) : (
                                  <span className="text-xl font-black text-slate-300">#{i + 1}</span>
                               )}
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 font-black shrink-0 border border-teal-100">
                               {u.firstName?.[0] || u.username[0].toUpperCase()}
                            </div>
                            <div className="flex-grow min-w-0">
                               <p className="text-lg font-black text-slate-900 uppercase tracking-tight truncate">{u.firstName || u.username} {u.lastName}</p>
                               <div className="flex gap-2 mt-1">
                                  {u.badges?.map((b, bi) => (
                                     <span key={bi} className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-widest">{b}</span>
                                  ))}
                               </div>
                            </div>
                            <div className="text-right shrink-0">
                               <p className="text-2xl font-black text-teal-900">{u.points || 0}</p>
                               <p className="text-[9px] font-black text-teal-400 uppercase tracking-widest">Gems Collected</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {/* Library Resources */}
          {activeFold === 'resources' && (
             <div className="max-w-4xl mx-auto space-y-8">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                   <FileText className="text-teal-600" /> Digital Library & Handouts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[
                      { name: 'Fashion Pattern Mastery Vol 1', type: 'PDF', size: '4.2 MB' },
                      { name: 'Technical Drawing Standards', type: 'PDF', size: '1.8 MB' },
                      { name: 'Institutional Policy Handbook', type: 'DOCX', size: '0.5 MB' },
                      { name: 'Intro to Textile Chemistry', type: 'PDF', size: '12.4 MB' }
                   ].map((item, i) => (
                      <div key={i} className="bg-white p-8 rounded-[2rem] border border-teal-50 shadow-xl flex items-center justify-between group hover:border-teal-300 transition-all">
                         <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                               <Download className="w-6 h-6" />
                            </div>
                            <div>
                               <h4 className="font-black text-slate-900 uppercase tracking-tight">{item.name}</h4>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.type} • {item.size}</p>
                            </div>
                         </div>
                         <button className="p-3 text-slate-300 group-hover:text-teal-600 transition-colors"><ChevronRight className="w-6 h-6" /></button>
                      </div>
                   ))}
                </div>
             </div>
          )}
       </div>
    </div>
  );
};

const LMS: React.FC<{ 
  externalUser: User | null; 
  onLogout: () => void; 
  onPageChange: (p: string) => void;
  dbData: any; 
}> = ({ externalUser, onLogout, onPageChange, dbData }) => {
  const [activeStage, setActiveStage] = useState<'classroom' | 'corner'>('classroom');
  const { terminateSession } = useLiveSession();

  if (!externalUser) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]"><ShieldCheck className="w-20 h-20 text-teal-600 animate-pulse" /></div>
  );

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="bg-white border-b border-teal-100 px-6 py-4 flex items-center justify-center shadow-sm no-print">
         <div className="flex bg-slate-100 p-1.5 rounded-[2rem] border border-slate-200 gap-1.5 shadow-inner">
            <button 
              onClick={() => setActiveStage('classroom')} 
              className={`flex items-center gap-3 px-8 py-3 rounded-[1.5rem] transition-all font-black uppercase text-[11px] tracking-widest ${activeStage === 'classroom' ? 'bg-teal-800 text-white shadow-2xl scale-105' : 'text-slate-400 hover:text-teal-800'}`}
            >
               <Monitor className="w-5 h-5" /> Portal Stage
            </button>
            <button 
              onClick={() => setActiveStage('corner')} 
              className={`flex items-center gap-3 px-8 py-3 rounded-[1.5rem] transition-all font-black uppercase text-[11px] tracking-widest ${activeStage === 'corner' ? 'bg-teal-800 text-white shadow-2xl scale-105' : 'text-slate-400 hover:text-teal-800'}`}
            >
               <GraduationCap className="w-5 h-5" /> Learner Hub
            </button>
         </div>
      </div>

      <main className="flex-grow overflow-hidden animate-fadeIn relative bg-slate-50/20">
         {activeStage === 'classroom' && <InstitutionalClassroom user={externalUser} />}
         {activeStage === 'corner' && <StudentsCornerView user={externalUser} dbData={dbData} />}
      </main>

      <style>{`
         @keyframes sound-bar { 0%, 100% { height: 4px; } 50% { height: 16px; } }
         .animate-sound-bar { animation: sound-bar 0.4s ease-in-out infinite; }
         @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
         .animate-fadeIn { animation: fadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
         .no-scrollbar::-webkit-scrollbar { display: none; }
         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
         .animate-spin-slow { animation: spin 4s linear infinite; }
         video { object-fit: contain !important; }
         :fullscreen video { object-fit: contain !important; }
      `}</style>
    </div>
  );
};

export default LMS;
