"use client";

import { AnimatePresence } from "framer-motion";
import Toast from "./Toast";
import type { Toast as ToastType } from "@/hooks/useToast";

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
  onToastClick?: (taskId?: string) => void;
}

export default function ToastContainer({
  toasts,
  onDismiss,
  onToastClick,
}: ToastContainerProps) {
  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
            onClick={onToastClick}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
