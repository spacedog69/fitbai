"use client";

import { COLORS } from "@/lib/constants";
import { calculateProgress } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | null | undefined;
  unit: string;
  change: number | null;
  goal?: number;
  startValue?: number;
  icon: string;
  color: string;
}

export function StatCard({ label, value, unit, change, goal, startValue, icon, color }: StatCardProps) {
  const pct = goal && value && startValue ? calculateProgress(value, startValue, goal) : 0;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border animate-fade-in"
      style={{
        background: `linear-gradient(135deg, ${COLORS.card} 0%, ${COLORS.bg} 100%)`,
        borderColor: COLORS.border,
        padding: "20px 20px 16px",
      }}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] opacity-80" style={{ background: color }} />

      <div className="flex justify-between items-start mb-2">
        <span className="text-[13px] font-medium tracking-wider uppercase" style={{ color: COLORS.textDim }}>
          {label}
        </span>
        <span className="text-xl">{icon}</span>
      </div>

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-[34px] font-extrabold font-mono tracking-tight" style={{ color: COLORS.text }}>
          {typeof value === "number" ? value.toFixed(1) : "—"}
        </span>
        <span className="text-sm font-medium" style={{ color: COLORS.textMuted }}>
          {unit}
        </span>
      </div>

      {change !== null && change !== undefined && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-md"
            style={{
              background: change < 0 ? "rgba(16,185,129,0.15)" : change === 0 ? "rgba(148,163,184,0.15)" : "rgba(239,68,68,0.15)",
              color: change < 0 ? COLORS.accent : change === 0 ? COLORS.textDim : COLORS.danger,
            }}
          >
            {change === 0 ? "=" : change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1)} {unit}
          </span>
          <span className="text-[11px]" style={{ color: COLORS.textMuted }}>
            vs anterior
          </span>
        </div>
      )}

      {goal && (
        <div className="mt-1.5">
          <div className="flex justify-between mb-1">
            <span className="text-[11px]" style={{ color: COLORS.textMuted }}>
              Meta: {goal}{unit}
            </span>
            <span className="text-[11px] font-bold" style={{ color }}>
              {Math.round(pct)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${color}88, ${color})`,
                boxShadow: `0 0 12px ${color}44`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
