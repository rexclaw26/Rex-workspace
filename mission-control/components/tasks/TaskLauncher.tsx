"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { X, ShieldCheck, Zap, ChevronDown } from "lucide-react";
import { getExposedSkills } from "@/config/skill-registry";

interface Props {
  agentName: string;
  agentSkills?: string[]; // skill codes — if omitted, shows all
  onClose: () => void;
  onLaunched?: (taskId: string) => void;
}

const PRIORITY_OPTIONS = [
  { value: "low",      label: "Low",      color: "text-[--text-muted]" },
  { value: "medium",   label: "Medium",   color: "text-blue-400" },
  { value: "high",     label: "High",     color: "text-orange-400" },
  { value: "critical", label: "Critical", color: "text-red-400" },
];

const CATEGORY_CLASS: Record<string, string> = {
  content:   "skill-pill-content",
  analytics: "skill-pill-analytics",
  technical: "skill-pill-technical",
  admin:     "skill-pill-admin",
};

export default function TaskLauncher({ agentName, agentSkills, onClose, onLaunched }: Props) {
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [priority, setPriority] = useState("medium");
  const [confirmed, setConfirmed] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState("");

  const createTask = useMutation(api.tasks.create);

  const allSkills = getExposedSkills();
  const skills = agentSkills
    ? allSkills.filter((s) => agentSkills.includes(s.code))
    : allSkills;

  // Group by category
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const toggleSkill = (code: string) => {
    setSelectedSkills((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleLaunch = async () => {
    if (!description.trim()) { setError("Task description is required."); return; }
    if (selectedSkills.length === 0) { setError("Select at least one skill."); return; }
    if (!confirmed) { setError("Please confirm human approval before launching."); return; }

    setLaunching(true);
    setError("");
    try {
      const primarySkill = skills.find((s) => s.code === selectedSkills[0]);
      const taskId = await createTask({
        title: description.trim(),
        description: description.trim(),
        skill: primarySkill?.fullName || selectedSkills[0],
        skillCode: selectedSkills[0],
        agentCodename: agentName,
        priority: priority as "low" | "medium" | "high" | "critical",
        status: "todo",
        notes: `Skills: ${selectedSkills.join(", ")}`,
      });
      onLaunched?.(taskId as string);
      onClose();
    } catch (e: any) {
      setError(e.message || "Launch failed. Check Convex connection.");
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[--border-card]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="page-title text-sm">Launch Task</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "12px", fontFamily: "var(--font-data)" }}>
              Agent: <span style={{ color: "var(--text-taupe)" }}>{agentName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Description */}
          <div>
            <label className="text-label block mb-2">Task Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you want the agent to do..."
              rows={3}
              className="w-full rounded-lg px-3 py-2.5 text-sm resize-none outline-none transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-card)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--orange-border)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-card)")}
            />
          </div>

          {/* Skill Selection */}
          <div>
            <label className="text-label block mb-3">Select Skills</label>
            <div className="space-y-3">
              {Object.entries(grouped).map(([category, catSkills]) => (
                <div key={category}>
                  <p
                    className="text-[10px] uppercase tracking-widest mb-2"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}
                  >
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {catSkills.map((s) => (
                      <button
                        key={s.code}
                        onClick={() => toggleSkill(s.code)}
                        className={`skill-pill ${CATEGORY_CLASS[s.category]} ${
                          selectedSkills.includes(s.code) ? "selected" : ""
                        }`}
                        style={
                          selectedSkills.includes(s.code)
                            ? { filter: "brightness(1.3)", fontWeight: 700 }
                            : {}
                        }
                      >
                        {s.displayName}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-label block mb-2">Priority</label>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    priority === p.value
                      ? "border-orange-500/50 bg-orange-500/10 " + p.color
                      : "border-[--border-card] bg-transparent text-[--text-muted] hover:border-[--border-hover]"
                  }`}
                  style={{ fontFamily: "var(--font-data)", letterSpacing: "0.05em" }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Approval Gate */}
          <div className="gate-banner">
            <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
            <div className="flex-1 text-xs" style={{ color: "var(--text-taupe)" }}>
              <strong style={{ color: "var(--orange)" }}>Approval Gate — </strong>
              Human review required before any external action (emails, posts, financial ops).
            </div>
            <input
              type="checkbox"
              id="confirm-launch"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 accent-orange-500 cursor-pointer"
            />
          </div>
          {!confirmed && (
            <p
              className="text-[11px] ml-1"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-data)" }}
            >
              Check the box above to confirm you'll review output before anything goes external.
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleLaunch}
              disabled={launching}
              className="flex-2 flex-1"
            >
              {launching ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Launching...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Launch Task
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
