"use client";

import { useEffect, useState } from "react";
import { Briefcase, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  description?: string;
  domainFocus?: string;
  createdAt: string;
  company: {
    companyName: string;
  };
};

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

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

  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">Explore Jobs</h1>
        <p className="text-zinc-400 text-sm">
          Discover opportunities from top companies
        </p>
      </div>

      {/* JOB LIST */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

        {jobs.length === 0 ? (
          <p className="text-zinc-500">No jobs available</p>
        ) : (
          jobs.map((job, index) => (
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
                  <h3 className="text-lg font-semibold">
                    {job.title}
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
                  <button className="
                    px-3 py-1.5 rounded-lg
                    bg-indigo-500/10 text-indigo-400
                    border border-indigo-400/20
                    hover:bg-indigo-500/20
                  ">
                    View →
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