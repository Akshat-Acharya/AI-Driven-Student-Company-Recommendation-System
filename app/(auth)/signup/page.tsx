"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Navbar } from "@/components/navbar";
import { RoleModal } from "@/components/role-modal";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open,setOpen] = useState(false);
  const role = searchParams.get("role");

  useEffect(() => {
    if (role !== "student" && role !== "company") {
      router.replace("/login");
    }
  }, [role, router]);

  if (!role) return null;

  const roleLabel =
    role === "student" ? "Job Seeker" : "Company";

  return (
    <div>
        <Navbar/>
    <div className="relative flex min-h-screen items-center justify-center px-4">
      
      {/* Background Glow */}
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
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Signing up as{" "}
            <span className="font-semibold text-primary">
              {roleLabel}
            </span>
          </p>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-1 text-xs text-muted-foreground hover:underline"
          >
            Change role
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <Input
            type="text"
            placeholder="Full Name"
            className="rounded-xl bg-background/70"
          />

          <Input
            type="email"
            placeholder="Email address"
            className="rounded-xl bg-background/70"
          />

          <Input
            type="password"
            placeholder="Password"
            className="rounded-xl bg-background/70"
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            className="rounded-xl bg-background/70"
          />

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
            Create Account
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

        {/* Google Button */}
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

        {/* Login Redirect */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
   <RoleModal open={open} onOpenChange={setOpen}/>
    </div>
  );
}