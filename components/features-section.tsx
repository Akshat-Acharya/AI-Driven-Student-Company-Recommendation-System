"use client";

import { motion } from "framer-motion";
import { Brain, LineChart, Search, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Resume Intelligence",
    description:
      "Our AI understands resumes beyond keywords, extracting structured skills, experience signals, and growth potential.",
  },
  {
    icon: Search,
    title: "Smart Candidate Ranking",
    description:
      "AI evaluates candidates holistically — skill depth, trajectory, and contextual experience — to build a ranked pipeline.",
  },
  {
    icon: LineChart,
    title: "Skill Gap Analysis",
    description:
      "Automatically identify missing skills and learning opportunities for candidates to improve hiring readiness.",
  },
  {
    icon: Zap,
    title: "Proactive Talent Discovery",
    description:
      "Surface hidden-gem candidates and recommend roles that align with their strengths and growth potential.",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function FeaturesSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">

      {/* background glow */}

      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
        <div className="w-[600px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full opacity-60" />
      </div>

      {/* heading */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-20 text-center"
      >
        <h2 className="text-4xl font-semibold tracking-tight text-zinc-100">
          Powered by{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Intelligent AI
          </span>
        </h2>

        <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
          Four pillars that transform hiring into a structured,
          data-driven decision engine.
        </p>
      </motion.div>

      {/* cards */}

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ y: -8 }}
              className="
              group
              relative
              rounded-2xl
              border border-white/10
              bg-white/[0.03]
              backdrop-blur-xl
              p-6
              transition
              hover:border-indigo-400/30
              hover:shadow-[0_0_40px_rgba(79,70,229,0.25)]
              "
            >

              {/* glow hover */}

              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none">
                <div className="absolute -top-10 right-0 w-40 h-40 bg-indigo-500/20 blur-[80px] rounded-full" />
              </div>

              {/* icon */}

              <div className="
                mb-5
                flex
                h-12 w-12
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-indigo-500/20
                to-cyan-500/20
                border border-indigo-400/20
              ">
                <Icon className="h-6 w-6 text-indigo-400" />
              </div>

              <h3 className="text-lg font-semibold text-zinc-100">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {feature.description}
              </p>

            </motion.div>
          );
        })}
      </motion.div>

    </section>
  );
}