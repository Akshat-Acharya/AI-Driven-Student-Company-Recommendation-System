"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PostAuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
  if (status === "loading") return;

  if (!session?.user) {
    router.replace("/login");
    return;
  }

  if (!session.user.role) {
    router.replace("/onboarding");
    return;
  }

  if (session.user.role === "STUDENT") {
    router.replace("/student/resume");
  }

  if (session.user.role === "COMPANY") {
    router.replace("/company/dashboard");
  }

}, [session, status]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      Redirecting...
    </div>
  );
}
