"use client";

import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import {
  UserPlus,
  Upload,
  Brain,
  Database,
  Briefcase,
  Sparkles,
  GitBranch,
  BarChart3,
  Bot,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Student Registers",
    text: "Students create an account to join the AI-powered recruitment ecosystem.",
  },
  {
    icon: Upload,
    title: "Resume Upload",
    text: "Students upload resumes which are automatically processed by the platform.",
  },
  {
    icon: Brain,
    title: "AI Resume Parsing",
    text: "LangChain + local LLM extracts skills, projects, education and experience.",
  },
  {
    icon: Database,
    title: "Structured Profile",
    text: "The system converts extracted data into a normalized structured student profile.",
  },
  {
    icon: Briefcase,
    title: "Company Job Posting",
    text: "Companies publish roles specifying required skills and qualifications.",
  },
  {
    icon: Sparkles,
    title: "Skill Normalization",
    text: "AI standardizes both student skills and job requirements for accurate comparison.",
  },
  {
    icon: GitBranch,
    title: "Matching Engine",
    text: "Deterministic scoring calculates compatibility between candidates and roles.",
  },
  {
    icon: BarChart3,
    title: "Ranked Candidates",
    text: "Companies receive ranked applicants based on skill similarity and fit.",
  },
  {
    icon: Bot,
    title: "AI Explanations",
    text: "AI explains match scores and helps recruiters evaluate candidates faster.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function HowItWorksPage() {
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

        {/* HERO */}

        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-center max-w-4xl mx-auto mb-32"
        >

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            How TalentBridge
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              connects talent & companies
            </span>
          </h1>

          <p className="mt-6 text-zinc-400 text-lg max-w-xl mx-auto">
            Our platform combines deterministic scoring and AI reasoning
            to intelligently match students with companies.
          </p>

        </motion.section>

        {/* TIMELINE */}

        <section className="max-w-6xl mx-auto relative">

          {/* vertical line */}

          <div className="absolute left-1/2 top-0 h-full w-[2px] bg-zinc-800 -translate-x-1/2" />

          <div className="space-y-28">

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    isLeft ? "justify-start" : "justify-end"
                  }`}
                >

                  {/* card */}

                  <div className="w-[45%] rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 hover:bg-white/[0.05] transition">

                    <div className="flex items-center gap-3 mb-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <Icon className="h-5 w-5 text-indigo-400" />
                      </div>

                      <h3 className="text-lg font-semibold">
                        {step.title}
                      </h3>

                    </div>

                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {step.text}
                    </p>

                  </div>

                  {/* timeline node */}

                  <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">

                    <div className="w-6 h-6 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.7)] border border-indigo-300/40" />

                  </div>

                </motion.div>
              );
            })}

          </div>

        </section>

        {/* CTA */}

        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-36 text-center max-w-4xl mx-auto border border-white/10 rounded-3xl p-14 bg-white/[0.03]"
        >

          <h2 className="text-3xl font-semibold mb-4">
            Experience AI-driven recruitment
          </h2>

          <p className="text-zinc-400 mb-8">
            Join TalentBridge and discover smarter hiring powered by AI.
          </p>

          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 font-medium hover:opacity-90 transition"
          >
            Get Started
          </a>

        </motion.section>

      </main>

    </div>
  );
}