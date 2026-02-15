
import React from 'react';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
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
  const { isGenerating, prompt, isApiConnected, handleGenerate, handleConnectApi, error, modelOptions, selectedModel } = props;

  return (
    <div className="space-y-6">
      <ModelSelector {...props} />
      <StorySection {...props} />
      <AIFeatureToggles {...props} />
      <CoverStudio {...props} />
      <TechnicalSettings {...props} />
      <GenrePicker {...props} />

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim() || !isApiConnected}
        className={`w-full py-5 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-xl ${
          isGenerating || !prompt.trim() || !isApiConnected
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed grayscale'
            : 'bg-gradient-to-r from-indigo-600 to-violet-700 text-white shadow-indigo-500/20'
        }`}
      >
        {isGenerating ? (
          <><Loader2 className="animate-spin" size={24} /><span>กำลังสร้างเพลง...</span></>
        ) : (
          <><Sparkles size={24} /><span>สร้างเพลงตอนนี้</span></>
        )}
      </button>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex flex-col gap-2">
          <div className="flex items-center gap-3"><AlertCircle size={18} /><span>{error}</span></div>
          {error.includes("API") && <button onClick={handleConnectApi} className="underline text-left">เชื่อมต่อ API ทันที</button>}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
