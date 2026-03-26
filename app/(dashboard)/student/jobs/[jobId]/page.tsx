import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MapPin } from "lucide-react";
import StudentChat from "@/components/student/StudentChat";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  // ✅ unwrap params FIRST
  const { jobId } = await params;

  // ✅ now this works
  if (!jobId) {
    return <div className="text-white p-10">Invalid Job ID</div>;
  }

  // ✅ SESSION
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div className="text-white p-10">Unauthorized</div>;
  }

  // ✅ USER + STUDENT PROFILE
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      studentProfile: true,
    },
  });

  if (!user?.studentProfile) {
    return <div className="text-white p-10">Profile not found</div>;
  }

  // ✅ JOB FETCH (MAIN FIX AREA)
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      company: true,
      applications: {
        where: {
          studentId: user.studentProfile.id,
        },
        select: { id: true },
      },
    },
  });

  if (!job) {
    return <div className="text-white p-10">Job not found</div>;
  }

  const isApplied = job.applications.length > 0;

 return (
  <div className="min-h-screen bg-[#09090b] text-white px-6 py-10">

    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER CARD */}
      <div className="
        p-6 rounded-2xl
        border border-white/10
        bg-white/[0.03]
      ">
        <div className="flex justify-between items-start">

          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>

            <p className="text-indigo-400 mt-2 text-sm">
              {job.company.companyName}
            </p>

            {/* META */}
            <div className="flex gap-4 text-xs text-zinc-500 mt-3">
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {job.employmentType || "Remote"}
              </span>

              <span>
                {new Date(job.createdAt).toDateString()}
              </span>
            </div>
          </div>

          {/* APPLIED BADGE */}
          {isApplied && (
            <span className="
              text-xs px-3 py-1 rounded-full
              bg-green-500/10 text-green-400
              border border-green-400/20
              h-fit
            ">
              Applied
            </span>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="
        p-6 rounded-2xl
        border border-white/10
        bg-white/[0.03]
      ">
        <h2 className="text-sm text-zinc-400 mb-3">
          Job Description
        </h2>

        <p className="text-sm text-zinc-300 whitespace-pre-line leading-relaxed">
          {job.description || "No description provided"}
        </p>
      </div>

      {/* DETAILS GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* DOMAIN */}
        {job.domainFocus && (
          <div className="
            p-6 rounded-2xl
            border border-white/10
            bg-white/[0.03]
          ">
            <h2 className="text-sm text-zinc-400 mb-3">
              Domain
            </h2>

            <span className="
              px-3 py-1 rounded-lg text-xs
              bg-indigo-500/20 text-indigo-300
            ">
              {job.domainFocus}
            </span>
          </div>
        )}

        {/* CGPA + EXPERIENCE */}
        {(job.minCgpa || job.experienceLevel) && (
          <div className="
            p-6 rounded-2xl
            border border-white/10
            bg-white/[0.03]
          ">
            <h2 className="text-sm text-zinc-400 mb-3">
              Requirements
            </h2>

            <div className="space-y-2 text-sm text-zinc-300">
              {job.minCgpa && (
                <p>Minimum CGPA: {job.minCgpa}</p>
              )}
              {job.experienceLevel && (
                <p>Experience: {job.experienceLevel}</p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* SKILLS */}
      {job.requiredSkills?.length > 0 && (
        <div className="
          p-6 rounded-2xl
          border border-white/10
          bg-white/[0.03]
        ">
          <h2 className="text-sm text-zinc-400 mb-3">
            Required Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill: string) => (
              <span
                key={skill}
                className="
                  px-3 py-1 rounded-lg text-xs
                  bg-white/[0.05]
                  border border-white/10
                  hover:bg-white/[0.08]
                  transition
                "
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* APPLY SECTION */}
      <div className="
        p-6 rounded-2xl
        border border-white/10
        bg-white/[0.03]
      ">
        <form action="/api/student/apply" method="POST">
          <input type="hidden" name="jobId" value={job.id} />

          <button
            disabled={isApplied}
            className={`
              w-full py-3 rounded-xl font-medium transition
              ${
                isApplied
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/20 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:opacity-90"
              }
            `}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </button>
        </form>
        
      </div>
           <StudentChat jobId={job.id} />   
    </div>
    
  </div>
);
}