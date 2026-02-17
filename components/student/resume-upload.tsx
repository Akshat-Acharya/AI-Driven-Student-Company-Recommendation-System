"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  GraduationCap,
  Briefcase,
  Code2,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Phase = "idle" | "uploading" | "parsing" | "done";

const parsedProfile = {
  skills: ["Python", "Machine Learning", "React", "TypeScript", "TensorFlow", "AWS", "SQL", "Docker"],
  cgpa: 3.92,
  experience: "1 year (Internships)",
  domain: "AI / Machine Learning",
};

export function ResumeUpload() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const simulateUpload = useCallback(() => {
    setPhase("uploading");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase("parsing");

          setTimeout(() => {
            setPhase("done");
          }, 2200);

          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      simulateUpload();
    },
    [simulateUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-5"
    >
      <h2 className="mb-4 font-heading text-lg font-semibold">Resume Upload</h2>

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={simulateUpload}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border/60 hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            <motion.div
              animate={isDragging ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20"
            >
              <Upload className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <p className="text-sm font-medium">
                Drop your resume here or click to upload
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PDF, DOCX up to 5MB
              </p>
            </div>
          </motion.div>
        )}

        {phase === "uploading" && (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 rounded-xl bg-secondary/30 p-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
            >
              <FileText className="h-5 w-5 text-primary" />
            </motion.div>
            <div className="w-full max-w-xs">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Uploading resume...</span>
                <span className="text-muted-foreground">
                  {Math.min(100, Math.round(progress))}%
                </span>
              </div>
              <Progress value={Math.min(100, progress)} className="h-2" />
            </div>
          </motion.div>
        )}

        {phase === "parsing" && (
          <motion.div
            key="parsing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 rounded-xl bg-secondary/30 p-8"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20"
            >
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-semibold gradient-text">
                AI Parsing Resume...
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Extracting skills, experience, and profile data
              </p>
            </div>
            {/* Skeleton preview */}
            <div className="mt-2 w-full space-y-2">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="h-4 rounded bg-muted"
                  style={{ width: `${100 - i * 15}%` }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4 rounded-xl bg-secondary/30 p-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold gradient-text">
                AI Profile Generated
              </span>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Domain:</span>
                <span className="font-medium">{parsedProfile.domain}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">CGPA:</span>
                <span className="font-medium">{parsedProfile.cgpa}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Experience:</span>
                <span className="font-medium">{parsedProfile.experience}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Level:</span>
                <span className="font-medium">Graduate</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Extracted Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {parsedProfile.skills.map((skill, i) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <Badge variant="secondary" className="rounded-full text-xs">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setPhase("idle");
                setProgress(0);
              }}
              className="mt-1 text-xs font-medium text-primary hover:underline"
            >
              Upload a different resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
