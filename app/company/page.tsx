import { Navbar } from "@/components/navbar";
import { JobsOverview } from "@/components/company/jobs-overview";
import { CandidateCards } from "@/components/company/candidate-cards";

export const metadata = {
  title: "Company Dashboard - RecruitAI",
  description: "AI-powered talent discovery and candidate management",
};

export default function CompanyDashboard() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold">
            Company <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-powered talent discovery for your open roles.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <JobsOverview />
          <CandidateCards />
        </div>
      </main>
    </div>
  );
}
