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
    const res = await fetch("/api/company/jobs");
    const data = await res.json();
    setJobs(data.jobs || []);
  };

  const filteredJobs = jobs.filter((job) => {
    if (filter === "ALL") return true;
    return job.status === filter;
  });

  return (
    <div className="relative w-full min-h-screen text-white px-8 py-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Your Jobs
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage and track all your job postings
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="
            flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-gradient-to-r from-indigo-500 to-cyan-500
            text-white font-medium
            shadow-lg hover:scale-[1.05]
            transition
          "
        >
          <Plus size={16} />
          Create Job
        </button>
      </div>

      {/* FILTERS (NO BOX) */}
      <div className="flex gap-3 mb-8">
        {["ALL", "ACTIVE", "COMPLETED"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`
              px-4 py-1.5 rounded-lg text-sm transition
              ${
                filter === type
                  ? "bg-indigo-500 text-white shadow"
                  : "text-zinc-400 hover:bg-white/[0.05]"
              }
            `}
          >
            {type}
          </button>
        ))}
      </div>

      {/* JOB GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {filteredJobs.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mb-4">
              <Briefcase className="text-zinc-500" />
            </div>
            <p className="text-zinc-400 text-sm">No jobs found</p>
            <p className="text-zinc-600 text-xs mt-1">
              Create your first job to get started
            </p>
          </div>
        ) : (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className={`
                group relative flex flex-col justify-between
                p-6 rounded-2xl
                border border-white/10
                bg-white/[0.03]
                hover:border-indigo-400/40
                hover:shadow-[0_0_40px_rgba(79,70,229,0.25)]
                transition-all duration-300
                ${job.status === "COMPLETED" && "opacity-60"}
              `}
            >

              {/* subtle hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/20 blur-[80px]" />
              </div>

              {/* TOP */}
              <div>
                <div className="flex items-start justify-between mb-4">

                  <div className="flex items-center gap-3">

                    <div className="
                      w-11 h-11 rounded-xl flex items-center justify-center
                      bg-gradient-to-br from-indigo-500/20 to-cyan-500/20
                      border border-indigo-400/30
                    ">
                      <Briefcase className="text-indigo-400" size={18} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">
                        {job.title}
                      </h3>

                      {job.domainFocus && (
                        <p className="text-xs text-indigo-400 mt-1">
                          {job.domainFocus}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* STATUS */}
                  <span className={`
                    text-[10px] px-2 py-1 rounded-full border
                    ${
                      job.status === "ACTIVE"
                        ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                        : "bg-zinc-500/10 text-zinc-400 border-zinc-400/20"
                    }
                  `}>
                    {job.status || "ACTIVE"}
                  </span>
                </div>

                <p className="text-sm text-zinc-400 line-clamp-2 mb-6">
                  {job.description || "No description provided"}
                </p>
              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between">

                <div className="text-xs text-zinc-500 space-y-1">
                  <div>
                    {new Date(job.createdAt).toLocaleDateString("en-IN")}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    Remote
                  </div>
                </div>

                <Link href={`/company/jobs/${job.id}`}>
                  <button className="
                    px-4 py-2 text-xs rounded-lg
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