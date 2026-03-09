"use client";

import { Navbar } from "@/components/navbar";
import { FeaturesSection } from "@/components/features-section";
import { motion } from "framer-motion";
import { Cpu, Sparkles, BrainCircuit, ArrowRight } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">

      <Navbar />

      {/* background glow */}

      <div className="pointer-events-none absolute inset-0 flex justify-center opacity-50">
        <div className="absolute top-[120px] w-[700px] h-[500px] bg-indigo-600/20 blur-[140px] rounded-full"/>
      </div>

      <main className="pt-40">

        {/* HERO */}

        <section className="mx-auto max-w-6xl px-6 text-center mb-28">

          <motion.div
          initial={{opacity:0,y:30}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.6}}
          >

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-6">
              <Sparkles size={14} className="text-indigo-400"/>
              <span className="text-xs text-zinc-400">
                TalentBridge AI
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Everything you need to build
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                intelligent hiring pipelines
              </span>
            </h1>

            <p className="text-zinc-400 mt-6 max-w-xl mx-auto">
              Our AI transforms messy resumes into structured talent data,
              helping companies identify the best candidates faster and fairer.
            </p>

          </motion.div>

        </section>


        {/* MAIN FEATURES GRID */}

        <FeaturesSection />


        {/* WORKFLOW SECTION */}

        <section className="mx-auto max-w-6xl px-6 py-28">

          <div className="grid md:grid-cols-3 gap-8">

            <motion.div
            initial={{opacity:0,y:30}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true}}
            className="p-8 rounded-2xl border border-white/10 bg-white/[0.03]"
            >

              <Cpu className="text-indigo-400 mb-4"/>

              <h3 className="text-lg font-semibold">
                Resume Parsing
              </h3>

              <p className="text-zinc-400 text-sm mt-2">
                Extract structured skills, education, and experience from resumes using AI.
              </p>

            </motion.div>


            <motion.div
            initial={{opacity:0,y:30}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true}}
            className="p-8 rounded-2xl border border-white/10 bg-white/[0.03]"
            >

              <BrainCircuit className="text-indigo-400 mb-4"/>

              <h3 className="text-lg font-semibold">
                Skill Intelligence
              </h3>

              <p className="text-zinc-400 text-sm mt-2">
                Convert raw resume information into normalized skill vectors.
              </p>

            </motion.div>


            <motion.div
            initial={{opacity:0,y:30}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true}}
            className="p-8 rounded-2xl border border-white/10 bg-white/[0.03]"
            >

              <Sparkles className="text-indigo-400 mb-4"/>

              <h3 className="text-lg font-semibold">
                Candidate Ranking
              </h3>

              <p className="text-zinc-400 text-sm mt-2">
                Rank candidates based on skill similarity and job requirements.
              </p>

            </motion.div>

          </div>

        </section>


        {/* CTA SECTION */}

        <section className="mx-auto max-w-5xl px-6 pb-32 text-center">

          <motion.div
          initial={{opacity:0,y:30}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          className="p-12 rounded-3xl border border-white/10 bg-white/[0.03]"
          >

            <h2 className="text-3xl font-semibold">
              Start building smarter hiring today
            </h2>

            <p className="text-zinc-400 mt-3">
              Join companies using AI to identify the best talent faster.
            </p>

            <button className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500">
              Get Started
              <ArrowRight size={16}/>
            </button>

          </motion.div>

        </section>

      </main>

    </div>
  );
}