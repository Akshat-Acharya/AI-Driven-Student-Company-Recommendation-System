"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function SkillInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addSkill = (skill: string) => {
    if (!skill.trim()) return;

    if (!value.includes(skill.trim())) {
      onChange([...value, skill.trim()]);
    }

    setInput("");
  };

  const removeSkill = (skill: string) => {
    onChange(value.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input);
    }

    if (e.key === "Backspace" && !input && value.length > 0) {
      removeSkill(value[value.length - 1]);
    }
  };

 return (
  <div className="flex flex-col gap-2">
    <label className="text-xs text-zinc-500">Skills</label>

    <div
      className="
        flex flex-wrap items-center gap-2
        min-h-[48px]                 /* 🔥 MATCH OTHER INPUT HEIGHT */
        w-full
        rounded-xl border border-white/10
        bg-white/[0.04]
        px-3
        py-2
        focus-within:border-indigo-500
        hover:border-white/20
        transition-all duration-200
      "
    >
      {value.map((skill) => (
        <span
          key={skill}
          className="
             flex items-center gap-1
            px-3 py-1.5               /* 🔥 bigger chip */
            rounded-lg
            bg-indigo-500/20 text-indigo-300
            text-xs font-medium
            whitespace-nowrap
          "
        >
          {skill}
          <X
            size={12}
            className="cursor-pointer hover:text-white"
            onClick={() => removeSkill(skill)}
          />
        </span>
      ))}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? "Type and press enter..." : ""}
        className="
          flex-1
          min-w-[120px]
          h-[28px]                   /* 🔥 vertical alignment fix */
          bg-transparent
          outline-none
          text-sm text-white
          placeholder:text-zinc-500
        "
      />
    </div>
  </div>
);
}