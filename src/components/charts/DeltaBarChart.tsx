"use client";

import {
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { COLORS } from "@/lib/constants";

interface DeltaPoint {
  date: string;
  cambio: number;
}

interface Props {
  data: DeltaPoint[];
}

export function DeltaBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
        <XAxis dataKey="date" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
        <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
        <Tooltip
          formatter={(v: number) => [`${v > 0 ? "+" : ""}${v.toFixed(2)} kg`, "Cambio"]}
          contentStyle={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10 }}
          labelStyle={{ color: COLORS.textDim }}
          itemStyle={{ color: COLORS.text }}
        />
        <ReferenceLine y={0} stroke={COLORS.textMuted} />
        <Bar
          dataKey="cambio"
          radius={[4, 4, 0, 0]}
          shape={(props: unknown) => {
            const { x, y, width, height, value } = props as { x: number; y: number; width: number; height: number; value: number };
            return (
              <rect
                x={x}
                y={value <= 0 ? y : y - Math.abs(height)}
                width={width}
                height={Math.abs(height)}
                fill={value <= 0 ? COLORS.accent : COLORS.danger}
                rx={4}
              />
            );
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
