"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import {
  LayoutDashboard,
  Briefcase,
  FileText,
  TrendingUp,
  User,
  Bot,
  PlusCircle,
  Users,
  Sparkles,
  Building,
  ClipboardList,
} from "lucide-react";

type Role = "STUDENT" | "COMPANY";

interface SidebarProps {
  role: Role;
}

const studentLinks = [
  {
    href: "/student/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/student/resume",
    label: "Resume",
    icon: FileText,
  },
  {
    href: "/student/jobs",
    label: "Jobs",
    icon: Briefcase,
  },
  {
    href: "/student/recommendations",
    label: "AI Recommendations",
    icon: ClipboardList,
  },
  // {
  //   href: "/student/skill-gap",
  //   label: "Skill Gap",
  //   icon: TrendingUp,
  // },
];

const companyLinks = [
  {
    href: "/company/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/company/jobs",
    label: "Jobs",
    icon: Briefcase,
  },
  {
    href: "/company/candidates",
    label: "Candidates",
    icon: Users,
  },
  {
    href: "/company/profile",
    label: "Company Profile",
    icon: Building,
  },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const links = role === "STUDENT" ? studentLinks : companyLinks;

  return (
  <aside
  className="
  fixed
  left-6
  top-28
  bottom-6
  w-64
  rounded-2xl
  border border-white/10
  bg-white/[0.04]
  backdrop-blur-xl
  shadow-[0_20px_60px_-20px_rgba(79,70,229,0.45)]
  p-5
  flex
  flex-col
  "
>
  <div className="absolute -top-20 left-10 w-60 h-60 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <nav className="flex flex-col gap-2">

        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
  "relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition",
  isActive
    ? "text-white"
    : "text-zinc-400 hover:text-white hover:bg-white/5"
)}
            >

              {/* active background */}

              {isActive && (
  <motion.div
    layoutId="sidebar-pill"
    className="
    absolute
    inset-0
    rounded-xl
    bg-gradient-to-r
    from-indigo-500/20
    to-cyan-500/20
    border border-white/10
    "
  />
)}

              <Icon className="relative z-10 w-4 h-4" />

              <span className="relative z-10">{link.label}</span>

            </Link>
          );
        })}

      </nav>
    </aside>
  );
}