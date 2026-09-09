"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LinksManager } from "@/components/dashboard/links-manager";
import { PhonePreview } from "@/components/profile/phone-preview";
import type { LinkItem, Profile, SessionUser, SocialLink } from "@/lib/types";

export function LinksClient({
  user,
  profile,
  links: initialLinks,
  socialLinks,
}: {
  user: SessionUser;
  profile: Profile;
  links: LinkItem[];
  socialLinks: SocialLink[];
}) {
  const [links, setLinks] = useState(initialLinks);

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
      <LinksManager initialLinks={initialLinks} onChange={setLinks} />
    </DashboardShell>
  );
}
