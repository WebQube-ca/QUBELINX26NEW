import { requireProfile } from "@/lib/auth";
import { getLinks, getSocialLinks } from "@/lib/data/store";
import { AppearanceClient } from "@/components/dashboard/appearance-client";

export default async function AppearancePage() {
  const { user, profile } = await requireProfile();
  const [links, socialLinks] = await Promise.all([
    getLinks(profile.id),
    getSocialLinks(profile.id),
  ]);

  return (
    <AppearanceClient
      user={user}
      profile={profile}
      links={links}
      socialLinks={socialLinks}
    />
  );
}
