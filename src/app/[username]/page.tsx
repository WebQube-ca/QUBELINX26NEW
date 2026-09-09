import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProfile } from "@/lib/data/store";
import { PublicProfileClient } from "@/components/profile/public-profile-client";

type Props = {
  params: Promise<{ username: string }>;
};

const reserved = new Set([
  "login",
  "signup",
  "onboarding",
  "dashboard",
  "api",
  "forgot-password",
  "reset-password",
  "verify-email",
  "auth",
  "_next",
  "favicon.ico",
]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  if (reserved.has(username)) return {};
  const payload = await getPublicProfile(username);
  if (!payload) return { title: "Not found" };
  const title = `${payload.profile.display_name} | QubeLinx`;
  const description =
    payload.profile.bio ||
    `Explore ${payload.profile.display_name}'s links on QubeLinx.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: payload.profile.profile_image
        ? [{ url: payload.profile.profile_image }]
        : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  if (reserved.has(username)) notFound();
  const payload = await getPublicProfile(username);
  if (!payload) notFound();

  return (
    <PublicProfileClient
      profile={payload.profile}
      links={payload.links}
      socialLinks={payload.social_links}
    />
  );
}
