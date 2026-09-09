import { requireProfile } from "@/lib/auth";
import {
  getAnalytics,
  getLinks,
  getSocialLinks,
} from "@/lib/data/store";
import { OverviewClient } from "@/components/dashboard/overview-client";

export default async function DashboardPage() {
  const { user, profile } = await requireProfile();
  const [links, socialLinks, analytics] = await Promise.all([
    getLinks(profile.id),
    getSocialLinks(profile.id),
    getAnalytics(profile.id, 30),
  ]);

  return (
    <OverviewClient
      user={user}
      profile={profile}
      links={links}
      socialLinks={socialLinks}
      analytics={analytics}
    />
  );
}
