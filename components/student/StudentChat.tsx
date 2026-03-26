"use client";

import { useState } from "react";

export default function StudentChat({ jobId }: { jobId: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/student/chat", {
        method: "POST",
        body: JSON.stringify({
          message: input,
          jobId,
        }),
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "ai", text: data.reply },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="
          fixed bottom-6 right-6
          bg-indigo-600 hover:bg-indigo-500
          px-4 py-2 rounded-full text-sm
        "
      >
        💬 AI
      </button>

      {/* CHAT PANEL */}
      {open && (
        <div className="
          fixed bottom-20 right-6
          w-80 h-[400px]
          bg-[#09090b] border border-white/10
          rounded-xl flex flex-col
        ">

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
             <div
  key={i}
  className={`
    text-xs p-2 rounded-lg max-w-[80%] whitespace-pre-wrap leading-relaxed
    ${msg.role === "user"
      ? "bg-indigo-500 ml-auto"
      : "bg-white/10"}
  `}
>
  {msg.text.split("\n").map((line: string, idx: number) => (
  <p key={idx} className="mb-1">
    {line}
  </p>
))}
</div>
            ))}

            {loading && (
              <p className="text-xs text-zinc-500">Thinking...</p>
            )}
          </div>

          {/* INPUT */}
          <div className="p-2 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-white/10 text-xs p-2 rounded"
              placeholder="Ask about this job..."
            />

            <button
              onClick={sendMessage}
              className="text-xs bg-indigo-500 px-3 rounded"
            >
              Send
            </button>
          </div>

        </div>
      )}
    </>
  );
}