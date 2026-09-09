import type { CSSProperties } from "react";
import type { AppearanceSettings, ThemePreset } from "@/lib/types";

export const THEME_PRESETS: Record<
  ThemePreset,
  {
    name: string;
    description: string;
    appearance: Partial<AppearanceSettings>;
    preview: { bg: string; link: string; text: string };
  }
> = {
  minimal: {
    name: "Minimal",
    description: "Clean white canvas with soft contrast",
    appearance: {
      theme: "minimal",
      background_type: "solid",
      background_color: "#FAFAF9",
      text_color: "#18181B",
      link_background: "#FFFFFF",
      link_text: "#18181B",
      accent_color: "#0D9488",
      link_style: "rounded",
      shadow: true,
      font: "sora",
    },
    preview: { bg: "#FAFAF9", link: "#FFFFFF", text: "#18181B" },
  },
  midnight: {
    name: "Midnight",
    description: "Deep charcoal with luminous accents",
    appearance: {
      theme: "midnight",
      background_type: "solid",
      background_color: "#09090B",
      text_color: "#FAFAFA",
      link_background: "#18181B",
      link_text: "#FAFAFA",
      accent_color: "#2DD4BF",
      link_style: "rounded",
      shadow: false,
      font: "space-grotesk",
    },
    preview: { bg: "#09090B", link: "#18181B", text: "#FAFAFA" },
  },
  glass: {
    name: "Glass",
    description: "Frosted panels over a soft gradient",
    appearance: {
      theme: "glass",
      background_type: "gradient",
      background_gradient:
        "linear-gradient(145deg, #0B1220 0%, #134E4A 55%, #0F172A 100%)",
      background_color: "#0B1220",
      text_color: "#F8FAFC",
      link_background: "rgba(255,255,255,0.12)",
      link_text: "#F8FAFC",
      accent_color: "#5EEAD4",
      link_style: "glass",
      transparency: 70,
      shadow: true,
      font: "manrope",
    },
    preview: { bg: "#0F172A", link: "rgba(255,255,255,0.15)", text: "#F8FAFC" },
  },
  aurora: {
    name: "Aurora",
    description: "Vibrant teal-to-indigo atmosphere",
    appearance: {
      theme: "aurora",
      background_type: "gradient",
      background_gradient:
        "linear-gradient(160deg, #042F2E 0%, #0F766E 40%, #312E81 100%)",
      background_color: "#042F2E",
      text_color: "#ECFDF5",
      link_background: "rgba(15,23,42,0.45)",
      link_text: "#ECFDF5",
      accent_color: "#A7F3D0",
      link_style: "pill",
      shadow: true,
      font: "outfit",
    },
    preview: { bg: "#0F766E", link: "rgba(15,23,42,0.45)", text: "#ECFDF5" },
  },
  creator: {
    name: "Creator",
    description: "Bold contrast for modern creators",
    appearance: {
      theme: "creator",
      background_type: "solid",
      background_color: "#111827",
      text_color: "#F9FAFB",
      link_background: "#14B8A6",
      link_text: "#042F2E",
      accent_color: "#F97316",
      link_style: "soft-square",
      shadow: true,
      font: "syne",
    },
    preview: { bg: "#111827", link: "#14B8A6", text: "#F9FAFB" },
  },
  professional: {
    name: "Professional",
    description: "Refined neutrals for brands & founders",
    appearance: {
      theme: "professional",
      background_type: "texture",
      background_color: "#F4F4F5",
      text_color: "#18181B",
      link_background: "#18181B",
      link_text: "#FAFAFA",
      accent_color: "#0F766E",
      link_style: "minimal",
      shadow: false,
      font: "dm-sans",
    },
    preview: { bg: "#F4F4F5", link: "#18181B", text: "#18181B" },
  },
};

export const FONT_OPTIONS = [
  { id: "sora", label: "Sora", className: "font-[family-name:var(--font-sora)]" },
  {
    id: "manrope",
    label: "Manrope",
    className: "font-[family-name:var(--font-manrope)]",
  },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    className: "font-[family-name:var(--font-space-grotesk)]",
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    className: "font-[family-name:var(--font-dm-sans)]",
  },
  {
    id: "outfit",
    label: "Outfit",
    className: "font-[family-name:var(--font-outfit)]",
  },
  { id: "syne", label: "Syne", className: "font-[family-name:var(--font-syne)]" },
] as const;

export function getFontClass(font: string) {
  return FONT_OPTIONS.find((f) => f.id === font)?.className ?? FONT_OPTIONS[0].className;
}

export function getBackgroundStyle(appearance: AppearanceSettings): CSSProperties {
  if (appearance.background_type === "gradient") {
    return { backgroundImage: appearance.background_gradient };
  }
  if (appearance.background_type === "image" && appearance.background_image) {
    return {
      backgroundImage: `url(${appearance.background_image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  if (appearance.background_type === "texture") {
    return {
      backgroundColor: appearance.background_color,
      backgroundImage:
        "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)",
      backgroundSize: "18px 18px",
    };
  }
  return { backgroundColor: appearance.background_color };
}

export function getLinkStyle(
  appearance: AppearanceSettings
): CSSProperties {
  const radiusMap = {
    rounded: appearance.border_radius,
    pill: 999,
    "soft-square": Math.max(8, appearance.border_radius * 0.5),
    minimal: 6,
    glass: appearance.border_radius,
  };

  const opacity = Math.max(0.4, appearance.transparency / 100);

  return {
    backgroundColor: appearance.link_background.includes("rgba")
      ? appearance.link_background
      : appearance.link_background,
    color: appearance.link_text,
    borderRadius: radiusMap[appearance.link_style],
    boxShadow: appearance.shadow
      ? "0 10px 30px -12px rgba(0,0,0,0.28)"
      : "none",
    border:
      appearance.link_style === "glass" || appearance.link_style === "minimal"
        ? "1px solid rgba(255,255,255,0.18)"
        : "1px solid transparent",
    backdropFilter:
      appearance.link_style === "glass" ? "blur(12px)" : undefined,
    opacity: appearance.link_background.includes("rgba") ? 1 : opacity,
  };
}
