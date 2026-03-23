"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Briefcase, MapPin } from "lucide-react";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);
const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/student/jobs/${jobId}`);
      const data = await res.json();
      setJob(data.job);
    } catch (err) {
      console.error(err);
    }
  };
  const handleApply = async () => {
  try {
    setLoading(true);

    const res = await fetch("/api/student/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to apply");
      return;
    }

    setApplied(true);
    alert("Application submitted");
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  if (!job) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-10">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{job.title}</h1>

          <p className="text-indigo-400 mt-2 text-sm">
            {job.company.companyName}
          </p>

          <div className="flex gap-4 text-xs text-zinc-500 mt-3">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {job.employmentType || "Remote"}
            </span>

            <span>
              {new Date(job.createdAt).toDateString()}
            </span>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] mb-6">
          <h2 className="text-sm text-zinc-400 mb-3">
            Job Description
          </h2>

          <p className="text-sm text-zinc-300 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* DOMAINS */}
        {job.domainFocus && (
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] mb-6">
            <h2 className="text-sm text-zinc-400 mb-3">
              Domain
            </h2>

            <span className="px-3 py-1 rounded-lg text-xs bg-indigo-500/20 text-indigo-300">
              {job.domainFocus}
            </span>
          </div>
        )}

        {/* SKILLS */}
        {job.requiredSkills?.length > 0 && (
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] mb-6">
            <h2 className="text-sm text-zinc-400 mb-3">
              Required Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill: string) => (
                <span
                  key={skill}
                  className="
                    px-3 py-1 rounded-lg text-xs
                    bg-white/[0.05] border border-white/10
                  "
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* APPLY BUTTON */}
       <button
  onClick={handleApply}
  disabled={loading || applied}
  className={`
    w-full py-3 rounded-xl font-medium transition
    ${
      applied
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/20"
        : "bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:opacity-90"
    }
  `}
>
  {loading
    ? "Applying..."
    : applied
    ? "Applied"
    : "Apply Now"}
</button>

      </div>
    </div>
  );
}