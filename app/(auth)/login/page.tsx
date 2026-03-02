"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Navbar } from "@/components/navbar";
import { RoleModal } from "@/components/role-modal";
import { useState } from "react";

export default function LoginPage() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Navbar />
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        {/* Background Gradient Glow */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
          w-full 
          max-w-md 
          rounded-2xl 
          border 
          border-border/40 
          bg-background/60 
          p-8 
          shadow-xl 
          backdrop-blur-xl
        "
        >
          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Login to continue to TalentBridge
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email address"
                className="rounded-xl bg-background/70"
              />
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                className="rounded-xl bg-background/70"
              />
            </div>

            <Button
              className="
              w-full 
              rounded-xl 
              bg-primary 
              text-primary-foreground 
              transition-all 
              hover:opacity-90 
              active:scale-[0.98]
            "
            >
              Login
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google Login */}
          <Button
            variant="outline"
            className="
            w-full 
            rounded-xl 
            border-border/40 
            bg-background/40 
            backdrop-blur-md
            transition-all 
            hover:bg-background/70
            active:scale-[0.98]
          "
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>

          {/* Signup Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="
                        relative
                        font-semibold
                        text-primary
                        transition-all
                        duration-300
                        hover:text-primary/80
                        after:absolute
                        after:-bottom-0.5
                        after:left-0
                        after:h-[2px]
                        after:w-0
                        after:bg-primary
                        after:transition-all
                        after:duration-300
                        hover:after:w-full
                        "
            >
              Sign up
            </button>
          </p>
          <RoleModal open={open} onOpenChange={setOpen} />
        </motion.div>
      </div>
    </div>
  );
}