"use client";

import { COLORS } from "@/lib/constants";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <div
      className="rounded-2xl border p-5 animate-fade-in"
      style={{
        background: `linear-gradient(135deg, ${COLORS.card} 0%, ${COLORS.bg} 100%)`,
        borderColor: COLORS.border,
      }}
    >
      <div className="mb-4">
        <h3 className="text-base font-bold m-0" style={{ color: COLORS.text }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs mt-1 m-0" style={{ color: COLORS.textMuted }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
