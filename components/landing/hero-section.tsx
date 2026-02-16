"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 30, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex max-w-3xl flex-col items-center gap-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-muted-foreground">
            AI-Powered Recruitment Platform
          </span>
        </motion.div>

        <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
          The Future of{" "}
          <span className="gradient-text">Campus Recruiting</span> is Here
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-balance">
          Connect top talent with leading companies through intelligent
          AI matching, deep skill analysis, and proactive career
          recommendations.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
          >
            <Link href="/student">
              I'm a Student
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full"
          >
            <Link href="/company">I'm Hiring</Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-8 text-center"
        >
          {[
            { value: "50K+", label: "Students Matched" },
            { value: "2,400+", label: "Companies" },
            { value: "96%", label: "Match Accuracy" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-heading text-2xl font-bold gradient-text">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
