"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import GlowButton from "@/components/ui/GlowButton";
import { Power, Trash2, Plus } from "lucide-react";

export default function TriggerRulesPanel() {
  const rules = useQuery(api.triggerRules.getAll) || [];
  const toggleRule = useMutation(api.triggerRules.toggle);
  const removeRule = useMutation(api.triggerRules.remove);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-sm font-semibold text-slate-200">Trigger Rules</h3>
        <GlowButton variant="blue" size="sm">
          <Plus size={12} />
          Add Rule
        </GlowButton>
      </div>
      <div className="space-y-2">
        {rules.map((rule) => (
          <div
            key={rule._id}
            className={`flex items-center gap-3 p-2 rounded border ${
              rule.enabled
                ? "border-green-500/20 bg-green-500/5"
                : "border-white/5 bg-white/[0.02]"
            }`}
          >
            <button
              onClick={() => toggleRule({ id: rule._id })}
              className={`${rule.enabled ? "text-green-400" : "text-slate-600"}`}
            >
              <Power size={14} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-body text-slate-300 truncate">{rule.name}</p>
              {rule.description && (
                <p className="text-[10px] font-body text-slate-600 truncate">
                  {rule.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeRule({ id: rule._id })}
              className="text-slate-600 hover:text-red-400 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {rules.length === 0 && (
          <p className="text-xs text-slate-600 text-center py-4">No trigger rules defined</p>
        )}
      </div>
    </div>
  );
}
