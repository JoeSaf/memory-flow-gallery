
import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AmbientControlsProps {
  isAmbientMode: boolean;
  setIsAmbientMode: (enabled: boolean) => void;
}

export const AmbientControls = ({ isAmbientMode, setIsAmbientMode }: AmbientControlsProps) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const toggleAmbientMode = () => {
    setIsAmbientMode(!isAmbientMode);
    console.log('Ambient mode:', !isAmbientMode ? 'enabled' : 'disabled');
  };

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
    console.log('Ambient music:', !isMusicPlaying ? 'playing' : 'paused');
  };

  return (
    <div className="bg-warm-cream/60 backdrop-blur-sm rounded-2xl p-4 border border-foggy-blue/20 shadow-lg animate-gentle-fade flex-1">
      <h3 className="font-poppins font-medium text-charcoal mb-3 text-sm uppercase tracking-wide">
        Ambient Mode
      </h3>
      
      <div className="flex gap-2">
        <button
          onClick={toggleAmbientMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
            isAmbientMode
              ? 'bg-dusty-rose text-warm-cream shadow-md'
              : 'bg-foggy-blue/20 text-slate-gray hover:bg-dusty-rose/20'
          }`}
        >
          {isAmbientMode ? <Pause size={16} /> : <Play size={16} />}
          <span className="font-inter text-sm">
            {isAmbientMode ? 'Stop' : 'Start'}
          </span>
        </button>
        
        <button
          onClick={toggleMusic}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
            isMusicPlaying
              ? 'bg-dusty-rose text-warm-cream shadow-md'
              : 'bg-foggy-blue/20 text-slate-gray hover:bg-dusty-rose/20'
          }`}
        >
          {isMusicPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span className="font-inter text-sm">Music</span>
        </button>
      </div>

      {isAmbientMode && (
        <p className="text-xs text-slate-gray/80 mt-2 font-inter">
          Photos will cycle every 4 seconds
        </p>
      )}
    </div>
  );
};
