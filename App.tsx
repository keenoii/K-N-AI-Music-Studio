
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Footer from './components/Footer';
import { generateSong, analyzeAndConfigure, generateCoverImage } from './services/geminiService';
import { SunoConfig } from './types';

const GENRES_LIST = ['Pop', 'Rock', 'Jazz', 'Hip-hop', 'R&B', 'Country', 'Folk', 'Blues', 'Electronic', 'Dance', 'House', 'Techno', 'Ambient', 'Classical', 'Reggae', 'Ska', 'Punk', 'Metal', 'Alternative', 'Indie', 'Acoustic', 'Soul', 'Funk', 'Disco', 'Trap', 'Lo-fi', 'Chill', 'Ballad'];
const VALID_KEYS = ['C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'Eb', 'E', 'Em', 'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'Ab', 'A', 'Am', 'Bb', 'B', 'Bm'];
const IMAGE_STYLES = ['Cinematic', 'Digital Art', 'Oil Painting', 'Synthwave', 'Anime', 'Photorealistic', 'Neon Punk', 'Minimalist', 'Vintage Photo'];
const LANGUAGE_OPTIONS = [
  { value: 'ไทย', label: '🇹🇭 ภาษาไทย' },
  { value: 'อังกฤษ', label: '🇬🇧 English' },
  { value: 'จีน', label: '🇨🇳 中文' },
  { value: 'ญี่ปุ่น', label: '🇯🇵 日本語' },
  { value: 'เกาหลี', label: '🇰🇷 한국어' },
  { value: 'อีสาน', label: '🎭 ภาษาอีสาน' }
];
const MODEL_OPTIONS = [
  { value: 'gemini-3-pro-preview', label: 'Gemini 3 Pro', description: 'ดีที่สุดสำหรับการแต่งเพลงที่ซับซ้อนและเนื้อหาเชิงลึก' },
  { value: 'gemini-3-flash-preview', label: 'Gemini 3 Flash', description: 'ทำงานรวดเร็ว แม่นยำ เหมาะสำหรับการร่างเพลงด่วน' },
  { value: 'gemini-flash-lite-latest', label: 'Gemini Flash Lite', description: 'โมเดลขนาดเล็ก ประหยัดพลังงาน สำหรับงานทั่วไป' }
];

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [prompt, setPrompt] = useState('บทเพลงรักที่ระเบิดอารมณ์ความเจ็บปวด...');
  const [references, setReferences] = useState('แนวพี่เสก Loso, Bodyslam, เพลงร็อคยุค 90');
  const [inspirations, setInspirations] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [generatedLyrics, setGeneratedLyrics] = useState(``);
  const [jsonPrompt, setJsonPrompt] = useState<SunoConfig | null>(null);
  const [selectedModel, setSelectedModel] = useState('gemini-3-pro-preview');

  const [bpm, setBpm] = useState(60);
  const [keyName, setKeyName] = useState('F#m');
  const [duration, setDuration] = useState(3.5);
  const [vocalType, setVocalType] = useState('ชาย');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Rock', 'Alternative', 'Acoustic']);
  const [poemType, setPoemType] = useState('กลอน 4');
  const [language, setLanguage] = useState('ไทย');
  const [autoTitle, setAutoTitle] = useState(true);
  const [autoMelody, setAutoMelody] = useState(true);

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [imageStyle, setImageStyle] = useState('Cinematic');
  const [imageAspectRatio, setImageAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutoConfiguring, setIsAutoConfiguring] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);

  useEffect(() => {
    checkApiKey();
    const saved = localStorage.getItem('kn-music-last-session');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setGeneratedLyrics(data.lyrics || '');
        setJsonPrompt(data.json || null);
        setSongTitle(data.songTitle || '');
        setReferences(data.references || '');
        setInspirations(data.inspirations || '');
        setCoverImage(data.coverImage || null);
        if (data.selectedModel) setSelectedModel(data.selectedModel);
        if (data.config) {
          setBpm(data.config.bpm ?? 60);
          setKeyName(data.config.keyName ?? 'F#m');
          setDuration(data.config.duration ?? 3.5);
          setVocalType(data.config.vocalType ?? 'ชาย');
          setSelectedGenres(data.config.selectedGenres ?? ['Rock', 'Alternative', 'Acoustic']);
          setPoemType(data.config.poemType ?? 'กลอน 4');
          setLanguage(data.config.language ?? 'ไทย');
          setAutoTitle(data.config.autoTitle ?? true);
          setAutoMelody(data.config.autoMelody ?? true);
        }
      } catch (e) {}
    }
  }, []);

  const checkApiKey = async () => {
    try {
      const hasKey = await window.aistudio?.hasSelectedApiKey();
      setIsApiConnected(!!hasKey);
    } catch (e) {}
  };

  const handleConnectApi = async () => {
    try {
      if (window.aistudio?.openSelectKey) {
        await window.aistudio.openSelectKey();
        setIsApiConnected(true);
        showStatus("เชื่อมต่อ API สำเร็จ");
      }
    } catch (e) {
      setError("ไม่สามารถเปิดหน้าต่างเลือก API ได้");
    }
  };

  const showStatus = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const toggleGenre = useCallback((genre: string) => {
    setSelectedGenres((prev) => 
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }, []);

  const handleAutoConfigure = async () => {
    if (!prompt.trim()) return;
    setIsAutoConfiguring(true);
    setError(null);
    try {
      const data = await analyzeAndConfigure(prompt, GENRES_LIST, selectedModel);
      
      // Update Language with direct match or label search
      if (data.language) {
        const matchedLang = LANGUAGE_OPTIONS.find(opt => 
          opt.value === data.language || 
          opt.label.toLowerCase().includes(data.language.toLowerCase())
        );
        if (matchedLang) setLanguage(matchedLang.value);
      }
      
      if (data.bpm) setBpm(data.bpm);
      if (data.vocalType) setVocalType(data.vocalType);
      if (data.poemType) setPoemType(data.poemType);

      // Robust Key Matching
      if (data.key) {
        const cleanKey = data.key.replace(/\s/g, '');
        const foundKey = VALID_KEYS.find(k => k.toLowerCase() === cleanKey.toLowerCase());
        if (foundKey) setKeyName(foundKey);
      }
      
      setDuration(Math.min(Math.max(data.duration || 3.5, 1), 5));

      // IMPROVED FUZZY GENRE MATCHING
      if (data.genres && Array.isArray(data.genres)) {
        const matched = data.genres.map(g => {
          const target = g.trim().toLowerCase().replace(/-/g, '').replace(/\s/g, '');
          return GENRES_LIST.find(systemGenre => {
            const system = systemGenre.toLowerCase().replace(/-/g, '').replace(/\s/g, '');
            return system === target || system.includes(target) || target.includes(system);
          });
        }).filter((g): g is string => !!g);

        if (matched.length > 0) {
          setSelectedGenres(Array.from(new Set(matched))); // Unique values
        }
      }

      showStatus(`AI ตั้งค่าให้เรียบร้อยแล้ว: ${data.reason}`);
    } catch (e: any) {
      console.error("Auto configuration error:", e);
      setError('การตั้งค่าอัตโนมัติล้มเหลว กรุณาลองใหม่');
    } finally {
      setIsAutoConfiguring(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const data = await generateSong({ 
        prompt, references, inspirations, language, genres: selectedGenres, bpm, key: keyName, 
        vocalType, linesPerSection: 4, poemType, autoMelody, autoTitle, duration, 
        model: selectedModel 
      });
      setGeneratedLyrics(data.lyrics);
      setJsonPrompt(data.suno_config);
      if (autoTitle) setSongTitle(data.title);
      showStatus('สร้างบทเพลงสำเร็จแล้ว!');
    } catch (e: any) {
      setError('การสร้างเพลงล้มเหลว');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingImage(true);
    setError(null);
    try {
      const imgUrl = await generateCoverImage({ prompt: songTitle || prompt.substring(0, 50), aspectRatio: imageAspectRatio, style: imageStyle });
      setCoverImage(imgUrl);
      showStatus('สร้างภาพหน้าปกเรียบร้อย!');
    } catch (e: any) {
      setError('การสร้างภาพหน้าปกล้มเหลว');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCopy = async (text: any) => {
    if (!text) return;
    const content = typeof text === 'object' ? JSON.stringify(text, null, 2) : text;
    try {
      await navigator.clipboard.writeText(content);
      showStatus('คัดลอกลงคลิปบอร์ดแล้ว!');
    } catch (err) {}
  };

  const handleResetAll = useCallback(() => {
    if (window.confirm('คุณต้องการรีเซ็ตการตั้งค่าและเนื้อหาทั้งหมดกลับสู่ค่าเริ่มต้นใช่หรือไม่?')) {
      setPrompt('');
      setReferences('');
      setInspirations('');
      setSongTitle('');
      setGeneratedLyrics('');
      setJsonPrompt(null);
      setCoverImage(null);
      setBpm(60);
      setKeyName('F#m');
      setDuration(3.5);
      setVocalType('ชาย');
      setSelectedGenres(['Rock', 'Alternative', 'Acoustic']);
      setPoemType('กลอน 4');
      setLanguage('ไทย');
      showStatus('รีเซ็ตข้อมูลทั้งหมดแล้ว');
    }
  }, []);

  const handleClearPrompt = useCallback(() => {
    if (window.confirm('ต้องการล้างเนื้อหาในช่องเรื่องราวใช่หรือไม่?')) {
      setPrompt('');
      showStatus('ล้างช่องเรื่องราวแล้ว');
    }
  }, []);

  const handleNewProject = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการเริ่มโปรเจกต์ใหม่? ข้อมูลเนื้อร้องปัจจุบันจะสูญหาย')) {
      setPrompt('');
      setReferences('');
      setInspirations('');
      setSongTitle('');
      setGeneratedLyrics('');
      setJsonPrompt(null);
      setCoverImage(null);
      showStatus('เริ่มโปรเจกต์ใหม่แล้ว');
    }
  };

  const handleSave = () => {
    const data = { 
      lyrics: generatedLyrics, 
      json: jsonPrompt, 
      prompt, 
      references, 
      inspirations, 
      songTitle, 
      coverImage, 
      selectedModel,
      config: { bpm, keyName, duration, vocalType, selectedGenres, poemType, language, autoTitle, autoMelody } 
    };
    localStorage.setItem('kn-music-last-session', JSON.stringify(data));
    showStatus('บันทึกโปรเจกต์เรียบร้อยแล้ว');
  };

  const handleExport = (type: 'lyrics' | 'json' | 'image') => {
    if (type === 'image' && coverImage) {
      const link = document.createElement('a');
      link.href = coverImage;
      link.download = `cover-${songTitle || 'song'}.png`;
      link.click();
      return;
    }
    const content = type === 'lyrics' ? generatedLyrics : JSON.stringify(jsonPrompt, null, 2);
    const filename = type === 'lyrics' ? 'lyrics.txt' : 'suno_config.json';
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename; link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header theme={theme} setTheme={setTheme} isApiConnected={isApiConnected} onConnectApi={handleConnectApi} successMsg={successMsg} />
      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Sidebar 
          {...{theme, prompt, setPrompt, references, setReferences, inspirations, setInspirations, songTitle, setSongTitle, bpm, setBpm, keyName, setKeyName, duration, setDuration, vocalType, setVocalType, poemType, setPoemType, language, setLanguage, autoTitle, setAutoTitle, autoMelody, setAutoMelody, selectedGenres, toggleGenre, genres: GENRES_LIST, imageAspectRatio, setImageAspectRatio, imageStyle, setImageStyle, imageStyles: IMAGE_STYLES, languageOptions: LANGUAGE_OPTIONS, isAutoConfiguring, isGenerating, isGeneratingImage, isApiConnected, handleAutoConfigure, handleGenerate, handleGenerateImage, handleConnectApi, error, selectedModel, setSelectedModel, modelOptions: MODEL_OPTIONS, handleResetAll, handleClearPrompt}}
        />
        <Editor 
          {...{theme, generatedLyrics, setGeneratedLyrics, songTitle, duration, selectedGenres, bpm, keyName, inspirations, isGenerating, coverImage, imageAspectRatio, jsonPrompt, handleNewProject, handleSave, handleCopy, handleExport}}
        />
      </main>
      <Footer theme={theme} />
    </div>
  );
};

export default App;
