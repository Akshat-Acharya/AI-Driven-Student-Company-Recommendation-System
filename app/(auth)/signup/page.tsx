"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Navbar } from "@/components/navbar";

export default function SignupPage() {
  const router = useRouter();

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const handleSignup=async(e:React.FormEvent)=>{
    e.preventDefault();
    setError("");

    if(password!==confirmPassword){
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try{
      const res=await fetch("/api/register",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ name,email,password }),
      });

      const data=await res.json();

      if(!res.ok){
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      await signIn("credentials",{ email,password,redirect:false });

      router.push("/post-auth");

    }catch{
      setError("Unexpected error occurred.");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">

      <Navbar/>

      <div className="grid lg:grid-cols-2 min-h-screen pt-32">

        {/* LEFT SIDE */}

        <div className="hidden lg:flex flex-col justify-center px-20">

          <motion.div
          initial={{opacity:0,y:40}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.6}}
          >

            <p className="text-indigo-400 text-sm mb-4">
              AI Recruitment Platform
            </p>

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Build your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                AI hiring pipeline.
              </span>
            </h1>

            <p className="text-zinc-400 max-w-md text-lg">
              Extract structured skills from resumes, analyze talent automatically,
              and build a ranked hiring pipeline powered by AI.
            </p>

          </motion.div>

        </div>

        {/* SIGNUP PANEL */}

        <div className="flex items-center justify-center px-6">

          <motion.div
          initial={{opacity:0,y:30}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.5}}
          className="w-full max-w-md"
          >

            <h2 className="text-3xl font-semibold mb-2">
              Create account
            </h2>

            <p className="text-zinc-400 mb-8">
              Start using TalentBridge today
            </p>

            <form onSubmit={handleSignup} className="space-y-5">

              <Input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              required
              className="h-11 rounded-lg bg-[#0f0f12] border-white/10"
              />

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

              <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required
              className="h-11 rounded-lg bg-[#0f0f12] border-white/10"
              />

              <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500"
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>

              {error && (
                <p className="text-red-400 text-sm">
                  {error}
                </p>
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
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-400">
                Log in
              </Link>
            </p>

          </motion.div>

        </div>

      </div>

    </div>
  );
}