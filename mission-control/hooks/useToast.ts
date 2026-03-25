// hooks/useToast.ts
"use client";

import { useState, useCallback, useRef } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  taskId?: string;
  createdAt: number;
}

const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 5000;

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (params: {
      type: ToastType;
      title: string;
      message?: string;
      taskId?: string;
    }) => {
      const id = `toast-${++toastCounter}`;
      const toast: Toast = {
        id,
        ...params,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        const next = [toast, ...prev];
        if (next.length > MAX_TOASTS) {
          const removed = next.pop();
          if (removed) {
            const timer = timersRef.current.get(removed.id);
            if (timer) {
              clearTimeout(timer);
              timersRef.current.delete(removed.id);
            }
          }
        }
        return next;
      });

      const timer = setTimeout(() => {
        removeToast(id);
      }, AUTO_DISMISS_MS);
      timersRef.current.set(id, timer);

      return id;
    },
    [removeToast]
  );

  const taskCompleted = useCallback(
    (title: string, skillCode: string, taskId?: string) => {
      addToast({ type: "success", title: `${title} completed via ${skillCode}`, taskId });
    },
    [addToast]
  );

  const taskFailed = useCallback(
    (title: string, error: string, taskId?: string) => {
      addToast({ type: "error", title: `${title} failed`, message: error, taskId });
    },
    [addToast]
  );

  const taskNeedsReview = useCallback(
    (title: string, taskId?: string) => {
      addToast({ type: "warning", title: `${title} needs your review`, taskId });
    },
    [addToast]
  );

  const chainStepReady = useCallback(
    (skillCode: string, chainName: string, taskId?: string) => {
      addToast({
        type: "info",
        title: `Next step ready: ${skillCode} in chain ${chainName}`,
        taskId,
      });
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    taskCompleted,
    taskFailed,
    taskNeedsReview,
    chainStepReady,
  };
}
