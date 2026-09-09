"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  PerformanceChart,
  StatsGrid,
} from "@/components/dashboard/analytics-widgets";
import { PhonePreview } from "@/components/profile/phone-preview";
import { greetingForNow } from "@/lib/urls";
import type {
  AnalyticsSummary,
  LinkItem,
  Profile,
  SessionUser,
  SocialLink,
} from "@/lib/types";

export function OverviewClient({
  user,
  profile,
  links,
  socialLinks,
  analytics: initialAnalytics,
}: {
  user: SessionUser;
  profile: Profile;
  links: LinkItem[];
  socialLinks: SocialLink[];
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
    <DashboardShell
      user={user}
      profile={profile}
      preview={
        <PhonePreview
          profile={profile}
          links={links}
          socialLinks={socialLinks}
        />
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {greetingForNow()}, {profile.display_name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s how your QubeLinx is performing.
          </p>
        </div>
        <StatsGrid analytics={analytics} />
        <PerformanceChart
          series={analytics.series}
          range={range}
          onRangeChange={changeRange}
        />
      </div>
    </DashboardShell>
  );
}
