"use client";

import { motion } from "framer-motion";
import { Brain, LineChart, Search, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Resume Intelligence",
    description:
      "Our AI reads between the lines, extracting skills, potential, and growth signals that keyword scanners miss entirely.",
  },
  {
    icon: Search,
    title: "Smart Candidate Ranking",
    description:
      "Move beyond resumes. AI evaluates cultural fit, growth trajectory, and skill depth to rank candidates holistically.",
  },
  {
    icon: LineChart,
    title: "AI Skill Gap Analysis",
    description:
      "Identify exactly where candidates excel and where they need growth, with personalized upskilling recommendations.",
  },
  {
    icon: Zap,
    title: "Proactive Recommendations",
    description:
      "Our engine suggests roles students haven't considered and surfaces hidden-gem candidates companies would overlook.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="font-heading text-3xl font-bold text-balance sm:text-4xl">
          Powered by <span className="gradient-text">Intelligent AI</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Four pillars that make recruitment smarter, faster, and fairer.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="group glass rounded-xl p-6 transition-shadow hover:glow-primary"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
