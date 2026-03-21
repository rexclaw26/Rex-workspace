// hooks/useBootSequence.ts
"use client";

import { useState, useEffect } from "react";

const BOOT_DURATION = 3000;
const STORAGE_KEY_SESSION = "mc-boot-played";
const STORAGE_KEY_DISABLED = "mc-skip-boot";

export function useBootSequence() {
  const [isBooting, setIsBooting] = useState(false);
  const [bootStage, setBootStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const isDisabled = localStorage.getItem(STORAGE_KEY_DISABLED) === "true";
    const alreadyPlayed = sessionStorage.getItem(STORAGE_KEY_SESSION) === "true";

    if (isDisabled || alreadyPlayed) {
      setIsComplete(true);
      return;
    }

    setIsBooting(true);

    const timer1 = setTimeout(() => setBootStage(1), 500);
    const timer2 = setTimeout(() => setBootStage(2), 1200);
    const timer3 = setTimeout(() => setBootStage(3), 2500);
    const timer4 = setTimeout(() => {
      setBootStage(4);
      setIsBooting(false);
      setIsComplete(true);
      sessionStorage.setItem(STORAGE_KEY_SESSION, "true");
    }, BOOT_DURATION);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const toggleBootEnabled = () => {
    const current = localStorage.getItem(STORAGE_KEY_DISABLED) === "true";
    localStorage.setItem(STORAGE_KEY_DISABLED, current ? "false" : "true");
  };

  const isBootDisabled =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEY_DISABLED) === "true"
      : false;

  return {
    isBooting,
    bootStage,
    isComplete,
    toggleBootEnabled,
    isBootDisabled,
  };
}
