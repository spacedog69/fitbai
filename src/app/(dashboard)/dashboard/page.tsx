"use client";

import { useState, useEffect, useCallback } from "react";
import { COLORS, DEFAULT_GOALS, DEFAULT_START } from "@/lib/constants";
import { weekLabel } from "@/lib/utils";
import { StatCard } from "@/components/ui/StatCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { Modal } from "@/components/ui/Modal";
import { EntryForm, type EntryFormData } from "@/components/forms/EntryForm";
import { WeightChart } from "@/components/charts/WeightChart";
import { MotivationalQuote } from "@/components/gamification/MotivationalQuote";
import { StreakCounter } from "@/components/gamification/StreakCounter";
import { Header } from "@/components/layout/Header";
import { XP_PER_LEVEL } from "@/lib/constants";

interface Entry {
  id: string;
  date: string;
  weight: number;
  waist: number | null;
  bodyFat: number | null;
  muscle: number | null;
  notes: string;
  files: { name: string; path: string; size: number; type: string }[];
}

interface UserProfile {
  goals: typeof DEFAULT_GOALS;
  start: typeof DEFAULT_START;
  xp: number;
  level: number;
  streak: number;
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const goals = profile?.goals || DEFAULT_GOALS;
  const start = profile?.start || DEFAULT_START;

  const fetchData = useCallback(async () => {
    try {
      const [entriesRes, profileRes] = await Promise.all([
        fetch("/api/entries"),
        fetch("/api/profile"),
      ]);
      if (entriesRes.ok) setEntries(await entriesRes.json());
      if (profileRes.ok) setProfile(await profileRes.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (data: EntryFormData) => {
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setModalOpen(false);
    fetchData();
  };

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  const prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;

  const totalLost = latest ? start.weight - latest.weight : 0;
  const waistLost = latest?.waist ? start.waist - latest.waist : 0;
  const weeksElapsed = latest ? Math.max(1, Math.ceil((new Date(latest.date).getTime() - new Date("2025-02-01").getTime()) / (7 * 86400000))) : 0;
  const avgPerWeek = weeksElapsed > 0 ? totalLost / weeksElapsed : 0;
  const remaining = latest ? latest.weight - goals.weight : start.weight - goals.weight;
  const weeksToGo = avgPerWeek > 0 ? Math.ceil(remaining / avgPerWeek) : 0;
  const eta = weeksToGo > 0 ? new Date(Date.now() + weeksToGo * 7 * 86400000).toLocaleDateString("es-ES", { month: "long", year: "numeric" }) : "—";

  const chartData = sorted.map((e) => ({ date: weekLabel(e.date), Peso: e.weight }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bg }}>
        <div className="text-lg font-semibold" style={{ color: COLORS.accent }}>Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <Header onNewEntry={() => setModalOpen(true)} />
      <div className="max-w-[900px] mx-auto px-6 py-5">
        {/* Gamification row */}
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <StreakCounter streak={profile.streak} level={profile.level} xp={profile.xp} xpPerLevel={XP_PER_LEVEL} />
            <MotivationalQuote />
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
          <StatCard label="Peso" value={latest?.weight} unit="kg" change={prev ? latest!.weight - prev.weight : null} goal={goals.weight} startValue={start.weight} icon="⚖️" color={COLORS.accent} />
          <StatCard label="Cintura" value={latest?.waist} unit="cm" change={prev?.waist && latest?.waist ? latest.waist - prev.waist : null} goal={goals.waist} startValue={start.waist} icon="📏" color={COLORS.blue} />
          <StatCard label="Grasa" value={latest?.bodyFat} unit="%" change={prev?.bodyFat && latest?.bodyFat ? latest.bodyFat - prev.bodyFat : null} goal={goals.bodyFat} startValue={start.bodyFat} icon="🔥" color={COLORS.orange} />
          <StatCard label="Músculo" value={latest?.muscle} unit="kg" change={prev?.muscle && latest?.muscle ? latest.muscle - prev.muscle : null} goal={goals.muscle} startValue={start.muscle} icon="💪" color={COLORS.purple} />
        </div>

        {/* Progress summary */}
        <div
          className="rounded-2xl border p-6 mb-5"
          style={{
            background: `linear-gradient(135deg, ${COLORS.accentDim}33 0%, ${COLORS.card} 100%)`,
            borderColor: `${COLORS.accentDim}66`,
          }}
        >
          <h3 className="text-base font-bold m-0 mb-4" style={{ color: COLORS.accent }}>
            📈 Resumen de progreso
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Peso perdido", value: `${totalLost.toFixed(1)} kg`, sub: `de ${(start.weight - goals.weight).toFixed(0)} kg` },
              { label: "Cintura perdida", value: `${waistLost.toFixed(1)} cm`, sub: `de ${start.waist - goals.waist} cm` },
              { label: "Media semanal", value: `${avgPerWeek.toFixed(2)} kg/sem`, sub: avgPerWeek >= 0.5 ? "Buen ritmo ✓" : "Ajustar" },
              { label: "ETA objetivo", value: eta, sub: weeksToGo > 0 ? `~${weeksToGo} semanas` : "Faltan datos" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-[11px] mb-1 uppercase tracking-wider" style={{ color: COLORS.textMuted }}>{item.label}</div>
                <div className="text-xl font-extrabold font-mono" style={{ color: COLORS.text }}>{item.value}</div>
                <div className="text-[11px] mt-0.5" style={{ color: COLORS.textDim }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weight chart */}
        {chartData.length > 1 && (
          <ChartCard title="Evolución del peso" subtitle="Tendencia con objetivo marcado">
            <WeightChart data={chartData} goalWeight={goals.weight} />
          </ChartCard>
        )}

        {/* Empty state */}
        {entries.length === 0 && (
          <div
            className="text-center py-16 rounded-2xl border-dashed border"
            style={{ background: COLORS.card, borderColor: COLORS.border }}
          >
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.text }}>Sin registros todavía</h3>
            <p className="text-sm max-w-xs mx-auto" style={{ color: COLORS.textMuted }}>
              Pulsa &quot;+ Registro&quot; para empezar a trackear tu progreso.
            </p>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="📊 Nuevo registro">
        <EntryForm onSave={handleSave} onClose={() => setModalOpen(false)} />
      </Modal>
    </>
  );
}
