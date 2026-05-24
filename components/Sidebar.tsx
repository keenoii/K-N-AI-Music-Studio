
import React, { useState } from 'react';
import { Loader2, Sparkles, AlertCircle, Headphones, Sliders, Image as ImageIcon, Cpu } from 'lucide-react';
import { ModelSelector } from './sidebar/ModelSelector';
import { StorySection } from './sidebar/StorySection';
import { AIFeatureToggles } from './sidebar/AIFeatureToggles';
import { CoverStudio } from './sidebar/CoverStudio';
import { TechnicalSettings } from './sidebar/TechnicalSettings';
import { GenrePicker } from './sidebar/GenrePicker';

interface SidebarProps {
  theme: 'dark' | 'light';
  prompt: string;
  setPrompt: (v: string) => void;
  references: string;
  setReferences: (v: string) => void;
  inspirations: string;
  setInspirations: (v: string) => void;
  songTitle: string;
  setSongTitle: (v: string) => void;
  bpm: number;
  setBpm: (v: number) => void;
  keyName: string;
  setKeyName: (v: string) => void;
  duration: number;
  setDuration: (v: number) => void;
  linesPerSection: number;
  setLinesPerSection: (v: number) => void;
  vocalType: string;
  setVocalType: (v: string) => void;
  poemType: string;
  setPoemType: (v: string) => void;
  language: string;
  setLanguage: (v: string) => void;
  autoTitle: boolean;
  setAutoTitle: (v: boolean) => void;
  autoMelody: boolean;
  setAutoMelody: (v: boolean) => void;
  selectedGenres: string[];
  toggleGenre: (g: string) => void;
  genres: string[];
  imageAspectRatio: "1:1" | "16:9" | "9:16";
  setImageAspectRatio: (r: "1:1" | "16:9" | "9:16") => void;
  imageStyle: string;
  setImageStyle: (s: string) => void;
  imageStyles: string[];
  languageOptions: { value: string; label: string }[];
  isAutoConfiguring: boolean;
  isGenerating: boolean;
  isGeneratingImage: boolean;
  isApiConnected: boolean;
  handleAutoConfigure: () => void;
  handleGenerate: () => void;
  handleGenerateImage: () => void;
  handleConnectApi: () => void;
  error: string | null;
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  modelOptions: { value: string; label: string; description: string }[];
  handleResetAll: () => void;
  handleClearPrompt: () => void;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { isGenerating, prompt, isApiConnected, handleGenerate, handleConnectApi, error, theme } = props;
  const [activeTab, setActiveTab] = useState<'creative' | 'studio' | 'artwork'>('creative');

  return (
    <div className="space-y-6">
      {/* Pinned Model Selector at top */}
      <ModelSelector {...props} />

      {/* Modern High-End Tab Switcher */}
      <div className={`p-1.5 rounded-2xl flex gap-1 ${
        theme === 'dark' ? 'bg-[#060608] border border-gray-900/60' : 'bg-gray-100/80 border border-gray-200/50'
      }`}>
        <button
          type="button"
          onClick={() => setActiveTab('creative')}
          className={`flex-1 py-3 px-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
            activeTab === 'creative'
              ? theme === 'dark'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-white text-indigo-600 shadow-md'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-white/5'
                : 'text-gray-500 hover:text-indigo-600 hover:bg-white/40'
          }`}
        >
          <Sparkles size={14} />
          <span className="hidden sm:inline">Creative</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('studio')}
          className={`flex-1 py-3 px-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
            activeTab === 'studio'
              ? theme === 'dark'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-white text-indigo-600 shadow-md'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-white/5'
                : 'text-gray-500 hover:text-indigo-600 hover:bg-white/40'
          }`}
        >
          <Sliders size={14} />
          <span className="hidden sm:inline">Studio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('artwork')}
          className={`flex-1 py-3 px-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
            activeTab === 'artwork'
              ? theme === 'dark'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-white text-indigo-600 shadow-md'
              : theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-white/5'
                : 'text-gray-555 hover:text-indigo-600 hover:bg-white/40'
          }`}
        >
          <ImageIcon size={14} />
          <span className="hidden sm:inline">Artwork</span>
        </button>
      </div>

      {/* Tab Contents with animation style wrappers */}
      <div className="space-y-6 transition-all duration-300">
        {activeTab === 'creative' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <StorySection {...props} />
            <AIFeatureToggles {...props} />
          </div>
        )}

        {activeTab === 'studio' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <TechnicalSettings {...props} />
            <GenrePicker {...props} />
          </div>
        )}

        {activeTab === 'artwork' && (
          <div className="animate-in fade-in duration-300">
            <CoverStudio {...props} />
          </div>
        )}
      </div>

      {/* Main CTA Trigger action */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim() || !isApiConnected}
        className={`w-full py-5 rounded-[2rem] font-black text-base uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-xl ${
          isGenerating || !prompt.trim() || !isApiConnected
            ? theme === 'dark' 
              ? 'bg-gray-900 border border-gray-800 text-gray-500 cursor-not-allowed grayscale' 
              : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed grayscale'
            : 'bg-gradient-to-r from-indigo-600 to-violet-700 text-white hover:opacity-95 shadow-indigo-500/10'
        }`}
      >
        {isGenerating ? (
          <><Loader2 className="animate-spin text-white" size={20} /><span>กำลังสร้างบทเพลง...</span></>
        ) : (
          <><Sparkles size={20} className="animate-pulse text-indigo-200" /><span>COMPRISE LYRICS NOW</span></>
        )}
      </button>

      {error && (
        <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex flex-col gap-2">
          <div className="flex items-center gap-3"><AlertCircle size={18} /><span>{error}</span></div>
          {error.includes("API") && <button onClick={handleConnectApi} className="underline text-left">เชื่อมต่อ API ทันที</button>}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
