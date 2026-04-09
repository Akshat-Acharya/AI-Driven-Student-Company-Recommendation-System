"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2, CheckCircle, RotateCcw } from "lucide-react";
import { useState } from "react";
import EditJobModal from "./EditJobModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { toast } from "sonner";

export default function JobActions({ job }: any) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  /* ---------------- DELETE ---------------- */

  const handleDelete = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/company/jobs/${job.id}`, {
        method: "DELETE",
      });

     if (!res.ok) {
  toast.error("Failed to delete job");
  throw new Error("Failed");
}

toast.success("Job deleted successfully");

      setOpenDelete(false);

      router.push("/company/jobs");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STATUS ---------------- */

  const handleStatusToggle = async () => {
    try {
      setLoading(true);

      const newStatus = job.status === "ACTIVE" ? "COMPLETED" : "ACTIVE";

      const res = await fetch(`/api/company/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

if (!res.ok) {
  toast.error("Failed to update status");
  throw new Error("Failed");
}

toast.success(
  job.status === "ACTIVE"
    ? "Job marked as completed"
    : "Job reopened"
);

      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ACTION CARD */}
      <div>


        <div className="flex flex-col gap-2">

          {/* EDIT */}
          <button
            onClick={() => setOpenEdit(true)}
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-2
              px-4 py-2 rounded-lg text-sm
              bg-indigo-500/10 text-indigo-400
              border border-indigo-400/20
              hover:bg-indigo-500/20
              disabled:opacity-50
              transition
            "
          >
            <Pencil size={14} />
            Edit
          </button>

          {/* STATUS TOGGLE */}
          <button
            onClick={handleStatusToggle}
            disabled={loading}
            className={`
              w-full flex items-center justify-center gap-2
              px-4 py-2 rounded-lg text-sm
              border transition
              disabled:opacity-50
              ${
                job.status === "ACTIVE"
                  ? "bg-white/[0.04] text-yellow-300 border-yellow-400/20 hover:bg-yellow-500/10"
                  : "bg-white/[0.04] text-emerald-400 border-emerald-400/20 hover:bg-emerald-500/10"
              }
            `}
          >
            {job.status === "ACTIVE" ? (
              <>
                <CheckCircle size={14} />
                Mark as Completed
              </>
            ) : (
              <>
                <RotateCcw size={14} />
                Reopen Job
              </>
            )}
          </button>

          {/* DELETE */}
          <button
            onClick={() => setOpenDelete(true)}
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-2
              px-4 py-2 rounded-lg text-sm
              bg-red-500/10 text-red-400
              border border-red-400/20
              hover:bg-red-500/20
              disabled:opacity-50
              transition
            "
          >
            <Trash2 size={14} />
            Delete
          </button>

        </div>
      </div>

      {/* EDIT MODAL */}
      <EditJobModal
        open={openEdit}
        setOpen={setOpenEdit}
        jobId={job.id}
        initialData={job}
        onSuccess={() => router.refresh()} // 🔥 smoother than reload
      />

      {/* DELETE MODAL */}
      <DeleteConfirmModal
        open={openDelete}
        setOpen={setOpenDelete}
        onConfirm={handleDelete}
        loading={loading}
      />
    </>
  );
}