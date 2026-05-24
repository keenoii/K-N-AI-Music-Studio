
import React from 'react';
import { Globe, Clock, Sliders, Music, Volume2, AlignLeft } from 'lucide-react';
import { SectionCard } from '../SharedUI';

interface TechnicalSettingsProps {
  theme: 'dark' | 'light';
  language: string;
  setLanguage: (v: string) => void;
  languageOptions: { value: string; label: string }[];
  vocalType: string;
  setVocalType: (v: string) => void;
  bpm: number;
  setBpm: (v: number) => void;
  duration: number;
  setDuration: (v: number) => void;
  keyName: string;
  setKeyName: (v: string) => void;
  linesPerSection: number;
  setLinesPerSection: (v: number) => void;
}

export const TechnicalSettings: React.FC<TechnicalSettingsProps> = (props) => {
  const { theme, language, setLanguage, languageOptions, vocalType, setVocalType, bpm, setBpm, duration, setDuration, keyName, setKeyName, linesPerSection, setLinesPerSection } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard theme={theme} className="!p-5 border-indigo-500/5">
        <h3 className="text-[10px] font-black text-gray-500 uppercase mb-3.5 flex items-center gap-1.5 tracking-wider"><Globe size={12} className="text-indigo-400" /> SONG LANGUAGE</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {languageOptions.map(lang => {
            const isActive = language === lang.value;
            return (
              <button 
                key={lang.value} 
                type="button"
                onClick={() => setLanguage(lang.value)} 
                className={`px-2.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : theme === 'dark' 
                      ? 'bg-[#060608] border border-gray-901 text-gray-500 hover:border-gray-800 hover:text-gray-300' 
                      : 'bg-gray-50 border border-gray-150 text-gray-650 hover:bg-gray-100'
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard theme={theme} className="!p-5 border-indigo-500/5">
        <h3 className="text-[10px] font-black text-gray-500 uppercase mb-3.5 flex items-center gap-1.5 tracking-wider"><Volume2 size={12} className="text-indigo-400" /> VOCAL CHARACTER</h3>
        <select 
          value={vocalType} 
          onChange={(e) => setVocalType(e.target.value)} 
          className={`w-full p-3 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-all ${
            theme === 'dark' 
              ? 'bg-[#060608] border-gray-900 text-indigo-400 focus:border-indigo-500/30' 
              : 'bg-gray-50 border-gray-150 text-indigo-650 focus:border-indigo-500'
          }`}
        >
          {['ชาย', 'หญิง', 'เด็กชาย', 'เด็กหญิง', 'Duet (คู่)', 'Choir (ประสานเสียง)'].map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </SectionCard>

      <SectionCard theme={theme} className="!p-5 border-indigo-500/5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-1.5 tracking-wider"><Sliders size={12} className="text-indigo-400" /> TEMPO</h3>
          <span className="text-[10px] font-mono font-black text-indigo-400">{bpm} BPM</span>
        </div>
        <input 
          type="range" 
          min="40" 
          max="200" 
          value={bpm} 
          onChange={(e) => setBpm(parseInt(e.target.value))} 
          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-gray-250/20 rounded-lg appearance-none" 
        />
        <div className="flex justify-between text-[8px] font-bold text-gray-650 mt-1 uppercase tracking-wider"><span>Slow</span><span>Fast</span></div>
      </SectionCard>

      <SectionCard theme={theme} className="!p-5 border-indigo-500/5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-1.5 tracking-wider"><Clock size={12} className="text-indigo-400" /> TARGET LENGTH</h3>
          <span className="text-[10px] font-mono font-black text-indigo-400">{Math.floor(duration)}:{Math.round((duration % 1) * 60).toString().padStart(2, '0')} MIN</span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="5" 
          step="0.5" 
          value={duration} 
          onChange={(e) => setDuration(parseFloat(e.target.value))} 
          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-gray-250/20 rounded-lg appearance-none" 
        />
        <div className="flex justify-between text-[8px] font-bold text-gray-650 mt-1 uppercase tracking-wider"><span>1m</span><span>5m</span></div>
      </SectionCard>

      <SectionCard theme={theme} className="!p-5 border-indigo-500/5">
        <h3 className="text-[10px] font-black text-gray-500 uppercase mb-3.5 flex items-center gap-1.5 tracking-wider"><Music size={12} className="text-indigo-400" /> TONIC HARMONY (KEY)</h3>
        <select 
          value={keyName} 
          onChange={(e) => setKeyName(e.target.value)} 
          className={`w-full p-3 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-all ${
            theme === 'dark' 
              ? 'bg-[#060608] border-gray-900 text-indigo-400 focus:border-indigo-500/30' 
              : 'bg-gray-50 border-gray-150 text-indigo-650 focus:border-indigo-500'
          }`}
        >
          {['C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'Eb', 'E', 'Em', 'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'Ab', 'A', 'Am', 'Bb', 'B', 'Bm'].map(k => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </SectionCard>

      <SectionCard theme={theme} className="!p-5 border-indigo-500/5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-1.5 tracking-wider"><AlignLeft size={12} className="text-indigo-400" /> LINES PER SECTION</h3>
          <span className="text-[10px] font-mono font-black text-indigo-400">{linesPerSection} LINES</span>
        </div>
        <input 
          type="range" 
          min="2" 
          max="12" 
          step="1" 
          value={linesPerSection} 
          onChange={(e) => setLinesPerSection(parseInt(e.target.value))} 
          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-gray-250/20 rounded-lg appearance-none" 
        />
        <div className="flex justify-between text-[8px] font-bold text-gray-650 mt-1 uppercase tracking-wider"><span>Short</span><span>Long</span></div>
      </SectionCard>
    </div>
  );
};
