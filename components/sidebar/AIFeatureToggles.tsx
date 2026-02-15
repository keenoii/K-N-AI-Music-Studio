
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
  <SectionCard theme={theme} className="!p-5">
    <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
      <Settings2 size={14} /> ฟีเจอร์ AI อัจฉริยะ
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button onClick={() => setAutoTitle(!autoTitle)} className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${autoTitle ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400' : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-700'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${autoTitle ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-500'}`}><Sparkles size={14} /></div>
          <span className="text-xs font-bold uppercase tracking-wide">ตั้งชื่อเพลง</span>
        </div>
        {autoTitle && <Check size={16} />}
      </button>
      <button onClick={() => setAutoMelody(!autoMelody)} className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${autoMelody ? 'bg-violet-600/10 border-violet-500/50 text-violet-400' : 'bg-transparent border-gray-800 text-gray-500 hover:border-gray-700'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${autoMelody ? 'bg-violet-500 text-white' : 'bg-gray-800 text-gray-500'}`}><Music size={14} /></div>
          <span className="text-xs font-bold uppercase tracking-wide">ช่วยแต่งทำนอง</span>
        </div>
        {autoMelody && <Check size={16} />}
      </button>
    </div>
  </SectionCard>
);
