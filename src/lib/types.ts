export type LinkType = "standard" | "social" | "featured" | "divider" | "text";

export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "facebook"
  | "x"
  | "snapchat"
  | "whatsapp"
  | "discord"
  | "spotify"
  | "twitch"
  | "pinterest"
  | "threads"
  | "email";

export type ThemePreset =
  | "minimal"
  | "midnight"
  | "glass"
  | "aurora"
  | "creator"
  | "professional";

export type BackgroundType = "solid" | "gradient" | "image" | "texture";

export type LinkStyle = "rounded" | "pill" | "soft-square" | "minimal" | "glass";

export type FontOption =
  | "sora"
  | "manrope"
  | "space-grotesk"
  | "dm-sans"
  | "outfit"
  | "syne";

export type PlanTier = "free" | "pro" | "business";

export type AnalyticsEventType = "page_view" | "link_click";

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  auth_provider: "email" | "google" | "apple";
  email_verified: boolean;
  plan: PlanTier;
  created_at: string;
}

export interface AppearanceSettings {
  theme: ThemePreset;
  background_type: BackgroundType;
  background_color: string;
  background_gradient: string;
  background_image: string | null;
  text_color: string;
  link_background: string;
  link_text: string;
  accent_color: string;
  link_style: LinkStyle;
  border_radius: number;
  transparency: number;
  shadow: boolean;
  link_spacing: number;
  font: FontOption;
}

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio: string;
  profile_image: string | null;
  location: string | null;
  website: string | null;
  appearance: AppearanceSettings;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface LinkItem {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  type: LinkType;
  description: string | null;
  thumbnail: string | null;
  icon: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  profile_id: string;
  platform: SocialPlatform;
  url: string;
  position: number;
}

export interface AnalyticsEvent {
  id: string;
  profile_id: string;
  link_id: string | null;
  event_type: AnalyticsEventType;
  created_at: string;
  meta?: {
    referrer?: string;
    user_agent?: string;
    country?: string;
    device?: string;
  };
}

export interface PublicProfilePayload {
  profile: Profile;
  links: LinkItem[];
  social_links: SocialLink[];
}

export interface AnalyticsSummary {
  total_views: number;
  unique_visitors: number;
  total_clicks: number;
  click_through_rate: number;
  active_links: number;
  series: { date: string; views: number; clicks: number }[];
  top_links: { id: string; title: string; clicks: number }[];
  recent_activity: {
    id: string;
    type: AnalyticsEventType;
    label: string;
    created_at: string;
  }[];
}

export interface SessionUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
}

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: "minimal",
  background_type: "solid",
  background_color: "#FAFAF9",
  background_gradient: "linear-gradient(160deg, #0f172a 0%, #134e4a 100%)",
  background_image: null,
  text_color: "#18181B",
  link_background: "#FFFFFF",
  link_text: "#18181B",
  accent_color: "#0D9488",
  link_style: "rounded",
  border_radius: 16,
  transparency: 100,
  shadow: true,
  link_spacing: 12,
  font: "sora",
};
