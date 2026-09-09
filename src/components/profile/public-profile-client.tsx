"use client";

import { useEffect } from "react";
import { ProfilePageView } from "@/components/profile/profile-page-view";
import type { LinkItem, Profile, SocialLink } from "@/lib/types";

export function PublicProfileClient({
  profile,
  links,
  socialLinks,
}: {
  profile: Profile;
  links: LinkItem[];
  socialLinks: SocialLink[];
}) {
  useEffect(() => {
    fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "track",
        profile_id: profile.id,
        event_type: "page_view",
      }),
    }).catch(() => undefined);
  }, [profile.id]);

  async function onLinkClick(link: LinkItem) {
    fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "track",
        profile_id: profile.id,
        link_id: link.id,
        event_type: "link_click",
      }),
    }).catch(() => undefined);

    if (link.url.startsWith("mailto:")) {
      window.location.href = link.url;
    } else if (link.url && link.url !== "#") {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <ProfilePageView
      profile={profile}
      links={links}
      socialLinks={socialLinks}
      className="min-h-screen"
      onLinkClick={onLinkClick}
      showBranding
    />
  );
}
