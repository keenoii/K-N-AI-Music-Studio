
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mic, MicOff, Loader2, Wand2, Search, Disc, Type as TypeIcon, History, Trash2, RotateCcw } from 'lucide-react';
import { SectionCard } from '../SharedUI';

interface StorySectionProps {
  theme: 'dark' | 'light';
  prompt: string;
  setPrompt: (v: string) => void;
  references: string;
  setReferences: (v: string) => void;
  inspirations: string;
  setInspirations: (v: string) => void;
  songTitle: string;
  setSongTitle: (v: string) => void;
  poemType: string;
  setPoemType: (v: string) => void;
  language: string;
  autoTitle: boolean;
  isAutoConfiguring: boolean;
  handleAutoConfigure: () => void;
  handleResetAll: () => void;
  handleClearPrompt: () => void;
}

export const StorySection: React.FC<StorySectionProps> = (props) => {
  const { theme, prompt, setPrompt, references, setReferences, inspirations, setInspirations, songTitle, setSongTitle, poemType, setPoemType, language, autoTitle, isAutoConfiguring, handleAutoConfigure, handleResetAll, handleClearPrompt } = props;
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      const langMap: Record<string, string> = { 
        'ไทย': 'th-TH', 
        'อังกฤษ': 'en-US', 
        'จีน': 'zh-CN', 
        'ญี่ปุ่น': 'ja-JP',
        'เกาหลี': 'ko-KR',
        'อีสาน': 'th-TH' 
      };
      
      recognitionRef.current.lang = langMap[language] || 'th-TH';
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
        }
        if (finalTranscript) setPrompt(prompt + (prompt ? ' ' : '') + finalTranscript);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    return () => recognitionRef.current?.stop();
  }, [language, prompt, setPrompt]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); }
    else { try { recognitionRef.current?.start(); setIsListening(true); } catch (e) { console.error(e); } }
  };

  const onClearClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleClearPrompt();
  };

  const onResetClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleResetAll();
  };

  return (
    <SectionCard theme={theme} className="!p-5 sm:!p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <label className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-indigo-400">
          <Sparkles size={14} className="animate-pulse" /> STORY SEED & DIRECTION
        </label>
        <div className="flex flex-wrap gap-2">
          <button 
            type="button"
            onClick={onClearClick} 
            title="ล้างเนื้อหาในช่องนี้"
            className={`p-2 rounded-xl transition-all border shadow-sm flex items-center justify-center ${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-850/80 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30' 
                : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-rose-500 hover:bg-rose-100'
            }`}
          >
            <Trash2 size={14} />
          </button>
          
          <button 
            type="button"
            onClick={onResetClick} 
            title="รีเซ็ตค่าทั้งหมดกลับเป็นค่าเริ่มต้น"
            className={`p-2 rounded-xl transition-all border shadow-sm flex items-center justify-center ${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-850/80 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/30' 
                : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            <RotateCcw size={14} />
          </button>

          <button 
            type="button" 
            onClick={toggleListening} 
            className={`p-2 rounded-xl transition-all border flex items-center justify-center ${
              isListening 
                ? 'bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse shadow-lg shadow-rose-500/20' 
                : theme === 'dark' 
                  ? 'bg-gray-900 border-gray-850/80 text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            {isListening ? <Mic size={14} /> : <MicOff size={14} />}
          </button>
          
          <button 
            type="button" 
            onClick={(e) => { e.preventDefault(); handleAutoConfigure(); }} 
            disabled={isAutoConfiguring || !prompt.trim()} 
            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border transition-all duration-300 ${
              isAutoConfiguring || !prompt.trim() 
                ? 'opacity-40 cursor-not-allowed border-gray-800 text-gray-500' 
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/60 shadow-lg shadow-indigo-500/5'
            }`}
          >
            {isAutoConfiguring ? <Loader2 className="animate-spin" size={12} /> : <Wand2 size={12} />} 
            ตั้งค่า AI อัตโนมัติ
          </button>
        </div>
      </div>
      <div className="relative">
        <textarea 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          className={`w-full h-32 p-4 text-xs font-medium leading-relaxed rounded-2xl resize-none focus:ring-1 focus:ring-indigo-500/50 outline-none border transition-all ${
            theme === 'dark' 
              ? 'bg-[#060608]/90 border-gray-900/60 text-gray-250 focus:border-indigo-500/40 focus:bg-[#07070a]' 
              : 'bg-gray-50/50 border-gray-200 text-gray-800 focus:border-indigo-500 focus:bg-white'
          }`} 
          placeholder={isListening ? "กำลังฟัง..." : "บรรยายไอเดีย คอนเซปต์ หรือเรื่องราวพล็อตเพลงของคุณตรงนี้..."} 
        />
        {isListening && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[9px] text-rose-500 font-bold uppercase tracking-widest animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            กำลังบันทึกเสียง
          </div>
        )}
      </div>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase mb-1.5 flex items-center gap-2 tracking-wider">
              <Search size={11} className="text-gray-400" /> สไตล์อ้างอิง (References)
            </label>
            <input 
              type="text" 
              value={references} 
              onChange={(e) => setReferences(e.target.value)} 
              className={`w-full p-2.5 text-xs font-semibold rounded-xl border outline-none transition-all ${
                theme === 'dark' 
                  ? 'bg-[#060608]/90 border-gray-900/60 text-gray-300 focus:border-indigo-500/40 focus:bg-[#07070a]' 
                  : 'bg-gray-50/50 border-gray-200 text-gray-700 focus:border-indigo-500 focus:bg-white'
              }`} 
              placeholder="เช่น Modern Rock, Synth-Pop" 
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase mb-1.5 flex items-center gap-2 tracking-wider">
              <Disc size={11} className="text-gray-400" /> แรงบันดาลใจ (Inspirations)
            </label>
            <input 
              type="text" 
              value={inspirations} 
              onChange={(e) => setInspirations(e.target.value)} 
              className={`w-full p-2.5 text-xs font-semibold rounded-xl border outline-none transition-all ${
                theme === 'dark' 
                  ? 'bg-[#060608]/90 border-gray-900/60 text-gray-300 focus:border-indigo-500/40 focus:bg-[#07070a]' 
                  : 'bg-gray-50/50 border-gray-200 text-gray-700 focus:border-indigo-500 focus:bg-white'
              }`} 
              placeholder="เช่น Jeff Satur, Three Man Down" 
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase mb-1.5 flex items-center gap-2 tracking-wider">
              <TypeIcon size={11} className="text-gray-400" /> ชื่อเพลง (Song Title)
            </label>
            <input 
              type="text" 
              value={songTitle} 
              onChange={(e) => setSongTitle(e.target.value)} 
              className={`w-full p-2.5 text-xs font-semibold rounded-xl border outline-none transition-all ${
                theme === 'dark' 
                  ? 'bg-[#060608]/90 border-gray-900/60 text-gray-300 focus:border-indigo-500/40 focus:bg-[#07070a]' 
                  : 'bg-gray-50/50 border-gray-200 text-gray-700 focus:border-indigo-500 focus:bg-white'
              }`} 
              placeholder={autoTitle ? "AI จะตั้งให้โดยอัตโนมัติ..." : "ใส่ชื่อเพลงที่ต้องการ"} 
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase mb-1.5 flex items-center gap-2 tracking-wider">
              <History size={11} className="text-gray-400" /> จังหวะเนื้อร้อง (Lyric Rhythm / Poem)
            </label>
            <select 
              value={poemType} 
              onChange={(e) => setPoemType(e.target.value)} 
              className={`w-full p-2.5 text-xs font-bold rounded-xl border outline-none transition-all cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-[#060608]/90 border-gray-900/60 text-indigo-400 focus:border-indigo-500/40 focus:bg-[#07070a]' 
                  : 'bg-gray-50/50 border-gray-200 text-indigo-650 focus:border-indigo-500 focus:bg-white'
              }`}
            >
              <option value="กลอน 4">กลอน 4 (มาตรฐาน)</option>
              <option value="กลอน 8">กลอน 8 (สุนทรภู่)</option>
              <option value="ฟรีสไตล์">ฟรีสไตล์ (สมัยใหม่)</option>
              <option value="English Verse">สไตล์สากล (English)</option>
            </select>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};
