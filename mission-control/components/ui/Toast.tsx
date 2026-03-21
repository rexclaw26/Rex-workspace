"use client";

import { motion } from "framer-motion";
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import type { Toast as ToastType, ToastType as TType } from "@/hooks/useToast";

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
  onClick?: (taskId?: string) => void;
}

const typeConfig: Record<TType, { icon: any; borderColor: string; iconColor: string }> = {
  success: { icon: CheckCircle, borderColor: "#22C55E", iconColor: "#22C55E" },
  error: { icon: XCircle, borderColor: "#EF4444", iconColor: "#EF4444" },
  warning: { icon: AlertTriangle, borderColor: "#F97316", iconColor: "#F97316" },
  info: { icon: Info, borderColor: "#3B82F6", iconColor: "#3B82F6" },
};

export default function Toast({ toast, onDismiss, onClick }: ToastProps) {
  const config = typeConfig[toast.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="glass-card p-3 min-w-[280px] max-w-[360px] cursor-pointer"
      style={{ borderLeftWidth: "3px", borderLeftColor: config.borderColor }}
      onClick={() => onClick?.(toast.taskId)}
    >
      <div className="flex items-start gap-2">
        <Icon size={16} style={{ color: config.iconColor }} className="mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-body text-slate-200 truncate">{toast.title}</p>
          {toast.message && (
            <p className="text-xs font-body text-slate-400 mt-0.5 truncate">{toast.message}</p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(toast.id);
          }}
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}
