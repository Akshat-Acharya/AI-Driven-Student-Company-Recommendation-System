"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-3">
      {/* Login */}
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

      {/* Signup */}
      {/* <Link href="/signup">
        <Button size="sm">
          Sign Up
        </Button>
      </Link> */}

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="relative h-9 w-9 rounded-full"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  );
}
