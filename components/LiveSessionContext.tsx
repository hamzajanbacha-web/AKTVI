
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface ImageSettings {
  brightness: number;
  contrast: number;
  saturate: number;
  hueRotate: number;
  blur: number;
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
  chromaKey: { active: boolean; bgImage: string | null };
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

  const [chromaKey, setChromaKey] = useState<{ active: boolean; bgImage: string | null }>({
    active: false,
    bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'
  });

  const startCamera = async (deviceId?: string) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this environment");
      }
      
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: 1.777777778, 
          frameRate: { max: 30 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      const videoTrack = stream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities() as any;
      if (capabilities.zoom) {
        await videoTrack.applyConstraints({ advanced: [{ zoom: 1 }] } as any);
      }

      setActiveStream(stream);
      setSessionMode('camera');
      setIsCameraOff(false);
      if (deviceId) setCurrentDeviceId(deviceId);
    } catch (err) {
      console.error("Camera error", err);
      alert("Could not access camera. Please check permissions.");
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
      const nextDevice = videoDevices[nextIndex];

      stopCamera();
      await startCamera(nextDevice.deviceId);
    } catch (err) {
      console.error("Cycling error", err);
    }
  };

  const toggleTorch = async () => {
    const track = activeStream?.getVideoTracks()[0];
    if (!track) return;
    
    try {
      const constraints = { advanced: [{ torch: !isTorchOn }] } as any;
      await track.applyConstraints(constraints);
      setIsTorchOn(!isTorchOn);
    } catch (err) {
      console.warn("Torch not supported on this device/browser");
    }
  };

  const startScreenShare = async () => {
    try {
      // Robust check for getDisplayMedia availability
      if (!navigator.mediaDevices || !(navigator.mediaDevices as any).getDisplayMedia) {
        throw new Error("Screen sharing is not supported in this browser/environment (requires HTTPS).");
      }
      
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
      setScreenStream(stream);
      setSessionMode('screen');
    } catch (err: any) {
      console.error("Screen share error", err);
      alert(err.message || "Failed to start screen share.");
    }
  };

  const terminateSession = () => {
    stopCamera();
    screenStream?.getTracks().forEach(track => track.stop());
    setScreenStream(null);
    setMediaUrl(null);
    setSessionMode('idle');
  };

  const toggleMute = () => {
    if (activeStream) {
      activeStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    }
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    if (activeStream) {
      activeStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    }
    setIsCameraOff(!isCameraOff);
  };

  const updateImageSettings = (newSettings: Partial<ImageSettings>) => {
    setImageSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleChromaKey = (active: boolean, bg?: string) => {
    setChromaKey(prev => ({ active, bgImage: bg || prev.bgImage }));
  };

  const setZoom = async (level: number) => {
    setZoomLevel(level);
    const track = activeStream?.getVideoTracks()[0];
    if (track) {
      const capabilities = track.getCapabilities() as any;
      if (capabilities.zoom) {
        try {
          await track.applyConstraints({ advanced: [{ zoom: level }] } as any);
        } catch (e) {
          console.warn("Hardware zoom failed, falling back to UI zoom");
        }
      }
    }
  };

  const playMediaFile = (file: File) => {
    setMediaUrl(URL.createObjectURL(file));
    setSessionMode('media');
  };

  return (
    <LiveSessionContext.Provider value={{
      sessionMode, activeStream, screenStream, mediaUrl, isMuted, isCameraOff, isTorchOn, 
      zoomLevel, imageSettings, chromaKey,
      startCamera, stopCamera, cycleCamera, toggleTorch, startScreenShare, playMediaFile, 
      terminateSession, toggleMute, toggleCamera, setZoom, updateImageSettings, toggleChromaKey
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
