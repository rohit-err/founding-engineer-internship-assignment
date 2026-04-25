import { SlidersHorizontal, X } from 'lucide-react';
import { locationOptions } from '../data/colleges';

const RATING_OPTIONS = [
  { value: 0,   label: 'All ratings' },
  { value: 4.0, label: '4.0+ ★' },
  { value: 4.5, label: '4.5+ ★' },
  { value: 4.8, label: '4.8+ ★' },
];

function FilterContent({ filters, onChange, onReset, totalResults, mobile }) {
  const hasActive = filters.location !== '' || filters.maxFees < 80000 || filters.minRating > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header — desktop only; mobile drawer has its own header in App */}
      {!mobile && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-blue-700" />
            <span className="font-semibold text-slate-800 text-sm">Filters</span>
          </div>
          {hasActive && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors duration-150"
            >
              <X size={11} /> Reset
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <p className="px-5 pt-3 pb-1 text-xs text-slate-400 shrink-0">
        {totalResults} {totalResults === 1 ? 'college' : 'colleges'} found
      </p>

      {/* Controls */}
      <div className="px-5 py-4 space-y-5 overflow-y-auto flex-1">
        {/* Mobile reset — shown inside controls when in drawer */}
        {mobile && hasActive && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors duration-150"
          >
            <X size={11} /> Reset filters
          </button>
        )}

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => onChange('location', e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500 transition-colors duration-150 cursor-pointer"
          >
            {locationOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Max Fees */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Max Fees</label>
            <span className="text-xs font-semibold text-blue-700">${filters.maxFees.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={10000}
            max={80000}
            step={1000}
            value={filters.maxFees}
            onChange={(e) => onChange('maxFees', Number(e.target.value))}
            className="accent-blue-700"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>$10k</span><span>$80k+</span>
          </div>
        </div>

        {/* Min Rating */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Min Rating
          </label>
          <div className="space-y-1">
            {RATING_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onChange('minRating', value)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors duration-150
                  ${filters.minRating === value
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Filters({ filters, onChange, onReset, totalResults, mobile = false }) {
  if (mobile) {
    return <FilterContent filters={filters} onChange={onChange} onReset={onReset} totalResults={totalResults} mobile />;
  }

  return (
    <aside className="hidden md:flex fixed top-14 left-0 bottom-0 w-60 bg-white border-r border-slate-200 flex-col z-30">
      <FilterContent filters={filters} onChange={onChange} onReset={onReset} totalResults={totalResults} mobile={false} />
    </aside>
  );
}
