
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
    className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl border transition-all duration-300 ${
      disabled 
        ? 'opacity-30 cursor-not-allowed grayscale' 
        : theme === 'dark'
          ? 'hover:border-indigo-500/60 hover:text-white hover:bg-white/5 hover:shadow-lg hover:shadow-indigo-500/5 active:scale-95'
          : 'hover:border-indigo-505/60 hover:text-indigo-600 hover:bg-indigo-50/50 hover:shadow-md active:scale-95'
    } ${theme === 'dark' ? 'bg-[#121214] border-gray-850 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}
  >
    <span className="text-indigo-500 transition-transform duration-300 group-hover:scale-110">{icon}</span>
    <span>{label}</span>
  </button>
);

export const SectionCard: React.FC<{ children: React.ReactNode; theme: 'dark' | 'light'; className?: string }> = ({ children, theme, className = "" }) => (
  <section className={`p-6 rounded-[2rem] border transition-all duration-500 relative overflow-hidden ${
    theme === 'dark' 
      ? 'bg-[#0c0c0e]/95 border-gray-900/90 shadow-xl shadow-black/40 hover:border-gray-800/80' 
      : 'bg-white border-gray-150 shadow-sm hover:shadow-md hover:border-gray-300/65'
  } ${className}`}>
    {theme === 'dark' && (
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent pointer-events-none" />
    )}
    {children}
  </section>
);

