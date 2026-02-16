"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-card to-accent/10 p-12 text-center"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="relative z-10">
          <h2 className="font-heading text-3xl font-bold text-balance sm:text-4xl">
            Ready to Transform Your{" "}
            <span className="gradient-text">Recruitment?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Join thousands of students and companies already using AI to find
            their perfect match.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
            >
              <Link href="/student">
                Get Started Free
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/company">Book a Demo</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
