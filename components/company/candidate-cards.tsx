"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  GraduationCap,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchScoreBadge } from "@/components/match-score-badge";
import {
  appliedCandidates,
  aiRecommendedCandidates,
  type Candidate,
} from "@/lib/mock-data";

type Tab = "applied" | "recommended";

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass rounded-xl p-5 transition-shadow hover:glow-primary"
    >
      <div className="flex items-start gap-4">
        <MatchScoreBadge score={candidate.matchScore} size="sm" />

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-border/50">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-xs font-semibold">
                  {candidate.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-semibold">{candidate.name}</h3>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <GraduationCap className="h-3 w-3" />
                  {candidate.university} &middot; {candidate.degree}
                </p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {candidate.appliedDate || "AI Surfaced"}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="rounded-full text-xs"
              >
                {skill}
              </Badge>
            ))}
            <Badge variant="outline" className="rounded-full text-xs">
              GPA: {candidate.gpa}
            </Badge>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            AI Reasoning
            <ChevronDown
              className={`h-3 w-3 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="mt-2 rounded-lg bg-primary/5 p-3 text-sm leading-relaxed text-muted-foreground">
                  {candidate.aiReasoning}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
            >
              Schedule Interview
            </Button>
            <Button size="sm" variant="outline" className="rounded-full">
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CandidateCards() {
  const [activeTab, setActiveTab] = useState<Tab>("applied");

  const tabs: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
    {
      id: "applied",
      label: "Applied",
      icon: UserCheck,
      count: appliedCandidates.length,
    },
    {
      id: "recommended",
      label: "AI Recommended",
      icon: Sparkles,
      count: aiRecommendedCandidates.length,
    },
  ];

  const candidates =
    activeTab === "applied" ? appliedCandidates : aiRecommendedCandidates;

  return (
    <div className="flex flex-col gap-6">
      {/* Segmented Control */}
      <div className="relative flex glass rounded-xl p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-lg bg-card shadow-sm"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.5,
                  }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{tab.label}</span>
              <Badge
                variant={isActive ? "default" : "secondary"}
                className="relative z-10 rounded-full text-xs"
              >
                {tab.count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Candidate List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-4"
        >
          {candidates.map((candidate, i) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <CandidateCard candidate={candidate} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
