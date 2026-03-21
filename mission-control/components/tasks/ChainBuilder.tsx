"use client";

import { useState } from "react";
import { Plus, X, Lock, Unlock } from "lucide-react";
import {
  getExposedSkills,
  type SkillEntry,
  getCategoryColor,
} from "@/config/skill-registry";
import type { ChainStep } from "@/lib/chain-engine";
import SkillPill from "@/components/ui/SkillPill";

interface ChainBuilderProps {
  steps: ChainStep[];
  onChange: (steps: ChainStep[]) => void;
}

export default function ChainBuilder({ steps, onChange }: ChainBuilderProps) {
  const [showSelector, setShowSelector] = useState(false);
  const exposedSkills = getExposedSkills();

  const addStep = (skill: SkillEntry) => {
    onChange([
      ...steps,
      { skill: skill.fullName, skillCode: skill.code, requiresApproval: false },
    ]);
    setShowSelector(false);
  };

  const removeStep = (index: number) => {
    onChange(steps.filter((_, i) => i !== index));
  };

  const toggleApproval = (index: number) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], requiresApproval: !updated[index].requiresApproval };
    onChange(updated);
  };

  return (
    <div className="mt-2 space-y-2">
      {steps.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="flex items-center gap-1 glass px-2 py-1 rounded">
                <SkillPill skillCode={step.skillCode} />
                <button
                  onClick={() => toggleApproval(i)}
                  className="text-slate-500 hover:text-slate-300 ml-1"
                  title={step.requiresApproval ? "Requires approval" : "Auto-execute"}
                >
                  {step.requiresApproval ? <Lock size={10} /> : <Unlock size={10} />}
                </button>
                <button
                  onClick={() => removeStep(i)}
                  className="text-slate-600 hover:text-red-400 ml-0.5"
                >
                  <X size={10} />
                </button>
              </div>
              {i < steps.length - 1 && (
                <span className="text-slate-600 text-xs">→</span>
              )}
            </div>
          ))}
        </div>
      )}

      {steps.length > 0 && (
        <div className="flex gap-1 flex-wrap text-[9px] font-data text-slate-600">
          {steps.map((step, i) => (
            <span key={i} className="flex items-center gap-1">
              {step.requiresApproval ? "approval" : "auto"}
              {i < steps.length - 1 && <span className="mx-1">·</span>}
            </span>
          ))}
        </div>
      )}

      {!showSelector ? (
        <button
          onClick={() => setShowSelector(true)}
          className="flex items-center gap-1 text-xs font-body text-mc-blue-bright hover:text-mc-blue-neon transition-colors"
        >
          <Plus size={12} />
          Add chained task
        </button>
      ) : (
        <div className="glass p-2 rounded max-h-[200px] overflow-y-auto space-y-0.5">
          {exposedSkills.map((skill) => (
            <button
              key={skill.code}
              onClick={() => addStep(skill)}
              className="w-full text-left px-2 py-1 text-xs font-body text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded flex items-center gap-2"
            >
              <span style={{ color: getCategoryColor(skill.code) }}>◈</span>
              {skill.fullName}
            </button>
          ))}
          <button
            onClick={() => setShowSelector(false)}
            className="w-full text-center py-1 text-xs text-slate-600 hover:text-slate-400"
          >
            Cancel
          </button>
        </div>
      )}

      {steps.length === 0 && !showSelector && (
        <p className="text-[10px] font-body text-slate-600">
          (none yet — click above to add)
        </p>
      )}
    </div>
  );
}
