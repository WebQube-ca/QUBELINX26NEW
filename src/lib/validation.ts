import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be 30 characters or fewer")
  .regex(
    /^[a-z0-9-]+$/,
    "Only lowercase letters, numbers, and hyphens are allowed"
  )
  .refine((v) => !v.startsWith("-") && !v.endsWith("-"), {
    message: "Username cannot start or end with a hyphen",
  })
  .refine((v) => !v.includes("--"), {
    message: "Username cannot contain consecutive hyphens",
  });

export const urlSchema = z
  .string()
  .url("Enter a valid URL")
  .refine(
    (v) => {
      try {
        const u = new URL(v);
        return ["http:", "https:", "mailto:"].includes(u.protocol);
      } catch {
        return false;
      }
    },
    { message: "URL must use http, https, or mailto" }
  );

export const emailSchema = z.string().email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must include a letter")
  .regex(/[0-9]/, "Password must include a number");

export const linkSchema = z.object({
  title: z.string().min(1, "Title is required").max(80),
  url: urlSchema,
  type: z.enum(["standard", "social", "featured", "divider", "text"]),
  description: z.string().max(240).optional().nullable(),
  thumbnail: z.string().url().optional().nullable().or(z.literal("")),
  icon: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export const profileSchema = z.object({
  display_name: z.string().min(1).max(60),
  bio: z.string().max(160).optional().default(""),
  location: z.string().max(80).optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal("")),
});

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function isSafeUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.startsWith("127.") ||
      host.startsWith("0.") ||
      host.endsWith(".local")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
