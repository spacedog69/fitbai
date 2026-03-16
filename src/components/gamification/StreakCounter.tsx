"use client";

import { COLORS } from "@/lib/constants";

interface StreakCounterProps {
  streak: number;
  level: number;
  xp: number;
  xpPerLevel: number;
}

export function StreakCounter({ streak, level, xp, xpPerLevel }: StreakCounterProps) {
  const xpInLevel = xp % xpPerLevel;
  const pct = (xpInLevel / xpPerLevel) * 100;

  return (
    <div
      className="rounded-2xl border p-5 animate-fade-in"
      style={{
        background: `linear-gradient(135deg, ${COLORS.card} 0%, ${COLORS.accentDim}22 100%)`,
        borderColor: `${COLORS.accent}33`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-extrabold font-mono animate-pulse-glow"
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDim})`,
              color: "white",
            }}
          >
            {level}
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: COLORS.text }}>
              Nivel {level}
            </div>
            <div className="text-xs" style={{ color: COLORS.textDim }}>
              {xpInLevel} / {xpPerLevel} XP
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <span className="text-2xl">🔥</span>
            <span className="text-3xl font-extrabold font-mono" style={{ color: COLORS.warning }}>
              {streak}
            </span>
          </div>
          <div className="text-[11px]" style={{ color: COLORS.textMuted }}>
            racha semanal
          </div>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${COLORS.accent}88, ${COLORS.accent})`,
            boxShadow: `0 0 12px ${COLORS.accent}44`,
          }}
        />
      </div>
    </div>
  );
}
