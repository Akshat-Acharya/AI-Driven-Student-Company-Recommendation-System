"use client";

export default function CompareModal({
  open,
  onClose,
  result,
}: {
  open: boolean;
  onClose: () => void;
  result: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#09090b] w-[600px] max-h-[80vh] overflow-y-auto p-6 rounded-xl border border-white/10">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            🔍 Candidate Comparison
          </h2>

          <button onClick={onClose} className="text-sm text-zinc-400">
            ✕
          </button>
        </div>

        <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
          {result}
        </div>

      </div>
    </div>
  );
}