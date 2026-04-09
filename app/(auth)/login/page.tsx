"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Navbar } from "@/components/navbar";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const { data: session, status } = useSession();

  useEffect(() => {
  if (status === "loading") return;

  if (session?.user?.role === "STUDENT") {
    router.replace("/student/dashboard");
  }

  if (session?.user?.role === "COMPANY") {
    router.replace("/company/dashboard");
  }

  if (session && !session.user?.role) {
    router.replace("/onboarding");
  }
}, [session, status, router]);

  const handleLogin=async(e:React.FormEvent)=>{
    e.preventDefault();

    setError("");
    setLoading(true);

    const res=await signIn("credentials",{email,password,redirect:false});

    setLoading(false);

    if(res?.error){
      setError("Invalid email or password");
      return;
    }

    router.push("/post-auth");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">

      <Navbar/>

      <div className="grid lg:grid-cols-2 min-h-screen pt-32">

        {/* LEFT SIDE */}

        <div className="hidden lg:flex flex-col justify-center px-20">

          <motion.div
          initial={{opacity:0,y:30}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.6}}
          >

            <p className="text-indigo-400 text-sm mb-4">
              AI Recruitment Platform
            </p>

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Match talent with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                mathematical precision.
              </span>
            </h1>

            <p className="text-zinc-400 max-w-md text-lg">
              Upload resumes, extract skills using AI, and rank candidates
              automatically against job requirements.
            </p>

          </motion.div>

        </div>

        {/* RIGHT SIDE LOGIN */}

        <div className="flex items-center justify-center px-6">

          <motion.div
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.5}}
          className="w-full max-w-md"
          >

            <h2 className="text-3xl font-semibold mb-2">
              Welcome back
            </h2>

            <p className="text-zinc-400 mb-8">
              Sign in to your account
            </p>

            <form onSubmit={handleLogin} className="space-y-5">

              <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              className="h-11 rounded-lg bg-[#0f0f12] border-white/10"
              />

              <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
              className="h-11 rounded-lg bg-[#0f0f12] border-white/10"
              />

              <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

            </form>

            {/* divider */}

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10"/>
              <span className="text-xs text-zinc-500">
                OR
              </span>
              <div className="h-px flex-1 bg-white/10"/>
            </div>

            <Button
            variant="outline"
            onClick={()=>signIn("google",{callbackUrl:"/post-auth"})}
            className="w-full h-11 rounded-lg border-white/10 bg-[#0f0f12]"
            >
              <FcGoogle className="mr-2"/>
              Continue with Google
            </Button>

            <p className="mt-6 text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-indigo-400">
                Sign up
              </Link>
            </p>

          </motion.div>

        </div>

      </div>

    </div>
  );
}