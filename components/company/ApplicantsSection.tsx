"use client";

import { useEffect, useState } from "react";
import { Sparkles, RefreshCw, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function ApplicantsSection({ jobId }: { jobId: string }) {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await fetch(
        `/api/company/jobs/${jobId}/applications`
      );
      const data = await res.json();
      setApps(data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 STATUS UPDATE */
  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/company/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchApplicants();
  };

  /* 🔥 RE-EVALUATE */
  const reEvaluate = async (studentId: string) => {
    await fetch(`/api/company/re-evaluate`, {
      method: "POST",
      body: JSON.stringify({ jobId, studentId }),
    });
    fetchApplicants();
  };

  const topFive = apps.slice(0, 5);
  const others = apps.slice(5);

  const getStatusColor = (status: string) => {
    if (status === "SHORTLISTED") return "text-emerald-400";
    if (status === "REJECTED") return "text-red-400";
    return "text-indigo-400";
  };

  return (
    <div>
      <div className="mb-8 flex justify-between">
        <h2 className="text-2xl font-semibold flex gap-2 items-center">
          <Sparkles size={18} className="text-indigo-400" />
          AI Ranked Applicants
        </h2>
        <span className="text-sm text-zinc-500">
          {apps.length} candidates
        </span>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && (
        <>
          {/* TOP 5 */}
          <div className="space-y-5 mb-10">
            {topFive.map((app, i) => (
              <motion.div
                key={app.id}
                className="p-5 rounded-2xl border border-indigo-400/30 bg-indigo-500/5"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="text-white font-semibold">
                    #{i + 1} {app.student.fullName}
                  </h3>

                  <span className="text-xs bg-indigo-500/20 px-2 py-1 rounded">
                    {app.score}%
                  </span>
                </div>

                <p className="text-xs text-zinc-500 mb-2">
                  {app.student.user.email}
                </p>

                <p className="text-xs text-zinc-400 mb-3">
                  {app.explanation}
                </p>

                {/* SKILLS */}
                <div className="flex gap-2 flex-wrap mb-3">
                  {app.student.skills?.slice(0, 4).map((s: string) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 flex-wrap text-xs">
                  <button
                    onClick={() => updateStatus(app.id, "SHORTLISTED")}
                    className="text-emerald-400"
                  >
                    Shortlist
                  </button>

                  <button
                    onClick={() => updateStatus(app.id, "REJECTED")}
                    className="text-red-400"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => reEvaluate(app.student.id)}
                    className="text-indigo-400 flex items-center gap-1"
                  >
                    <RefreshCw size={12} />
                    Re-evaluate
                  </button>

                  {app.student.resumeUrl && (
                    <a
                      href={app.student.resumeUrl}
                      target="_blank"
                      className="flex items-center gap-1 text-zinc-400"
                    >
                      <FileText size={12} />
                      Resume
                    </a>
                  )}
                </div>

                {/* STATUS */}
                <p className={`text-xs mt-2 ${getStatusColor(app.status)}`}>
                  {app.status}
                </p>
              </motion.div>
            ))}
          </div>

          {/* OTHERS */}
          <div className="grid md:grid-cols-2 gap-4">
            {others.map((app) => (
              <div
                key={app.id}
                className="p-4 border border-white/10 rounded-xl"
              >
                <div className="flex justify-between">
                  <span>{app.student.fullName}</span>
                  <span className="text-xs">{app.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}