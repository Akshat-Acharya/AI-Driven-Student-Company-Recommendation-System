"use client";

import { motion } from "framer-motion";
import { GraduationCap, Building2 } from "lucide-react";
import { useState } from "react";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);

  const chooseRole = async (role: "STUDENT" | "COMPANY") => {
    setLoading(true);

    const res = await fetch("/api/user/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    if (res.ok) {
      window.location.href = "/post-auth";
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center px-6">

      {/* glow background */}

      <div className="pointer-events-none absolute inset-0 flex justify-center opacity-60">
        <div className="absolute top-[150px] w-[600px] h-[500px] bg-indigo-600/20 blur-[140px] rounded-full" />
      </div>

      {/* grid texture */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-3xl"
      >

        {/* header */}

        <div className="text-center mb-12">

          <h1 className="text-4xl font-semibold tracking-tight">
            How will you use
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              TalentBridge?
            </span>
          </h1>

          <p className="text-zinc-400 mt-3">
            Select your role to personalize your experience.
          </p>

        </div>

        {/* role cards */}

        <div className="grid md:grid-cols-2 gap-6">

          {/* STUDENT */}

          <motion.div
            whileHover={{ y: -6 }}
            onClick={() => chooseRole("STUDENT")}
            className="
            group
            cursor-pointer
            rounded-2xl
            border border-white/10
            bg-white/[0.03]
            backdrop-blur-xl
            p-8
            transition
            hover:border-indigo-400/40
            hover:bg-white/[0.05]
            "
          >

            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-6">

              <GraduationCap className="text-indigo-400" />

            </div>

            <h3 className="text-lg font-semibold mb-2">
              Student / Job Seeker
            </h3>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Upload your resume, discover matching roles,
              and get AI insights to improve your profile.
            </p>

          </motion.div>


          {/* COMPANY */}

          <motion.div
            whileHover={{ y: -6 }}
            onClick={() => chooseRole("COMPANY")}
            className="
            group
            cursor-pointer
            rounded-2xl
            border border-white/10
            bg-white/[0.03]
            backdrop-blur-xl
            p-8
            transition
            hover:border-indigo-400/40
            hover:bg-white/[0.05]
            "
          >

            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-6">

              <Building2 className="text-indigo-400" />

            </div>

            <h3 className="text-lg font-semibold mb-2">
              Company / Recruiter
            </h3>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Post job roles, discover top candidates,
              and get ranked applicant recommendations.
            </p>

          </motion.div>

        </div>

        {loading && (
          <p className="text-center text-sm text-zinc-400 mt-8">
            Setting up your workspace...
          </p>
        )}

      </motion.div>

    </div>
  );
}