"use client";

import { motion, AnimatePresence } from "framer-motion";

interface BootSequenceProps {
  isBooting: boolean;
  bootStage: number;
}

export default function BootSequence({ isBooting, bootStage }: BootSequenceProps) {
  if (!isBooting && bootStage >= 4) return null;

  return (
    <AnimatePresence>
      {isBooting && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {bootStage >= 0 && (
            <div className="text-center">
              <motion.h1
                className="font-data text-2xl md:text-4xl tracking-widest"
                style={{ color: "var(--blue-neon)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <TypewriterText text="MISSION CONTROL" delay={30} />
              </motion.h1>
              {bootStage >= 1 && (
                <motion.p
                  className="font-data text-xs tracking-[0.3em] mt-4"
                  style={{ color: "var(--text-tertiary)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  INITIALIZING SYSTEMS...
                </motion.p>
              )}
            </div>
          )}

          {bootStage >= 1 && (
            <motion.div
              className="absolute left-0 right-0 h-px opacity-30"
              style={{ backgroundColor: "var(--blue-neon)" }}
              initial={{ top: 0 }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.3, ease: "linear" }}
            />
          )}

          {bootStage >= 2 && (
            <motion.div
              className="absolute inset-0 mission-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {bootStage >= 3 && (
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {["Systems", "Network", "Skills", "Ready"].map((label, i) => (
                <motion.div
                  key={label}
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="font-data text-[10px] tracking-widest text-slate-500 uppercase">
                    {label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TypewriterText({ text, delay = 50 }: { text: string; delay?: number }) {
  return (
    <span
      className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-cyan-400"
      style={{
        animation: `typewriter ${text.length * delay}ms steps(${text.length}) forwards, blink-cursor 0.7s step-end infinite`,
      }}
    >
      {text}
    </span>
  );
}
