
import React from 'react';
import { RenderStyle } from '../types';

interface StyleCardProps {
  style: RenderStyle;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const StyleCard: React.FC<StyleCardProps> = ({ style, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(style.id)}
      className={`relative group text-left overflow-hidden rounded-xl border-2 transition-all duration-300 ${
        isSelected 
          ? 'border-indigo-500 ring-4 ring-indigo-500/20' 
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img 
          src={style.previewUrl} 
          alt={style.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className={`p-3 ${isSelected ? 'bg-indigo-900/20' : 'bg-slate-900'}`}>
        <h3 className="font-semibold text-slate-100 text-sm truncate">{style.name}</h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{style.description}</p>
      </div>
      
      {isSelected && (
        <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
};

export default StyleCard;
