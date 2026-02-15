
import React from 'react';

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  theme: 'dark' | 'light';
  disabled?: boolean;
}

export const ToolButton: React.FC<ToolButtonProps> = ({ icon, label, onClick, theme, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition-all ${
      disabled 
        ? 'opacity-40 cursor-not-allowed grayscale' 
        : 'hover:border-indigo-500 hover:shadow-lg active:scale-95'
    } ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}
  >
    <span className="text-indigo-500">{icon}</span>
    <span>{label}</span>
  </button>
);

export const SectionCard: React.FC<{ children: React.ReactNode; theme: 'dark' | 'light'; className?: string }> = ({ children, theme, className = "" }) => (
  <section className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200'} ${className}`}>
    {children}
  </section>
);
