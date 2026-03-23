"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function DeleteConfirmModal({
  open,
  setOpen,
  onConfirm,
  loading,
}: any) {
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="
              relative w-full max-w-md
              rounded-2xl
              border border-white/10
              bg-gradient-to-b from-[#111113] to-[#0b0b0d]
              backdrop-blur-2xl
              p-6
              shadow-[0_40px_120px_-20px_rgba(239,68,68,0.4)]
            ">

              {/* CLOSE */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white"
              >
                <X size={18} />
              </button>

              {/* CONTENT */}
              <div className="flex flex-col items-center text-center">

                {/* ICON */}
                <div className="
                  w-12 h-12 mb-4
                  rounded-xl
                  bg-red-500/10
                  border border-red-500/20
                  flex items-center justify-center
                ">
                  <AlertTriangle className="text-red-400" size={20} />
                </div>

                <h2 className="text-lg font-semibold mb-2">
                  Delete Job?
                </h2>

                <p className="text-sm text-zinc-400 mb-6">
                  This action cannot be undone. This will permanently delete the job posting.
                </p>

                {/* ACTIONS */}
                <div className="flex gap-3 w-full">

                  <button
                    onClick={() => setOpen(false)}
                    className="
                      flex-1 py-2.5 rounded-lg
                      border border-white/10
                      bg-white/[0.03]
                      hover:bg-white/[0.06]
                      text-sm
                    "
                  >
                    Cancel
                  </button>

                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="
                      flex-1 py-2.5 rounded-lg
                      bg-red-500 text-white
                      hover:bg-red-600
                      transition
                      text-sm font-medium
                    "
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>

                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}