import { requireProfile } from "@/lib/auth";
import { getLinks, getSocialLinks } from "@/lib/data/store";
import { LinksClient } from "@/components/dashboard/links-client";

export default async function LinksPage() {
  const { user, profile } = await requireProfile();
  const [links, socialLinks] = await Promise.all([
    getLinks(profile.id),
    getSocialLinks(profile.id),
  ]);

  return (
    <LinksClient
      user={user}
      profile={profile}
      links={links}
      socialLinks={socialLinks}
    />
  );
}
