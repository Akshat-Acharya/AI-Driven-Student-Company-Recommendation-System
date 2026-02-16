"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { chatMessages } from "@/lib/mock-data";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AiChatPanel() {
  const [messages, setMessages] = useState<Message[]>(chatMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response: Message = {
        role: "assistant",
        content:
          "That's a great question! Based on your profile analysis, I'd recommend focusing on showcasing your practical ML project experience. Companies like DeepMind and Vercel particularly value hands-on implementation skills alongside theoretical knowledge.",
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass flex h-[600px] flex-col rounded-xl"
    >
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
          <Bot className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold">AI Career Advisor</h3>
          <p className="text-xs text-muted-foreground">Always online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className={cn(
                "flex gap-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {msg.content.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < msg.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
              {msg.role === "user" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                <Bot className="h-3 w-3 text-primary" />
              </div>
              <div className="flex gap-1 rounded-2xl bg-secondary px-4 py-3">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                />
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                />
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="border-t border-border/50 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your career..."
            className="flex-1 rounded-full border-border/50 bg-secondary/50 text-sm"
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
