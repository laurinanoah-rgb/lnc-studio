"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { clearPendingLevelUp } from "@/lib/xp-actions";

type Pending = { level: number; unlocks: string[] } | null;

function playLevelUpChime() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.09;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  } catch {
    // Audio nicht verfügbar – kein Problem, Konfetti/Modal reichen auch so.
  }
}

export function LevelUpCelebration({ pending }: { pending: Pending }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!pending) return;

    setVisible(true);
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#ef4444", "#f97316", "#38bdf8"],
    });
    playLevelUpChime();
    clearPendingLevelUp();

    const timeout = setTimeout(() => setVisible(false), 7000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending?.level]);

  return (
    <AnimatePresence>
      {visible && pending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setVisible(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 text-center shadow-2xl"
          >
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="text-5xl"
            >
              🎉
            </motion.p>
            <h2 className="mt-4 text-2xl font-bold">
              Level {pending.level}!
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Glückwunsch, du bist aufgestiegen!</p>

            {pending.unlocks.length > 0 && (
              <div className="mt-5 flex flex-col gap-2 text-left">
                {pending.unlocks.map((unlock) => (
                  <p
                    key={unlock}
                    className="rounded-lg bg-surface-hover px-3 py-2 text-sm text-foreground"
                  >
                    {unlock}
                  </p>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setVisible(false)}
              className="mt-6 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
            >
              Weiter geht's
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
