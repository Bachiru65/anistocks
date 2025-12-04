"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const defaultData = [
  { name: "T-7d", value: 35 },
  { name: "T-5d", value: 42 },
  { name: "T-3d", value: 48 },
  { name: "T-2d", value: 51 },
  { name: "Today", value: 55 },
];

export function MarketChart({ data = defaultData }: { data?: { name: string; value: number }[] }) {
  return (
    <div className="h-64 w-full rounded-2xl border border-white/10 bg-black/40 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="probGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #312e81", color: "#f8fafc" }}
            formatter={(value: number) => `${value}%`}
          />
          <Area type="monotone" dataKey="value" stroke="#a78bfa" fill="url(#probGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
