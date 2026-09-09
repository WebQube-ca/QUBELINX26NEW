"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Eye, Link2, MousePointerClick, Percent } from "lucide-react";
import type { AnalyticsSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatsGrid({ analytics }: { analytics: AnalyticsSummary }) {
  const stats = [
    {
      label: "Total Views",
      value: analytics.total_views.toLocaleString(),
      icon: Eye,
    },
    {
      label: "Total Link Clicks",
      value: analytics.total_clicks.toLocaleString(),
      icon: MousePointerClick,
    },
    {
      label: "Click Through Rate",
      value: `${analytics.click_through_rate}%`,
      icon: Percent,
    },
    {
      label: "Active Links",
      value: analytics.active_links.toLocaleString(),
      icon: Link2,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-border/70 bg-card/60 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <stat.icon className="h-4 w-4 text-teal-700 dark:text-teal-300" />
          </div>
          <div className="mt-3 text-2xl font-semibold tracking-tight">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PerformanceChart({
  series,
  range,
  onRangeChange,
}: {
  series: AnalyticsSummary["series"];
  range: number;
  onRangeChange?: (range: number) => void;
}) {
  const ranges = [
    { label: "Today", value: 1 },
    { label: "7 Days", value: 7 },
    { label: "30 Days", value: 30 },
    { label: "90 Days", value: 90 },
  ];

  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold tracking-tight">Performance</h3>
          <p className="text-sm text-muted-foreground">
            Page views and link clicks over time
          </p>
        </div>
        {onRangeChange ? (
          <div className="flex rounded-xl bg-muted p-1 text-xs">
            {ranges.map((r) => (
              <button
                key={r.value}
                onClick={() => onRangeChange(r.value)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 transition",
                  range === r.value
                    ? "bg-background font-medium shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series}>
            <defs>
              <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="clicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => String(v).slice(5)}
              tickLine={false}
              axisLine={false}
              fontSize={11}
            />
            <YAxis tickLine={false} axisLine={false} fontSize={11} width={32} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
              }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#0d9488"
              fill="url(#views)"
              strokeWidth={2}
              name="Page views"
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#6366f1"
              fill="url(#clicks)"
              strokeWidth={2}
              name="Link clicks"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
