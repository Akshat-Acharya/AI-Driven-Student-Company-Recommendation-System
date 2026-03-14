"use client";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  const role = session?.user?.role as "STUDENT" | "COMPANY";

  return (
<div className="h-screen bg-[#09090b] text-zinc-100 overflow-hidden">

  <Navbar />

  <div className="flex h-full pt-24">

    <Sidebar role={role} />

    <main
      className="
      flex-1
  ml-[300px]
  overflow-y-auto
  px-14
  py-10
      "
    >
      {children}
    </main>

  </div>
</div>
  );
}