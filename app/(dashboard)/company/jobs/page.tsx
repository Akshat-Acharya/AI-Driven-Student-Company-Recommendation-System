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
};

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 px-6 py-10">

      {/* HEADER */}

      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">

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

      {/* JOB LIST */}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

        {jobs.length === 0 && (
          <div className="text-zinc-500 text-sm">
            No jobs created yet.
          </div>
        )}

       {jobs.map((job, index) => (
  <motion.div
    key={job.id}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ y: -6 }}
    className="
    group
    relative
    p-6
    rounded-2xl
    border border-white/10
    bg-gradient-to-b from-white/[0.05] to-white/[0.02]
    backdrop-blur-xl
    overflow-hidden
    transition-all duration-300
    hover:border-indigo-400/40
    hover:shadow-[0_0_40px_rgba(79,70,229,0.25)]
    "
  >

    {/* HOVER GLOW */}

    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full" />
    </div>

    {/* HEADER */}

    <div className="flex items-start justify-between mb-4">

      <div className="flex items-center gap-3">

        {/* ICON */}

        <div className="
          w-11 h-11
          rounded-xl
          bg-gradient-to-br from-indigo-500/20 to-cyan-500/20
          border border-indigo-500/30
          flex items-center justify-center
          group-hover:scale-110 group-hover:rotate-6
          transition
        ">
          <Briefcase className="text-indigo-400" size={18} />
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

      <div className="
        text-[10px]
        px-2 py-1
        rounded-full
        bg-emerald-400/10
        text-emerald-400
        border border-emerald-400/20
      ">
        Active
      </div>

    </div>

    {/* DESCRIPTION */}

    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-5">
      {job.description || "No description provided"}
    </p>

    {/* SKILL TAGS (OPTIONAL IF YOU HAVE) */}

    {/* {job.skills && job.skills.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-5">
        {job.skills.slice(0, 3).map((skill: string) => (
          <span
            key={skill}
            className="
              text-[10px]
              px-2 py-1
              rounded-md
              bg-white/[0.05]
              border border-white/10
              text-zinc-300
            "
          >
            {skill}
          </span>
        ))}
      </div>
    )} */}

    {/* FOOTER */}

    <div className="flex items-center justify-between text-xs text-zinc-500">

      <span>
        
        {new Date(job.createdAt).toDateString()}
      </span>

      <div className="flex items-center gap-2">

        <span className="flex items-center gap-1">
          <MapPin size={12} />
          Remote
        </span>

      </div>

    </div>

    {/* HOVER ACTION */}

    <div className="
      absolute bottom-4 right-4
      opacity-0 group-hover:opacity-100
      translate-y-2 group-hover:translate-y-0
      transition
    ">
      <span className="text-xs text-indigo-400">
        View →
      </span>
    </div>

  </motion.div>
))}
      </div>
        <div> <CreateJobModal open={open} setOpen={setOpen} onSuccess={fetchJobs} /></div>
    </div>
    
  );
  
}