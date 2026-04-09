"use client";

import { useState } from "react";
import EditJobModal from "./EditJobModal";

export default function JobDetailClient({ job }: any) {
  const [openEdit, setOpenEdit] = useState(false);
    console.log("CLIENT JOB:", job);
  return (
    <>
      {/* EDIT BUTTON */}
      <button
        onClick={() => setOpenEdit(true)}
        className="
          px-4 py-2 rounded-lg
          bg-indigo-500/10 text-indigo-400
          border border-indigo-400/20
          hover:bg-indigo-500/20 transition
        "
      >
        Edit Job
      </button>

      {/* MODAL */}
      <EditJobModal
        open={openEdit}
        setOpen={setOpenEdit}
        jobId={job.id}
        initialData={job}
        onSuccess={() => window.location.reload()} // simple refresh
      />
    </>
  );
}