
import React, { useRef, useEffect, useState } from 'react';
import { FileText, Music, Clock, Download, Plus, Save, Clipboard, ImageIcon, ChevronRight, Loader2, Eye, PenTool, ZoomIn, ZoomOut } from 'lucide-react';
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
  
  const [viewMode, setViewMode] = useState<'write' | 'sing'>('sing');
  const [fontSize, setFontSize] = useState<number>(18); // Default font-size 18px (text-lg)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Auto-switch view modes when lyrics change
  useEffect(() => {
    if (generatedLyrics) {
      setViewMode('sing');
    } else {
      setViewMode('write');
    }
  }, [generatedLyrics === '']);

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
    if (text.includes('verse')) return 'bg-indigo-500/15 border-indigo-500/45 text-indigo-400';
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

  // Stage view parsing engine
  const renderSingingSheet = (text: string) => {
    if (!text) return null;
    const cleanText = text.replace(/\\n/g, '\n');
    const lines = cleanText.split('\n');
    
    interface SongSection {
      tag: string;
      cues: string[];
      verses: string[];
    }
    
    const sections: SongSection[] = [];
    let currentSection: SongSection = { tag: '', cues: [], verses: [] };
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        if (currentSection.tag || currentSection.cues.length > 0 || currentSection.verses.length > 0) {
          sections.push({ ...currentSection });
          currentSection = { tag: '', cues: [], verses: [] };
        }
        return;
      }
      
      const isTag = trimmed.startsWith('[') && trimmed.endsWith(']');
      const isCue = trimmed.startsWith('(') && trimmed.endsWith(')');
      
      if (isTag) {
        if (currentSection.tag || currentSection.cues.length > 0 || currentSection.verses.length > 0) {
          sections.push({ ...currentSection });
        }
        currentSection = { tag: trimmed, cues: [], verses: [] };
      } else if (isCue) {
        currentSection.cues.push(trimmed);
      } else {
        currentSection.verses.push(trimmed);
      }
    });
    
    if (currentSection.tag || currentSection.cues.length > 0 || currentSection.verses.length > 0) {
      sections.push(currentSection);
    }
    
    return (
      <div className="space-y-6 pb-20 overflow-y-auto max-h-[650px] pr-2 custom-scrollbar">
        {sections.map((section, sIdx) => {
          const tagStyle = getTagStyle(section.tag || '[Section]');
          return (
            <div 
              key={sIdx} 
              className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-[#0a0a0c]/80 border-gray-900/60 hover:border-indigo-500/10 hover:bg-[#0c0c0f]/90 shadow-md' 
                  : 'bg-gray-50/30 border-gray-150 hover:border-indigo-300 hover:bg-indigo-50/5 hover:shadow-sm'
              }`}
            >
              {section.tag && (
                <div className="mb-4">
                  <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.15em] inline-flex items-center gap-2 shadow-sm ${tagStyle}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {section.tag.replace('[', '').replace(']', '')}
                  </span>
                </div>
              )}
              
              {section.cues.length > 0 && (
                <div className="space-y-2 mb-5 select-none">
                  {section.cues.map((cue, cIdx) => {
                    const cleanCue = cue.replace('(', '').replace(')', '');
                    const hasChords = cleanCue.toLowerCase().includes('chord');
                    
                    if (hasChords) {
                      const parts = cleanCue.split('|');
                      const chordsPart = parts[0]?.replace(/chords:\s*/i, '').trim();
                      const descPart = parts[1]?.trim();
                      
                      return (
                        <div key={cIdx} className={`rounded-2xl px-5 py-4 border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          theme === 'dark' 
                            ? 'bg-indigo-950/10 border-indigo-500/15 text-indigo-300/90' 
                            : 'bg-indigo-50/30 border-indigo-150 text-indigo-800'
                        }`}>
                          <div className="flex items-center gap-3">
                            <span className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                              <Music size={14} />
                            </span>
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-widest opacity-50 block">CHORD PROGRESSIONS</span>
                              <span className="text-sm font-black font-mono tracking-wider">{chordsPart}</span>
                            </div>
                          </div>
                          {descPart && (
                            <span className="text-xs font-semibold text-gray-400 italic sm:border-l sm:border-current/10 sm:pl-4">{descPart}</span>
                          )}
                        </div>
                      );
                    }
                    
                    return (
                      <div key={cIdx} className={`px-4 py-2.5 rounded-xl border text-xs font-bold italic flex items-center gap-2.5 ${
                        theme === 'dark' ? 'bg-black/40 border-gray-900 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-60 animate-ping" />
                        {cleanCue}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {section.verses.length > 0 ? (
                <div className="space-y-3.5 pl-1">
                  {section.verses.map((verse, vIdx) => (
                    <p 
                      key={vIdx} 
                      className={`font-serif leading-relaxed font-bold tracking-wide transition-all ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                      }`}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {verse}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-gray-500 pl-1">บรรเลงดนตรี / ไม่มีเนื้อร้อง</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    handleScroll();
  }, [generatedLyrics]);

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Top Action Tools */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={handleNewProject} icon={<Plus size={16} />} label="ใหม่" theme={theme} />
          <ToolButton onClick={handleSave} icon={<Save size={16} />} label="บันทึก" theme={theme} />
          <ToolButton onClick={() => handleCopy(generatedLyrics)} icon={<Clipboard size={16} />} label="คัดลอก" theme={theme} disabled={!generatedLyrics} />
          <ToolButton onClick={() => handleExport('lyrics')} icon={<Download size={16} />} label="ส่งออก TXT" theme={theme} disabled={!generatedLyrics} />
          <ToolButton onClick={() => handleExport('image')} icon={<ImageIcon size={16} />} label="โหลดปก" theme={theme} disabled={!coverImage} />
        </div>

        {/* Dynamic Reader/Writer Font Adjustments if Lyrics exist */}
        {generatedLyrics && viewMode === 'sing' && (
          <div className={`p-1.5 rounded-xl border flex items-center gap-2 ${
            theme === 'dark' ? 'bg-[#0c0c0e]/80 border-gray-900/60' : 'bg-gray-100/50 border-gray-200/50'
          }`}>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 pl-2">LYRICS SIZE</span>
            <div className="flex gap-1">
              <button 
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className={`p-1.5 rounded-lg border transition-all ${theme === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white' : 'bg-white border-gray-250 text-gray-600 hover:text-indigo-600'}`}
              >
                <ZoomOut size={12} />
              </button>
              <button 
                onClick={() => setFontSize(prev => Math.min(28, prev + 2))}
                className={`p-1.5 rounded-lg border transition-all ${theme === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white' : 'bg-white border-gray-250 text-gray-600 hover:text-indigo-600'}`}
              >
                <ZoomIn size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      <section className={`flex-1 rounded-[2.5rem] border flex flex-col overflow-hidden min-h-[600px] shadow-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-[#050505] border-gray-800/40 shadow-indigo-500/10' : 'bg-white border-gray-100 shadow-xl'}`}>
        {/* Editor Main Navbar Controls with Mode Switcher! */}
        <div className={`px-8 py-4 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${theme === 'dark' ? 'border-gray-800/40 bg-[#080808]' : 'border-gray-50 bg-gray-50/30'}`}>
          <h3 className="text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.2em] text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Songwriting Studio
          </h3>

          {/* Eye/Pen Layout Controller */}
          {generatedLyrics && (
            <div className={`p-1 rounded-2xl flex gap-1 ${
              theme === 'dark' ? 'bg-[#060608] border border-gray-950' : 'bg-gray-150 border border-gray-250'
            }`}>
              <button
                type="button"
                onClick={() => setViewMode('write')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 ${
                  viewMode === 'write'
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white text-indigo-600 shadow-md'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <PenTool size={11} />
                <span>แก้ไข (Write)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('sing')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 ${
                  viewMode === 'sing'
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white text-indigo-600 shadow-md'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                <Eye size={11} />
                <span>ร้องเพลง (Stage)</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-600">
            <span className="flex items-center gap-1.5"><Clock size={12} /> {duration} MIN TARGET</span>
          </div>
        </div>
        
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {isGenerating && (
            <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-12 animate-fade-in">
              <div className="w-full max-w-md space-y-6 text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                  <Loader2 size={40} className="text-indigo-500 animate-spin relative" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold tracking-tight text-white font-sans">กำลังจำพล็อตและประพันธ์บทเพลง...</h4>
                  <p className="text-xs text-indigo-300/80 animate-pulse">AI เกรดแกรนมาสเตอร์กำลังเลือกคำและตรวจสัมผัส</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Title / Cover Section */}
            <div className="px-10 pt-10 pb-4 flex-shrink-0">
              {songTitle && (
                <div className="flex flex-col md:flex-row gap-6 mb-4 items-start">
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

            {/* Content canvas block */}
            <div className="flex-1 relative px-10 pb-10 overflow-hidden min-h-[450px]">
              {!generatedLyrics && !isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-0 pointer-events-none animate-in fade-in duration-500">
                  <div className="w-14 h-14 rounded-full bg-indigo-500/5 flex items-center justify-center mb-5 border border-indigo-500/10 shadow-inner">
                    <Music className="w-5 h-5 text-indigo-400 animate-pulse" />
                  </div>
                  <h4 className={`text-md font-black uppercase tracking-wider ${theme === 'dark' ? 'text-gray-350' : 'text-gray-700'} mb-1.5`}>
                    K&N SONGWRITING CANVAS
                  </h4>
                  <p className="text-xs text-gray-500 max-w-sm leading-relaxed mb-4">
                    บอกเล่าไอเดีย คอนเซปต์ หรือพล็อตเพลงของคุณตรงแท็บการตั้งค่า แล้วให้สตูดิโอจัดการสร้างสรรค์เนื้อเพลงและโครงสร้างระดับพรีเมียมทันที
                  </p>
                  <div className="flex gap-2 text-[9px] font-black uppercase tracking-wide text-indigo-400/75 select-none bg-indigo-500/5 px-3 py-1.5 rounded-full border border-indigo-500/10">
                    <span>1. บอกเนื้อหา</span>
                    <span>•</span>
                    <span>2. ตั้งค่าดนตรี</span>
                    <span>•</span>
                    <span>3. สร้างเพลง</span>
                  </div>
                </div>
              )}

              {/* View Mode Switch Logic rendering */}
              {generatedLyrics && viewMode === 'sing' ? (
                renderSingingSheet(generatedLyrics)
              ) : (
                <div className="w-full h-full relative">
                  {/* Backdrop rendering elements only if we have text (and not empty) */}
                  {generatedLyrics && (
                    <div 
                      ref={backdropRef}
                      className={`absolute inset-0 p-0 pointer-events-none whitespace-pre-wrap break-words font-serif text-lg leading-relaxed overflow-y-auto overflow-x-hidden ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
                      style={{ color: 'transparent', WebkitTextFillColor: 'transparent' }}
                    >
                      {renderHighlightedText(generatedLyrics)}
                    </div>
                  )}

                  <textarea
                    ref={textareaRef}
                    value={generatedLyrics}
                    onChange={(e) => setGeneratedLyrics(e.target.value)}
                    onScroll={handleScroll}
                    spellCheck={false}
                    className={`relative w-full h-full bg-transparent border-none outline-none resize-none font-serif text-lg leading-relaxed break-words whitespace-pre-wrap z-15 p-0 ${theme === 'dark' ? 'text-gray-300 focus:text-gray-100' : 'text-gray-650 focus:text-gray-900'} transition-colors duration-300`}
                    style={{ caretColor: '#6366f1' }}
                    placeholder={!isGenerating ? "พิมพ์หรือบันทึกเนื้อร้องที่นี่เพื่อปรับแต่งด้วยสไตล์ศิลปินระดับโปร..." : ""}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={`rounded-[2rem] border flex flex-col overflow-hidden shadow-xl ${theme === 'dark' ? 'bg-[#080808] border-gray-800/40' : 'bg-gray-50 border-gray-100'}`}>
        <div className={`px-6 py-2 border-b flex justify-between items-center ${theme === 'dark' ? 'border-gray-800/40 bg-[#0c0c0c]' : 'border-gray-100 bg-gray-100/50'}`}>
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-indigo-500" />
            Style Metadata
          </span>
          {jsonPrompt && (
            <button 
              onClick={() => {
                const text = [
                  jsonPrompt.style,
                  jsonPrompt.tempo,
                  jsonPrompt.key,
                  jsonPrompt.mood,
                  jsonPrompt.vocal_description,
                  jsonPrompt.instrumentation
                ].filter(Boolean).join(', ');
                handleCopy(text);
              }} 
              className="text-[9px] font-black text-indigo-500 hover:text-indigo-400 tracking-widest transition-colors"
            >
              COPY AUTO-STYLE
            </button>
          )}
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {jsonPrompt ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5">
                {jsonPrompt.style?.split(',').map((s: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-medium leading-none">
                    {s.trim()}
                  </span>
                ))}
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium leading-none">
                  {jsonPrompt.tempo}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium leading-none">
                  {jsonPrompt.key}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">Mood & Vibe</span>
                  <p className="text-[11px] text-gray-400 leading-relaxed italic">"{jsonPrompt.mood}"</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">Vocal style</span>
                  <p className="text-[11px] text-gray-400 leading-relaxed italic">"{jsonPrompt.vocal_description}"</p>
                </div>
              </div>
              
              <div className="pt-2 border-t border-white/5">
                <span className="text-[8px] font-black text-gray-600 uppercase tracking-tighter block mb-1">Instrumentation</span>
                <p className="text-[10px] text-indigo-300/60 font-mono leading-tight uppercase tracking-tight">
                  {jsonPrompt.instrumentation}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center opacity-20 italic font-sans text-[10px] tracking-widest pt-4">
              No metadata available
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Editor;
