import { useState, useMemo } from 'react';
import { GraduationCap, SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { colleges } from './data/colleges';
import CollegeCard from './components/CollegeCard';
import Filters from './components/Filters';
import CompareRibbon from './components/CompareRibbon';
import CompareModal from './components/CompareModal';

const DEFAULT_FILTERS = { location: '', maxFees: 80000, minRating: 0 };
const MAX_COMPARE = 3;

export default function App() {
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showModal, setShowModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() =>
    colleges.filter((c) => {
      if (filters.location && c.state !== filters.location) return false;
      if (c.fees > filters.maxFees) return false;
      if (c.rating < filters.minRating) return false;
      return true;
    }),
  [filters]);

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const handleToggle = (id) =>
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });

  const handleRemove = (id) => setSelected((prev) => prev.filter((x) => x !== id));
  const handleClear = () => setSelected([]);
  const selectedColleges = colleges.filter((c) => selected.includes(c.id));

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-700 rounded-lg flex items-center justify-center shrink-0">
              <GraduationCap size={15} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-base tracking-tight">Academia</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg bg-white"
            >
              <SlidersHorizontal size={13} /> Filters
            </button>
            <button className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors duration-150">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile filter drawer ────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm md:hidden"
          />
        )}
        {drawerOpen && (
          <motion.div
            key="drawer-panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-xl flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-blue-700" />
                <span className="font-semibold text-slate-800 text-sm">Filters</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors duration-150"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Filters
                filters={filters}
                onChange={handleFilterChange}
                onReset={() => setFilters(DEFAULT_FILTERS)}
                totalResults={filtered.length}
                mobile
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ─────────────────────────────────────────────────── */}
      <Filters
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        totalResults={filtered.length}
      />

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main className="md:pl-60 px-4 md:px-6 py-6 pb-36">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">College Comparison</h1>
            <p className="text-slate-500 text-sm">Select up to 3 colleges to compare side by side.</p>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                <GraduationCap size={24} className="text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-700 text-sm mb-1">No colleges found</h3>
              <p className="text-xs text-slate-400">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((college, index) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    index={index}
                    isSelected={selected.includes(college.id)}
                    onToggle={handleToggle}
                    selectionDisabled={selected.length >= MAX_COMPARE && !selected.includes(college.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* ── Compare ribbon ──────────────────────────────────────────────────── */}
      <CompareRibbon
        selected={selected}
        colleges={colleges}
        onRemove={handleRemove}
        onClear={handleClear}
        onCompare={() => setShowModal(true)}
      />

      {/* ── Compare modal — manages its own AnimatePresence internally ──────── */}
      {showModal && (
        <CompareModal
          colleges={selectedColleges}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
