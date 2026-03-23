"use client";

import { useEffect, useState } from "react";
import { Plus, Briefcase, MapPin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import CreateJobModal from "@/components/company/CreateJobModal";

type Job = {
  id: string;
  title: string;
  description?: string;
  domainFocus?: string;
  createdAt: string;
  status?: "ACTIVE" | "COMPLETED";
};

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/company/jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredJobs = jobs.filter((job) => {
    if (filter === "ALL") return true;
    return job.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 px-6 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">Your Jobs</h1>
          <p className="text-zinc-400 text-sm">
            Manage and track all your job postings
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-white font-medium hover:opacity-90 transition"
        >
          <Plus size={16} />
          Create Job
        </button>
      </div>

      {/* 🔥 FILTER TABS */}
      <div className="max-w-6xl mx-auto flex gap-2 mb-6">

        {["ALL", "ACTIVE", "COMPLETED"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`
              px-4 py-1.5 rounded-lg text-sm border transition
              ${
                filter === type
                  ? "bg-indigo-500/20 text-indigo-300 border-indigo-400/30"
                  : "bg-white/[0.03] text-zinc-400 border-white/10 hover:bg-white/[0.06]"
              }
            `}
          >
            {type}
          </button>
        ))}

      </div>

      {/* JOB LIST */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

        {filteredJobs.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-4">
              <Briefcase className="text-zinc-400" />
            </div>
            <p className="text-zinc-400 text-sm">No jobs found</p>
            <p className="text-zinc-600 text-xs mt-1">
              Try switching filters or create a new job
            </p>
          </div>
        ) : (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className={`
                group relative flex flex-col justify-between
                p-6 rounded-2xl border
                backdrop-blur-xl overflow-hidden
                transition-all duration-300
                ${
                  job.status === "COMPLETED"
                    ? "border-white/5 opacity-70"
                    : "border-white/10 hover:border-indigo-400/40 hover:shadow-[0_0_40px_rgba(79,70,229,0.25)]"
                }
              `}
            >

              {/* HOVER GLOW ONLY FOR ACTIVE */}
              {job.status === "ACTIVE" && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full" />
                </div>
              )}

              {/* TOP */}
              <div>
                <div className="flex items-start justify-between mb-4">

                  <div className="flex items-center gap-3">

                    <div className={`
                      w-11 h-11 rounded-xl flex items-center justify-center
                      border transition
                      ${
                        job.status === "COMPLETED"
                          ? "bg-white/5 border-white/10"
                          : "bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border-indigo-500/30"
                      }
                    `}>
                      <Briefcase
                        className={job.status === "COMPLETED" ? "text-zinc-500" : "text-indigo-400"}
                        size={18}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold leading-tight">
                        {job.title}
                      </h3>

                      {job.domainFocus && (
                        <p className="text-xs text-indigo-400 mt-1">
                          {job.domainFocus}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* STATUS BADGE */}
                  <div className={`
                    text-[10px] px-2 py-1 rounded-full border
                    ${
                      job.status === "ACTIVE"
                        ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                        : "bg-zinc-500/10 text-zinc-400 border-zinc-400/20"
                    }
                  `}>
                    {job.status || "ACTIVE"}
                  </div>
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-5">
                  {job.description || "No description provided"}
                </p>
              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between mt-4">

                <div className="text-xs text-zinc-500 flex flex-col gap-1">
                  <span>
                    {new Date(job.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    Remote
                  </span>
                </div>

                <Link href={`/company/jobs/${job.id}`}>
                  <button className="
                    text-xs px-4 py-2 rounded-lg
                    bg-indigo-500/10 text-indigo-400
                    border border-indigo-400/20
                    hover:bg-indigo-500/20
                    transition
                  ">
                    View →
                  </button>
                </Link>

              </div>
            </motion.div>
          ))
        )}
      </div>

      <CreateJobModal open={open} setOpen={setOpen} onSuccess={fetchJobs} />
    </div>
  );
}