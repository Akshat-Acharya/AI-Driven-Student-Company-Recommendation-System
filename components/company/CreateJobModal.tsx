"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useState } from "react";
import { CustomSelect } from "./Select_box";
import SkillInput from "./SkillInput";

export default function CreateJobModal({ open, setOpen, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState<any>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    experienceLevel: "",
    minCgpa: "",
    employmentType: "",
    skills: "",
    domainFocus: "",
  });

  /* ---------------- AI GENERATE ---------------- */

  const handleGenerate = async () => {
    if (!form.title) return;

    try {
      setAiLoading(true);

      const res = await fetch("/api/company/generate-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAiData(data);

      setForm((prev) => ({
        ...prev,
        description:
          data.description?.replace(/\\n/g, "\n").replace(/\*\*/g, "") ||
          prev.description,
        experienceLevel: data.experienceLevel || prev.experienceLevel,
        skills: data.skills?.join(", ") || prev.skills,
        domainFocus: data.domainFocus || prev.domainFocus,
      }));
    } catch (err) {
      console.error(err);
    }

    setAiLoading(false);
  };

  /* ---------------- CREATE JOB ---------------- */

  const handleCreate = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/company/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          experienceLevel: form.experienceLevel || null,
          minCgpa: form.minCgpa ? Number(form.minCgpa) : null,
          skills: form.skills
            ? form.skills.split(",").map((s) => s.trim())
            : [],
          domainFocus: form.domainFocus || "",
          employmentType: form.employmentType || null,
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
        employmentType: "",
        skills: "",
        domainFocus: "",
      });

      setAiData(null);
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div
              className="
              relative w-full max-w-3xl
              rounded-[28px]
              border border-white/10
              bg-gradient-to-b from-[#111113] to-[#0b0b0d]
              backdrop-blur-2xl
              p-8
              shadow-[0_50px_150px_-20px_rgba(79,70,229,0.45)]
              overflow-hidden
            "
            >
              {/* GLOW */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute -top-20 right-0 w-72 h-72 bg-indigo-500/20 blur-[100px] rounded-full" />
              </div>

              {/* CLOSE */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-5 right-5 text-zinc-500 hover:text-white transition"
              >
                <X size={20} />
              </button>

              {/* HEADER */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Create New Job
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Define role requirements and let AI assist you
                </p>
              </div>

              {/* FORM */}
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-x-4 gap-y-6 items-start">
                  <Input
                    label="Job Title"
                    placeholder="Frontend Developer"
                    value={form.title}
                    onChange={(e: any) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />

                  <div className="min-h-[72px] relative z-20">
                    <CustomSelect
                      label="Experience Level"
                      value={form.experienceLevel}
                      onChange={(val: string) =>
                        setForm({ ...form, experienceLevel: val })
                      }
                      options={["BEGINNER", "INTERMEDIATE", "ADVANCED"]}
                    />
                  </div>

                  <Input
                    label="Minimum CGPA"
                    type="number"
                    placeholder="Number under 10"
                    value={form.minCgpa}
                    onChange={(e: any) =>
                      setForm({ ...form, minCgpa: e.target.value })
                    }
                  />

                  <div className="min-h-[72px] relative z-10">
                    <CustomSelect
                      label="Employment Type"
                      value={form.employmentType}
                      onChange={(val: string) =>
                        setForm({ ...form, employmentType: val })
                      }
                      options={["REMOTE", "ONSITE", "HYBRID"]}
                    />
                  </div>

                  <SkillInput
                    value={form.skills ? form.skills.split(",").map((s) => s.trim()) : []}
                    onChange={(skills) =>
                      setForm({ ...form, skills: skills.join(", ") })
                    }
                  />

                  <Input
                    label="Domain"
                    placeholder="Technology"
                    value={form.domainFocus}
                    onChange={(e: any) =>
                      setForm({ ...form, domainFocus: e.target.value })
                    }
                  />
                </div>

                {/* AI SECTION */}
                <div
                  className="
                  flex items-center justify-between
                  rounded-2xl
                  border border-indigo-500/20
                  bg-gradient-to-br from-indigo-500/10 to-transparent
                  p-5
                "
                >
                  <div>
                    <p className="text-sm font-medium text-indigo-300 flex items-center gap-2">
                      <Sparkles size={14} />
                      AI Job Generator
                    </p>
                    <p className="text-xs text-zinc-400">
                      Enter job title to enable AI generation
                    </p>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={aiLoading || !form.title}
                    className={`
                      px-4 py-2 text-sm rounded-lg transition
                      ${
                        !form.title
                          ? "bg-white/10 text-zinc-500 cursor-not-allowed"
                          : "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                      }
                    `}
                  >
                    {aiLoading ? "Generating..." : "Generate"}
                  </button>
                </div>

                {/* DESCRIPTION */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-400">Description</label>
                  <textarea
                  placeholder="Job description....."
                    value={form.description}
                    onChange={(e: any) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={5}
                    className="
                      w-full rounded-xl
                      bg-white/[0.04]
                      border border-white/10
                      p-4 text-sm
                      focus:border-indigo-500
                      transition
                    "
                  />
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="
                      flex-1 py-3 rounded-xl
                      border border-white/10
                      bg-white/[0.03]
                      hover:bg-white/[0.06]
                      text-sm
                    "
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="
                      flex-1 py-3 rounded-xl
                      bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500
                      text-white font-semibold
                      hover:opacity-90 transition
                    "
                  >
                    {loading ? "Creating..." : "Create Job"}
                  </button>
                </div>
              </div>
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
    <div className="flex flex-col gap-2 min-h-[72px]">
      <label className="text-xs text-zinc-500">{label}</label>
      <input
        {...props}
        className="
        h-[48px]
        w-full rounded-xl
        bg-white/[0.04]
        border border-white/10
        px-4 text-sm text-white
        outline-none
        transition-all duration-300
        focus:border-indigo-500
        focus:ring-2 focus:ring-indigo-500/20
        hover:border-white/20
        "
      />
    </div>
  );
}
