"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { studentProfile } from "@/lib/mock-data";

export function ProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <Avatar className="h-20 w-20 border-2 border-primary/30">
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-lg font-bold text-primary-foreground">
            {studentProfile.avatar}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-heading text-xl font-bold">
            {studentProfile.name}
          </h2>
          <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5" />
            {studentProfile.degree}
          </p>
          <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {studentProfile.university}
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-1">
          <Star className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-semibold">{studentProfile.gpa} GPA</span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {studentProfile.skills.map((skill, i) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
            >
              <Badge
                variant="secondary"
                className="rounded-full text-xs"
              >
                {skill}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {studentProfile.interests.map((interest) => (
            <Badge
              key={interest}
              variant="outline"
              className="rounded-full text-xs"
            >
              {interest}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
