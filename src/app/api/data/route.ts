import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";
import {
  createLink,
  createProfile,
  deleteLink,
  duplicateLink,
  getAnalytics,
  getLinks,
  getProfileByUserId,
  getSocialLinks,
  getUserBySession,
  isUsernameAvailable,
  removeSocialLink,
  reorderLinks,
  trackEvent,
  updateLink,
  updateProfile,
  updateUser,
  changePassword,
  deleteAccount,
  upsertSocialLink,
  getPublicProfile,
} from "@/lib/data/store";
import {
  isSafeUrl,
  normalizeUsername,
  usernameSchema,
} from "@/lib/validation";
import { DEFAULT_APPEARANCE, type AppearanceSettings } from "@/lib/types";
import { THEME_PRESETS } from "@/lib/themes";

async function requireAuthed() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const user = await getUserBySession(token);
  if (!user) return null;
  return user;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    if (action === "username") {
      const username = normalizeUsername(searchParams.get("username") || "");
      const parsed = usernameSchema.safeParse(username);
      if (!parsed.success) {
        return NextResponse.json({
          available: false,
          error: parsed.error.issues[0]?.message,
        });
      }
      const user = await requireAuthed();
      const available = await isUsernameAvailable(username, user?.id);
      return NextResponse.json({ available, username });
    }

    if (action === "public") {
      const username = searchParams.get("username") || "";
      const payload = await getPublicProfile(username);
      if (!payload) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(payload);
    }

    if (action === "dashboard") {
      const user = await requireAuthed();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const profile = await getProfileByUserId(user.id);
      if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });
      const links = await getLinks(profile.id);
      const social_links = await getSocialLinks(profile.id);
      const range = Number(searchParams.get("range") || 30);
      const analytics = await getAnalytics(profile.id, range);
      return NextResponse.json({
        user,
        profile,
        links,
        social_links,
        analytics,
      });
    }

    if (action === "analytics") {
      const user = await requireAuthed();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const profile = await getProfileByUserId(user.id);
      if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });
      const range = Number(searchParams.get("range") || 30);
      const analytics = await getAnalytics(profile.id, range);
      return NextResponse.json(analytics);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body as { action: string };

    if (action === "track") {
      await trackEvent({
        profile_id: body.profile_id,
        link_id: body.link_id,
        event_type: body.event_type,
      });
      return NextResponse.json({ ok: true });
    }

    const user = await requireAuthed();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (action === "onboarding") {
      const username = usernameSchema.parse(normalizeUsername(body.username));
      if (!(await isUsernameAvailable(username, user.id))) {
        return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
      }

      let profile = await getProfileByUserId(user.id);
      const theme = (body.theme as keyof typeof THEME_PRESETS) || "minimal";
      const appearance: AppearanceSettings = {
        ...DEFAULT_APPEARANCE,
        ...THEME_PRESETS[theme]?.appearance,
      };

      if (!profile) {
        profile = await createProfile({
          user_id: user.id,
          username,
          display_name: body.display_name || user.full_name,
          bio: body.bio || "",
          location: body.location || null,
          website: body.website || null,
          profile_image: body.profile_image || null,
          appearance,
        });
      } else {
        profile = await updateProfile(profile.id, {
          username,
          display_name: body.display_name || profile.display_name,
          bio: body.bio ?? profile.bio,
          location: body.location ?? profile.location,
          website: body.website ?? profile.website,
          profile_image: body.profile_image ?? profile.profile_image,
          appearance,
        });
      }

      const existingLinks = await getLinks(profile.id);
      if (Array.isArray(body.links) && existingLinks.length === 0) {
        for (const item of body.links) {
          if (!item.title || !item.url) continue;
          if (!isSafeUrl(item.url) && !item.url.startsWith("mailto:")) continue;
          await createLink(profile.id, {
            title: item.title,
            url: item.url,
            type: "standard",
            description: null,
            thumbnail: null,
            icon: null,
            is_active: true,
          });
        }
      }

      profile = await updateProfile(profile.id, { onboarding_completed: true });
      return NextResponse.json({ profile });
    }

    const profile = await getProfileByUserId(user.id);
    if (!profile) {
      return NextResponse.json({ error: "Complete onboarding first" }, { status: 400 });
    }

    if (action === "create_link") {
      if (body.url && !isSafeUrl(body.url) && !String(body.url).startsWith("mailto:")) {
        return NextResponse.json({ error: "Unsafe or invalid URL" }, { status: 400 });
      }
      const link = await createLink(profile.id, {
        title: body.title || "New Link",
        url: body.url || "https://example.com",
        type: body.type || "standard",
        description: body.description || null,
        thumbnail: body.thumbnail || null,
        icon: body.icon || null,
        is_active: body.is_active ?? true,
      });
      return NextResponse.json({ link });
    }

    if (action === "update_link") {
      const existing = (await getLinks(profile.id)).find((l) => l.id === body.id);
      if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (body.url && !isSafeUrl(body.url) && !String(body.url).startsWith("mailto:")) {
        return NextResponse.json({ error: "Unsafe or invalid URL" }, { status: 400 });
      }
      const link = await updateLink(body.id, {
        title: body.title,
        url: body.url,
        type: body.type,
        description: body.description,
        thumbnail: body.thumbnail,
        icon: body.icon,
        is_active: body.is_active,
      });
      return NextResponse.json({ link });
    }

    if (action === "delete_link") {
      const existing = (await getLinks(profile.id)).find((l) => l.id === body.id);
      if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
      await deleteLink(body.id);
      return NextResponse.json({ ok: true });
    }

    if (action === "duplicate_link") {
      const existing = (await getLinks(profile.id)).find((l) => l.id === body.id);
      if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const link = await duplicateLink(body.id);
      return NextResponse.json({ link });
    }

    if (action === "reorder_links") {
      const links = await reorderLinks(profile.id, body.orderedIds || []);
      return NextResponse.json({ links });
    }

    if (action === "update_appearance") {
      const updated = await updateProfile(profile.id, {
        appearance: { ...profile.appearance, ...body.appearance },
        display_name: body.display_name ?? profile.display_name,
        bio: body.bio ?? profile.bio,
        profile_image: body.profile_image ?? profile.profile_image,
        location: body.location ?? profile.location,
        website: body.website ?? profile.website,
      });
      return NextResponse.json({ profile: updated });
    }

    if (action === "update_profile") {
      if (body.username && body.username !== profile.username) {
        const username = usernameSchema.parse(normalizeUsername(body.username));
        if (!(await isUsernameAvailable(username, user.id))) {
          return NextResponse.json({ error: "Username taken" }, { status: 400 });
        }
        body.username = username;
      }
      const updated = await updateProfile(profile.id, {
        username: body.username ?? profile.username,
        display_name: body.display_name ?? profile.display_name,
        bio: body.bio ?? profile.bio,
        profile_image: body.profile_image ?? profile.profile_image,
        location: body.location ?? profile.location,
        website: body.website ?? profile.website,
      });
      if (body.full_name || body.avatar_url || body.email) {
        await updateUser(user.id, {
          full_name: body.full_name,
          avatar_url: body.avatar_url,
          email: body.email,
        });
      }
      return NextResponse.json({ profile: updated });
    }

    if (action === "upsert_social") {
      if (!isSafeUrl(body.url) && !String(body.url).startsWith("mailto:")) {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
      }
      const social_links = await upsertSocialLink(profile.id, body.platform, body.url);
      return NextResponse.json({ social_links });
    }

    if (action === "remove_social") {
      await removeSocialLink(profile.id, body.platform);
      const social_links = await getSocialLinks(profile.id);
      return NextResponse.json({ social_links });
    }

    if (action === "change_password") {
      await changePassword(user.id, String(body.password || ""));
      return NextResponse.json({ ok: true });
    }

    if (action === "delete_account") {
      await deleteAccount(user.id);
      const jar = await cookies();
      jar.delete(SESSION_COOKIE);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
