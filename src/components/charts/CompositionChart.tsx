"use client";

import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { COLORS } from "@/lib/constants";
import { CustomTooltip } from "@/components/ui/CustomTooltip";

interface ChartDataPoint {
  date: string;
  Grasa: number | null;
  Musculo: number | null;
}

interface Props {
  data: ChartDataPoint[];
  goalBodyFat: number;
  goalMuscle: number;
}

export function CompositionChart({ data, goalBodyFat, goalMuscle }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
        <XAxis dataKey="date" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
        <YAxis yAxisId="left" domain={["dataMin - 2", "dataMax + 2"]} tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
        <YAxis yAxisId="right" orientation="right" domain={["dataMin - 2", "dataMax + 2"]} tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine yAxisId="left" y={goalBodyFat} stroke={COLORS.orange} strokeDasharray="5 5" />
        <ReferenceLine yAxisId="right" y={goalMuscle} stroke={COLORS.purple} strokeDasharray="5 5" />
        <Area yAxisId="left" type="monotone" dataKey="Grasa" stroke={COLORS.orange} fill={`${COLORS.orange}22`} strokeWidth={2.5} dot={{ fill: COLORS.orange, r: 4, stroke: COLORS.bg, strokeWidth: 2 }} name="Grasa" connectNulls />
        <Line yAxisId="right" type="monotone" dataKey="Musculo" stroke={COLORS.purple} strokeWidth={2.5} dot={{ fill: COLORS.purple, r: 4, stroke: COLORS.bg, strokeWidth: 2 }} name="Músculo" connectNulls />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
