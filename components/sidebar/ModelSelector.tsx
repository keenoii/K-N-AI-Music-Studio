
import React from 'react';
import { Cpu } from 'lucide-react';
import { SectionCard } from '../SharedUI';

interface ModelSelectorProps {
  theme: 'dark' | 'light';
  selectedModel: string;
  setSelectedModel: (m: string) => void;
  modelOptions: { value: string; label: string; description: string }[];
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ theme, selectedModel, setSelectedModel, modelOptions }) => (
  <SectionCard theme={theme} className="!p-5 border-indigo-500/30">
    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
      <Cpu size={14} className="text-indigo-500" /> เลือกโมเดล AI Engine
    </h3>
    <select
      value={selectedModel}
      onChange={(e) => setSelectedModel(e.target.value)}
      className={`w-full p-3 rounded-xl text-sm font-bold outline-none border transition-all ${
        theme === 'dark' ? 'bg-[#0a0a0a] border-gray-800 text-indigo-400' : 'bg-gray-50 border-gray-200 text-indigo-600'
      }`}
    >
      {modelOptions.map(m => (
        <option key={m.value} value={m.value}>{m.label}</option>
      ))}
    </select>
    <p className="mt-2 text-[10px] text-gray-500 font-medium">
      {modelOptions.find(m => m.value === selectedModel)?.description}
    </p>
  </SectionCard>
);
