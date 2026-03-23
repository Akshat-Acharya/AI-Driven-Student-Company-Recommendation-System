"use client";

import EditCompanyModal from "@/components/company/EditCompanyModal";
import { useEffect, useState } from "react";

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
    return <div className="text-white p-10">Loading...</div>;
  }

  /* ---------------- HELPERS ---------------- */

  const initials = company.companyName
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
   <div className="max-w-6xl mx-auto px-6 mt-16">

  {/* HEADER */}
  <div className="flex items-center justify-between mb-8">

    <div className="flex items-center gap-4">

      {/* LOGO */}
      {company.logoUrl ? (
        <img
          src={company.logoUrl}
          className="w-16 h-16 rounded-xl border border-white/10 object-cover"
        />
      ) : (
        <div className="
          w-16 h-16 rounded-xl
          bg-indigo-500/20 border border-indigo-400/30
          flex items-center justify-center
          text-lg font-semibold
        ">
          {initials}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-semibold">
          {company.companyName}
        </h1>

        <div className="flex flex-wrap gap-3 text-sm text-zinc-400 mt-1">
          {company.location && <span>{company.location}</span>}
          {company.industry && <span>• {company.industry}</span>}
          {company.companySize && <span>• {company.companySize}</span>}
          {company.foundedYear && <span>• Est. {company.foundedYear}</span>}
        </div>
      </div>
    </div>

    {/* EDIT BUTTON */}
    <button className="
      px-4 py-2 rounded-lg
      bg-indigo-500/10 text-indigo-400
      border border-indigo-400/20
      hover:bg-indigo-500/20 transition
    "
    onClick={() => setOpenEdit(true)}
    >
      Edit Profile
    </button>
  </div>

  {/* GRID */}
  <div className="grid md:grid-cols-3 gap-6">

    {/* LEFT */}
    <div className="md:col-span-2 space-y-6">

      {/* ABOUT */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
        <h2 className="text-sm text-zinc-400 mb-3">About Company</h2>

        <p className="text-sm text-zinc-300 leading-relaxed">
          {company.description || "No description provided"}
        </p>
      </div>

      {/* DOMAINS */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
        <h2 className="text-sm text-zinc-400 mb-4">Hiring Domains</h2>

        {company.hiringDomains?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {company.hiringDomains.map((d) => (
              <span
                key={d}
                className="
                  px-3 py-1 rounded-lg text-xs
                  bg-indigo-500/20 text-indigo-300
                  border border-indigo-400/20
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
      </div>

    </div>

    {/* RIGHT */}
    <div className="space-y-6">

      {/* QUICK INFO */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
        <h2 className="text-sm text-zinc-400 mb-4">Company Info</h2>

        <div className="text-sm text-zinc-300 space-y-2">
          {company.website && (
            <p>
              🌐{" "}
              <a
                href={company.website}
                target="_blank"
                className="text-indigo-400 hover:underline"
              >
                Website
              </a>
            </p>
          )}

          {company.location && <p>📍 {company.location}</p>}
          {company.companySize && <p>👥 {company.companySize}</p>}
          {company.foundedYear && <p>📅 {company.foundedYear}</p>}
        </div>
      </div>

      {/* SOCIAL LINKS */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
        <h2 className="text-sm text-zinc-400 mb-4">Links</h2>

        <div className="flex flex-col gap-2 text-sm">
          {company.socialLinks?.length > 0 ? (
            company.socialLinks.map((link: any, i: number) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                className="text-indigo-400 hover:underline"
              >
                🔗 {link.type}
              </a>
            ))
          ) : (
            <p className="text-xs text-zinc-500">
              No links added
            </p>
          )}
        </div>
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
