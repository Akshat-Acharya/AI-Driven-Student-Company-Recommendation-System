import { Navbar } from "@/components/navbar";
import { ResumeUpload } from "@/components/student/resume-upload";
import { ProfileCard } from "@/components/student/profile-card";
import { SkillGapCard } from "@/components/student/skill-gap-card";
import { JobCards } from "@/components/student/job-cards";
import { AiChatPanel } from "@/components/student/ai-chat-panel";
import { LogoutButton } from "@/components/logout-button";

export const metadata = {
  title: "Student Dashboard - RecruitAI",
  description: "Your AI-powered career command center",
};

export default function StudentDashboard() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">
              Welcome back, <span className="gradient-text">Sarah</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Your AI career advisor found new opportunities for you.
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr_320px]">
          {/* Left column */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <ProfileCard />
            <ResumeUpload />
            <SkillGapCard />
          </aside>

          {/* Center */}
          <section>
            <JobCards />
          </section>

          {/* Right */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <AiChatPanel />
          </aside>
        </div>
      </main>
    </div>
  );
}