
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ImageSettings {
  brightness: number;
  contrast: number;
  saturate: number;
  hueRotate: number;
  blur: number;
}

interface ChromaKeySettings {
  active: boolean;
  bgImage: string | null;
  similarity: number;
  smoothness: number;
  keyColor: string;
}

interface LiveSessionContextType {
  sessionMode: 'idle' | 'camera' | 'screen' | 'media';
  activeStream: MediaStream | null;
  screenStream: MediaStream | null;
  mediaUrl: string | null;
  isMuted: boolean;
  isCameraOff: boolean;
  isTorchOn: boolean;
  zoomLevel: number;
  imageSettings: ImageSettings;
  chromaKey: ChromaKeySettings;
  startCamera: (deviceId?: string) => Promise<void>;
  stopCamera: () => void;
  cycleCamera: () => Promise<void>;
  toggleTorch: () => Promise<void>;
  startScreenShare: () => Promise<void>;
  playMediaFile: (file: File) => void;
  terminateSession: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  setZoom: (level: number) => void;
  updateImageSettings: (settings: Partial<ImageSettings>) => void;
  toggleChromaKey: (active: boolean, bg?: string) => void;
  updateChromaKeySettings: (settings: Partial<ChromaKeySettings>) => void;
}

const LiveSessionContext = createContext<LiveSessionContextType | undefined>(undefined);

export const LiveSessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionMode, setSessionMode] = useState<'idle' | 'camera' | 'screen' | 'media'>('idle');
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  
  const [imageSettings, setImageSettings] = useState<ImageSettings>({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    hueRotate: 0,
    blur: 0
  });

  const [chromaKey, setChromaKey] = useState<ChromaKeySettings>({
    active: false,
    bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    similarity: 15,
    smoothness: 10,
    keyColor: '#00FF00'
  });

  const startCamera = async (deviceId?: string) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this environment");
      }
      activeStream?.getTracks().forEach(track => track.stop());
      
      // Try with ideal constraints first
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: {
          deviceId: deviceId ? { ideal: deviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (innerErr) {
        console.warn("Retrying with basic constraints", innerErr);
        // Fallback to basic video if ideal fails
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      }

      setActiveStream(stream);
      setSessionMode('camera');
      setIsCameraOff(false);
      if (deviceId) setCurrentDeviceId(deviceId);
    } catch (err) {
      console.error("Camera error", err);
      alert("Media Access Error: Please check device permissions or if another app is using the camera.");
    }
  };

  const stopCamera = () => {
    activeStream?.getTracks().forEach(track => track.stop());
    setActiveStream(null);
  };

  const cycleCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      if (videoDevices.length <= 1) return;
      const currentIndex = videoDevices.findIndex(d => d.deviceId === currentDeviceId);
      const nextIndex = (currentIndex + 1) % videoDevices.length;
      await startCamera(videoDevices[nextIndex].deviceId);
    } catch (err) { console.error("Cycling error", err); }
  };

  const toggleTorch = async () => {
    const track = activeStream?.getVideoTracks()[0];
    if (!track) return;
    try {
      const capabilities = (track as any).getCapabilities?.() || {};
      if (!capabilities.torch) return;
      await track.applyConstraints({ advanced: [{ torch: !isTorchOn }] } as any);
      setIsTorchOn(!isTorchOn);
    } catch (err) { console.warn("Torch failed", err); }
  };

  const startScreenShare = async () => {
    try {
      if (!navigator.mediaDevices || !(navigator.mediaDevices as any).getDisplayMedia) {
        alert("Screen sharing is not supported on this device or browser.");
        return;
      }
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({ 
        video: { cursor: "always" },
        audio: true 
      });
      stream.getVideoTracks()[0].onended = () => terminateSession();
      setScreenStream(stream);
      setSessionMode('screen');
    } catch (err) { 
      console.error("Screen share error", err); 
      alert("Failed to start screen share: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const terminateSession = () => {
    stopCamera();
    screenStream?.getTracks().forEach(track => track.stop());
    setScreenStream(null);
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaUrl(null);
    setSessionMode('idle');
    setIsMuted(false);
    setIsCameraOff(false);
    setIsTorchOn(false);
    setZoomLevel(1);
    setImageSettings({
      brightness: 100,
      contrast: 100,
      saturate: 100,
      hueRotate: 0,
      blur: 0
    });
    setChromaKey({
      active: false,
      bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
      similarity: 15,
      smoothness: 10,
      keyColor: '#00FF00'
    });
  };

  const toggleMute = () => {
    if (activeStream) activeStream.getAudioTracks().forEach(t => t.enabled = !t.enabled);
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    if (activeStream) activeStream.getVideoTracks().forEach(t => t.enabled = !t.enabled);
    setIsCameraOff(!isCameraOff);
  };

  const updateImageSettings = (newSettings: Partial<ImageSettings>) => {
    setImageSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleChromaKey = (active: boolean, bg?: string) => {
    setChromaKey(prev => ({ ...prev, active, bgImage: bg || prev.bgImage }));
  };

  const updateChromaKeySettings = (newSettings: Partial<ChromaKeySettings>) => {
    setChromaKey(prev => ({ ...prev, ...newSettings }));
  };

  const setZoom = async (level: number) => {
    setZoomLevel(level);
    const track = activeStream?.getVideoTracks()[0];
    if (track) {
      try { await track.applyConstraints({ advanced: [{ zoom: level }] } as any); } catch (e) { }
    }
  };

  const playMediaFile = (file: File) => {
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaUrl(URL.createObjectURL(file));
    setSessionMode('media');
  };

  return (
    <LiveSessionContext.Provider value={{
      sessionMode, activeStream, screenStream, mediaUrl, isMuted, isCameraOff, isTorchOn, 
      zoomLevel, imageSettings, chromaKey,
      startCamera, stopCamera, cycleCamera, toggleTorch, startScreenShare, playMediaFile, 
      terminateSession, toggleMute, toggleCamera, setZoom, updateImageSettings, toggleChromaKey,
      updateChromaKeySettings
    }}>
      {children}
    </LiveSessionContext.Provider>
  );
};

export const useLiveSession = () => {
  const context = useContext(LiveSessionContext);
  if (!context) throw new Error("useLiveSession must be used within a LiveSessionProvider");
  return context;
};
