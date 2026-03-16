"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { COLORS } from "@/lib/constants";
import { CustomTooltip } from "@/components/ui/CustomTooltip";

interface ChartDataPoint {
  date: string;
  Peso: number;
}

interface WeightChartProps {
  data: ChartDataPoint[];
  goalWeight: number;
  height?: number;
}

export function WeightChart({ data, goalWeight, height = 220 }: WeightChartProps) {
  if (data.length < 2) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.3} />
            <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
        <XAxis dataKey="date" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
        <YAxis domain={["dataMin - 2", "dataMax + 1"]} tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={goalWeight} stroke={COLORS.accent} strokeDasharray="5 5" />
        <Area
          type="monotone"
          dataKey="Peso"
          stroke={COLORS.accent}
          fill="url(#weightGradient)"
          strokeWidth={2.5}
          dot={{ fill: COLORS.accent, r: 4, strokeWidth: 2, stroke: COLORS.bg }}
          name="Peso"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
