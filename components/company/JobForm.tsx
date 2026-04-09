"use client";

import { useState } from "react";
import { CustomSelect } from "./Select_box";

export default function JobForm({
  mode,
  jobId,
  initialData,
  onSuccess,
}: any) {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    experienceLevel: initialData?.experienceLevel || "",
    minCgpa: initialData?.minCgpa || "",
    employmentType: initialData?.employmentType || "",
    skills: initialData?.requiredSkills?.join(", ") || "",
    domainFocus: initialData?.domainFocus || "",
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

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        title: form.title,
        description: form.description,
        experienceLevel: form.experienceLevel || null,
        minCgpa: form.minCgpa ? Number(form.minCgpa) : null,
        requiredSkills: form.skills
          .split(",")
          .map((s : any) => s.trim())
          .filter(Boolean),
        domainFocus: form.domainFocus || "",
        employmentType: form.employmentType || null,
      };

      const url =
        mode === "create"
          ? "/api/company/jobs"
          : `/api/company/jobs/${jobId}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");

      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">

      <Input
        label="Job Title"
        value={form.title}
        onChange={(e: any) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <CustomSelect
        label="Experience Level"
        value={form.experienceLevel}
        onChange={(val: string) =>
          setForm({ ...form, experienceLevel: val })
        }
        options={["BEGINNER", "INTERMEDIATE", "ADVANCED"]}
      />

      <Input
        label="Minimum CGPA"
        type="number"
        value={form.minCgpa}
        onChange={(e: any) =>
          setForm({ ...form, minCgpa: e.target.value })
        }
      />

      <CustomSelect
        label="Employment Type"
        value={form.employmentType}
        onChange={(val: string) =>
          setForm({ ...form, employmentType: val })
        }
        options={["REMOTE", "ONSITE", "HYBRID"]}
      />

      <Input
        label="Skills"
        value={form.skills}
        onChange={(e: any) =>
          setForm({ ...form, skills: e.target.value })
        }
      />

      <Input
        label="Domain"
        value={form.domainFocus}
        onChange={(e: any) =>
          setForm({ ...form, domainFocus: e.target.value })
        }
      />

      {/* AI BUTTON */}
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-indigo-500/20 rounded"
      >
        {aiLoading ? "Generating..." : "Generate with AI"}
      </button>

      <textarea
        value={form.description}
        onChange={(e: any) =>
          setForm({ ...form, description: e.target.value })
        }
        className="w-full p-3 bg-black border border-white/10 rounded"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-indigo-500 rounded"
      >
        {loading
          ? "Saving..."
          : mode === "create"
          ? "Create Job"
          : "Update Job"}
      </button>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-zinc-500">{label}</label>
      <input {...props} className="p-3 bg-black border border-white/10 rounded" />
    </div>
  );
}