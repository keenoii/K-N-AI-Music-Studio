
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
  
  const getAspectRatioVisual = (ratio: "1:1" | "16:9" | "9:16") => {
    if (ratio === '1:1') return <div className="w-3.5 h-3.5 border-2 border-current rounded-sm mx-auto mb-1" />;
    if (ratio === '16:9') return <div className="w-5 h-3 border-2 border-current rounded-sm mx-auto mb-1.5" />;
    return <div className="w-3 h-5 border-2 border-current rounded-sm mx-auto mb-0.5" />;
  };

  return (
    <SectionCard theme={theme} className="!p-5 sm:!p-6">
      <h3 className="text-xs font-black flex items-center gap-2 uppercase tracking-widest mb-5 text-indigo-400">
        <ImageIcon size={14} className="text-indigo-400" /> ARTWORK & COVER DESIGNER
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="text-[10px] font-black text-gray-500 uppercase mb-2 flex items-center gap-1.5 tracking-wider">
            <Maximize2 size={11} className="text-gray-400" /> ASPECT Ratios
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["1:1", "16:9", "9:16"] as const).map(ratio => {
              const isActive = imageAspectRatio === ratio;
              return (
                <button 
                  key={ratio} 
                  type="button"
                  onClick={() => setImageAspectRatio(ratio)} 
                  className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all duration-300 flex flex-col items-center justify-center ${
                    isActive 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/10' 
                      : theme === 'dark' 
                        ? 'bg-[#060608] border-gray-901 text-gray-500 hover:border-gray-800 hover:text-gray-400' 
                        : 'bg-gray-50 border-gray-200 text-gray-650 hover:bg-gray-100'
                  }`}
                >
                  {getAspectRatioVisual(ratio)}
                  <span>{ratio}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-500 uppercase mb-2 flex items-center gap-1.5 tracking-wider">
            <Palette size={11} className="text-gray-400" /> VISUAL STYLES
          </label>
          <select 
            value={imageStyle} 
            onChange={(e) => setImageStyle(e.target.value)} 
            className={`w-full p-3 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-all ${
              theme === 'dark' 
                ? 'bg-[#060608] border-gray-900 text-indigo-400 focus:border-indigo-500/30' 
                : 'bg-gray-50 border-gray-150 text-indigo-650 focus:border-indigo-500'
            }`}
          >
            {imageStyles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      
      <button 
        type="button"
        onClick={handleGenerateImage} 
        disabled={isGeneratingImage || !prompt.trim() || !isApiConnected} 
        className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-300 border ${
          isGeneratingImage || !prompt.trim() || !isApiConnected 
            ? 'bg-[#08080a] border-gray-900 text-gray-500 cursor-not-allowed grayscale' 
            : 'bg-indigo-500/10 border-indigo-500/35 text-indigo-300 hover:bg-indigo-500/20'
        }`}
      >
        {isGeneratingImage ? (
          <><Loader2 className="animate-spin text-indigo-400" size={14} /><span>GENERATING DESIGNS...</span></>
        ) : (
          <><Sparkles size={14} className="text-indigo-400 animate-pulse" /><span>CREATE ALBUM ARTWORK</span></>
        )}
      </button>
    </SectionCard>
  );
};
