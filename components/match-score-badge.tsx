"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MatchScoreBadgeProps {
  score: number;
  size?: "sm" | "md";
}

export function MatchScoreBadge({ score, size = "md" }: MatchScoreBadgeProps) {
  const isHigh = score >= 90;
  const isMedium = score >= 80 && score < 90;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={cn(
        "relative flex items-center justify-center rounded-full font-heading font-bold",
        size === "sm" ? "h-10 w-10 text-xs" : "h-12 w-12 text-sm",
        isHigh && "bg-gradient-to-br from-primary to-accent text-primary-foreground",
        isMedium && "bg-primary/80 text-primary-foreground",
        !isHigh && !isMedium && "bg-muted text-muted-foreground"
      )}
    >
      {isHigh && (
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent blur-md"
        />
      )}
      <span className="relative z-10">{score}%</span>
    </motion.div>
  );
}
