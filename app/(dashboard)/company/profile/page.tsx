"use client";

import EditCompanyModal from "@/components/company/EditCompanyModal";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Company = {
  companyName: string;
  description?: string;
  location?: string;
  website?: string;
  logoUrl?: string;
  bannerUrl?: string;
  industry?: string;
  companySize?: string;
  foundedYear?: number;
  hiringDomains: string[];
  socialLinks?: any;
};

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    const res = await fetch("/api/company/profile");
    const data = await res.json();
    setCompany(data.company);
  };

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Loading...
      </div>
    );
  }

  const initials = company.companyName
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative min-h-screen bg-[#030303] overflow-hidden px-6 py-16">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />

      <div className="relative max-w-6xl mx-auto">

        {/* 🔥 HERO HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            relative overflow-hidden
            rounded-3xl
            bg-gradient-to-br from-white/[0.08] to-white/[0.02]
            border border-white/10
            p-10 mb-12
            shadow-[0_0_60px_rgba(99,102,241,0.15)]
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 opacity-40" />

          <div className="relative flex items-center justify-between">

            <div className="flex items-center gap-6">

              {/* LOGO */}
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-xl"
                />
              ) : (
                <div className="
                  w-20 h-20 rounded-2xl
                  bg-gradient-to-br from-indigo-500 to-purple-500
                  flex items-center justify-center
                  text-xl font-bold text-white
                  shadow-xl
                ">
                  {initials}
                </div>
              )}

              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  {company.companyName}
                </h1>

                <div className="flex flex-wrap gap-3 mt-2 text-sm text-zinc-400">
                  {company.location && <span>📍 {company.location}</span>}
                  {company.industry && <span>• {company.industry}</span>}
                  {company.companySize && <span>• {company.companySize}</span>}
                  {company.foundedYear && (
                    <span>• Est. {company.foundedYear}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setOpenEdit(true)}
              className="
                px-6 py-3 rounded-xl
                bg-gradient-to-r from-indigo-500 to-purple-500
                text-white font-medium
                shadow-lg hover:scale-[1.05]
                transition
              "
            >
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* 🔥 GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-8">

            <FadeIn>
              <Card title="About Company">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {company.description || "No description provided"}
                </p>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card title="Hiring Domains">
                {company.hiringDomains?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {company.hiringDomains.map((d) => (
                      <span
                        key={d}
                        className="
                          px-4 py-1.5 rounded-full text-xs font-medium
                          bg-gradient-to-r from-indigo-500/20 to-purple-500/20
                          border border-indigo-400/30
                          text-indigo-300
                          hover:scale-105 transition
                        "
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">
                    No domains added
                  </p>
                )}
              </Card>
            </FadeIn>

          </div>

          {/* RIGHT */}
          <div className="space-y-8 sticky top-24">

            <FadeIn>
              <Card title="Company Info">
                <div className="space-y-3 text-sm text-zinc-300">

                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      className="flex items-center gap-2 hover:text-indigo-400 transition"
                    >
                      🌐 Website
                    </a>
                  )}

                  {company.location && <p>📍 {company.location}</p>}
                  {company.companySize && <p>👥 {company.companySize}</p>}
                  {company.foundedYear && <p>📅 {company.foundedYear}</p>}
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card title="Social Links">
                {company.socialLinks?.length > 0 ? (
                  <div className="flex flex-col gap-3 text-sm">
                    {company.socialLinks.map((link: any, i: number) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        className="
                          flex items-center gap-3
                          px-4 py-3 rounded-xl
                          bg-white/[0.03]
                          border border-white/10
                          hover:border-indigo-400/50
                          hover:bg-indigo-500/10
                          transition
                        "
                      >
                        <span className="text-indigo-400">🔗</span>
                        <span className="text-zinc-300">{link.label}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">
                    No links added
                  </p>
                )}
              </Card>
            </FadeIn>

          </div>
        </div>

      </div>

      <EditCompanyModal
        open={openEdit}
        setOpen={setOpenEdit}
        initialData={company}
        onSuccess={fetchCompany}
      />
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function Card({ title, children }: any) {
  return (
    <div className="
      relative rounded-2xl
      bg-gradient-to-br from-white/[0.06] to-white/[0.02]
      border border-white/10
      p-6
      shadow-[0_10px_40px_rgba(0,0,0,0.4)]
      hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
      transition duration-300
    ">
      <div className="absolute inset-0 rounded-2xl bg-white/[0.02] opacity-0 hover:opacity-100 transition" />

      <h2 className="text-sm text-zinc-400 mb-4 tracking-wide">
        {title}
      </h2>

      <div className="relative">{children}</div>
    </div>
  );
}

function FadeIn({ children, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}