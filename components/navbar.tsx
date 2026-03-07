"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/student/dashboard", label: "Student", icon: GraduationCap },
  { href: "/company/dashboard", label: "Company", icon: Briefcase },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full glass-strong"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold">TalentBridge</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-lg bg-secondary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <Icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {!session ? (
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                 className="
                  rounded-xl
                  border
                  border-border/40
                  bg-background/40
                  px-4
                  py-2
                  text-sm
                  font-medium
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:border-primary/50
                  hover:text-primary
                  hover:shadow-lg
                  active:scale-95
                "
              >
                Login
              </Button>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="
                    rounded-xl
                    border
                    border-border/40
                    bg-background/40
                    px-4
                    py-2
                    text-sm
                    font-medium
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:border-primary/50
                    hover:text-primary
                    hover:shadow-lg
                    active:scale-95
                  "
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}