"use client";

import { useState, useEffect } from "react";
import { COLORS, DEFAULT_GOALS } from "@/lib/constants";
import { weekLabel } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { ChartCard } from "@/components/ui/ChartCard";
import { WeightVsWaistChart } from "@/components/charts/WeightVsWaistChart";
import { CompositionChart } from "@/components/charts/CompositionChart";
import { DeltaBarChart } from "@/components/charts/DeltaBarChart";

interface Entry {
  date: string;
  weight: number;
  waist: number | null;
  bodyFat: number | null;
  muscle: number | null;
}

export default function ChartsPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [er, pr] = await Promise.all([fetch("/api/entries"), fetch("/api/profile")]);
        if (er.ok) setEntries(await er.json());
        if (pr.ok) {
          const p = await pr.json();
          setGoals(p.goals || DEFAULT_GOALS);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const chartData = sorted.map((e) => ({
    date: weekLabel(e.date),
    Peso: e.weight,
    Cintura: e.waist,
    Grasa: e.bodyFat,
    Musculo: e.muscle,
  }));

  const deltaData = sorted.slice(1).map((e, i) => ({
    date: weekLabel(e.date),
    cambio: parseFloat((e.weight - sorted[i].weight).toFixed(2)),
  }));

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
        <h2 className="text-xl font-bold mb-5" style={{ color: COLORS.text }}>📈 Gráficas detalladas</h2>

        {chartData.length < 2 ? (
          <div className="text-center py-10" style={{ color: COLORS.textMuted }}>
            Necesitas al menos 2 registros para ver las gráficas.
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <ChartCard title="Peso vs Cintura" subtitle="Las dos métricas más fiables">
              <WeightVsWaistChart data={chartData} goalWeight={goals.weight} goalWaist={goals.waist} />
            </ChartCard>

            <ChartCard title="Composición corporal" subtitle="Grasa (%) y músculo esquelético (kg)">
              <CompositionChart data={chartData} goalBodyFat={goals.bodyFat} goalMuscle={goals.muscle} />
            </ChartCard>

            {deltaData.length > 0 && (
              <ChartCard title="Cambio entre registros" subtitle="Verde = bajada | Rojo = subida">
                <DeltaBarChart data={deltaData} />
              </ChartCard>
            )}
          </div>
        )}
      </div>
    </>
  );
}
