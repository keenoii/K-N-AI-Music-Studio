
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
    <SectionCard theme={theme}>
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-bold flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-500" /> เรื่องราว, พล็อต หรือหัวข้อเพลง
        </label>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={onClearClick} 
            title="ล้างเนื้อหาในช่องนี้"
            className={`p-1.5 rounded-lg transition-all border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-red-500 hover:bg-gray-200'}`}
          >
            <Trash2 size={16} />
          </button>
          
          <button 
            type="button"
            onClick={onResetClick} 
            title="รีเซ็ตค่าทั้งหมดกลับเป็นค่าเริ่มต้น"
            className={`p-1.5 rounded-lg transition-all border shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-indigo-400 hover:bg-gray-700' : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-indigo-600 hover:bg-gray-200'}`}
          >
            <RotateCcw size={16} />
          </button>

          <button type="button" onClick={toggleListening} className={`p-1.5 rounded-lg transition-all border ${isListening ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white' : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-indigo-600'}`}>
            {isListening ? <Mic size={16} /> : <MicOff size={16} />}
          </button>
          
          <button type="button" onClick={(e) => { e.preventDefault(); handleAutoConfigure(); }} disabled={isAutoConfiguring || !prompt.trim()} className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${isAutoConfiguring || !prompt.trim() ? 'opacity-50 cursor-not-allowed border-gray-700' : 'bg-indigo-500/10 border-indigo-500 text-indigo-400 hover:bg-indigo-500/20 shadow-md'}`}>
            {isAutoConfiguring ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} />} ตั้งค่า AI อัตโนมัติ
          </button>
        </div>
      </div>
      <div className="relative">
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className={`w-full h-32 p-5 text-sm rounded-2xl resize-none focus:ring-2 focus:ring-indigo-500 outline-none border transition-all ${theme === 'dark' ? 'bg-[#0a0a0a] border-gray-800 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'}`} placeholder={isListening ? "กำลังฟัง..." : "บรรยายไอเดียของคุณที่นี่..."} />
        {isListening && <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] text-red-400 font-bold uppercase tracking-widest animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> กำลังบันทึกเสียง</div>}
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><Search size={12} /> สไตล์อ้างอิง</label>
          <input type="text" value={references} onChange={(e) => setReferences(e.target.value)} className={`w-full p-3 text-sm rounded-xl border ${theme === 'dark' ? 'bg-[#0a0a0a] border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`} placeholder="เช่น ร็อคไทยยุค 90" /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><Disc size={12} className="text-indigo-500" /> แรงบันดาลใจ</label>
          <input type="text" value={inspirations} onChange={(e) => setInspirations(e.target.value)} className={`w-full p-3 text-sm rounded-xl border ${theme === 'dark' ? 'bg-[#0a0a0a] border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`} placeholder="เช่น เพลงของบอดี้สแลม" /></div>
        </div>
        <div className="space-y-4">
          <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><TypeIcon size={12} /> ชื่อเพลง</label>
          <input type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} className={`w-full p-3 text-sm rounded-xl border ${theme === 'dark' ? 'bg-[#0a0a0a] border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`} placeholder={autoTitle ? "AI จะตั้งให้โดยอัตโนมัติ..." : "ใส่ชื่อเพลงที่ต้องการ"} /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><History size={12} /> จังหวะเนื้อร้อง</label>
          <select value={poemType} onChange={(e) => setPoemType(e.target.value)} className={`w-full p-3 text-sm rounded-xl border ${theme === 'dark' ? 'bg-[#0a0a0a] border-gray-800 text-indigo-400' : 'bg-gray-50 border-gray-200 text-indigo-600'}`}>
            <option value="กลอน 4">กลอน 4 (มาตรฐาน)</option>
            <option value="กลอน 8">กลอน 8 (สุนทรภู่)</option>
            <option value="ฟรีสไตล์">ฟรีสไตล์ (สมัยใหม่)</option>
            <option value="English Verse">สไตล์สากล (English)</option>
          </select></div>
        </div>
      </div>
    </SectionCard>
  );
};
