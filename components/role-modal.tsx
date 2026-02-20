"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GraduationCap, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface RoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleModal({ open, onOpenChange }: RoleModalProps) {
  const router = useRouter();

  const handleSelect = (role: "student" | "company") => {
    onOpenChange(false);
    router.push(`/signup?role=${role}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          rounded-2xl 
          border 
          border-border/40 
          bg-background/70 
          p-8 
          shadow-2xl 
          backdrop-blur-xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Join TalentBridge as
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 grid gap-4">
          
          {/* Student */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect("student")}
            className="
              flex items-center gap-4 
              rounded-xl 
              border 
              border-border/40 
              bg-background/50 
              p-4 
              transition-all 
              hover:border-primary/40 
              hover:shadow-lg
            "
          >
            <div className="rounded-lg bg-primary/10 p-3">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Job Seeker</h3>
              <p className="text-sm text-muted-foreground">
                Find jobs and connect with companies
              </p>
            </div>
          </motion.button>

          {/* Company */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect("company")}
            className="
              flex items-center gap-4 
              rounded-xl 
              border 
              border-border/40 
              bg-background/50 
              p-4 
              transition-all 
              hover:border-primary/40 
              hover:shadow-lg
            "
          >
            <div className="rounded-lg bg-primary/10 p-3">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Company</h3>
              <p className="text-sm text-muted-foreground">
                Post jobs and hire talented candidates
              </p>
            </div>
          </motion.button>

        </div>
      </DialogContent>
    </Dialog>
  );
}