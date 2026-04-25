import { useEffect, useState } from 'react';
import { X, MapPin, DollarSign, Star, Users, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className={
            i <= full
              ? 'text-amber-400 fill-amber-400'
              : i === full + 1 && hasHalf
              ? 'text-amber-300 fill-amber-200'
              : 'text-slate-200 fill-slate-100'
          }
        />
      ))}
      <span className="text-sm font-semibold text-slate-800 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function AcceptanceBar({ value }) {
  const pct = parseFloat(value);
  const barColor = pct < 10 ? 'bg-red-400' : pct < 20 ? 'bg-amber-400' : 'bg-emerald-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${Math.min(pct * 2, 100)}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-700 w-10 text-right shrink-0">{value}</span>
    </div>
  );
}

const ROWS = [
  { key: 'location',            label: 'Location',              icon: MapPin,       render: (c) => c.location },
  { key: 'fees',                label: 'Annual Fees',           icon: DollarSign,   render: (c) => <span className="font-semibold text-slate-900">${c.fees.toLocaleString()}</span>, best: (cs) => cs.reduce((a, b) => a.fees < b.fees ? a : b).id },
  { key: 'rating',              label: 'Rating',                icon: Star,         render: (c) => <StarRating rating={c.rating} />, best: (cs) => cs.reduce((a, b) => a.rating > b.rating ? a : b).id },
  { key: 'acceptanceRate',      label: 'Acceptance Rate',       icon: TrendingDown, render: (c) => <AcceptanceBar value={c.acceptanceRate} /> },
  { key: 'studentFacultyRatio', label: 'Student-Faculty Ratio', icon: Users,        render: (c) => c.studentFacultyRatio },
];

export default function CompareModal({ colleges, onClose }) {
  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      window.removeEventListener('keydown', handler);
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onClose}>
      {open && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={handleClose}
          className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
        />
      )}
      {open && (
        <motion.div
          key="modal-sheet"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 32, stiffness: 280 }}
          className="fixed inset-x-0 bottom-0 z-[101] flex flex-col bg-white rounded-t-2xl shadow-2xl overflow-hidden"
          style={{ maxHeight: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-slate-100 shrink-0">
            <div>
              <h2 className="text-base md:text-lg font-bold text-slate-900">Side-by-Side Comparison</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {colleges.length} institution{colleges.length > 1 ? 's' : ''} selected
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors duration-150"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-auto compare-scroll flex-1">
            <table className="w-full border-collapse" style={{ minWidth: colleges.length > 1 ? 460 : 'auto' }}>
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th className="text-left py-4 px-5 md:px-8 w-32 md:w-44 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Metric</span>
                  </th>
                  {colleges.map((college) => (
                    <th key={college.id} className="py-4 px-4 md:px-6 border-b border-slate-100 text-left">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={college.image}
                          alt={college.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 text-xs md:text-sm leading-tight">{college.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5 hidden md:block">{college.location}</div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, idx) => {
                  const Icon = row.icon;
                  const bestId = row.best ? row.best(colleges) : null;
                  return (
                    <tr
                      key={row.key}
                      className={`border-b border-slate-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                    >
                      <td className="py-4 px-5 md:px-8">
                        <div className="flex items-center gap-1.5">
                          <Icon size={12} className="text-slate-400 shrink-0" />
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{row.label}</span>
                        </div>
                      </td>
                      {colleges.map((college) => (
                        <td key={college.id} className="py-4 px-4 md:px-6 text-sm text-slate-700 relative">
                          {bestId === college.id && (
                            <span className="absolute top-2 right-3 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                              Best
                            </span>
                          )}
                          {row.render(college)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* About */}
            <div className="px-5 md:px-8 py-6 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">About</p>
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${colleges.length}, 1fr)` }}
              >
                {colleges.map((college) => (
                  <div key={college.id} className="bg-slate-50 rounded-xl p-3 md:p-4">
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{college.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
