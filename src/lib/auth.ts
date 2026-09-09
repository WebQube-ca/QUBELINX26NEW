import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getProfileByUserId, getUserBySession } from "@/lib/data/store";
import type { Profile, SessionUser } from "@/lib/types";

export const SESSION_COOKIE = "qlx_session";

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  return getUserBySession(token);
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireProfile(): Promise<{
  user: SessionUser;
  profile: Profile;
}> {
  const user = await requireUser();
  const profile = await getProfileByUserId(user.id);
  if (!profile || !profile.onboarding_completed) {
    redirect("/onboarding");
  }
  return { user, profile };
}

export async function getOptionalProfile() {
  const user = await getSessionUser();
  if (!user) return { user: null, profile: null };
  const profile = await getProfileByUserId(user.id);
  return { user, profile };
}
