
import React from 'react';
import { Calendar, Snowflake } from 'lucide-react';

interface TimeSliderProps {
  sortBy: 'date' | 'season';
  setSortBy: (sortBy: 'date' | 'season') => void;
}

export const TimeSlider = ({ sortBy, setSortBy }: TimeSliderProps) => {
  return (
    <div className="bg-warm-cream/60 backdrop-blur-sm rounded-2xl p-4 border border-foggy-blue/20 shadow-lg animate-gentle-fade flex-1">
      <h3 className="font-poppins font-medium text-charcoal mb-3 text-sm uppercase tracking-wide">
        Time Travel
      </h3>
      
      <div className="flex gap-2">
        <button
          onClick={() => setSortBy('date')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
            sortBy === 'date'
              ? 'bg-slate-gray text-warm-cream shadow-md'
              : 'bg-foggy-blue/20 text-slate-gray hover:bg-slate-gray/20'
          }`}
        >
          <Calendar size={16} />
          <span className="font-inter text-sm">By Date</span>
        </button>
        
        <button
          onClick={() => setSortBy('season')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
            sortBy === 'season'
              ? 'bg-slate-gray text-warm-cream shadow-md'
              : 'bg-foggy-blue/20 text-slate-gray hover:bg-slate-gray/20'
          }`}
        >
          <Snowflake size={16} />
          <span className="font-inter text-sm">By Season</span>
        </button>
      </div>
    </div>
  );
};
