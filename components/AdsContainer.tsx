
import React, { useEffect, useRef } from 'react';
import { ENABLE_ADS } from '../constants.tsx';
import { initAdsterraBanner } from '../lib/adUtils.ts';

interface AdsContainerProps {
  zoneId?: string;
  type?: 'banner' | 'square' | 'native';
  className?: string;
}

const AdsContainer: React.FC<AdsContainerProps> = ({ zoneId, type = 'banner', className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalId = React.useId().replace(/:/g, '');

  useEffect(() => {
    if (!ENABLE_ADS || !zoneId || !containerRef.current) return;

    // Aquí se dispara la carga del anuncio cuando el componente se monta
    try {
      // Si usas Adsterra con atOptions:
      initAdsterraBanner(zoneId, `ad-slot-${internalId}`);
    } catch (err) {
      console.warn("Publicidad bloqueada o error en script externo", err);
    }
  }, [zoneId]);

  if (!ENABLE_ADS) return null;

  // Alturas mínimas para evitar Layout Shift (CLS)
  const styles = {
    banner: 'min-h-[60px]',
    square: 'min-h-[250px]',
    native: 'min-h-[120px]'
  };

  return (
    <div className={`w-full flex flex-col items-center justify-center py-4 ${className}`}>
      <div 
        id={`ad-slot-${internalId}`}
        ref={containerRef}
        className={`w-full max-w-sm rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden transition-all ${styles[type]}`}
      >
        {/* Marcador visual de carga/espacio */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-30">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Publicidad Patrocinada</span>
        </div>
      </div>
      <p className="text-[8px] text-slate-300 font-bold mt-1 uppercase tracking-widest">Anuncio</p>
    </div>
  );
};

export default AdsContainer;
