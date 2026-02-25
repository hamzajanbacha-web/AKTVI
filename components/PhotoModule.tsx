
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Save, Trash2, User as UserIcon, CheckCircle2, Edit3 } from 'lucide-react';

interface PhotoModuleProps {
  onPhotoSaved: (photoDataUrl: string) => void;
  initialPhoto?: string;
}

const PhotoModule: React.FC<PhotoModuleProps> = ({ onPhotoSaved, initialPhoto }) => {
  const [photo, setPhoto] = useState<string | null>(initialPhoto || null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isSaved, setIsSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Sync with initial photo if provided externally
  useEffect(() => {
    if (initialPhoto && initialPhoto !== photo) {
      setPhoto(initialPhoto);
      setIsSaved(true);
    } else if (!initialPhoto && photo) {
      // Clear internal state if form is reset from parent
      setPhoto(null);
      setIsSaved(false);
      setShowSuccess(false);
      setBrightness(100);
      setContrast(100);
    }
  }, [initialPhoto]);

  // Auto-hide success indicator
  useEffect(() => {
    let timer: number;
    if (showSuccess) {
      timer = window.setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
        setIsSaved(false);
        setShowSuccess(false);
        // Reset inputs so the same file can be picked again if deleted
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const savePhoto = () => {
    if (!photo || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Passport size ratio (3.5 : 4.5)
      canvas.width = 700;
      canvas.height = 900;
      
      if (context) {
        // Apply filters directly to the canvas context
        context.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth, drawHeight, startX, startY;

        if (imgRatio > canvasRatio) {
          drawHeight = canvas.height;
          drawWidth = img.width * (canvas.height / img.height);
          startX = (canvas.width - drawWidth) / 2;
          startY = 0;
        } else {
          drawWidth = canvas.width;
          drawHeight = img.height * (canvas.width / img.width);
          startX = 0;
          startY = (canvas.height - drawHeight) / 2;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, startX, startY, drawWidth, drawHeight);
        
        try {
          const finalDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onPhotoSaved(finalDataUrl);
          setIsSaved(true);
          setShowSuccess(true); // Trigger the transient visual feedback
        } catch (err) {
          console.error("Canvas export failed", err);
          alert("Failed to process photo. Please try a different image.");
        }
      }
    };
    img.src = photo;
  };

  const clearPhoto = () => {
    setPhoto(null);
    setBrightness(100);
    setContrast(100);
    setIsSaved(false);
    setShowSuccess(false);
    onPhotoSaved(''); // Clear parent state
  };

  return (
    <div className={`flex flex-col items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-500 ${isSaved ? 'bg-teal-50/50 border-teal-200 shadow-sm' : 'bg-gray-50 border-dashed border-gray-200'}`}>
      
      {/* Identity Card Style Preview Box */}
      <div className="relative w-[140px] h-[180px] bg-white rounded-lg overflow-hidden shadow-lg ring-1 ring-black/5 flex items-center justify-center">
        {photo && photo !== "" ? (
          <>
            <img 
              src={photo} 
              alt="Preview" 
              className="absolute inset-0 w-full h-full object-cover transition-all"
              style={{ filter: isSaved && !showSuccess ? 'none' : `brightness(${brightness}%) contrast(${contrast}%)` }} 
            />
            {showSuccess && (
              <div className="absolute inset-0 bg-teal-900/20 backdrop-blur-[1px] flex items-center justify-center animate-fadeIn">
                <div className="bg-white/90 p-2 rounded-full shadow-xl scale-110 transition-transform">
                  <CheckCircle2 className="w-8 h-8 text-teal-600" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-4">
             <UserIcon className="w-12 h-12 mx-auto text-gray-200 mb-3" />
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Student Photo</p>
          </div>
        )}
      </div>

      {/* Transient Badge */}
      <div className={`flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${showSuccess ? 'opacity-100 translate-y-0 animate-bounce' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
        <CheckCircle2 className="w-3 h-3" />
        Photo Applied
      </div>

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Native Inputs */}
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
      <input type="file" ref={cameraInputRef} onChange={handleFileUpload} accept="image/*" capture="user" className="hidden" />

      <div className="flex flex-col w-full gap-3">
        {!photo ? (
          <div className="grid grid-cols-2 gap-3 w-full">
            <button 
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 shadow-lg transition-all active:scale-95"
            >
              <Camera className="w-4 h-4" /> Camera
            </button>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-700 transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" /> Gallery
            </button>
          </div>
        ) : isSaved ? (
          <div className="flex gap-2 w-full">
            <button 
              type="button"
              onClick={() => {
                setIsSaved(false);
                setShowSuccess(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-teal-200 text-teal-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-50 transition-all"
            >
              <Edit3 className="w-4 h-4" /> Adjust Photo
            </button>
            <button 
              type="button"
              onClick={clearPhoto}
              className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-inner">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Light</label>
                  <span className="text-[9px] font-bold text-teal-600">{brightness}%</span>
                </div>
                <input 
                  type="range" min="60" max="140" value={brightness} 
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Contrast</label>
                  <span className="text-[9px] font-bold text-teal-600">{contrast}%</span>
                </div>
                <input 
                  type="range" min="60" max="140" value={contrast} 
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={savePhoto}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 shadow-xl transition-all active:scale-95"
              >
                <Save className="w-4 h-4" /> Apply & Save Photo
              </button>
              <button 
                type="button"
                onClick={clearPhoto}
                className="p-4 bg-gray-100 text-gray-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoModule;
