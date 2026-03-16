"use client";

import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { COLORS } from "@/lib/constants";
import { CustomTooltip } from "@/components/ui/CustomTooltip";

interface ChartDataPoint {
  date: string;
  Peso: number;
  Cintura: number | null;
}

interface Props {
  data: ChartDataPoint[];
  goalWeight: number;
  goalWaist: number;
}

export function WeightVsWaistChart({ data, goalWeight, goalWaist }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
        <XAxis dataKey="date" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
        <YAxis yAxisId="left" domain={["dataMin - 2", "dataMax + 1"]} tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
        <YAxis yAxisId="right" orientation="right" domain={["dataMin - 2", "dataMax + 2"]} tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine yAxisId="left" y={goalWeight} stroke={COLORS.accent} strokeDasharray="5 5" />
        <ReferenceLine yAxisId="right" y={goalWaist} stroke={COLORS.blue} strokeDasharray="5 5" />
        <Line yAxisId="left" type="monotone" dataKey="Peso" stroke={COLORS.accent} strokeWidth={2.5} dot={{ fill: COLORS.accent, r: 4, stroke: COLORS.bg, strokeWidth: 2 }} name="Peso" />
        <Line yAxisId="right" type="monotone" dataKey="Cintura" stroke={COLORS.blue} strokeWidth={2.5} dot={{ fill: COLORS.blue, r: 4, stroke: COLORS.bg, strokeWidth: 2 }} name="Cintura" connectNulls />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
