import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import { Briefcase, MapPin, GraduationCap, Sparkles } from "lucide-react";
import JobActions from "@/components/company/JobActions";

export default async function JobDetailPage({
  params,
}: {
  params: { jobId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "COMPANY") {
    redirect("/login");
  }

  const job = await prisma.job.findFirst({
    where: {
      id: params.jobId,
      company: {
        userId: session.user.id,
      },
    },
  });

  if (!job) {
    notFound(); // 🔥 proper 404 page
  }

  const formatEmployment = (type?: string | null) => {
    if (!type) return "Not specified";
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {formatEmployment(job.employmentType)}
            </span>
            

            {job.experienceLevel && (
              <span className="flex items-center gap-1">
                <Briefcase size={14} />
                {job.experienceLevel}
              </span>
            )}

            {job.minCgpa && (
              <span className="flex items-center gap-1">
                <GraduationCap size={14} />
                CGPA {job.minCgpa}+
              </span>
            )}
            
          </div>
          <JobActions jobId={job.id} />
        </div>
        

        {/* DESCRIPTION */}
        <div className="mb-10 p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
          <h2 className="text-lg font-semibold mb-3">Job Description</h2>
          <p className="text-zinc-400 whitespace-pre-line leading-relaxed">
            {job.description || "No description provided"}
          </p>
        </div>

        {/* SKILLS */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-400" />
            Required Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-400/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* DOMAIN */}
        {job.domainFocus && (
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
            <h2 className="text-lg font-semibold mb-2">Domain Focus</h2>
            <p className="text-zinc-400">{job.domainFocus}</p>
          </div>
        )}

      </div>
    </div>
  );
}