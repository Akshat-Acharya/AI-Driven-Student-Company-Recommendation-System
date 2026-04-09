"use client";

import { useEffect, useState } from "react";
import { Sparkles, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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

  const getScoreColor = (score: number) => {
    if (score >= 75) return "bg-green-500/20 text-green-400 border-green-400/20";
    if (score >= 50) return "bg-yellow-500/20 text-yellow-400 border-yellow-400/20";
    return "bg-red-500/20 text-red-400 border-red-400/20";
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles size={20} className="text-indigo-400" />
            Recommended Jobs
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            AI-powered matches based on your profile
          </p>
        </div>

        <span className="text-sm text-zinc-500">
          {jobs.length} matches
        </span>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="max-w-6xl mx-auto">
          <p className="text-zinc-500 text-sm animate-pulse">
            Finding best matches for you...
          </p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && jobs.length === 0 && (
        <div className="max-w-6xl mx-auto">
          <div className="
            border border-white/10 p-8 rounded-2xl
            text-zinc-500 text-sm text-center
            bg-white/[0.03]
          ">
            No recommendations found. Try updating your profile.
          </div>
        </div>
      )}

      {/* JOB LIST */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

        {jobs.map((job, index) => (
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
            <div className="flex justify-between items-start mb-4">

              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {job.title}
                </h3>

                <p className="text-sm text-indigo-400 mt-1">
                  {job.company?.companyName}
                </p>
              </div>

              {/* SCORE BADGE */}
              <div className={`
                text-xs px-3 py-1 rounded-full border
                ${getScoreColor(job.score)}
              `}>
                {job.score}%
              </div>
            </div>

            {/* SKILLS */}
            <div className="flex flex-wrap gap-2 mb-4">
              {job.requiredSkills?.slice(0, 5).map((skill: string) => (
                <span
                  key={skill}
                  className="
                    text-[11px] px-2 py-1 rounded-md
                    bg-white/[0.05]
                    border border-white/10
                    text-zinc-300
                    group-hover:bg-white/[0.08]
                    transition
                  "
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm text-zinc-400 line-clamp-2 mb-5 leading-relaxed">
              {job.description || "No description provided"}
            </p>

            {/* FOOTER */}
            <div className="flex justify-between items-center">

              {/* AI TAG */}
              <span className="
                text-[10px] px-2 py-1 rounded-full
                bg-indigo-500/10 text-indigo-400
                border border-indigo-400/20
              ">
                AI Matched
              </span>

              {/* ACTION */}
              <Link href={`/student/jobs/${job.id}`}>
                <button className="
                  text-sm text-indigo-400
                  hover:underline
                ">
                  View →
                </button>
              </Link>

            </div>

          </motion.div>
        ))}

      </div>
    </div>
  );
}