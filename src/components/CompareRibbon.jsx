import { useRef, useState, useEffect } from "react";
import { X, GitCompare, Trash2, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOBILE_BP = 768;
const BOTTOM_OFFSET = 56;

export default function CompareRibbon({
  selected,
  colleges,
  onRemove,
  onClear,
  onCompare,
}) {
  const ribbonRef = useRef(null);
  const dragState = useRef({
    active: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BP);
  const [isDragging, setIsDragging] = useState(false);

  const [desktopPos, setDesktopPos] = useState(() => ({
    x: Math.max(0, (window.innerWidth - 380) / 2),
    y: window.innerHeight - 56 - BOTTOM_OFFSET,
  }));
  const [mobilePos, setMobilePos] = useState({
    right: 12,
    bottom: BOTTOM_OFFSET,
  });

  useEffect(() => {
    let lastMobile = window.innerWidth < MOBILE_BP;
    const check = () => {
      const mobile = window.innerWidth < MOBILE_BP;
      if (mobile !== lastMobile) {
        lastMobile = mobile;
        setIsMobile(mobile);
        if (!mobile) {
          setDesktopPos({
            x: Math.max(0, (window.innerWidth - 380) / 2),
            y: window.innerHeight - 56 - BOTTOM_OFFSET,
          });
        } else {
          setMobilePos({ right: 12, bottom: BOTTOM_OFFSET });
        }
      }
    };
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const el = ribbonRef.current;
    if (!el) return;
    setDesktopPos({
      x: Math.max(0, (window.innerWidth - el.offsetWidth) / 2),
      y: window.innerHeight - el.offsetHeight - BOTTOM_OFFSET,
    });
  }, [isMobile]);

  // ── Drag logic ───────────────────────────────────────────────────────────────
  const startDrag = (clientX, clientY) => {
    const rect = ribbonRef.current.getBoundingClientRect();
    dragState.current = {
      active: true,
      startX: clientX,
      startY: clientY,
      origX: rect.left,
      origY: rect.top,
    };
    setIsDragging(true);
  };

  const moveDrag = (clientX, clientY) => {
    if (!dragState.current.active) return;
    const el = ribbonRef.current;
    const newX = dragState.current.origX + clientX - dragState.current.startX;
    const newY = dragState.current.origY + clientY - dragState.current.startY;
    if (isMobile) {
      setMobilePos({
        right:
          window.innerWidth -
          Math.min(
            Math.max(newX + el.offsetWidth, el.offsetWidth),
            window.innerWidth,
          ),
        bottom:
          window.innerHeight -
          Math.min(
            Math.max(newY + el.offsetHeight, el.offsetHeight),
            window.innerHeight,
          ),
      });
    } else {
      setDesktopPos({
        x: Math.max(0, Math.min(newX, window.innerWidth - el.offsetWidth)),
        y: Math.max(0, Math.min(newY, window.innerHeight - el.offsetHeight)),
      });
    }
  };

  const endDrag = () => {
    dragState.current.active = false;
    setIsDragging(false);
  };

  // Mouse drag — attached to the handle element only
  const onHandleMouseDown = (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
    const move = (ev) => moveDrag(ev.clientX, ev.clientY);
    const up = () => {
      endDrag();
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  // Touch drag — non-passive so preventDefault() stops page scroll
  const onHandleTouchStart = (e) => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
    const move = (ev) => {
      ev.preventDefault(); // prevents page scroll while dragging
      moveDrag(ev.touches[0].clientX, ev.touches[0].clientY);
    };
    const end = () => {
      endDrag();
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };
    window.addEventListener("touchmove", move, { passive: false }); // non-passive = can preventDefault
    window.addEventListener("touchend", end);
  };

  const selectedColleges = colleges.filter((c) => selected.includes(c.id));
  const isEmpty = selected.length === 0;
  const canCompare = selected.length >= 2;

  const handleClass = `text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing transition-colors p-1 touch-none`;

  // ── Mobile: compact vertical pill ───────────────────────────────────────────
  if (isMobile) {
    return (
      <div
        ref={ribbonRef}
        style={{
          right: mobilePos.right,
          bottom: mobilePos.bottom,
          position: "fixed",
          zIndex: 50,
        }}
        className="select-none"
      >
        <motion.div
          animate={{
            boxShadow: isDragging
              ? "0 16px 32px rgba(0,0,0,0.14)"
              : "0 4px 16px rgba(0,0,0,0.08)",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl py-3 px-2.5 flex flex-col items-center gap-2"
        >
          {/* Drag handle */}
          <div
            onMouseDown={onHandleMouseDown}
            onTouchStart={onHandleTouchStart}
            className={handleClass}
            aria-label="Drag to move"
          >
            <GripVertical size={14} />
          </div>

          {!isEmpty && (
            <>
              <div className="flex flex-col items-center">
                <AnimatePresence>
                  {selectedColleges.map((college, i) => (
                    <motion.div
                      key={college.id}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.15 }}
                      className="relative group"
                      style={{
                        marginTop: i === 0 ? 0 : -8,
                        zIndex: selectedColleges.length - i,
                      }}
                    >
                      <img
                        src={college.image}
                        alt={college.name}
                        title={college.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <button
                        onClick={() => onRemove(college.id)}
                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove ${college.name}`}
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <span className="text-[10px] font-semibold text-slate-400 mt-1.5">
                  {selected.length}/3
                </span>
              </div>
              <div className="w-full h-px bg-slate-100" />
              <button
                onClick={onClear}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label="Clear"
              >
                <Trash2 size={13} />
              </button>
            </>
          )}

          <button
            onClick={canCompare ? onCompare : undefined}
            disabled={!canCompare}
            className={`p-2 rounded-xl transition-colors duration-150
              ${canCompare ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
            aria-label="Compare"
          >
            <GitCompare size={15} />
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Desktop: horizontal pill ─────────────────────────────────────────────────
  return (
    <div
      ref={ribbonRef}
      style={{
        left: desktopPos.x,
        top: desktopPos.y,
        position: "fixed",
        zIndex: 50,
      }}
      className="select-none"
    >
      <motion.div
        animate={{
          boxShadow: isDragging
            ? "0 16px 32px rgba(0,0,0,0.12)"
            : "0 4px 16px rgba(0,0,0,0.08)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl px-3 py-3 flex items-center gap-3"
        style={{ minWidth: 360 }}
      >
        {/* Drag handle */}
        <div
          onMouseDown={onHandleMouseDown}
          className={handleClass}
          aria-label="Drag to move"
        >
          <GripVertical size={15} />
        </div>

        {/* Left: avatars or empty hint */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isEmpty ? (
            <p className="text-slate-400 text-sm">Select colleges to compare</p>
          ) : (
            <>
              <div className="flex shrink-0">
                <AnimatePresence>
                  {selectedColleges.map((college, i) => (
                    <motion.div
                      key={college.id}
                      initial={{ opacity: 0, scale: 0.7, x: -8 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.15 }}
                      className="relative group"
                      style={{
                        marginLeft: i === 0 ? 0 : -10,
                        zIndex: selectedColleges.length - i,
                      }}
                    >
                      <img
                        src={college.image}
                        alt={college.name}
                        title={college.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <button
                        onClick={() => onRemove(college.id)}
                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove ${college.name}`}
                      >
                        <X size={11} className="text-white" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <span className="text-slate-600 text-sm font-medium">
                {selected.length} selected
              </span>
            </>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          {!isEmpty && (
            <>
              <div className="w-px h-5 bg-slate-200" />
              <button
                onClick={onClear}
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-xs font-medium transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-100"
              >
                <Trash2 size={12} /> Clear
              </button>
            </>
          )}
          <button
            onClick={canCompare ? onCompare : undefined}
            disabled={!canCompare}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-colors duration-150
              ${canCompare ? "bg-blue-700 hover:bg-blue-800 text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
          >
            <GitCompare size={13} />
            Compare{selected.length >= 2 ? ` (${selected.length})` : ""}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
