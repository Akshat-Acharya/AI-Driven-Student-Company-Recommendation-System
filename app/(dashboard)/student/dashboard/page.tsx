"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-10 text-white">Loading...</div>;

  const { stats, statusCounts, recommended, insights } = data;

  const chartData = [
    { name: "Applied", value: statusCounts.APPLIED },
    { name: "Shortlisted", value: statusCounts.SHORTLISTED },
    { name: "Rejected", value: statusCounts.REJECTED },
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-white px-10 py-8">

      {/* HEADER */}
      <h1 className="text-3xl mb-8">Student Dashboard</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4 mb-10">
        <Stat title="Applications" value={stats.totalApplications} />
        <Stat title="Shortlisted" value={stats.shortlisted} />
        <Stat title="Avg Score" value={`${stats.avgScore}%`} />
        <Stat title="Profile" value={stats.profileCompleted ? "Done" : "Incomplete"} />
      </div>

      {/* MAIN */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        {/* STATUS CHART */}
        <Card title="Application Status">
          <Chart data={chartData} />
        </Card>

        {/* RECOMMENDED */}
        <Card title="Recommended Jobs">
          {recommended.map((job: any) => (
            <Link key={job.id} href={`/student/jobs/${job.id}`}>
              <div className="p-3 border border-white/10 rounded mb-2 hover:border-indigo-400">
                <p>{job.title}</p>
                <p className="text-xs text-zinc-400">{job.score}% match</p>
              </div>
            </Link>
          ))}
        </Card>

        {/* AI */}
        <div className="p-5 rounded-xl border border-indigo-500/30 bg-indigo-500/5">
          <h2 className="text-sm text-indigo-300 mb-3">
            ✨ AI Insights
          </h2>

          {insights.map((i: string, idx: number) => (
            <p key={idx} className="text-sm mb-2">• {i}</p>
          ))}
        </div>

      </div>

    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="p-5 rounded-xl border border-white/10 bg-[#0b0b10]">
      <h2 className="text-sm text-zinc-400 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Chart({ data }: any) {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <Tooltip />
          <Bar dataKey="value" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="p-4 border border-white/10 rounded bg-[#0b0b10]">
      <p className="text-xs text-zinc-400">{title}</p>
      <h3 className="text-lg">{value}</h3>
    </div>
  );
}