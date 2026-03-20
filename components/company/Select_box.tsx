"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CustomSelect({ label, value, onChange, options }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full z-10 min-h-[72px]">

      {/* LABEL */}
      <label className="text-xs text-zinc-500 mb-2 block">
        {label}
      </label>

      {/* TRIGGER */}
      <button
        onClick={() => setOpen(!open)}
        className={`
        h-[48px] w-full
        flex items-center justify-between
        rounded-xl px-4 text-sm

        bg-gradient-to-b from-white/[0.06] to-white/[0.02]
        border border-white/10

        shadow-inner shadow-black/40

        transition-all duration-300

        ${
          open
            ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
            : "hover:border-white/20"
        }
        `}
      >
        <span className={value ? "text-white" : "text-zinc-500"}>
          {value || "Select option"}
        </span>

        <ChevronDown
          size={16}
          className={`
          transition-all duration-300
          ${open ? "rotate-180 text-indigo-400" : "text-zinc-500"}
          `}
        />
      </button>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="
            absolute left-0 top-full mt-2 w-full z-50

            rounded-xl

            border border-white/15
            ring-1 ring-white/10

            bg-[#121216]   /* 🔥 FIXED: SOLID BACKGROUND */

            shadow-[0_40px_120px_-20px_rgba(0,0,0,0.95)]

            overflow-hidden
            "
          >

            {/* subtle glow */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-indigo-500/20 blur-2xl" />
            </div>

            <div className="relative max-h-56 overflow-y-auto">

              {options.map((opt: string, i: number) => (
                <motion.div
                  key={opt}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.015 }}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`
                  flex items-center justify-between
                  px-4 py-2.5 text-sm cursor-pointer
                  transition-all duration-200

                  ${
                    value === opt
                      ? "bg-indigo-500/20 text-white"
                      : "text-zinc-300 hover:bg-white/[0.08]"
                  }
                  `}
                >
                  <span>{opt}</span>

                  {value === opt && (
                    <Check size={14} className="text-indigo-400" />
                  )}
                </motion.div>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}