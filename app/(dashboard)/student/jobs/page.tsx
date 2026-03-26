"use client";

import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  description?: string;
  domainFocus?: string;
  createdAt: string;
  isApplied: boolean; // ✅ NEW
  company: {
    companyName: string;
  };
};

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "ALL" | "APPLIED" | "NOT_APPLIED"
  >("ALL");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/student/jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FILTER LOGIC
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" ||
      (filter === "APPLIED" && job.isApplied) ||
      (filter === "NOT_APPLIED" && !job.isApplied);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold">Explore Jobs</h1>
        <p className="text-zinc-400 text-sm">
          Discover opportunities from top companies
        </p>
      </div>

      {/* 🔍 SEARCH + FILTER */}
      <div className="max-w-6xl mx-auto mb-8 space-y-4">

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search jobs by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full p-3 rounded-xl
            bg-white/[0.05]
            border border-white/10
            text-sm text-white
            placeholder:text-zinc-500
            focus:outline-none focus:border-indigo-400/40
          "
        />

        {/* FILTER CHIPS */}
        <div className="flex gap-2 flex-wrap">
          {["ALL", "APPLIED", "NOT_APPLIED"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`
                px-4 py-1.5 rounded-full text-xs transition
                ${
                  filter === type
                    ? "bg-indigo-500 text-white"
                    : "bg-white/[0.05] text-zinc-400 border border-white/10 hover:bg-white/[0.08]"
                }
              `}
            >
              {type === "ALL"
                ? "All Jobs"
                : type === "APPLIED"
                ? "Applied"
                : "Not Applied"}
            </button>
          ))}
        </div>

      </div>

      {/* JOB LIST */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

        {filteredJobs.length === 0 ? (
          <p className="text-zinc-500">No jobs found</p>
        ) : (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="
                group p-6 rounded-2xl
                border border-white/10
                bg-white/[0.03]
                hover:border-indigo-400/40
                transition
              "
            >

              {/* TOP */}
              <div className="flex justify-between mb-4">

                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {job.title}

                    {/* 🏷️ APPLIED BADGE */}
                    {job.isApplied && (
                      <span className="
                        text-[10px] px-2 py-0.5 rounded-full
                        bg-green-500/10 text-green-400
                        border border-green-400/20
                      ">
                        Applied
                      </span>
                    )}
                  </h3>

                  <p className="text-sm text-indigo-400 mt-1">
                    {job.company.companyName}
                  </p>
                </div>

                <Briefcase className="text-indigo-400" />
              </div>

              {/* DESC */}
              <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                {job.description || "No description provided"}
              </p>

              {/* FOOTER */}
              <div className="flex justify-between items-center text-xs text-zinc-500">

                <span>
                  {new Date(job.createdAt).toDateString()}
                </span>

                <Link href={`/student/jobs/${job.id}`}>
                  <button
                   
                    className={`
                      px-3 py-1.5 rounded-lg transition
                           "bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 hover:bg-indigo-500/20"
                    `}
                  >
                    "View →"
                  </button>
                </Link>

              </div>

            </motion.div>
          ))
        )}

      </div>
    </div>
  );
}