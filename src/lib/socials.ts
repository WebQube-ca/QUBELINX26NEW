import type { SocialPlatform } from "@/lib/types";
import {
  AtSign,
  Camera,
  CirclePlay,
  Disc3,
  Globe,
  Mail,
  MessageCircle,
  Music2,
  Pin,
  Radio,
  Share2,
  Users,
  type LucideIcon,
} from "lucide-react";

export const SOCIAL_PLATFORMS: {
  id: SocialPlatform;
  label: string;
  placeholder: string;
  icon: LucideIcon;
}[] = [
  {
    id: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/username",
    icon: Camera,
  },
  {
    id: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@username",
    icon: Music2,
  },
  {
    id: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@username",
    icon: CirclePlay,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/username",
    icon: Users,
  },
  {
    id: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/username",
    icon: Globe,
  },
  {
    id: "x",
    label: "X",
    placeholder: "https://x.com/username",
    icon: AtSign,
  },
  {
    id: "snapchat",
    label: "Snapchat",
    placeholder: "https://snapchat.com/add/username",
    icon: MessageCircle,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    placeholder: "https://wa.me/1234567890",
    icon: MessageCircle,
  },
  {
    id: "discord",
    label: "Discord",
    placeholder: "https://discord.gg/invite",
    icon: Disc3,
  },
  {
    id: "spotify",
    label: "Spotify",
    placeholder: "https://open.spotify.com/user/username",
    icon: Music2,
  },
  {
    id: "twitch",
    label: "Twitch",
    placeholder: "https://twitch.tv/username",
    icon: Radio,
  },
  {
    id: "pinterest",
    label: "Pinterest",
    placeholder: "https://pinterest.com/username",
    icon: Pin,
  },
  {
    id: "threads",
    label: "Threads",
    placeholder: "https://threads.net/@username",
    icon: Share2,
  },
  {
    id: "email",
    label: "Email",
    placeholder: "mailto:hello@example.com",
    icon: Mail,
  },
];

export function getSocialPlatform(id: SocialPlatform) {
  return SOCIAL_PLATFORMS.find((p) => p.id === id)!;
}
