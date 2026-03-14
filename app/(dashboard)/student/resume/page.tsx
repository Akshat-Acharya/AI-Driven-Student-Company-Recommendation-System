"use client";

import { UploadCloud, FileText, User } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useEffect } from "react";

export default function StudentOnboardingPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [parsedSuccess, setParsedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    university: "",
    degree: "",
    graduationYear: "",
    cgpa: "",
    skills: "",
    projects: "",
    experienceLevel: "",
    domainFocus: "",
  });
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/student/profile");
        const data = await res.json();

        if (!data.profile) return;

        const profile = data.profile;

        setFormData({
          fullName: profile.fullName || "",
          university: profile.university || "",
          degree: profile.degree || "",
          graduationYear: profile.graduationYear || "",
          cgpa: profile.cgpa || "",
          skills: profile.skills?.join(", ") || "",
          projects: profile.projects?.join("\n") || "",
          experienceLevel: profile.experienceLevel || "",
          domainFocus: profile.domainFocus || "",
        });

        setResumeUrl(profile.resumeUrl || null);

        if (profile.resumeUrl) {
          setParsedSuccess(true);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/student/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, resumeUrl }),
      });

      const data = await res.json();

      console.log("Saved profile:", data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setParsedSuccess(false);
    setError(null);

    try {
      /* ---------------- UPLOAD RESUME ---------------- */

      const uploadForm = new FormData();
      uploadForm.append("file", file);

      const uploadRes = await fetch("/api/resume/upload", {
        method: "POST",
        body: uploadForm,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Upload failed");
      }

      setResumeUrl(uploadData.resumeUrl);

      /* ---------------- PARSE RESUME ---------------- */

      const parseForm = new FormData();
      parseForm.append("file", file);

      const parseRes = await fetch("/api/resume/parse", {
        method: "POST",
        body: parseForm,
      });

      const parseData = await parseRes.json();

      if (!parseRes.ok) {
        throw new Error(parseData.error || "Parsing failed");
      }

      const parsed = parseData.parsed ?? parseData;

      console.log("Parsed Resume:", parsed);

      setFormData({
        fullName: parsed.fullName || "",
        university: parsed.university || "",
        degree: parsed.degree || "",
        graduationYear: parsed.graduationYear || "",
        cgpa: "",
        skills: parsed.skills?.join(", ") || "",
        projects:
          parsed.projects
            ?.map((p: any) => (typeof p === "string" ? p : p.name || ""))
            .join("\n") || "",
        experienceLevel: parsed.experienceLevel || "",
        domainFocus: parsed.domainFocus || "",
      });
      setParsedSuccess(true);
    } catch (err) {
      console.error(err);
      setError("AI parsing failed. Please fill details manually.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 overflow-x-hidden">
      {/* Background Glow */}

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[20%] w-[500px] h-[500px] bg-indigo-600/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-200px] right-[20%] w-[500px] h-[500px] bg-cyan-600/20 blur-[140px] rounded-full" />
      </div>

      <main className="relative z-10 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          {/* HEADER */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Resume & Profile Setup
            </h1>

            <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
              Upload your resume and let AI extract your skills, projects, and
              experience automatically. You can update this anytime.
            </p>
          </motion.div>

          {/* RESUME UPLOAD */}

          <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  className="
  relative
  w-full
  rounded-3xl
  border border-white/10
  bg-gradient-to-b from-white/[0.05] to-white/[0.02]
  p-14
  flex flex-col items-center
  text-center
  gap-6
  overflow-hidden
  "
>
  <div className="absolute -top-32 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
    <UploadCloud className="text-indigo-400" size={28} />
  </div>

  <div>
    <h3 className="text-xl font-semibold">Upload your Resume</h3>

    <p className="text-sm text-zinc-400 mt-1">
      PDF format • AI will extract skills automatically
    </p>
  </div>

  {/* SHOW UPLOAD BUTTON ONLY IF NO RESUME */}
  {!resumeUrl && (
    <label className="cursor-pointer">
      <input
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFile}
      />

      <div
        className="
        px-8 py-3
        rounded-xl
        bg-gradient-to-r
        from-indigo-500
        via-blue-500
        to-cyan-500
        text-white
        font-medium
        hover:opacity-90
        transition
      "
      >
        Choose Resume
      </div>
    </label>
  )}

  {/* LOADING STATE */}
  {loading && (
    <p className="text-indigo-400 text-sm animate-pulse">
      Uploading & analyzing your resume...
    </p>
  )}

  {/* RESUME CARD */}
{resumeUrl && (
  <div
    className="
    w-full
    max-w-xl
    border border-white/10
    rounded-2xl
    bg-gradient-to-b from-white/[0.05] to-white/[0.02]
    p-6
    flex flex-col gap-4
    items-start
    "
  >
    {/* TOP SECTION */}

    <div className="flex items-center gap-4 w-full">

      {/* FILE ICON */}

      <div
        className="
        w-12 h-12
        rounded-xl
        bg-indigo-500/10
        border border-indigo-500/20
        flex items-center justify-center
        "
      >
        <FileText size={22} className="text-indigo-400" />
      </div>

      {/* FILE DETAILS */}

      <div className="flex flex-col flex-1 text-left">

        <span className="text-sm font-semibold truncate">
          {fileName}
        </span>

        {parsedSuccess && (
          <span className="text-xs text-emerald-400">
            AI parsed your resume successfully
          </span>
        )}

      </div>
    </div>

    {/* ACTION BUTTONS */}

    <div className="flex gap-3">

      <a
        href={resumeUrl}
        target="_blank"
        className="
        px-4 py-2
        rounded-lg
        text-sm
        bg-indigo-500/20
        hover:bg-indigo-500/30
        text-indigo-300
        transition
        "
      >
        Preview Resume
      </a>

      <label
        className="
        px-4 py-2
        rounded-lg
        text-sm
        bg-white/10
        hover:bg-white/20
        cursor-pointer
        transition
        "
      >
        Replace Resume

        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFile}
        />
      </label>

    </div>
  </div>
)}


  {/* SUCCESS MESSAGE */}
  {parsedSuccess && !loading && (
    <p className="text-emerald-400 text-sm">
      Resume parsed successfully ✔
    </p>
  )}

  {/* ERROR MESSAGE */}
  {error && (
    <p className="text-red-400 text-sm">{error}</p>
  )}
</motion.div>


          {/* PROFILE FORM */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="
            w-full
            rounded-3xl
            border border-white/10
            bg-gradient-to-b from-[#111113] to-[#0b0b0d]
            backdrop-blur-xl
            p-12
            shadow-[0_40px_120px_-30px_rgba(79,70,229,0.35)]
            "
          >
            <div className="flex items-center gap-3 mb-10">
              <User className="text-indigo-400" size={18} />
              <h2 className="text-xl font-semibold">Profile Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e: any) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />

              <Input
                label="University"
                value={formData.university}
                onChange={(e: any) =>
                  setFormData({ ...formData, university: e.target.value })
                }
              />

              <Input
                label="Degree"
                value={formData.degree}
                onChange={(e: any) =>
                  setFormData({ ...formData, degree: e.target.value })
                }
              />

              <Input
                label="Graduation Year"
                type="number"
                value={formData.graduationYear}
                onChange={(e: any) =>
                  setFormData({ ...formData, graduationYear: e.target.value })
                }
              />

              <Input
                label="CGPA"
                type="number"
                value={formData.cgpa}
                onChange={(e: any) =>
                  setFormData({ ...formData, cgpa: e.target.value })
                }
              />

              <Select
                label="Experience Level"
                value={formData.experienceLevel}
                onChange={(e: any) =>
                  setFormData({ ...formData, experienceLevel: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </Select>

              <Input
                label="Domain Focus"
                placeholder="Web Development / AI / Data Science"
                value={formData.domainFocus}
                onChange={(e: any) =>
                  setFormData({ ...formData, domainFocus: e.target.value })
                }
              />

              <Input
                label="Skills (comma separated)"
                value={formData.skills}
                onChange={(e: any) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
              />
            </div>

            <textarea
              value={formData.projects}
              onChange={(e: any) =>
                setFormData({ ...formData, projects: e.target.value })
              }
              placeholder="Projects"
              className="
              mt-8
              w-full
              rounded-xl
              bg-white/[0.04]
              border border-white/10
              p-4
              text-sm
              outline-none
              focus:border-indigo-500
              "
              rows={4}
            />

            <div className="mt-10 flex justify-end">
              <button
                onClick={handleSubmit}
                className="
  px-10 py-3
  rounded-xl
  bg-gradient-to-r
  from-indigo-500
  via-blue-500
  to-cyan-500
  text-white
  font-semibold
  hover:opacity-90
  transition
"
              >
                Complete Profile
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

/* INPUT */

function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-zinc-400">{label}</label>

      <input
        {...props}
        className="
        w-full
        rounded-xl
        bg-white/[0.04]
        border border-white/10
        px-4 py-2.5
        text-sm
        outline-none
        focus:border-indigo-500
        "
      />
    </div>
  );
}

/* SELECT */

function Select({ label, children, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-zinc-400">{label}</label>

      <select
        {...props}
        className="
        w-full
        rounded-xl
        bg-white/[0.04]
        border border-white/10
        px-4 py-2.5
        text-sm
        outline-none
        focus:border-indigo-500
        "
      >
        {children}
      </select>
    </div>
  );
}
