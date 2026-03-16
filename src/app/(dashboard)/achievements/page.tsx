"use client";

import { useState, useEffect } from "react";
import { COLORS, ACHIEVEMENT_TYPES, XP_PER_LEVEL } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { AchievementCard } from "@/components/gamification/AchievementCard";
import { StreakCounter } from "@/components/gamification/StreakCounter";

interface Achievement {
  type: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt: string;
}

interface Stats {
  xp: number;
  level: number;
  streak: number;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<Stats>({ xp: 0, level: 1, streak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/achievements");
        if (res.ok) {
          const data = await res.json();
          setAchievements(data.achievements);
          if (data.stats) setStats(data.stats);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  const unlockedTypes = new Set(achievements.map((a) => a.type));
  const allTypes = Object.entries(ACHIEVEMENT_TYPES) as [string, { title: string; description: string; icon: string; xp: number }][];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bg }}>
        <div className="text-lg font-semibold" style={{ color: COLORS.accent }}>Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-[900px] mx-auto px-6 py-5">
        <h2 className="text-xl font-bold mb-5" style={{ color: COLORS.text }}>🏆 Logros y progreso</h2>

        <StreakCounter streak={stats.streak} level={stats.level} xp={stats.xp} xpPerLevel={XP_PER_LEVEL} />

        <div className="mt-6 mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold" style={{ color: COLORS.text }}>Logros</h3>
          <span className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>
            {achievements.length} / {allTypes.length} desbloqueados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Unlocked first */}
          {allTypes
            .sort(([keyA], [keyB]) => {
              const aUnlocked = unlockedTypes.has(keyA);
              const bUnlocked = unlockedTypes.has(keyB);
              if (aUnlocked && !bUnlocked) return -1;
              if (!aUnlocked && bUnlocked) return 1;
              return 0;
            })
            .map(([key, def]) => {
              const unlocked = achievements.find((a) => a.type === key);
              return (
                <AchievementCard
                  key={key}
                  icon={def.icon}
                  title={def.title}
                  description={def.description}
                  xpReward={def.xp}
                  unlockedAt={unlocked?.unlockedAt}
                  locked={!unlocked}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}
