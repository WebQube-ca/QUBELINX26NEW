"use client";

import type { LinkItem, Profile, SocialLink } from "@/lib/types";
import { ProfilePageView } from "@/components/profile/profile-page-view";
import { cn } from "@/lib/utils";

export function PhonePreview({
  profile,
  links,
  socialLinks,
  className,
  scale = 1,
}: {
  profile: Profile;
  links: LinkItem[];
  socialLinks: SocialLink[];
  className?: string;
  scale?: number;
}) {
  return (
    <div
      className={cn("mx-auto w-[300px]", className)}
      style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
    >
      <div className="relative rounded-[2.4rem] border border-zinc-300/80 bg-zinc-900 p-2.5 shadow-2xl shadow-black/20 dark:border-zinc-700">
        <div className="absolute top-3 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-zinc-950" />
        <div className="h-[580px] overflow-hidden rounded-[2rem] bg-black">
          <div className="h-full overflow-y-auto overscroll-contain scrollbar-thin">
            <ProfilePageView
              profile={profile}
              links={links}
              socialLinks={socialLinks}
              compact
              showBranding={false}
              animate={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
