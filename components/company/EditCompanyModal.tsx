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
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* MODAL */}
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.96, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="
              w-full max-w-3xl max-h-[90vh]
              flex flex-col
              rounded-3xl
              border border-white/10
              bg-gradient-to-br from-[#0b0b0d] to-[#111115]
              shadow-[0_0_80px_rgba(99,102,241,0.25)]
              overflow-hidden
            ">

              {/* HEADER */}
              <div className="relative px-6 py-5 border-b border-white/10">

                <div className="absolute inset-0 bg-indigo-500/5 blur-2xl" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Edit Company Profile
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Update how your company appears to students
                    </p>
                  </div>

                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/5 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

                <Section title="Basic Info">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Company Name"
                      value={form.companyName}
                      onChange={(e: any) =>
                        setForm({ ...form, companyName: e.target.value })
                      }
                    />
                    <Input
                      label="Location"
                      value={form.location}
                      onChange={(e: any) =>
                        setForm({ ...form, location: e.target.value })
                      }
                    />
                  </div>
                </Section>

                <Section title="Company Details">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Website"
                      value={form.website}
                      onChange={(e: any) =>
                        setForm({ ...form, website: e.target.value })
                      }
                    />
                    <Input
                      label="Industry"
                      value={form.industry}
                      onChange={(e: any) =>
                        setForm({ ...form, industry: e.target.value })
                      }
                    />

                    <Select
                      label="Company Size"
                      value={form.companySize}
                      onChange={(e: any) =>
                        setForm({ ...form, companySize: e.target.value })
                      }
                    >
                      <option value="">Select size</option>
                      <option value="SMALL">1-10</option>
                      <option value="MEDIUM">10-50</option>
                      <option value="LARGE">50-200</option>
                      <option value="ENTERPRISE">200+</option>
                    </Select>

                    <Input
                      label="Founded Year"
                      type="number"
                      value={form.foundedYear}
                      onChange={(e: any) =>
                        setForm({ ...form, foundedYear: e.target.value })
                      }
                    />
                  </div>
                </Section>

                <Section title="Hiring Domains">
                  <input
                    value={domainsInput}
                    onChange={(e) => setDomainsInput(e.target.value)}
                    placeholder="Web Dev, AI, Backend..."
                    className="w-full h-11 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-sm outline-none focus:border-indigo-400"
                  />
                </Section>

                <Section title="Links">
                  <div className="space-y-3">
                    {form.socialLinks.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          value={link.label}
                          onChange={(e) =>
                            updateLink(index, "label", e.target.value)
                          }
                          placeholder="Label"
                          className="flex-1 h-11 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-sm"
                        />
                        <input
                          value={link.url}
                          onChange={(e) =>
                            updateLink(index, "url", e.target.value)
                          }
                          placeholder="URL"
                          className="flex-1 h-11 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-sm"
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
                      className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      <Plus size={14} /> Add Link
                    </button>
                  </div>
                </Section>

                <Section title="About Company">
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full h-32 rounded-xl bg-white/[0.04] border border-white/10 p-4 text-sm"
                  />
                </Section>

              </div>

              {/* FOOTER */}
              <div className="p-5 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-500 text-white hover:bg-indigo-400 transition shadow-lg"
                >
                  {loading ? "Saving..." : "Save Changes"}
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

/* ---------------- UI ---------------- */

function Section({ title, children }: any) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
        {title}
      </h3>
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
        className="h-11 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-sm outline-none focus:border-indigo-400"
      />
    </div>
  );
}

function Select({ label, children, ...props }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-500">{label}</label>
      <select
        {...props}
        className="h-11 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-sm outline-none focus:border-indigo-400"
      >
        {children}
      </select>
    </div>
  );
}