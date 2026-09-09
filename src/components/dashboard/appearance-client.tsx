"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AppearanceEditor } from "@/components/dashboard/appearance-editor";
import { PhonePreview } from "@/components/profile/phone-preview";
import type { LinkItem, Profile, SessionUser, SocialLink } from "@/lib/types";

export function AppearanceClient({
  user,
  profile: initialProfile,
  links,
  socialLinks: initialSocial,
}: {
  user: SessionUser;
  profile: Profile;
  links: LinkItem[];
  socialLinks: SocialLink[];
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [socialLinks, setSocialLinks] = useState(initialSocial);

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
      <AppearanceEditor
        initialProfile={initialProfile}
        initialSocial={initialSocial}
        onProfileChange={setProfile}
        onSocialChange={setSocialLinks}
      />
    </DashboardShell>
  );
}
