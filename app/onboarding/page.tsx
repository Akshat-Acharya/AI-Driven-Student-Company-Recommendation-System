"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
  const router = useRouter();
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
    <div className="flex min-h-screen items-center justify-center bg-background">
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg rounded-2xl border bg-background p-8 shadow-xl"
      >
        <h2 className="text-center text-2xl font-bold">
          Choose your role
        </h2>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          This helps us personalize your experience
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4">
          
          <Button
            onClick={() => chooseRole("STUDENT")}
            disabled={loading}
            className="h-14 text-base"
          >
            I am a Student / Job Seeker
          </Button>

          <Button
            onClick={() => chooseRole("COMPANY")}
            disabled={loading}
            variant="secondary"
            className="h-14 text-base"
          >
            I am a Company / Recruiter
          </Button>

        </div>
      </motion.div>
    </div>
  );
}