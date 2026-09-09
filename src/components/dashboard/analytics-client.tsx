"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  PerformanceChart,
  StatsGrid,
} from "@/components/dashboard/analytics-widgets";
import type {
  AnalyticsSummary,
  Profile,
  SessionUser,
} from "@/lib/types";

export function AnalyticsClient({
  user,
  profile,
  analytics: initialAnalytics,
}: {
  user: SessionUser;
  profile: Profile;
  analytics: AnalyticsSummary;
}) {
  const [range, setRange] = useState(30);
  const [analytics, setAnalytics] = useState(initialAnalytics);

  async function changeRange(next: number) {
    setRange(next);
    const res = await fetch(`/api/data?action=analytics&range=${next}`);
    if (res.ok) setAnalytics(await res.json());
  }

  return (
    <DashboardShell user={user} profile={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Privacy-friendly insights into how people discover your page.
          </p>
        </div>
        <StatsGrid analytics={analytics} />
        <PerformanceChart
          series={analytics.series}
          range={range}
          onRangeChange={changeRange}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-5">
            <h3 className="font-semibold">Top Links</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Ranked by clicks in the selected range.
            </p>
            <div className="mt-4 space-y-3">
              {analytics.top_links.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No clicks yet. Share your QubeLinx to start collecting data.
                </p>
              ) : (
                analytics.top_links.map((link, i) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0">
                      <span className="mr-2 text-muted-foreground">{i + 1}.</span>
                      <span className="font-medium">{link.title}</span>
                    </div>
                    <span className="shrink-0 text-muted-foreground">
                      {link.clicks.toLocaleString()} clicks
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/60 p-5">
            <h3 className="font-semibold">Recent Activity</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest visitor interactions.
            </p>
            <div className="mt-4 space-y-3">
              {analytics.recent_activity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="min-w-0 truncate">{item.label}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-dashed border-border px-3 py-3 text-xs text-muted-foreground">
              Coming later: geographic, device, and referrer analytics.
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
