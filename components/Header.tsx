
import React from 'react';
import { Music, Zap, Sun, Moon, ShieldCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  isApiConnected: boolean;
  onConnectApi: () => void;
  successMsg: string;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme, isApiConnected, onConnectApi, successMsg }) => {
  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${theme === 'dark' ? 'bg-[#111111]/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Music className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              K&N AI MUSIC
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] md:text-xs text-indigo-400 font-semibold uppercase tracking-widest">Songwriting Studio</span>
              <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isApiConnected ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {isApiConnected ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                {isApiConnected ? 'เชื่อมต่อแล้ว' : 'ยังไม่ได้เชื่อมต่อ'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {successMsg && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 md:relative md:top-0 md:left-0 flex items-center gap-3 px-5 py-2.5 rounded-2xl text-sm font-bold bg-indigo-600 text-white border border-indigo-500 shadow-2xl shadow-indigo-500/40 animate-in fade-in slide-in-from-top-4 duration-500 z-[100]">
              <div className="bg-white/20 p-1 rounded-full">
                <CheckCircle2 size={16} />
              </div>
              <span>{successMsg}</span>
            </div>
          )}
          
          <button
            onClick={onConnectApi}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              isApiConnected 
                ? 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20' 
                : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20'
            }`}
          >
            <Zap size={14} fill={isApiConnected ? "currentColor" : "none"} />
            {isApiConnected ? 'เปลี่ยน API' : 'เชื่อมต่อ API'}
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2.5 rounded-xl border transition-all ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-700 text-yellow-400' : 'bg-white border-gray-300 text-indigo-600'}`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
