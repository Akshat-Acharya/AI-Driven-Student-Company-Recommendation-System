"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowUpRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const missingSkills = [
  {
    skill: "Kubernetes",
    importance: "High",
    suggestion: "Complete the CKA certification on Udemy or KodeKloud",
  },
  {
    skill: "System Design",
    importance: "High",
    suggestion: "Practice on Educative.io's Grokking System Design course",
  },
  {
    skill: "GraphQL",
    importance: "Medium",
    suggestion: "Build a small project with Apollo Server and Next.js",
  },
  {
    skill: "CI/CD Pipelines",
    importance: "Medium",
    suggestion: "Set up GitHub Actions for an existing project",
  },
];

export function SkillGapCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass rounded-xl p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(45,90%,55%)]/10">
          <TrendingUp className="h-4 w-4 text-[hsl(45,90%,48%)]" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold">Skill Gap Analysis</h2>
          <p className="text-xs text-muted-foreground">
            For target role: Senior ML Engineer
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {missingSkills.map((item, i) => (
          <motion.div
            key={item.skill}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            className="rounded-lg border border-[hsl(45,90%,55%)]/20 bg-[hsl(45,90%,55%)]/5 p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-[hsl(45,90%,48%)]" />
                <span className="text-sm font-semibold">{item.skill}</span>
              </div>
              <Badge
                variant="outline"
                className={`rounded-full text-xs ${
                  item.importance === "High"
                    ? "border-destructive/30 text-destructive"
                    : "border-[hsl(45,90%,55%)]/30 text-[hsl(45,90%,48%)]"
                }`}
              >
                {item.importance}
              </Badge>
            </div>
            <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
              <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
              {item.suggestion}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
