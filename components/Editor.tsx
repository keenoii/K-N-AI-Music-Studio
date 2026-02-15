
import React, { useRef, useEffect } from 'react';
import { FileText, Music, Clock, Download, Plus, Save, Clipboard, ImageIcon, ChevronRight, Loader2 } from 'lucide-react';
import { ToolButton } from './SharedUI';

interface EditorProps {
  theme: 'dark' | 'light';
  generatedLyrics: string;
  setGeneratedLyrics: (v: string) => void;
  songTitle: string;
  duration: number;
  selectedGenres: string[];
  bpm: number;
  keyName: string;
  inspirations: string;
  isGenerating: boolean;
  coverImage: string | null;
  imageAspectRatio: "1:1" | "16:9" | "9:16";
  jsonPrompt: any;
  handleNewProject: () => void;
  handleSave: () => void;
  handleCopy: (v: any) => void;
  handleExport: (t: 'lyrics' | 'json' | 'image') => void;
}

const Editor: React.FC<EditorProps> = (props) => {
  const { theme, generatedLyrics, setGeneratedLyrics, songTitle, duration, selectedGenres, bpm, keyName, inspirations, isGenerating, coverImage, imageAspectRatio, jsonPrompt, handleNewProject, handleSave, handleCopy, handleExport } = props;
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const getTagStyle = (line: string) => {
    const text = line.toLowerCase();
    if (text.includes('chorus')) return 'bg-purple-500/20 border-purple-500/40 text-purple-400';
    if (text.includes('solo') || text.includes('instrumental')) return 'bg-amber-500/20 border-amber-500/40 text-amber-400';
    if (text.includes('intro') || text.includes('outro')) return 'bg-blue-500/20 border-blue-500/40 text-blue-400';
    if (text.includes('bridge')) return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400';
    if (text.includes('verse')) return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
    return 'bg-gray-500/20 border-gray-500/40 text-gray-400';
  };

  const renderHighlightedText = (text: string) => {
    if (!text) return null;
    
    // Normalize string: solve literal \n issue and extra spaces
    const cleanText = text.replace(/\\n/g, '\n');

    return cleanText.split('\n').map((line, i) => {
      const hasTag = line.trim().startsWith('[') && line.trim().endsWith(']');
      const hasDescription = line.trim().startsWith('(') && line.trim().endsWith(')');
      
      if (hasTag) {
        const styleClass = getTagStyle(line);
        return (
          <div key={i} className="min-h-[2em] flex items-center mb-1 mt-3 first:mt-0">
            <span className={`px-3 py-1 rounded-lg border font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm ${styleClass}`}>
              <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
              {line}
            </span>
          </div>
        );
      }

      if (hasDescription) {
        return (
          <div key={i} className={`min-h-[1.4em] py-0.5 text-[13px] italic font-medium opacity-60 flex items-center gap-2 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>
             <Music size={10} className="opacity-40" /> {line}
          </div>
        );
      }
      
      return (
        <div key={i} className="min-h-[1.4em] py-0.5">
          {line || ' '}
        </div>
      );
    });
  };

  useEffect(() => {
    handleScroll();
  }, [generatedLyrics]);

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={handleNewProject} icon={<Plus size={16} />} label="ใหม่" theme={theme} />
        <ToolButton onClick={handleSave} icon={<Save size={16} />} label="บันทึก" theme={theme} />
        <ToolButton onClick={() => handleCopy(generatedLyrics)} icon={<Clipboard size={16} />} label="คัดลอก" theme={theme} disabled={!generatedLyrics} />
        <ToolButton onClick={() => handleExport('lyrics')} icon={<Download size={16} />} label="ส่งออก TXT" theme={theme} disabled={!generatedLyrics} />
        <ToolButton onClick={() => handleExport('image')} icon={<ImageIcon size={16} />} label="โหลดปก" theme={theme} disabled={!coverImage} />
      </div>

      <section className={`flex-1 rounded-[2.5rem] border flex flex-col overflow-hidden min-h-[600px] shadow-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-[#050505] border-gray-800/40 shadow-indigo-500/10' : 'bg-white border-gray-100 shadow-xl'}`}>
        <div className={`px-8 py-4 border-b flex justify-between items-center ${theme === 'dark' ? 'border-gray-800/40 bg-[#080808]' : 'border-gray-50 bg-gray-50/30'}`}>
          <h3 className="text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.2em] text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Songwriting Editor
          </h3>
          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-600">
            <span className="flex items-center gap-1.5"><Clock size={12} /> {duration} MIN TARGET</span>
          </div>
        </div>
        
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {isGenerating && (
            <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-12">
              <div className="w-full max-w-md space-y-6 text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                  <Loader2 size={40} className="text-indigo-500 animate-spin relative" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold tracking-tight text-white">กำลังประพันธ์บทเพลง...</h4>
                  <p className="text-xs text-gray-400">AI กำลังจัดโครงสร้างอย่างเป็นระบบ</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-10 pt-10 pb-4 flex-shrink-0">
              {songTitle && (
                <div className="flex flex-col md:flex-row gap-6 mb-6 items-start">
                  {coverImage && (
                    <div className="flex-shrink-0 relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
                      <img 
                        src={coverImage} 
                        alt="Cover" 
                        className={`relative rounded-2xl shadow-xl object-cover border border-white/5 ${imageAspectRatio === '9:16' ? 'w-24 aspect-[9/16]' : 'w-32 aspect-square'}`} 
                      />
                    </div>
                  )}
                  <div className="flex-1 pt-1">
                    <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-100 to-indigo-400 mb-3 leading-tight tracking-tight">
                      {songTitle}
                    </h2>
                    <div className="flex flex-wrap gap-x-3 gap-y-2">
                      <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">{selectedGenres.join(' • ')}</span>
                      <span className="bg-white/5 text-gray-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5">{bpm} BPM • {keyName}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 relative px-10 pb-10 overflow-hidden">
              <div 
                ref={backdropRef}
                className={`absolute inset-x-10 inset-y-0 p-0 pointer-events-none whitespace-pre-wrap break-words font-serif text-lg leading-relaxed overflow-y-auto overflow-x-hidden ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
                style={{ color: 'transparent', WebkitTextFillColor: 'transparent' }}
              >
                {renderHighlightedText(generatedLyrics)}
              </div>

              <textarea
                ref={textareaRef}
                value={generatedLyrics}
                onChange={(e) => setGeneratedLyrics(e.target.value)}
                onScroll={handleScroll}
                spellCheck={false}
                className={`relative w-full h-full bg-transparent border-none outline-none resize-none font-serif text-lg leading-relaxed break-words whitespace-pre-wrap z-10 p-0 ${theme === 'dark' ? 'text-gray-400 focus:text-gray-100' : 'text-gray-600 focus:text-gray-900'} transition-colors duration-300`}
                style={{ caretColor: '#6366f1' }}
                placeholder="Start composing..."
              />
            </div>
          </div>
        </div>
      </section>

      <section className={`h-32 rounded-[2rem] border flex flex-col overflow-hidden shadow-xl ${theme === 'dark' ? 'bg-[#080808] border-gray-800/40' : 'bg-gray-50 border-gray-100'}`}>
        <div className={`px-6 py-2 border-b flex justify-between items-center ${theme === 'dark' ? 'border-gray-800/40 bg-[#0c0c0c]' : 'border-gray-100 bg-gray-100/50'}`}>
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-indigo-500" />
            Meta Data
          </span>
          <button onClick={() => handleCopy(jsonPrompt)} className="text-[9px] font-black text-indigo-500 hover:text-indigo-400 tracking-widest transition-colors">COPY</button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto font-mono text-[10px] text-indigo-400/60 leading-tight">
          {jsonPrompt ? <pre>{JSON.stringify(jsonPrompt, null, 2)}</pre> : <div className="h-full flex items-center justify-center opacity-20 italic font-sans text-[10px] tracking-widest">No data available</div>}
        </div>
      </section>
    </div>
  );
};

export default Editor;
