"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { THEME_PRESETS, FONT_OPTIONS } from "@/lib/themes";
import { SOCIAL_PLATFORMS } from "@/lib/socials";
import type {
  AppearanceSettings,
  LinkStyle,
  Profile,
  SocialLink,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export function AppearanceEditor({
  initialProfile,
  initialSocial,
  onProfileChange,
  onSocialChange,
}: {
  initialProfile: Profile;
  initialSocial: SocialLink[];
  onProfileChange?: (profile: Profile) => void;
  onSocialChange?: (social: SocialLink[]) => void;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [social, setSocial] = useState(initialSocial);
  const [saving, setSaving] = useState(false);

  function updateAppearance(partial: Partial<AppearanceSettings>) {
    const next = {
      ...profile,
      appearance: { ...profile.appearance, ...partial },
    };
    setProfile(next);
    onProfileChange?.(next);
  }

  async function persistProfile(next = profile) {
    setSaving(true);
    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_appearance",
          appearance: next.appearance,
          display_name: next.display_name,
          bio: next.bio,
          profile_image: next.profile_image,
          location: next.location,
          website: next.website,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setProfile(data.profile);
      onProfileChange?.(data.profile);
      toast.success("Appearance saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveSocial(platform: SocialLink["platform"], url: string) {
    if (!url) {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove_social", platform }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed");
        return;
      }
      setSocial(data.social_links);
      onSocialChange?.(data.social_links);
      return;
    }
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upsert_social", platform, url }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed");
      return;
    }
    setSocial(data.social_links);
    onSocialChange?.(data.social_links);
    toast.success("Social link updated");
  }

  const linkStyles: LinkStyle[] = [
    "rounded",
    "pill",
    "soft-square",
    "minimal",
    "glass",
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Appearance</h1>
          <p className="text-sm text-muted-foreground">
            Shape the look of your public QubeLinx. Preview updates live.
          </p>
        </div>
        <Button
          className="rounded-xl bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950"
          onClick={() => persistProfile()}
          disabled={saving}
        >
          Save changes
        </Button>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Profile
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Display name</Label>
            <Input
              className="rounded-xl"
              value={profile.display_name}
              onChange={(e) => {
                const next = { ...profile, display_name: e.target.value };
                setProfile(next);
                onProfileChange?.(next);
              }}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Bio</Label>
            <Textarea
              value={profile.bio}
              onChange={(e) => {
                const next = { ...profile, bio: e.target.value };
                setProfile(next);
                onProfileChange?.(next);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              className="rounded-xl"
              value={profile.location || ""}
              onChange={(e) => {
                const next = { ...profile, location: e.target.value };
                setProfile(next);
                onProfileChange?.(next);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Profile image URL</Label>
            <Input
              className="rounded-xl"
              value={profile.profile_image || ""}
              onChange={(e) => {
                const next = { ...profile, profile_image: e.target.value || null };
                setProfile(next);
                onProfileChange?.(next);
              }}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Themes
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Object.entries(THEME_PRESETS).map(([id, preset]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                const appearance = {
                  ...profile.appearance,
                  ...preset.appearance,
                } as AppearanceSettings;
                const next = { ...profile, appearance };
                setProfile(next);
                onProfileChange?.(next);
              }}
              className={cn(
                "overflow-hidden rounded-2xl border text-left transition",
                profile.appearance.theme === id
                  ? "border-teal-600 ring-2 ring-teal-600/25"
                  : "border-border hover:border-foreground/20"
              )}
            >
              <div className="h-14" style={{ background: preset.preview.bg }} />
              <div className="p-3">
                <div className="font-medium">{preset.name}</div>
                <div className="text-xs text-muted-foreground">
                  {preset.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Background & colors
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["background_color", "Background"],
              ["text_color", "Text"],
              ["link_background", "Link background"],
              ["link_text", "Link text"],
              ["accent_color", "Accent"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label>{label}</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  className="h-11 w-14 rounded-xl p-1"
                  value={
                    profile.appearance[key].startsWith("#")
                      ? profile.appearance[key]
                      : "#0d9488"
                  }
                  onChange={(e) => updateAppearance({ [key]: e.target.value })}
                />
                <Input
                  className="rounded-xl"
                  value={profile.appearance[key]}
                  onChange={(e) => updateAppearance({ [key]: e.target.value })}
                />
              </div>
            </div>
          ))}
          <div className="space-y-2 sm:col-span-2">
            <Label>Gradient CSS (when gradient background)</Label>
            <Input
              className="rounded-xl"
              value={profile.appearance.background_gradient}
              onChange={(e) =>
                updateAppearance({ background_gradient: e.target.value })
              }
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            {(["solid", "gradient", "texture", "image"] as const).map((type) => (
              <Button
                key={type}
                type="button"
                variant={
                  profile.appearance.background_type === type
                    ? "default"
                    : "outline"
                }
                className="rounded-xl capitalize"
                onClick={() => updateAppearance({ background_type: type })}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Link style
        </h2>
        <div className="flex flex-wrap gap-2">
          {linkStyles.map((style) => (
            <Button
              key={style}
              type="button"
              variant={
                profile.appearance.link_style === style ? "default" : "outline"
              }
              className="rounded-xl capitalize"
              onClick={() => updateAppearance({ link_style: style })}
            >
              {style}
            </Button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Border radius ({profile.appearance.border_radius})</Label>
            <input
              type="range"
              min={0}
              max={32}
              value={profile.appearance.border_radius}
              onChange={(e) =>
                updateAppearance({ border_radius: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Transparency ({profile.appearance.transparency}%)</Label>
            <input
              type="range"
              min={40}
              max={100}
              value={profile.appearance.transparency}
              onChange={(e) =>
                updateAppearance({ transparency: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Spacing ({profile.appearance.link_spacing}px)</Label>
            <input
              type="range"
              min={4}
              max={24}
              value={profile.appearance.link_spacing}
              onChange={(e) =>
                updateAppearance({ link_spacing: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={profile.appearance.shadow}
            onChange={(e) => updateAppearance({ shadow: e.target.checked })}
          />
          Soft shadow
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Typography
        </h2>
        <div className="flex flex-wrap gap-2">
          {FONT_OPTIONS.map((font) => (
            <Button
              key={font.id}
              type="button"
              variant={
                profile.appearance.font === font.id ? "default" : "outline"
              }
              className={cn("rounded-xl", font.className)}
              onClick={() =>
                updateAppearance({ font: font.id as AppearanceSettings["font"] })
              }
            >
              {font.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Social icons
        </h2>
        <div className="grid gap-3">
          {SOCIAL_PLATFORMS.map((platform) => {
            const existing = social.find((s) => s.platform === platform.id);
            return (
              <div
                key={platform.id}
                className="grid gap-2 rounded-2xl border border-border/70 p-3 sm:grid-cols-[140px_1fr_auto]"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <platform.icon className="h-4 w-4" />
                  {platform.label}
                </div>
                <Input
                  className="rounded-xl"
                  placeholder={platform.placeholder}
                  defaultValue={existing?.url || ""}
                  id={`social-${platform.id}`}
                />
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    const el = document.getElementById(
                      `social-${platform.id}`
                    ) as HTMLInputElement | null;
                    saveSocial(platform.id, el?.value.trim() || "");
                  }}
                >
                  Save
                </Button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
