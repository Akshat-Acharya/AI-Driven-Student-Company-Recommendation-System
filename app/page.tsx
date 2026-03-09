"use client";

import { useRef, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  SearchCode,
  ShieldCheck,
  UserCircle,
  CheckCircle2,
  TrendingUp,
  Briefcase,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function UltimateGSAPHome() {
  const container = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const bentoGridRef = useRef<HTMLDivElement>(null);

  /* ---------------- CURSOR SPOTLIGHT ---------------- */

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      gsap.to(container.current, {
        "--x": `${e.clientX}px`,
        "--y": `${e.clientY}px`,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  /* ---------------- GSAP ANIMATIONS ---------------- */

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
        .fromTo(
          ".hero-title-line",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 1 },
          "-=0.4"
        )
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0 },
          "-=0.6"
        )
        .fromTo(
          ".hero-buttons",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0 },
          "-=0.6"
        );

      /* DASHBOARD SCALE */

      gsap.fromTo(
        dashboardRef.current,
        { scale: 0.85, opacity: 0.3, y: 120, rotateX: 10 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          rotateX: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: dashboardRef.current,
            start: "top 90%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );

      /* PARALLAX */

      gsap.to(dashboardRef.current, {
        yPercent: -10,
        scrollTrigger: {
          trigger: dashboardRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      /* BENTO GRID */

      gsap.fromTo(
        ".bento-item",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          scrollTrigger: {
            trigger: bentoGridRef.current,
            start: "top 80%",
          },
        }
      );

      /* UI STAGGER */

      gsap.fromTo(
        ".ui-element",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.8,
          scrollTrigger: {
            trigger: dashboardRef.current,
            start: "top 60%",
          },
        }
      );

      /* FLOATING PARTICLES */

      gsap.to(".particle", {
        y: -40,
        opacity: 0,
        duration: 6,
        stagger: 0.3,
        repeat: -1,
        ease: "none",
      });

      /* MAGNETIC BUTTONS */

      gsap.utils.toArray(".magnetic").forEach((btn: any) => {
        btn.addEventListener("mousemove", (e: any) => {
          const rect = btn.getBoundingClientRect();

          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(btn, {
            x: x * 0.25,
            y: y * 0.25,
            duration: 0.3,
          });
        });

        btn.addEventListener("mouseleave", () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1,0.4)",
          });
        });
      });

      /* CARD TILT */

      gsap.utils.toArray(".bento-item").forEach((card: any) => {
        card.addEventListener("mousemove", (e: any) => {
          const rect = card.getBoundingClientRect();

          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const rotateX = -(y - rect.height / 2) / 20;
          const rotateY = (x - rect.width / 2) / 20;

          gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 800,
            duration: 0.3,
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
          });
        });
      });

      /* SCROLL PROGRESS */

      gsap.to(".progress-bar", {
        scaleX: 1,
        transformOrigin: "left",
        scrollTrigger: {
          scrub: true,
          start: "top top",
          end: "bottom bottom",
        },
      });
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="min-h-screen bg-[#09090b] text-zinc-100 overflow-x-hidden"
      style={{ "--x": "50%", "--y": "50%" } as any}
    >
      <Navbar />

      {/* Scroll Progress */}

      <div className="progress-bar fixed top-0 left-0 h-[2px] bg-indigo-500 w-full scale-x-0 z-50" />

      {/* Cursor Glow */}

      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(600px at var(--x) var(--y), rgba(99,102,241,0.15), transparent 40%)",
        }}
      />

      {/* Floating Particles */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-indigo-400/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 pt-32 pb-40">
        {/* HERO */}

        <section className="px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="hero-badge mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <Sparkles size={14} className="text-indigo-400" />
            <span className="text-xs text-zinc-300">
              TalentBridge Intelligence
            </span>
          </div>

          <h1 className="hero-title-line text-5xl md:text-[5rem] font-bold tracking-tight">
            Match talent with
          </h1>

          <h1 className="hero-title-line text-5xl md:text-[5rem] font-bold bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            mathematical precision.
          </h1>

          <p className="hero-subtitle text-lg text-zinc-400 max-w-2xl mt-6">
            Upload a resume. Our AI extracts skills, structures the data,
            and ranks candidates against job requirements.
          </p>

          <div className="hero-buttons flex gap-4 mt-10">
            <button className="magnetic flex items-center gap-2 px-8 py-4 bg-zinc-100 text-zinc-900 rounded-full font-semibold hover:scale-105 transition">
              Start Building Free
              <ArrowRight size={18} />
            </button>

            <button className="magnetic px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition">
              See How It Works
            </button>
          </div>
        </section>

        {/* DASHBOARD */}

        <section className="mt-24 px-6 max-w-6xl mx-auto" style={{ perspective: "1200px" }}>
  <div
    ref={dashboardRef}
    className="relative w-full h-[520px] rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#111113] to-[#0b0b0d] backdrop-blur-xl overflow-hidden shadow-[0_40px_120px_-30px_rgba(79,70,229,0.35)]"
  >

    {/* glow layer */}

    <div className="absolute inset-0 opacity-40 pointer-events-none">
      <div className="absolute top-[-80px] left-[30%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-120px] right-[20%] w-[500px] h-[500px] bg-cyan-600/20 blur-[120px] rounded-full" />
    </div>

    {/* window header */}

    <div className="h-12 border-b border-white/10 flex items-center px-6 gap-2 bg-black/40 backdrop-blur">
      <div className="w-3 h-3 rounded-full bg-red-500" />
      <div className="w-3 h-3 rounded-full bg-yellow-500" />
      <div className="w-3 h-3 rounded-full bg-green-500" />
    </div>

    <div className="flex h-full">

      {/* sidebar */}

      <div className="w-64 border-r border-white/10 p-6 hidden md:flex flex-col gap-6">

        <div className="text-xs text-zinc-500 uppercase tracking-wider">
          Active Jobs
        </div>

        <div className="flex flex-col gap-3 text-sm">

          <div className="ui-element px-3 py-2 bg-indigo-500/15 rounded-lg text-indigo-400">
            Frontend Engineer
          </div>

          <div className="ui-element px-3 py-2 hover:bg-white/5 rounded-lg text-zinc-400">
            Backend Engineer
          </div>

          <div className="ui-element px-3 py-2 hover:bg-white/5 rounded-lg text-zinc-400">
            AI Engineer
          </div>

        </div>
      </div>

      {/* main canvas */}

      <div className="flex-1 p-8 flex flex-col gap-6">

        {/* header */}

        <div className="flex justify-between items-center">

          <div>
            <h3 className="text-xl font-semibold">Top Candidates</h3>
            <p className="text-xs text-zinc-500">
              Ranked using normalized skill vectors
            </p>
          </div>

          <div className="text-sm text-emerald-400 flex items-center gap-2 bg-emerald-400/10 px-3 py-1 rounded-full">
            <CheckCircle2 size={14} />
            24 new matches
          </div>

        </div>

        {/* candidate cards */}

        <div className="flex flex-col gap-4">

          <div className="ui-element bg-white/[0.03] border border-white/10 rounded-xl p-5 flex justify-between items-center hover:bg-white/[0.06] transition">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-semibold">
                AC
              </div>

              <div>
                <h4 className="font-medium">Alex Chen</h4>
                <p className="text-xs text-zinc-500">Stanford CS</p>
              </div>

            </div>

            {/* skill bars */}

            <div className="hidden md:flex gap-6 items-center">

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-zinc-500">React</span>
                <div className="w-24 h-1 bg-zinc-800 rounded">
                  <div className="h-1 w-[85%] bg-indigo-500 rounded" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-zinc-500">NextJS</span>
                <div className="w-24 h-1 bg-zinc-800 rounded">
                  <div className="h-1 w-[80%] bg-cyan-400 rounded" />
                </div>
              </div>

            </div>

            <div className="text-emerald-400 flex items-center gap-1 font-semibold">
              98%
              <TrendingUp size={14} />
            </div>

          </div>

        </div>

        {/* activity graph */}

        <div className="ui-element mt-4 h-24 bg-white/[0.02] border border-white/10 rounded-xl flex items-end px-4 gap-2">

          {[20,40,30,60,45,80,70,90,60,75].map((h,i)=>(
            <div
              key={i}
              style={{height:`${h}%`}}
              className="flex-1 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-sm opacity-70"
            />
          ))}

        </div>

      </div>

    </div>
  </div>
</section>

        {/* BENTO */}

       <section className="mt-32 px-6 max-w-5xl mx-auto">
  <div
    ref={bentoGridRef}
    className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[260px]"
  >

    {/* Card 1 */}

    <div className="bento-item md:col-span-2 relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-8 overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">

      {/* glow */}

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/20 blur-[90px] rounded-full" />
      </div>

      {/* icon */}

      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition">
        <Cpu className="text-indigo-400" size={22} />
      </div>

      <h3 className="text-xl font-semibold text-zinc-100">
        Local LLM Parsing
      </h3>

      <p className="text-zinc-400 text-sm mt-3 max-w-md leading-relaxed">
        Our local AI pipeline reads resumes and extracts structured
        skills, projects, and experience into normalized vectors.
      </p>

    </div>


    {/* Card 2 */}

    <div className="bento-item relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03]">

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/20 blur-[90px] rounded-full" />
      </div>

      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition">
        <SearchCode className="text-cyan-400" size={22} />
      </div>

      <h3 className="text-xl font-semibold text-zinc-100">
        Skill Normalization
      </h3>

      <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
        Convert thousands of different resume formats into a unified
        skill language understood by the matching engine.
      </p>

    </div>


    {/* Card 3 */}

    <div className="bento-item relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03]">

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/20 blur-[90px] rounded-full" />
      </div>

      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition">
        <ShieldCheck className="text-emerald-400" size={22} />
      </div>

      <h3 className="text-xl font-semibold text-zinc-100">
        Deterministic Match
      </h3>

      <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
        Our matching engine computes skill similarity scores
        deterministically — removing bias from hiring decisions.
      </p>

    </div>


    {/* Card 4 */}

    <div className="bento-item md:col-span-2 relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-8 overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
        <div className="absolute -top-24 left-1/2 w-80 h-80 bg-blue-500/20 blur-[110px] rounded-full" />
      </div>

      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition">
        <Layers className="text-blue-400" size={22} />
      </div>

      <h3 className="text-xl font-semibold text-zinc-100">
        Symmetrical Marketplace
      </h3>

      <p className="text-zinc-400 text-sm mt-3 max-w-md leading-relaxed">
        Students get actionable insights on missing skills while
        companies receive ranked pipelines of qualified candidates.
      </p>

    </div>

  </div>
</section>
      </main>
    </div>
  );
}