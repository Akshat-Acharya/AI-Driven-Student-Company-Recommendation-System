"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CompanyDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/company/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-10 text-white">Loading...</div>;

  const { stats, funnel, activeJobs, skillData, topJob, insights } = data;

  const funnelData = [
    { name: "Applied", value: funnel.APPLIED },
    { name: "Shortlisted", value: funnel.SHORTLISTED },
    { name: "Rejected", value: funnel.REJECTED },
    { name: "Hired", value: funnel.HIRED },
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-white px-10 py-8">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-zinc-400 text-sm">
          Hiring insights & performance
        </p>
      </div>

      {/* 🔥 STATS */}
      <div className="grid md:grid-cols-5 gap-4 mb-10">
        <Stat title="Jobs" value={stats.totalJobs} />
        <Stat title="Active" value={stats.activeJobs} />
        <Stat title="Applicants" value={stats.totalApplicants} />
        <Stat title="Shortlisted" value={stats.shortlisted} />
        <Stat title="Avg Score" value={`${stats.avgScore}%`} />
      </div>

      {/* 🔥 MAIN GRID */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        {/* FUNNEL */}
        <Card title="Hiring Funnel">
          <Chart data={funnelData} />
        </Card>

        {/* SKILL GRAPH */}
        <Card title="Top Skills">
          <Chart
            data={skillData.map((s: any) => ({
              name: s.skill,
              value: s.count,
            }))}
          />
        </Card>

        {/* 🔥 AI INSIGHTS (FOCUS PANEL) */}
        <div className="
          p-5 rounded-xl
          border border-indigo-500/30
          bg-gradient-to-br from-indigo-500/10 to-purple-500/10
        ">
          <h2 className="text-sm text-indigo-300 mb-3">
            ✨ AI Insights
          </h2>

          <div className="space-y-2 text-sm text-zinc-300">
            {insights?.map((i: string, idx: number) => (
              <p key={idx}>• {i}</p>
            ))}
          </div>
        </div>

      </div>

      {/* 🔥 SECOND ROW */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        {/* TOP JOB */}
        <Card title="Top Performing Job">
          {topJob ? (
            <Link href={`/company/jobs/${topJob.id}`}>
              <div className="
                p-4 rounded-lg border border-white/10
                hover:border-indigo-400/40 transition
              ">
                <p className="font-medium">{topJob.title}</p>
                <p className="text-xs text-zinc-400 mt-1">
                  {topJob.applicants} applicants
                </p>
              </div>
            </Link>
          ) : (
            <p className="text-zinc-500 text-sm">No data</p>
          )}
        </Card>

        {/* EMPTY SPACE → RESERVED FOR FUTURE */}
        <div />

        {/* EMPTY SPACE */}
        <div />

      </div>

      {/* 🔥 ACTIVE JOBS */}
      <div>
        <h2 className="text-sm text-zinc-400 mb-4">
          Active Jobs
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {activeJobs.map((job: any) => (
            <Link key={job.id} href={`/company/jobs/${job.id}`}>
              <motion.div
                whileHover={{ y: -3 }}
                className="
                  p-4 rounded-xl
                  border border-white/10
                  bg-[#0b0b10]
                  hover:border-indigo-400/40
                  transition
                "
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">
                      {job.title}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {job.applicants} applicants
                    </p>
                  </div>

                  <span className="
                    text-xs px-2 py-1 rounded
                    bg-indigo-500/20 text-indigo-300
                  ">
                    {job.avgScore}%
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}

/* 🔥 CARD */
function Card({ title, children }: any) {
  return (
    <div className="
      p-5 rounded-xl
      border border-white/10
      bg-[#0b0b10]
    ">
      <h2 className="text-sm text-zinc-400 mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

/* 🔥 CHART */
function Chart({ data }: any) {
  return (
    <div className="h-[220px]">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="#1f1f23" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: "#777", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: "#0b0b10",
              border: "1px solid #222",
              borderRadius: "6px",
            }}
          />
          <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* 🔥 STAT */
function Stat({ title, value }: any) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="
        p-4 rounded-xl
        border border-white/10
        bg-[#0b0b10]
      "
    >
      <p className="text-xs text-zinc-400">{title}</p>
      <h3 className="text-lg font-semibold mt-1">{value}</h3>
    </motion.div>
  );
}