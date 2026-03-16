"use client";

import { COLORS } from "@/lib/constants";

interface AchievementCardProps {
  icon: string;
  title: string;
  description: string;
  xpReward: number;
  unlockedAt?: string;
  locked?: boolean;
}

export function AchievementCard({ icon, title, description, xpReward, unlockedAt, locked }: AchievementCardProps) {
  return (
    <div
      className="rounded-xl border p-4 animate-fade-in"
      style={{
        background: locked ? "rgba(255,255,255,0.02)" : `linear-gradient(135deg, ${COLORS.card} 0%, ${COLORS.bg} 100%)`,
        borderColor: locked ? COLORS.border : `${COLORS.accent}44`,
        opacity: locked ? 0.5 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="text-3xl flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl"
          style={{
            background: locked ? "rgba(255,255,255,0.03)" : `${COLORS.accent}15`,
            filter: locked ? "grayscale(1)" : "none",
          }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm" style={{ color: locked ? COLORS.textMuted : COLORS.text }}>
            {title}
          </div>
          <div className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>
            {description}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-md"
              style={{
                background: `${COLORS.warning}22`,
                color: COLORS.warning,
              }}
            >
              +{xpReward} XP
            </span>
            {unlockedAt && !locked && (
              <span className="text-[10px]" style={{ color: COLORS.textMuted }}>
                {new Date(unlockedAt).toLocaleDateString("es-ES")}
              </span>
            )}
          </div>
        </div>
        {!locked && (
          <div className="text-accent text-lg">✓</div>
        )}
      </div>
    </div>
  );
}
