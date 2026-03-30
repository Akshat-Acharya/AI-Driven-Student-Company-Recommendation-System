"use client";

import { useState } from "react";

export default function ApplyButton({
  jobId,
  isApplied,
}: {
  jobId: string;
  isApplied: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(isApplied);

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
      alert("Application submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleApply}
      disabled={loading || applied}
      className={`
        w-full py-3 rounded-xl font-medium transition
        ${
          applied
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/20 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:opacity-90"
        }
      `}
    >
      {loading
        ? "Applying..."
        : applied
        ? "Already Applied"
        : "Apply Now"}
    </button>
  );
}