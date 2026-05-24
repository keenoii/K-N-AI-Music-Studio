
import React from 'react';
import { Settings2, Sparkles, Music, Check } from 'lucide-react';
import { SectionCard } from '../SharedUI';

interface AIFeatureTogglesProps {
  theme: 'dark' | 'light';
  autoTitle: boolean;
  setAutoTitle: (v: boolean) => void;
  autoMelody: boolean;
  setAutoMelody: (v: boolean) => void;
}

export const AIFeatureToggles: React.FC<AIFeatureTogglesProps> = ({ theme, autoTitle, setAutoTitle, autoMelody, setAutoMelody }) => (
  <SectionCard theme={theme} className="!p-5 border-indigo-500/5">
    <h3 className="text-xs font-black text-gray-500 uppercase mb-4 flex items-center gap-2 tracking-widest">
      <Settings2 size={13} className="text-gray-400" /> INTELLIGENT COMPOSER FEATURES
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      <button 
        type="button"
        onClick={() => setAutoTitle(!autoTitle)} 
        className={`flex items-center justify-between px-4.5 py-4 rounded-2xl border transition-all duration-300 ${
          autoTitle 
            ? 'bg-indigo-950/15 border-indigo-500/40 text-indigo-300 shadow-md shadow-indigo-500/5' 
            : theme === 'dark' 
              ? 'bg-[#060608] border-gray-900 text-gray-500 hover:border-gray-800 hover:text-gray-400' 
              : 'bg-gray-50/50 border-gray-150 text-gray-400 hover:border-gray-300 hover:text-gray-650'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-colors duration-300 ${autoTitle ? 'bg-indigo-600/20 text-indigo-400' : 'bg-gray-900/60 text-gray-600'}`}>
            <Sparkles size={13} />
          </div>
          <span className="text-xs font-black uppercase tracking-wider">AUTO SONG TITLE</span>
        </div>
        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${autoTitle ? 'bg-indigo-500 text-white scale-110' : 'bg-gray-900/20 border border-gray-700/30'}`}>
          {autoTitle && <Check size={10} strokeWidth={3} />}
        </div>
      </button>

      <button 
        type="button"
        onClick={() => setAutoMelody(!autoMelody)} 
        className={`flex items-center justify-between px-4.5 py-4 rounded-2xl border transition-all duration-300 ${
          autoMelody 
            ? 'bg-violet-950/15 border-violet-500/40 text-violet-300 shadow-md shadow-violet-500/5' 
            : theme === 'dark' 
              ? 'bg-[#060608] border-gray-900 text-gray-500 hover:border-gray-800 hover:text-gray-400' 
              : 'bg-gray-50/50 border-gray-150 text-gray-400 hover:border-gray-300 hover:text-gray-650'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-colors duration-300 ${autoMelody ? 'bg-violet-600/20 text-violet-400' : 'bg-gray-900/60 text-gray-600'}`}>
            <Music size={13} />
          </div>
          <span className="text-xs font-black uppercase tracking-wider">CHORDS & MELODY GUIDE</span>
        </div>
        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${autoMelody ? 'bg-violet-500 text-white scale-110' : 'bg-gray-900/20 border border-gray-700/30'}`}>
          {autoMelody && <Check size={10} strokeWidth={3} />}
        </div>
      </button>
    </div>
  </SectionCard>
);
