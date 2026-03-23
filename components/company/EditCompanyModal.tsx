"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

export default function EditCompanyModal({
  open,
  setOpen,
  initialData,
  onSuccess,
}: any) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [domainsInput, setDomainsInput] = useState("");

  const [form, setForm] = useState({
    companyName: "",
    description: "",
    location: "",
    website: "",
    industry: "",
    companySize: "",
    foundedYear: "",
    socialLinks: [] as { label: string; url: string }[],
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (initialData) {
      setForm({
        companyName: initialData.companyName || "",
        description: initialData.description || "",
        location: initialData.location || "",
        website: initialData.website || "",
        industry: initialData.industry || "",
        companySize: initialData.companySize || "",
        foundedYear: initialData.foundedYear || "",
        socialLinks: initialData.socialLinks || [],
      });

      setDomainsInput((initialData.hiringDomains || []).join(", "));
    }
  }, [initialData]);

  /* ---------------- LINKS ---------------- */

  const addLink = () => {
    setForm({
      ...form,
      socialLinks: [...form.socialLinks, { label: "", url: "" }],
    });
  };

  const updateLink = (index: number, field: string, value: string) => {
    const updated = [...form.socialLinks];
    (updated[index] as any)[field] = value;
    setForm({ ...form, socialLinks: updated });
  };

  const removeLink = (index: number) => {
    const updated = form.socialLinks.filter((_, i) => i !== index);
    setForm({ ...form, socialLinks: updated });
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/company/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          hiringDomains: domainsInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          foundedYear: form.foundedYear
            ? Number(form.foundedYear)
            : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed");
        return;
      }

      toast.success("Profile updated");
      onSuccess?.();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0b0b0d] p-6">

              <button
                onClick={() => setOpen(false)}
                className="absolute top-5 right-5 text-zinc-500"
              >
                <X size={18} />
              </button>

              <h2 className="text-xl font-semibold mb-1">
                Edit Company Profile
              </h2>
              <p className="text-sm text-zinc-500 mb-6">
                This helps students understand your company better
              </p>

              <div className="space-y-6">

                {/* BASIC */}
                <Section title="Basic Info">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Company Name"
                      placeholder="e.g. Code Crafters Pvt Ltd"
                      value={form.companyName}
                      onChange={(e: any) =>
                        setForm({ ...form, companyName: e.target.value })
                      }
                    />

                    <Input
                      label="Location"
                      placeholder="e.g. Bangalore, India"
                      value={form.location}
                      onChange={(e: any) =>
                        setForm({ ...form, location: e.target.value })
                      }
                    />
                  </div>
                </Section>

                {/* DETAILS */}
                <Section title="Company Details">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Website"
                      placeholder="https://yourcompany.com"
                      value={form.website}
                      onChange={(e: any) =>
                        setForm({ ...form, website: e.target.value })
                      }
                    />

                    <Input
                      label="Industry"
                      placeholder="e.g. AI / SaaS / FinTech"
                      value={form.industry}
                      onChange={(e: any) =>
                        setForm({ ...form, industry: e.target.value })
                      }
                    />

                   <select
  value={form.companySize}
  onChange={(e) =>
    setForm({ ...form, companySize: e.target.value })
  }
  className="
    h-10 rounded-lg bg-white/[0.04]
    border border-white/10 px-3 text-sm
  "
>
  <option value="">Select size</option>
  <option value="SMALL">1-10</option>
  <option value="MEDIUM">10-50</option>
  <option value="LARGE">50-200</option>
  <option value="ENTERPRISE">200+</option>
</select>

                    <Input
                      label="Founded Year"
                      placeholder="e.g. 2020"
                      type="number"
                      value={form.foundedYear}
                      onChange={(e: any) =>
                        setForm({ ...form, foundedYear: e.target.value })
                      }
                    />
                  </div>
                </Section>

                {/* HIRING */}
                <Section title="Hiring Domains">
                  <input
                    placeholder="e.g. Web Dev, AI, Backend"
                    value={domainsInput}
                    onChange={(e) => setDomainsInput(e.target.value)}
                    className="
                      w-full h-10 rounded-lg
                      bg-white/[0.04]
                      border border-white/10
                      px-3 text-sm outline-none
                    "
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Add roles you hire for (comma separated)
                  </p>
                </Section>

                {/* LINKS */}
                <Section title="Links">
                  <div className="space-y-3">
                    {form.socialLinks.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          placeholder="e.g. LinkedIn"
                          value={link.label}
                          onChange={(e) =>
                            updateLink(index, "label", e.target.value)
                          }
                          className="flex-1 h-10 rounded-lg bg-white/[0.04] border border-white/10 px-3 text-sm"
                        />

                        <input
                          placeholder="https://..."
                          value={link.url}
                          onChange={(e) =>
                            updateLink(index, "url", e.target.value)
                          }
                          className="flex-1 h-10 rounded-lg bg-white/[0.04] border border-white/10 px-3 text-sm"
                        />

                        <button
                          onClick={() => removeLink(index)}
                          className="px-3 text-red-400"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={addLink}
                      className="flex items-center gap-2 text-sm text-indigo-400"
                    >
                      <Plus size={14} /> Add Link
                    </button>
                  </div>
                </Section>

                {/* DESCRIPTION */}
                <Section title="About Company">
                  <textarea
                    placeholder="Tell students what your company does and what you build..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full h-28 rounded-xl bg-white/[0.04] border border-white/10 p-3 text-sm"
                  />
                </Section>

              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-white/10"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg bg-indigo-500 text-white"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* UI */
function Section({ title, children }: any) {
  return (
    <div>
      <h3 className="text-sm text-zinc-400 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-500">{label}</label>
      <input
        {...props}
        className="h-10 rounded-lg bg-white/[0.04] border border-white/10 px-3 text-sm outline-none"
      />
    </div>
  );
}``