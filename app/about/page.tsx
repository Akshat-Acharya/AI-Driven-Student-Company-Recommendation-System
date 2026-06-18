"use client";

import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import {
  Brain,
  Bot,
  Sparkles,
  Cpu,
  FileText,
  Briefcase,
  Users,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 overflow-x-hidden">

      <Navbar />

      {/* glow background */}

      <div className="pointer-events-none absolute inset-0 flex justify-center opacity-60">
        <div className="absolute top-[120px] w-[700px] h-[500px] bg-indigo-600/20 blur-[140px] rounded-full" />
      </div>

      {/* grid texture */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <main className="relative pt-40 px-6">

        <div className="mx-auto max-w-6xl">

          {/* HERO */}

          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-center mb-32"
          >

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              About
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                TalentBridge
              </span>
            </h1>

            <p className="mt-6 text-zinc-400 text-lg max-w-3xl mx-auto">
              TalentBridge is an AI-powered recruitment platform that
              transforms messy resumes into structured talent data and
              intelligently connects students with companies.
            </p>

          </motion.section>

          {/* PROBLEM */}

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-16 items-center mb-32"
          >

            <div>

              <h2 className="text-3xl font-semibold mb-6">
                The Problem
              </h2>

              <p className="text-zinc-400 mb-4">
                Traditional recruitment relies heavily on manual resume
                screening and keyword filters, often missing high-potential
                candidates who don’t perfectly match job descriptions.
              </p>

              <p className="text-zinc-400">
                TalentBridge solves this by combining deterministic matching
                with AI-powered resume understanding and structured skill
                extraction.
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">

              <ProblemItem icon={<Users />} text="Students struggle to discover relevant job opportunities." />

              <ProblemItem icon={<Briefcase />} text="Recruiters spend hours manually reviewing resumes." />

              <ProblemItem icon={<FileText />} text="Unstructured resumes make automated matching difficult." />

            </div>

          </motion.section>

          {/* AI SYSTEM */}

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-32"
          >

            <h2 className="text-3xl font-semibold text-center mb-16">
              AI Recruitment Architecture
            </h2>

            <div className="grid md:grid-cols-4 gap-6">

              <TechCard
                icon={<Brain />}
                title="Resume Parsing"
                text="LangChain + local LLM extract structured skills, projects and education."
              />

              <TechCard
                icon={<Sparkles />}
                title="Skill Normalization"
                text="AI standardizes candidate skills and job requirements."
              />

              <TechCard
                icon={<Cpu />}
                title="Matching Engine"
                text="Deterministic scoring calculates candidate-job compatibility."
              />

              <TechCard
                icon={<Bot />}
                title="AI Explanations"
                text="LLM generates explanations behind each match score."
              />

            </div>

          </motion.section>

          {/* TECH STACK */}

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-32"
          >

            <h2 className="text-3xl font-semibold text-center mb-16">
              Technology Stack
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              <TechStack title="Frontend">
                Next.js <br />
                TailwindCSS <br />
                Framer Motion
              </TechStack>

              <TechStack title="Backend">
                Prisma ORM <br />
                PostgreSQL <br />
                NextAuth Authentication
              </TechStack>

              <TechStack title="AI Layer">
                LangChain (JS) <br />
                AI Skill Extraction
              </TechStack>

            </div>

          </motion.section>

          {/* CTA */}

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center border border-white/10 rounded-3xl p-16 bg-white/[0.03]"
          >

            <h2 className="text-3xl font-semibold mb-4">
              Experience AI-driven recruitment
            </h2>

            <p className="text-zinc-400 max-w-xl mx-auto mb-8">
              TalentBridge demonstrates how deterministic systems and AI
              reasoning can work together to improve recruitment decisions.
            </p>

            <a
              href="/signup"
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 font-medium hover:opacity-90 transition"
            >
              Get Started
            </a>

          </motion.section>

        </div>

      </main>

    </div>
  );
}


/* COMPONENTS */

function ProblemItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
        {icon}
      </div>
      <p className="text-sm text-zinc-400">{text}</p>
    </div>
  );
}

function TechCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:bg-white/[0.05] transition">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4">
        {icon}
      </div>

      <h3 className="font-semibold mb-2">{title}</h3>

      <p className="text-sm text-zinc-400">{text}</p>

    </div>
  );
}

function TechStack({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
      <h3 className="font-semibold mb-3">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{children}</p>
    </div>
  );
}