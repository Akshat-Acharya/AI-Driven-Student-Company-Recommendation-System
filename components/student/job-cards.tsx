"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ChevronDown, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchScoreBadge } from "@/components/match-score-badge";
import { recommendedJobs } from "@/lib/mock-data";

export function JobCards() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">Recommended for You</h2>
        <span className="text-sm text-muted-foreground">
          {recommendedJobs.length} matches
        </span>
      </div>

      {recommendedJobs.map((job, i) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          whileHover={{ y: -2 }}
          className="glass rounded-xl p-5 transition-shadow hover:glow-primary"
        >
          <div className="flex items-start gap-4">
            <MatchScoreBadge score={job.matchScore} />

            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading text-base font-semibold">
                    {job.title}
                  </h3>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Briefcase className="h-3 w-3" />
                    {job.company}
                  </p>
                </div>
                <span className="whitespace-nowrap text-sm font-medium text-primary">
                  {job.salary}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {job.posted}
                </span>
                <Badge variant="outline" className="rounded-full text-xs">
                  {job.type}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="rounded-full text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>

              <button
                onClick={() =>
                  setExpandedId(expandedId === job.id ? null : job.id)
                }
                className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                AI Match Reasoning
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${
                    expandedId === job.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {expandedId === job.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-2 rounded-lg bg-primary/5 p-3 text-sm leading-relaxed text-muted-foreground">
                      {job.aiReasoning}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
            >
              Quick Apply
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
