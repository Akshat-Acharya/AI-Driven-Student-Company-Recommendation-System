"use client";

import { useState } from "react";
import CompareModal from "@/components/company/CompareModal";

export default function CompareCandidates({
  candidates,
  jobId,
}: {
  candidates: any[];
  jobId: string;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      if (selected.length >= 2) {
        alert("You can only compare 2 candidates");
        return;
      }
      setSelected([...selected, id]);
    }
  };

  const handleCompare = async () => {
    if (selected.length !== 2) {
      alert("Select exactly 2 candidates");
      return;
    }

    try {
      setLoading(true);

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

      setResult(data.result);
      setOpen(true);
    } catch (err) {
      console.error(err);
      alert("Error comparing candidates");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Compare Candidates
        </h2>

        <button
          onClick={handleCompare}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 rounded text-sm"
        >
          {loading ? "Comparing..." : "Compare"}
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {candidates.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 p-3 border border-white/10 rounded"
          >
            <input
              type="checkbox"
              checked={selected.includes(c.id)}
              onChange={() => toggleSelect(c.id)}
            />

            <div>
              <p className="text-sm font-medium">
                {c.fullName}
              </p>
              <p className="text-xs text-zinc-400">
                {c.skills?.slice(0, 3).join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <CompareModal
        open={open}
        onClose={() => setOpen(false)}
        result={result}
      />
    </div>
  );
}