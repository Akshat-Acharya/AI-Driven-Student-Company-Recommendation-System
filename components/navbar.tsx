"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, Sparkles, Rocket, Info } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/features", label: "Features", icon: Rocket },
  { href: "/how-it-works", label: "How it Works", icon: Bot },
  { href: "/about", label: "About", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">

      <motion.header
        initial={{ y: -40, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
        pointer-events-auto
        relative
        w-[92%]
        max-w-6xl
        flex
        items-center
        justify-between
        px-6
        py-3
        rounded-2xl
        border
        border-white/10
        bg-white/[0.06]
        backdrop-blur-xl
        shadow-[0_15px_50px_-15px_rgba(79,70,229,0.45)]
        "
      >

        {/* glow under navbar */}

        <div className="absolute inset-x-0 -bottom-10 h-20 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-indigo-500/20 blur-3xl opacity-40 pointer-events-none" />

        {/* LOGO */}

        <Link href="/" className="flex items-center gap-3 group">

          <div
            className="
            flex h-9 w-9 items-center justify-center
            rounded-xl
            bg-gradient-to-br
            from-indigo-500
            via-blue-500
            to-cyan-500
            shadow-lg
            transition-all duration-300
            group-hover:scale-110 group-hover:rotate-6
            "
          >
            <Bot className="h-4 w-4 text-white" />
          </div>

          <span className="font-semibold text-zinc-100 tracking-tight">
            TalentBridge
          </span>

        </Link>

        {/* NAVIGATION */}

        <nav className="hidden md:flex items-center gap-2 relative">

          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-200",
                  isActive
                    ? "text-white"
                    : "text-zinc-400 hover:text-white"
                )}
              >

                {/* active pill */}

                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-white/10 border border-white/10 backdrop-blur-md"
                    transition={{
                      type: "spring",
                      bounce: 0.25,
                      duration: 0.45,
                    }}
                  />
                )}

                <Icon className="relative z-10 h-4 w-4 opacity-80" />

                <span className="relative z-10">{link.label}</span>

              </Link>
            );
          })}

        </nav>

        {/* RIGHT SIDE */}

        <div className="flex items-center gap-3">

          

          {!session ? (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="
                  border
                  border-white/10
                  bg-white/[0.04]
                  backdrop-blur-md
                  rounded-xl
                  hover:bg-white/[0.08]
                  transition-all
                  "
                >
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button
                  size="sm"
                  className="
                  rounded-xl
                  bg-gradient-to-r
                  from-indigo-500
                  via-blue-500
                  to-cyan-500
                  text-white
                  shadow-lg
                  hover:opacity-90
                  transition-all
                  "
                >
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/post-auth">
                <Button
                  variant="ghost"
                  size="sm"
                  className="
                  border border-white/10
                  bg-white/[0.04]
                  rounded-xl
                  hover:bg-white/[0.08]
                  "
                >
                  Dashboard
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="
                border border-white/10
                bg-white/[0.04]
                rounded-xl
                hover:text-red-400
                hover:bg-white/[0.08]
                "
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Logout
              </Button>
            </>
          )}

        </div>

      </motion.header>

    </div>
  );
}