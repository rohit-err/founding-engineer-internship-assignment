import { MapPin, DollarSign, Star, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={
            i <= full
              ? 'text-amber-400 fill-amber-400'
              : i === full + 1 && hasHalf
              ? 'text-amber-300 fill-amber-200'
              : 'text-slate-200 fill-slate-100'
          }
        />
      ))}
      <span className="text-sm font-semibold text-slate-700 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.18, delay: i * 0.03, ease: 'easeOut' } }),
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

export default function CollegeCard({ college, isSelected, onToggle, selectionDisabled, index = 0 }) {
  const canAdd = !isSelected && !selectionDisabled;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      className={`bg-white rounded-xl overflow-hidden border flex flex-col
        ${isSelected
          ? 'border-blue-600 shadow-md ring-2 ring-blue-600/10'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
        }`}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-slate-100 shrink-0">
        <img
          src={college.image}
          alt={college.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full"
            >
              Selected
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-900 text-sm mb-1 truncate">{college.name}</h3>

        <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
          <MapPin size={11} className="shrink-0" />
          <span className="truncate">{college.location}</span>
        </div>

        <div className="border-t border-slate-100 pt-3 space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Fees / yr</span>
            <div className="flex items-center gap-0.5 text-slate-800 font-semibold text-sm">
              <DollarSign size={12} />
              {college.fees.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Rating</span>
            <StarRating rating={college.rating} />
          </div>
        </div>

        <button
          onClick={() => onToggle(college.id)}
          disabled={!isSelected && selectionDisabled}
          className={`mt-auto w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors duration-200
            ${isSelected
              ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
              : canAdd
              ? 'bg-slate-900 text-white hover:bg-blue-700'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
        >
          {isSelected
            ? <><Minus size={13} /> Remove from Compare</>
            : canAdd
            ? <><Plus size={13} /> Add to Compare</>
            : 'Max 3 selected'
          }
        </button>
      </div>
    </motion.div>
  );
}
