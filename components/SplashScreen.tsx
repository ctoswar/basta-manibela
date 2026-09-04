"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [phase, setPhase] = useState<"showing" | "leaving" | "done">("showing");

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const holdMs = prefersReduced ? 200 : 1600;
    const leaveMs = prefersReduced ? 0 : 550;

    const leaveTimer = setTimeout(() => setPhase("leaving"), holdMs);
    const doneTimer = setTimeout(() => setPhase("done"), holdMs + leaveMs);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      onClick={() => setPhase("leaving")}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg transition-opacity duration-500 ${
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="splash-logo relative flex h-28 w-28 items-center justify-center">
        <svg
          viewBox="0 0 90 90"
          className="absolute inset-0 h-full w-full -rotate-90"
        >
          <circle
            cx="45"
            cy="45"
            r="40"
            fill="none"
            stroke="#2A2B30"
            strokeWidth="2"
          />
          <circle
            cx="45"
            cy="45"
            r="40"
            fill="none"
            stroke="#C9A227"
            strokeWidth="2"
            strokeLinecap="round"
            className="splash-ring"
          />
        </svg>
        <Image
          src="/images/logo.png"
          alt="Basta Manibela"
          width={96}
          height={96}
          priority
          className="h-24 w-24 rounded-full"
        />
      </div>

      <p className="mt-6 font-display text-2xl tracking-tightish text-paper">
        Basta <span className="text-gold">Manibela</span>
      </p>
      <p className="mt-1 font-body text-xs text-muted">
        Quality vehicles. Trusted service.
      </p>
    </div>
  );
}
