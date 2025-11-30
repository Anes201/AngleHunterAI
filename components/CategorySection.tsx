import React, { useState } from 'react';
import { Category } from '../types';
import { AngleCard } from './AngleCard';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';

interface CategorySectionProps {
  category: Category;
  defaultOpen?: boolean;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (category.angles.length === 0) return null;

  return (
    <div className="border-b border-slate-800 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 px-4 hover:bg-slate-800/30 transition-colors text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isOpen ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800 text-slate-400'}`}>
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">{category.categoryName}</h2>
          <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full border border-slate-700">
            {category.angles.length}
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-8 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {category.angles.map((angle, idx) => (
            <AngleCard key={idx} angle={angle} />
          ))}
        </div>
      )}
    </div>
  );
};