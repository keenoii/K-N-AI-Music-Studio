
import React from 'react';
import { ImageIcon, Maximize2, Palette, Loader2, Sparkles } from 'lucide-react';
import { SectionCard } from '../SharedUI';

interface CoverStudioProps {
  theme: 'dark' | 'light';
  imageAspectRatio: "1:1" | "16:9" | "9:16";
  setImageAspectRatio: (r: "1:1" | "16:9" | "9:16") => void;
  imageStyle: string;
  setImageStyle: (s: string) => void;
  imageStyles: string[];
  isGeneratingImage: boolean;
  isApiConnected: boolean;
  handleGenerateImage: () => void;
  prompt: string;
}

export const CoverStudio: React.FC<CoverStudioProps> = (props) => {
  const { theme, imageAspectRatio, setImageAspectRatio, imageStyle, setImageStyle, imageStyles, isGeneratingImage, isApiConnected, handleGenerateImage, prompt } = props;
  return (
    <SectionCard theme={theme}>
      <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest mb-4">
        <ImageIcon size={16} className="text-indigo-500" /> ออกแบบหน้าปก (Cover Designer)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><Maximize2 size={12} /> อัตราส่วนภาพ</label>
          <div className="grid grid-cols-3 gap-2">
            {(["1:1", "16:9", "9:16"] as const).map(ratio => (
              <button key={ratio} onClick={() => setImageAspectRatio(ratio)} className={`py-2 rounded-xl text-xs font-bold border transition-all ${imageAspectRatio === ratio ? 'bg-indigo-600 border-indigo-500 text-white' : theme === 'dark' ? 'bg-[#1a1a1a] border-gray-700 text-gray-500' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>{ratio}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><Palette size={12} /> สไตล์ภาพ</label>
          <select value={imageStyle} onChange={(e) => setImageStyle(e.target.value)} className={`w-full p-2.5 rounded-xl text-xs font-bold border ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-700 text-indigo-400' : 'bg-gray-50 border-gray-200 text-indigo-600'}`}>
            {imageStyles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <button onClick={handleGenerateImage} disabled={isGeneratingImage || !prompt.trim() || !isApiConnected} className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all border ${isGeneratingImage || !prompt.trim() || !isApiConnected ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed grayscale' : 'bg-indigo-500/10 border-indigo-500 text-indigo-400 hover:bg-indigo-500/20'}`}>
        {isGeneratingImage ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />} {isGeneratingImage ? 'กำลังออกแบบหน้าปก...' : 'สร้างภาพหน้าปก'}
      </button>
    </SectionCard>
  );
};
