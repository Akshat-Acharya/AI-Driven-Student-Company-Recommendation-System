"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

export default function CreateJobModal({
  open,
  setOpen,
  onSuccess,
}: any) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    experienceLevel: "",
    minCgpa: "",
  });

  const handleCreate = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/company/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          minCgpa: form.minCgpa ? Number(form.minCgpa) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      onSuccess();
      setOpen(false);

      setForm({
        title: "",
        description: "",
        experienceLevel: "",
        minCgpa: "",
      });

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* MODAL CENTER FIX */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="
              fixed inset-0 z-50
              flex items-center justify-center
              px-4
            "
          >
            <div
              className="
                relative
                w-full max-w-2xl
                rounded-3xl
                border border-white/10
                bg-gradient-to-b from-[#111113] to-[#0b0b0d]
                backdrop-blur-xl
                p-10
                shadow-[0_40px_120px_-30px_rgba(79,70,229,0.4)]
                flex flex-col gap-6
              "
            >
              {/* GLOW */}
              <div className="absolute -top-20 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

              {/* CLOSE */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>

              {/* HEADER */}
              <div>
                <h2 className="text-2xl font-semibold">
                  Create New Job
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Add a new job posting for candidates
                </p>
              </div>

              {/* FORM GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <Input
                  label="Job Title"
                  value={form.title}
                  onChange={(e: any) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />

                <Select
                  label="Experience Level"
                  value={form.experienceLevel}
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      experienceLevel: e.target.value,
                    })
                  }
                >
                  <option value="">Select</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </Select>

                <Input
                  label="Minimum CGPA"
                  type="number"
                  value={form.minCgpa}
                  onChange={(e: any) =>
                    setForm({ ...form, minCgpa: e.target.value })
                  }
                />

              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">
                  Job Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e: any) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={4}
                  className="
                    w-full
                    rounded-xl
                    bg-white/[0.04]
                    border border-white/10
                    p-3
                    text-sm
                    outline-none
                    focus:border-indigo-500
                  "
                />
              </div>

              {/* BUTTON */}
              <button
                onClick={handleCreate}
                disabled={loading}
                className="
                  mt-2
                  w-full
                  py-3
                  rounded-xl
                  bg-gradient-to-r
                  from-indigo-500
                  via-blue-500
                  to-cyan-500
                  text-white
                  font-semibold
                  hover:opacity-90
                  transition
                "
              >
                {loading ? "Creating..." : "Create Job"}
              </button>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* INPUT */

function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-zinc-400">{label}</label>
      <input
        {...props}
        className="
          w-full
          rounded-xl
          bg-white/[0.04]
          border border-white/10
          px-4 py-2.5
          text-sm
          outline-none
          focus:border-indigo-500
        "
      />
    </div>
  );
}

/* SELECT */

function Select({ label, children, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-zinc-400">{label}</label>
      <select
        {...props}
        className="
          w-full
          rounded-xl
          bg-white/[0.04]
          border border-white/10
          px-4 py-2.5
          text-sm
          outline-none
          focus:border-indigo-500
        "
      >
        {children}
      </select>
    </div>
  );
}