"use client";

import { useState } from "react";

export default function CompanyChat({ jobId }: { jobId: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (customMessage?: string) => {
    const msg = customMessage || input;
    if (!msg.trim()) return;

    const newMessages = [...messages, { role: "user", text: msg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/company/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: msg,
          jobId,
          history: messages,
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
          px-4 py-2 rounded-full text-sm shadow-lg
        "
      >
        💬 AI Hiring
      </button>

      {/* CHAT PANEL */}
      {open && (
        <div className="
          fixed bottom-20 right-6
          w-80 h-[420px]
          bg-[#09090b]
          border border-white/10
          rounded-xl
          flex flex-col
          shadow-xl
        ">

          {/* HEADER */}
          <div className="p-3 border-b border-white/10 text-sm font-medium">
            AI Hiring Assistant
          </div>

          {/* QUICK ACTIONS */}
          <div className="p-2 flex flex-wrap gap-2 border-b border-white/10">
            {[
              "Who is the best candidate?",
              "Compare top candidates",
              "What skills are missing?",
              "Who should I shortlist?",
            ].map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="
                  text-[10px] px-2 py-1 rounded
                  bg-white/10 hover:bg-white/20
                "
              >
                {q}
              </button>
            ))}
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "ai" && (
                  <div className="text-[10px] text-zinc-500 mb-1">
                    AI
                  </div>
                )}

                <div
                  className={`
                    text-xs p-2 rounded-lg max-w-[80%]
                    whitespace-pre-wrap leading-relaxed
                    ${
                      msg.role === "user"
                        ? "bg-indigo-500 text-white ml-auto"
                        : "bg-zinc-800 text-zinc-200"
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-xs text-zinc-500">
                Thinking...
              </p>
            )}
          </div>

          {/* INPUT */}
          <div className="p-2 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about candidates..."
              className="
                flex-1 bg-white/10 text-xs p-2 rounded
                focus:outline-none
              "
            />

            <button
              onClick={() => sendMessage()}
              className="
                text-xs bg-indigo-500 px-3 rounded
                hover:bg-indigo-400
              "
            >
              Send
            </button>
          </div>

        </div>
      )}
    </>
  );
}