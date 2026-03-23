import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import { Briefcase, MapPin, GraduationCap, Sparkles } from "lucide-react";
import ApplicantsSection from "@/components/company/ApplicantsSection";
import JobActions from "@/components/company/JobActions";

// Force the page to be dynamic so it doesn't show cached data from other users
export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>; // In Next.js 15, params is a Promise
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "COMPANY") {
    redirect("/login");
  }

  // 1. CRITICAL FIX: Await the params before using them
  const decodedParams = await params;
  const jobId = decodedParams.jobId;

  // 2. Fetch the specific job owned by this user
  const job = await prisma.job.findFirst({
    where: {
      id: jobId, // This ensures we only get the job matching the URL
      company: {
        userId: session.user.id, // This ensures the logged-in user owns it
      },
    },
  });

  // Debugging log to see exactly what is being pulled in your terminal
  console.log(`Fetching Job ID: ${jobId} for User: ${session.user.id}`);
  console.log("Result Found:", job?.title || "NULL");

  if (!job) {
    notFound(); // Redirects to your 404 page if ID is wrong or belongs to another user
  }

  const formatEmployment = (type?: string | null) => {
    if (!type) return "Not specified";
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 px-6 py-14 relative overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-1/4 w-[600px] h-[600px] bg-indigo-600/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* ================= HERO ================= */}
        <div className="mb-14">
          <span
            className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
              ${
                job.status === "ACTIVE"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/20"
                  : "bg-red-500/10 text-red-400 border border-red-400/20"
              }
            `}
          >
            {job.status}
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4">
            {job.title}
          </h1>

          <p className="text-zinc-400 text-sm max-w-xl mb-6">
            This role is actively hiring. Candidates will be evaluated based on
            skills, experience, and compatibility with your requirements.
          </p>

          {/* META */}
          <div className="flex flex-wrap gap-3">
            <Badge icon={<MapPin size={14} />}>
              {formatEmployment(job.employmentType)}
            </Badge>

            {job.experienceLevel && (
              <Badge icon={<Briefcase size={14} />}>
                {job.experienceLevel}
              </Badge>
            )}

            {job.minCgpa && (
              <Badge icon={<GraduationCap size={14} />}>
                CGPA {job.minCgpa}+
              </Badge>
            )}
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* LEFT CONTENT */}
          <div className="md:col-span-2 space-y-10">
            {/* DESCRIPTION */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-zinc-200">
                Job Description
              </h2>

              <div className="text-zinc-400 leading-relaxed text-sm space-y-3">
                {(job.description || "No description provided")
                  .split("\n")
                  .map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
              </div>
            </div>

            {/* SKILLS */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-400" />
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="
                      px-3 py-1.5 text-xs rounded-full
                      bg-white/[0.04]
                      border border-white/10
                      text-zinc-300
                      hover:border-indigo-400/40 hover:text-white
                      transition-all
                    "
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* DOMAIN */}
            {job.domainFocus && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Domain Focus</h2>
                <p className="text-zinc-400 text-sm">{job.domainFocus}</p>
              </div>
            )}
          </div>

          {/* RIGHT SIDE PANEL */}
          <div className="space-y-6">
            {/* ACTION CARD */}
            <div
              className="
                p-6 rounded-2xl
                border border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
              "
            >
              <h3 className="text-sm text-zinc-400 mb-4">Actions</h3>
              <JobActions job={job} />
            </div>

            {/* QUICK INFO */}
            <div
              className="
                p-6 rounded-2xl
                border border-white/10
                bg-gradient-to-b from-white/[0.04] to-transparent
              "
            >
              <h3 className="text-sm text-zinc-400 mb-4">Overview</h3>

              <div className="space-y-3 text-sm">
                <InfoRow label="Employment">
                  {formatEmployment(job.employmentType)}
                </InfoRow>

                {job.experienceLevel && (
                  <InfoRow label="Experience">{job.experienceLevel}</InfoRow>
                )}

                {job.minCgpa && (
                  <InfoRow label="Minimum CGPA">{job.minCgpa}+</InfoRow>
                )}

                <InfoRow label="Posted">
                  {new Date(job.createdAt).toDateString()}
                </InfoRow>
              </div>
            </div>
          </div>
        </div>

        {/* APPLICANTS */}
        <div className="mt-16">
          <ApplicantsSection jobId={job.id} />
        </div>
      </div>
    </div>
  );
}

// Helper Components
function Badge({ children, icon }: any) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-white/[0.04] border border-white/10 text-zinc-300">
      {icon}
      {children}
    </div>
  );
}

function InfoRow({ label, children }: any) {
  return (
    <div className="flex justify-between text-zinc-400">
      <span>{label}</span>
      <span className="text-zinc-200">{children}</span>
    </div>
  );
}