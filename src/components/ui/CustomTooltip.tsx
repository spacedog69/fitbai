"use client";

import { COLORS } from "@/lib/constants";

interface TooltipPayload {
  name: string;
  value: number | null;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-xl shadow-lg"
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        padding: "10px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <p className="text-xs mb-1.5 m-0" style={{ color: COLORS.textDim }}>
        {label}
      </p>
      {payload
        .filter((p) => p.value != null)
        .map((p, i) => (
          <p key={i} className="text-[13px] font-semibold font-mono m-0" style={{ color: p.color }}>
            {p.name}: {p.value?.toFixed(1)}
          </p>
        ))}
    </div>
  );
}
