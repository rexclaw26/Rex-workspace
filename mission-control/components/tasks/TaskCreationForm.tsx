"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { SkillEntry } from "@/config/skill-registry";
import { getAgentForSkill } from "@/config/skill-to-agent";
import GlowButton from "@/components/ui/GlowButton";
import SkillPill from "@/components/ui/SkillPill";
import ChainBuilder from "./ChainBuilder";
import type { ChainStep } from "@/lib/chain-engine";
import { serializeChainConfig } from "@/lib/chain-engine";

interface TaskCreationFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkill?: SkillEntry | null;
  prefillData?: {
    title?: string;
    description?: string;
    priority?: string;
    skill?: SkillEntry;
    basedOnTitle?: string;
  };
}

export default function TaskCreationForm({
  isOpen,
  onClose,
  selectedSkill,
  prefillData,
}: TaskCreationFormProps) {
  const skill = prefillData?.skill || selectedSkill;
  const agent = skill ? getAgentForSkill(skill.fullName) : "Rex";

  const [title, setTitle] = useState(prefillData?.title || "");
  const [description, setDescription] = useState(prefillData?.description || "");
  const [priority, setPriority] = useState<string>(prefillData?.priority || "medium");
  const [dueDate, setDueDate] = useState("");
  const [chainSteps, setChainSteps] = useState<ChainStep[]>([]);
  const [autoExecute, setAutoExecute] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);

  const createTask = useMutation(api.tasks.create);

  const handleSubmit = async (runNow = false) => {
    const taskData: any = {
      title,
      description,
      status: runNow ? "in_progress" : "todo",
      priority: priority as any,
      agentCodename: agent,
      skill: skill?.fullName,
      skillCode: skill?.code,
    };

    if (dueDate) {
      taskData.dueDate = new Date(dueDate).getTime();
    }

    if (chainSteps.length > 0) {
      taskData.chainConfig = serializeChainConfig({
        name: `Chain for ${title}`,
        steps: chainSteps,
      });
    }

    await createTask(taskData);
    onClose();

    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setChainSteps([]);
    setAutoExecute(false);
    setRequiresApproval(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="glass-card w-full max-w-lg max-h-[85vh] overflow-y-auto relative z-10"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
      >
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <h2 className="font-display text-base font-semibold text-slate-200">
            {prefillData?.basedOnTitle
              ? `New Task (based on: ${prefillData.basedOnTitle})`
              : "Create Task"}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {skill && (
            <div className="flex items-center gap-4">
              <div>
                <span className="text-label block mb-1">Skill</span>
                <SkillPill skillCode={skill.code} showFullName size="md" />
              </div>
              <div>
                <span className="text-label block mb-1">Routed to</span>
                <span className="text-sm font-body text-slate-300">{agent} (auto)</span>
              </div>
            </div>
          )}

          <div>
            <label className="text-label block mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-sm font-body text-slate-200 placeholder-slate-600 outline-none focus:border-mc-blue/50"
            />
          </div>

          <div>
            <label className="text-label block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task..."
              rows={3}
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-sm font-body text-slate-200 placeholder-slate-600 outline-none focus:border-mc-blue/50 resize-none"
            />
          </div>

          <div>
            <label className="text-label block mb-1">Priority</label>
            <div className="flex gap-2">
              {["low", "medium", "high", "critical"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1.5 rounded text-xs font-body capitalize transition-all ${
                    priority === p
                      ? "bg-white/10 text-slate-200 border border-white/20"
                      : "bg-white/5 text-slate-500 border border-transparent hover:border-white/10"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-label block mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-2 rounded bg-white/5 border border-white/10 text-sm font-body text-slate-200 outline-none focus:border-mc-blue/50"
            />
          </div>

          <div className="border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
            <span className="text-label">Auto-Workflow (optional)</span>
            <ChainBuilder steps={chainSteps} onChange={setChainSteps} />
          </div>

          <div className="border-t pt-4 space-y-2" style={{ borderColor: "var(--border-subtle)" }}>
            <span className="text-label">Options</span>
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={autoExecute}
                onChange={(e) => setAutoExecute(e.target.checked)}
                className="rounded"
              />
              Auto-execute immediately after creation
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="rounded"
              />
              Requires approval before finalizing
            </label>
          </div>
        </div>

        <div
          className="flex items-center justify-end gap-2 p-4 border-t"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <GlowButton variant="ghost" onClick={onClose}>Cancel</GlowButton>
          <GlowButton variant="blue" onClick={() => handleSubmit(false)} disabled={!title.trim()}>
            Create Task
          </GlowButton>
          <GlowButton
            variant="orange"
            onClick={() => handleSubmit(true)}
            disabled={!title.trim() || !skill}
          >
            Create & Run Now
          </GlowButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
