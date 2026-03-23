"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function RecommendationsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/student/recommendations");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Sparkles size={18} className="text-indigo-400" />
          Recommended Jobs
        </h1>

        <span className="text-sm text-zinc-500">
          {jobs.length} matches
        </span>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-zinc-500 text-sm">Finding best matches...</p>
      )}

      {/* EMPTY */}
      {!loading && jobs.length === 0 && (
        <div className="border border-white/10 p-6 rounded-xl text-zinc-500 text-sm">
          No recommendations found. Try updating your profile.
        </div>
      )}

      {/* JOB LIST */}
      <div className="grid md:grid-cols-2 gap-5">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="
              p-5 rounded-2xl
              border border-white/10
              bg-white/[0.03]
              backdrop-blur-xl
              hover:border-indigo-400/30
              transition
            "
          >
            {/* TOP */}
            <div className="flex justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold">
                  {job.title}
                </h3>
                <p className="text-xs text-zinc-500">
                  {job.company?.companyName}
                </p>
              </div>

              {/* SCORE */}
              <div className="
                text-xs px-2 py-1 rounded-full
                bg-indigo-500/20 text-indigo-300
              ">
                {job.score}%
              </div>
            </div>

            {/* TAGS (WHY MATCH) */}
            <div className="flex flex-wrap gap-2 mb-4">
              {job.requiredSkills?.slice(0, 4).map((skill: string) => (
                <span
                  key={skill}
                  className="
                    text-[10px] px-2 py-1 rounded-md
                    bg-white/[0.05]
                    border border-white/10
                    text-zinc-300
                  "
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* DETAILS */}
            <p className="text-xs text-zinc-500 mb-4 line-clamp-2">
              {job.description}
            </p>

            {/* ACTION */}
            <a
              href={`/student/jobs/${job.id}`}
              className="
                text-xs text-indigo-400
                hover:underline
              "
            >
              View Job →
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}