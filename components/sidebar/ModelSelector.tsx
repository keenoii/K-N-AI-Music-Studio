
import React from 'react';
import { Cpu, Star, Flame, Zap } from 'lucide-react';
import { SectionCard } from '../SharedUI';

interface ModelSelectorProps {
  theme: 'dark' | 'light';
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  modelOptions: { value: string; label: string; description: string }[];
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ theme, selectedModel, setSelectedModel, modelOptions }) => {
  const getModelIcon = (val: string) => {
    if (val.includes('pro')) return <Star size={14} className="text-amber-400 animate-spin-slow" />;
    if (val.includes('flash')) return <Flame size={14} className="text-orange-400" />;
    return <Zap size={14} className="text-indigo-400" />;
  };

  return (
    <SectionCard theme={theme} className="!p-5 border-indigo-500/10">
      <h3 className="text-xs font-black text-gray-500 uppercase mb-4 flex items-center gap-2 tracking-widest">
        <Cpu size={14} className="text-indigo-500" /> AI ENGINE SELECTION
      </h3>
      <div className="space-y-2.5">
        {modelOptions.map(m => {
          const isActive = selectedModel === m.value;
          return (
            <button
              key={m.value}
              type="button"
              onClick={() => setSelectedModel(m.value)}
              className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-indigo-950/20 to-slate-900/40 border-indigo-500/45 text-white'
                    : 'bg-indigo-50/40 border-indigo-400 text-indigo-950'
                  : theme === 'dark'
                    ? 'bg-[#08080a] border-gray-850/60 text-gray-400 hover:border-gray-800 hover:text-gray-300'
                    : 'bg-gray-50/50 border-gray-150 text-gray-500 hover:border-gray-350 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-indigo-500/10' : 'bg-transparent'}`}>
                    {getModelIcon(m.value)}
                  </div>
                  <span className="text-xs font-bold font-mono tracking-tight">{m.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-500 animate-pulse ring-4 ring-indigo-500/20' : 'bg-transparent border border-gray-700/40'}`} />
                </div>
              </div>
              <p className="mt-1.5 text-[10px] opacity-75 font-medium leading-relaxed pl-8 group-hover:opacity-100 transition-opacity">
                {m.description}
              </p>
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
};
