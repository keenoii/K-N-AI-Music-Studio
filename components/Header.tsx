
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
    <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-[#0a0a0c]/80 border-gray-900/80' 
        : 'bg-white/85 border-gray-200/60'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
              <Music className="w-5 h-5 text-white animate-pulse" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                K&N AI MUSIC
              </h1>
              <span className={`flex items-center gap-1 text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full ${
                isApiConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isApiConnected ? 'bg-emerald-500' : 'bg-rose-500'} animate-ping`} />
                {isApiConnected ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-indigo-400/80 font-bold uppercase tracking-wider">Professional Songwriting Studio</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {successMsg && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 md:top-6 md:left-auto md:translate-x-0 md:right-6 flex items-center gap-3 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-slate-900/90 text-indigo-300 border border-indigo-500/30 shadow-2xl shadow-black animate-in fade-in slide-in-from-top-4 duration-500 z-[100] backdrop-blur-md">
              <div className="bg-indigo-500/20 p-1 rounded-full text-indigo-400">
                <CheckCircle2 size={14} className="animate-bounce" />
              </div>
              <span>{successMsg}</span>
            </div>
          )}
          
          <button
            onClick={onConnectApi}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all duration-300 ${
              isApiConnected 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/30'
            }`}
          >
            <Zap size={12} fill={isApiConnected ? "currentColor" : "none"} className={isApiConnected ? "text-emerald-400" : "text-white"} />
            {isApiConnected ? 'เปลี่ยน API KEY' : 'เชื่อมต่อ API'}
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2.5 rounded-xl border transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-[#121214] border-gray-850 text-amber-400 hover:text-amber-300' 
                : 'bg-gray-100 border-gray-200 text-indigo-600 hover:bg-gray-200'
            }`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
