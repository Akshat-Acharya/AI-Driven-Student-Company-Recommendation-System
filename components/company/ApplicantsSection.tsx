"use client";

import { useEffect, useState } from "react";
import { Sparkles, RefreshCw, FileText } from "lucide-react";
import { motion } from "framer-motion";

/* 🔥 MODAL */
function CompareModal({ open, onClose, result }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#09090b] w-[600px] max-h-[80vh] overflow-y-auto p-6 rounded-xl border border-white/10">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">
            🔍 Candidate Comparison
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
          {result}
        </div>
      </div>
    </div>
  );
}

export default function ApplicantsSection({ jobId }: { jobId: string }) {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🔥 COMPARE STATE */
  const [selected, setSelected] = useState<string[]>([]);
  const [compareResult, setCompareResult] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await fetch(`/api/company/jobs/${jobId}/applications`);
      const data = await res.json();
      setApps(data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 SELECT TOGGLE */
  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      if (selected.length >= 2) {
        alert("Only 2 candidates can be compared");
        return;
      }
      setSelected([...selected, id]);
    }
  };

  /* 🔥 COMPARE */
  const handleCompare = async () => {
    if (selected.length !== 2) {
      alert("Select exactly 2 candidates");
      return;
    }

    try {
      setComparing(true);

      const res = await fetch("/api/company/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateIds: selected,
          jobId,
        }),
      });

      const data = await res.json();

      setCompareResult(data.result);
      setOpenModal(true);
    } catch (err) {
      console.error(err);
      alert("Error comparing");
    } finally {
      setComparing(false);
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
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex gap-2 items-center">
          <Sparkles size={18} className="text-indigo-400" />
          AI Ranked Applicants
        </h2>

        <button
          onClick={handleCompare}
          disabled={comparing}
          className="px-4 py-2 bg-indigo-600 rounded text-sm"
        >
          {comparing ? "Comparing..." : "Compare"}
        </button>
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
                  <div className="flex items-center gap-2">
                    {/* 🔥 CHECKBOX */}
                    <input
                      type="checkbox"
                      checked={selected.includes(app.student.id)}
                      onChange={() => toggleSelect(app.student.id)}
                    />

                    <h3 className="text-white font-semibold">
                      #{i + 1} {app.student.fullName}
                    </h3>
                  </div>

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

                <p className={`text-xs mt-2 ${getStatusColor(app.status)}`}>
                  {app.status}
                </p>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* 🔥 MODAL */}
      <CompareModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        result={compareResult}
      />
    </div>
  );
}