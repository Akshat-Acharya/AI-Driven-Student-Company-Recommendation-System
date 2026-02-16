"use client";

import { motion } from "framer-motion";
import { Briefcase, Brain, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { companyJobs } from "@/lib/mock-data";

const stats = [
  {
    label: "Active Jobs",
    value: "3",
    icon: Briefcase,
    change: "+1 this week",
  },
  {
    label: "Total Applicants",
    value: "298",
    icon: Users,
    change: "+42 today",
  },
  {
    label: "AI Recommended",
    value: "39",
    icon: Brain,
    change: "Top 13%",
  },
  {
    label: "Avg Match Score",
    value: "87%",
    icon: TrendingUp,
    change: "+3% vs last month",
  },
];

export function JobsOverview() {
  return (
    <div className="flex flex-col gap-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass rounded-xl p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="mt-2 font-heading text-2xl font-bold">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.change}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Active Jobs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="glass rounded-xl"
      >
        <div className="border-b border-border/50 px-5 py-4">
          <h2 className="font-heading text-lg font-semibold">Active Postings</h2>
        </div>

        <div className="divide-y divide-border/30">
          {companyJobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div className="flex-1">
                <h3 className="text-sm font-semibold">{job.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {job.department} &middot; Posted {job.posted}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="font-semibold">{job.applicants}</p>
                  <p className="text-xs text-muted-foreground">Applied</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-primary">
                    {job.aiRecommended}
                  </p>
                  <p className="text-xs text-muted-foreground">AI Picks</p>
                </div>
                <Badge
                  variant={job.status === "active" ? "default" : "secondary"}
                  className="rounded-full capitalize"
                >
                  {job.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
