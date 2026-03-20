import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";

export default async function EditJobPage({
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

  if (!job) notFound();

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold mb-6">Edit Job</h1>

      {/* We'll replace this with form */}
      <pre>{JSON.stringify(job, null, 2)}</pre>
    </div>
  );
}