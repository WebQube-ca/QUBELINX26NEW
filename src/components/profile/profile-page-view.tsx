"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { AppearanceSettings, LinkItem, Profile, SocialLink } from "@/lib/types";
import { getBackgroundStyle, getFontClass, getLinkStyle } from "@/lib/themes";
import { getSocialPlatform } from "@/lib/socials";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfilePageView({
  profile,
  links,
  socialLinks,
  className,
  compact = false,
  animate = true,
  showBranding = true,
  onLinkClick,
}: {
  profile: Pick<
    Profile,
    "display_name" | "bio" | "profile_image" | "appearance" | "location" | "username"
  >;
  links: LinkItem[];
  socialLinks: SocialLink[];
  className?: string;
  compact?: boolean;
  animate?: boolean;
  showBranding?: boolean;
  onLinkClick?: (link: LinkItem) => void;
}) {
  const appearance = profile.appearance;
  const activeLinks = links.filter((l) => l.is_active);

  return (
    <div
      className={cn(
        "relative min-h-full w-full overflow-hidden",
        getFontClass(appearance.font),
        className
      )}
      style={{
        ...getBackgroundStyle(appearance),
        color: appearance.text_color,
      }}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-md flex-col items-center px-5",
          compact ? "py-8" : "py-12 sm:py-16"
        )}
      >
        <motion.div
          initial={animate ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center text-center"
        >
          <div
            className={cn(
              "mb-4 flex items-center justify-center overflow-hidden rounded-full border border-white/20 shadow-lg",
              compact ? "h-20 w-20 text-xl" : "h-24 w-24 text-2xl"
            )}
            style={{
              background: appearance.accent_color,
              color: "#fff",
            }}
          >
            {profile.profile_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.profile_image}
                alt={profile.display_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-semibold">{initials(profile.display_name || "QL")}</span>
            )}
          </div>
          <h1
            className={cn(
              "font-semibold tracking-tight",
              compact ? "text-xl" : "text-2xl"
            )}
          >
            {profile.display_name || "Your Name"}
          </h1>
          {profile.bio ? (
            <p
              className={cn(
                "mt-2 max-w-sm text-balance opacity-80",
                compact ? "text-sm" : "text-base"
              )}
            >
              {profile.bio}
            </p>
          ) : null}
          {profile.location ? (
            <p className="mt-1 text-xs opacity-60">{profile.location}</p>
          ) : null}
        </motion.div>

        {socialLinks.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {socialLinks.map((social) => {
              const platform = getSocialPlatform(social.platform);
              const Icon = platform.icon;
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/10 backdrop-blur transition hover:scale-105 hover:bg-black/20"
                  style={{ color: appearance.text_color }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        ) : null}

        <div
          className="mt-7 w-full"
          style={{ display: "grid", gap: appearance.link_spacing }}
        >
          {activeLinks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 px-4 py-8 text-center text-sm opacity-70">
              No links yet
            </div>
          ) : (
            activeLinks.map((link, index) => (
              <ProfileLinkItem
                key={link.id}
                link={link}
                appearance={appearance}
                animate={animate}
                index={index}
                onLinkClick={onLinkClick}
              />
            ))
          )}
        </div>

        {showBranding ? (
          <Link
            href="/"
            className="mt-10 text-xs opacity-50 transition hover:opacity-90"
          >
            Create your own QubeLinx
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function ProfileLinkItem({
  link,
  appearance,
  animate,
  index,
  onLinkClick,
}: {
  link: LinkItem;
  appearance: AppearanceSettings;
  animate: boolean;
  index: number;
  onLinkClick?: (link: LinkItem) => void;
}) {
  if (link.type === "divider") {
    return (
      <div className="flex items-center gap-3 py-1 opacity-40">
        <div className="h-px flex-1 bg-current" />
        {link.title ? <span className="text-xs">{link.title}</span> : null}
        <div className="h-px flex-1 bg-current" />
      </div>
    );
  }

  if (link.type === "text") {
    return (
      <p className="px-1 text-center text-sm opacity-80">{link.description || link.title}</p>
    );
  }

  const style = getLinkStyle(appearance);
  const content =
    link.type === "featured" ? (
      <div className="flex gap-3 p-3 text-left">
        {link.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={link.thumbnail}
            alt=""
            className="h-16 w-16 rounded-xl object-cover"
          />
        ) : (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-xl text-lg font-semibold"
            style={{ background: appearance.accent_color, color: "#fff" }}
          >
            {link.title.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0 flex-1 self-center">
          <div className="truncate font-medium">{link.title}</div>
          {link.description ? (
            <div className="mt-0.5 line-clamp-2 text-xs opacity-70">
              {link.description}
            </div>
          ) : null}
        </div>
      </div>
    ) : (
      <div className="px-4 py-3.5 text-center font-medium">{link.title}</div>
    );

  const shared = {
    className:
      "block w-full overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    style,
  };

  const wrapped = (
    <motion.div
      initial={animate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.05 * index }}
    >
      {onLinkClick ? (
        <button
          type="button"
          {...shared}
          onClick={() => onLinkClick(link)}
          className={cn(shared.className, "w-full cursor-pointer")}
        >
          {content}
        </button>
      ) : (
        <a
          href={link.url}
          target={link.url.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          {...shared}
        >
          {content}
        </a>
      )}
    </motion.div>
  );

  return wrapped;
}
