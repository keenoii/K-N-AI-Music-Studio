
import React from 'react';
import { SectionCard } from '../SharedUI';

interface GenrePickerProps {
  theme: 'dark' | 'light';
  genres: string[];
  selectedGenres: string[];
  toggleGenre: (g: string) => void;
}

export const GenrePicker: React.FC<GenrePickerProps> = ({ theme, genres, selectedGenres, toggleGenre }) => {
  if (!genres || !Array.isArray(genres)) return null;

  return (
    <SectionCard theme={theme}>
      <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 flex justify-between items-center">
        <span>แนวเพลง (Genres)</span>
        {selectedGenres.length > 0 && (
          <span className="text-indigo-500 lowercase font-medium">{selectedGenres.length} selected</span>
        )}
      </h3>
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2">
        {genres.map(genre => {
          const isActive = selectedGenres.includes(genre);
          return (
            <button 
              key={genre} 
              onClick={() => toggleGenre(genre)} 
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                isActive 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/20' 
                  : theme === 'dark' 
                    ? 'bg-[#1a1a1a] border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300' 
                    : 'bg-gray-100 border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
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
