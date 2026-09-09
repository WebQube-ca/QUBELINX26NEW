import { requireProfile } from "@/lib/auth";
import { getAnalytics } from "@/lib/data/store";
import { AnalyticsClient } from "@/components/dashboard/analytics-client";

export default async function AnalyticsPage() {
  const { user, profile } = await requireProfile();
  const analytics = await getAnalytics(profile.id, 30);

  return (
    <AnalyticsClient user={user} profile={profile} analytics={analytics} />
  );
}
