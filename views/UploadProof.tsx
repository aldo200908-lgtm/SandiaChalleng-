
import React, { useState, useRef } from 'react';
import { Camera, MapPin, CheckCircle2, UploadCloud, Database, Gift, Loader2 } from 'lucide-react';
import { Challenge } from '../types.ts';

interface UploadProofProps {
  challenge: Challenge | null;
  onSuccess: () => void;
  onReward: (challengeId: string) => void;
}

type UploadStep = 'idle' | 'uploading_image' | 'saving_data' | 'rewarding' | 'completed';

const UploadProof: React.FC<UploadProofProps> = ({ challenge, onSuccess, onReward }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [uploadStatus, setUploadStatus] = useState<UploadStep>('idle');
  const [progress, setProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateLocation = () => {
    // Simulate GPS validation
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        // Fallback for simulation
        setLocation({ lat: -14.33, lng: -69.46 });
      }
    );
  };

  const handleSubmit = async () => {
    if (!imagePreview || !challenge) return;
    
    try {
      setUploadStatus('uploading_image');
      setProgress(20);
      await new Promise(r => setTimeout(r, 800));
      
      setProgress(50);
      setUploadStatus('saving_data');
      await new Promise(r => setTimeout(r, 800));

      setProgress(80);
      setUploadStatus('rewarding');
      await new Promise(r => setTimeout(r, 800));

      setProgress(100);
      setUploadStatus('completed');
      
      setTimeout(() => {
        onReward(challenge.id);
        onSuccess();
      }, 1000);
    } catch (err: any) {
      setUploadStatus('idle');
      setProgress(0);
    }
  };

  if (!challenge) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-500 font-bold">Por favor selecciona un reto primero.</p>
        <button onClick={onSuccess} className="text-blue-600 font-bold">Ir a Retos</button>
      </div>
    );
  }

  if (uploadStatus !== 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-8 min-h-[60vh] animate-in fade-in zoom-in duration-500">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
          <div 
            className="absolute inset-0 border-4 border-blue-600 rounded-full transition-all duration-500" 
            style={{ 
              clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`,
              opacity: progress > 0 ? 1 : 0
            }}
          />
          {uploadStatus === 'uploading_image' && <UploadCloud size={40} className="text-blue-600 animate-bounce" />}
          {uploadStatus === 'saving_data' && <Database size={40} className="text-blue-600 animate-pulse" />}
          {uploadStatus === 'rewarding' && <Gift size={40} className="text-green-500 animate-bounce" />}
          {uploadStatus === 'completed' && <CheckCircle2 size={48} className="text-green-500" />}
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-slate-800">
            {uploadStatus === 'uploading_image' && "Subiendo prueba..."}
            {uploadStatus === 'saving_data' && "Validando reto..."}
            {uploadStatus === 'rewarding' && "Acreditando puntos..."}
            {uploadStatus === 'completed' && "¡Reto Completado!"}
          </h3>
          <p className="text-sm text-slate-400 font-medium px-4">
            {uploadStatus === 'uploading_image' && "Estamos procesando tu evidencia visual."}
            {uploadStatus === 'saving_data' && "Confirmando ubicación y autenticidad."}
            {uploadStatus === 'rewarding' && `Tus recompensas se están enviando a tu perfil.`}
            {uploadStatus === 'completed' && `¡Has ganado +${challenge.points_reward} puntos y +50 XP!`}
          </p>
        </div>

        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden max-w-xs shadow-inner">
          <div 
            className="h-full bg-blue-600 transition-all duration-500" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800 font-poppins">Validar Reto</h2>
        <p className="text-sm text-blue-600 font-bold uppercase tracking-wider">{challenge.title}</p>
      </div>
      
      {step === 1 ? (
        <div onClick={() => fileInputRef.current?.click()} className="aspect-square bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-100 transition-all group">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Camera size={40} />
          </div>
          <p className="font-bold text-slate-500">Toca para capturar prueba</p>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleImageUpload} />
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white relative">
            <img src={imagePreview!} className="w-full h-full object-cover" alt="Vista previa" />
            <button onClick={() => setStep(1)} className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold">CAMBIAR FOTO</button>
          </div>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            placeholder="Describe tu experiencia..."
            rows={3}
          />
          <button onClick={validateLocation} className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${location ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-100'}`}>
            <span className="flex items-center gap-2 font-bold text-xs"><MapPin size={18} className={location ? 'text-green-500' : ''}/> {location ? 'GPS Validado' : 'Validar Ubicación GPS'}</span>
            {!location && <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-lg">Obtener</span>}
          </button>
          <button 
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white font-bold py-5 rounded-3xl shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <CheckCircle2 size={20} /> Finalizar y Ganar +{challenge.points_reward} pts
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadProof;
