
import React from 'react';
import { Globe, Clock } from 'lucide-react';
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
}

export const TechnicalSettings: React.FC<TechnicalSettingsProps> = (props) => {
  const { theme, language, setLanguage, languageOptions, vocalType, setVocalType, bpm, setBpm, duration, setDuration, keyName, setKeyName } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard theme={theme} className="!p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Globe size={14} /> ภาษาของเพลง</h3>
        <div className="grid grid-cols-2 gap-2">
          {languageOptions.map(lang => (
            <button key={lang.value} onClick={() => setLanguage(lang.value)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${language === lang.value ? 'bg-indigo-600 text-white' : theme === 'dark' ? 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{lang.label}</button>
          ))}
        </div>
      </SectionCard>
      <SectionCard theme={theme} className="!p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">ประเภทเสียงร้อง</h3>
        <select value={vocalType} onChange={(e) => setVocalType(e.target.value)} className={`w-full p-2.5 rounded-xl text-sm font-semibold border ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-700 text-indigo-400' : 'bg-gray-50 border-gray-200 text-indigo-600'}`}>
          {['ชาย', 'หญิง', 'เด็กชาย', 'เด็กหญิง', 'Duet (คู่)', 'Choir (ประสานเสียง)'].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </SectionCard>
      <SectionCard theme={theme} className="!p-5">
        <div className="flex justify-between items-center mb-4"><h3 className="text-xs font-bold text-gray-500 uppercase">ความเร็ว (BPM)</h3><span className="text-xs font-bold text-indigo-500 uppercase">{bpm} BPM</span></div>
        <input type="range" min="40" max="200" value={bpm} onChange={(e) => setBpm(parseInt(e.target.value))} className="w-full accent-indigo-500" />
      </SectionCard>
      <SectionCard theme={theme} className="!p-5">
        <div className="flex justify-between items-center mb-4"><h3 className="text-xs font-bold text-gray-500 uppercase">ความยาวเพลง</h3><span className="text-xs font-bold text-indigo-500 uppercase">{Math.floor(duration)}:{Math.round((duration % 1) * 60).toString().padStart(2, '0')} นาที</span></div>
        <div className="flex items-center gap-3"><Clock size={16} className="text-gray-500" /><input type="range" min="1" max="5" step="0.5" value={duration} onChange={(e) => setDuration(parseFloat(e.target.value))} className="w-full accent-indigo-500" /></div>
      </SectionCard>
      <SectionCard theme={theme} className="!p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">คีย์เพลง (Key)</h3>
        <select value={keyName} onChange={(e) => setKeyName(e.target.value)} className={`w-full p-2.5 rounded-xl text-sm font-semibold border ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-700 text-indigo-400' : 'bg-gray-50 border-gray-200 text-indigo-600'}`}>
          {['C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'Eb', 'E', 'Em', 'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'Ab', 'A', 'Am', 'Bb', 'B', 'Bm'].map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </SectionCard>
    </div>
  );
};
