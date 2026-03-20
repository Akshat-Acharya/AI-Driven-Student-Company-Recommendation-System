"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export default function JobActions({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/company/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete job");
      }

      // Redirect after delete
      router.push("/company/jobs");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-6">

      {/* EDIT */}
      <button
        onClick={() => router.push(`/company/jobs/${jobId}/edit`)}
        className="
          flex items-center gap-2
          px-4 py-2 rounded-lg
          bg-indigo-500/10 text-indigo-400
          border border-indigo-400/20
          hover:bg-indigo-500/20 transition
        "
      >
        <Pencil size={14} />
        Edit
      </button>

      {/* DELETE */}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="
          flex items-center gap-2
          px-4 py-2 rounded-lg
          bg-red-500/10 text-red-400
          border border-red-400/20
          hover:bg-red-500/20 transition
        "
      >
        <Trash2 size={14} />
        {loading ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}