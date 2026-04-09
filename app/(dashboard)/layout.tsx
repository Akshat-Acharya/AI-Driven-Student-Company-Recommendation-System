"use client";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useSession } from "next-auth/react";
import { Toaster } from "sonner";

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
    px-8
    py-10
  "
>
  <div className="max-w-6xl mx-auto w-full">
    {children}
  </div>

  <Toaster
    position="top-right"
    expand={true}
    toastOptions={{
      className: "glass-toast",
      style: {
        marginTop: "80px",
      },
    }}
  />
</main>

  </div>
</div>
  );
}