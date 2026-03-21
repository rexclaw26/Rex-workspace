"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import {
  getExposedSkillsByCategory,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type SkillCategory,
  type SkillEntry,
} from "@/config/skill-registry";

interface CreateTaskDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSkill: (skill: SkillEntry) => void;
  onCustomTask: () => void;
}

export default function CreateTaskDropdown({
  isOpen,
  onClose,
  onSelectSkill,
  onCustomTask,
}: CreateTaskDropdownProps) {
  const [search, setSearch] = useState("");
  const grouped = useMemo(() => getExposedSkillsByCategory(), []);

  const filteredGroups = useMemo(() => {
    if (!search) return grouped;
    const q = search.toLowerCase();
    const result: Record<SkillCategory, SkillEntry[]> = {
      content: [],
      analytics: [],
      technical: [],
      admin: [],
    };
    Object.entries(grouped).forEach(([cat, skills]) => {
      result[cat as SkillCategory] = skills.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.fullName.toLowerCase().includes(q) ||
          s.displayName.toLowerCase().includes(q)
      );
    });
    return result;
  }, [search, grouped]);

  const hasResults = Object.values(filteredGroups).some((s) => s.length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute bottom-full left-0 mb-2 w-72 glass-card overflow-hidden z-50"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="p-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <span className="text-label">Select Skill</span>
            </div>

            <div className="p-2 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/5">
                <Search size={14} className="text-slate-500" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-xs font-body text-slate-200 placeholder-slate-600 outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-1">
              {(Object.entries(filteredGroups) as [SkillCategory, SkillEntry[]][]).map(
                ([category, skills]) => {
                  if (skills.length === 0) return null;
                  return (
                    <div key={category} className="mb-1">
                      <div className="flex items-center gap-2 px-3 py-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[category] }}
                        />
                        <span className="text-[10px] font-data tracking-widest text-slate-500 uppercase">
                          {CATEGORY_LABELS[category]}
                        </span>
                      </div>
                      {skills.map((skill) => (
                        <button
                          key={skill.code}
                          onClick={() => onSelectSkill(skill)}
                          className="w-full px-3 py-1.5 text-left text-xs font-body text-slate-300 hover:bg-white/5 hover:text-slate-100 rounded transition-colors flex items-center gap-2"
                        >
                          <span style={{ color: CATEGORY_COLORS[category] }}>◈</span>
                          {skill.fullName}
                        </button>
                      ))}
                    </div>
                  );
                }
              )}
              {!hasResults && (
                <div className="text-center py-4 text-xs text-slate-600">
                  No skills match "{search}"
                </div>
              )}
            </div>

            <div className="p-2 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <button
                onClick={onCustomTask}
                className="w-full px-3 py-2 text-left text-xs font-body font-semibold rounded hover:bg-mc-orange/10 transition-colors flex items-center gap-2"
                style={{ color: "var(--orange-bright)" }}
              >
                <Sparkles size={14} />
                Custom Task
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
