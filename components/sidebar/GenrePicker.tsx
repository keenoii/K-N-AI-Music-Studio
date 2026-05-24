
import React from 'react';
import { SectionCard } from '../SharedUI';
import { Disc } from 'lucide-react';

interface GenrePickerProps {
  theme: 'dark' | 'light';
  genres: string[];
  selectedGenres: string[];
  toggleGenre: (g: string) => void;
}

export const GenrePicker: React.FC<GenrePickerProps> = ({ theme, genres, selectedGenres, toggleGenre }) => {
  if (!genres || !Array.isArray(genres)) return null;

  return (
    <SectionCard theme={theme} className="!p-5 border-indigo-500/5">
      <h3 className="text-[10px] font-black text-gray-500 uppercase mb-4 flex justify-between items-center tracking-widest">
        <span className="flex items-center gap-1.5"><Disc size={12} className="text-indigo-400 rotate-slow" /> GENRE MATRIX (SELECT MULTIPLE)</span>
        {selectedGenres.length > 0 && (
          <span className="text-indigo-400 font-mono font-black text-[10px] lowercase">{selectedGenres.length} selected</span>
        )}
      </h3>
      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
        {genres.map(genre => {
          const isActive = selectedGenres.includes(genre);
          return (
            <button 
              key={genre} 
              type="button"
              onClick={() => toggleGenre(genre)} 
              className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 border ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-650 to-indigo-700 border-indigo-500 text-white shadow-md shadow-indigo-500/10' 
                  : theme === 'dark' 
                    ? 'bg-[#060608] border-gray-901 text-gray-500 hover:border-gray-800 hover:text-gray-300' 
                    : 'bg-gray-50 border-gray-150 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/20'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
};
