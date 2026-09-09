import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import {
  DEFAULT_APPEARANCE,
  type AnalyticsEvent,
  type AnalyticsSummary,
  type AppearanceSettings,
  type LinkItem,
  type Profile,
  type PublicProfilePayload,
  type SessionUser,
  type SocialLink,
  type User,
} from "@/lib/types";
import { THEME_PRESETS } from "@/lib/themes";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

export interface StoreData {
  users: User[];
  profiles: Profile[];
  links: LinkItem[];
  social_links: SocialLink[];
  analytics_events: AnalyticsEvent[];
  credentials: { user_id: string; password_hash: string }[];
  sessions: { token: string; user_id: string; expires_at: string }[];
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function createDemoStore(): StoreData {
  const userId = "user_demo_krishna";
  const profileId = "profile_demo_krishna";
  const now = new Date().toISOString();

  const links: LinkItem[] = [
    {
      id: "link_website",
      profile_id: profileId,
      title: "🌐 My Website",
      url: "https://example.com",
      type: "standard",
      description: null,
      thumbnail: null,
      icon: null,
      position: 0,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: "link_instagram",
      profile_id: profileId,
      title: "📸 Instagram",
      url: "https://instagram.com",
      type: "standard",
      description: null,
      thumbnail: null,
      icon: null,
      position: 1,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: "link_linkedin",
      profile_id: profileId,
      title: "💼 LinkedIn",
      url: "https://linkedin.com",
      type: "standard",
      description: null,
      thumbnail: null,
      icon: null,
      position: 2,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: "link_youtube",
      profile_id: profileId,
      title: "🎥 YouTube",
      url: "https://youtube.com",
      type: "standard",
      description: null,
      thumbnail: null,
      icon: null,
      position: 3,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: "link_contact",
      profile_id: profileId,
      title: "📩 Contact Me",
      url: "mailto:hello@example.com",
      type: "standard",
      description: null,
      thumbnail: null,
      icon: null,
      position: 4,
      is_active: true,
      created_at: now,
      updated_at: now,
    },
  ];

  const events: AnalyticsEvent[] = [];
  for (let day = 29; day >= 0; day--) {
    const views = 18 + Math.floor(Math.random() * 40) + (29 - day);
    const clicks = Math.floor(views * (0.35 + Math.random() * 0.25));
    for (let i = 0; i < views; i++) {
      events.push({
        id: randomUUID(),
        profile_id: profileId,
        link_id: null,
        event_type: "page_view",
        created_at: daysAgo(day),
      });
    }
    for (let i = 0; i < clicks; i++) {
      const link = links[i % links.length];
      events.push({
        id: randomUUID(),
        profile_id: profileId,
        link_id: link.id,
        event_type: "link_click",
        created_at: daysAgo(day),
      });
    }
  }

  return {
    users: [
      {
        id: userId,
        email: "krishna@qubelinx.com",
        full_name: "Krishna Midha",
        avatar_url: null,
        auth_provider: "email",
        email_verified: true,
        plan: "free",
        created_at: daysAgo(60),
      },
    ],
    profiles: [
      {
        id: profileId,
        user_id: userId,
        username: "krishna",
        display_name: "Krishna Midha",
        bio: "Entrepreneur · Creator · Building ideas.",
        profile_image: null,
        location: "Vancouver",
        website: "https://example.com",
        appearance: {
          ...DEFAULT_APPEARANCE,
          ...THEME_PRESETS.glass.appearance,
        } as AppearanceSettings,
        onboarding_completed: true,
        created_at: daysAgo(60),
        updated_at: now,
      },
    ],
    links,
    social_links: [
      {
        id: "social_ig",
        profile_id: profileId,
        platform: "instagram",
        url: "https://instagram.com",
        position: 0,
      },
      {
        id: "social_yt",
        profile_id: profileId,
        platform: "youtube",
        url: "https://youtube.com",
        position: 1,
      },
      {
        id: "social_li",
        profile_id: profileId,
        platform: "linkedin",
        url: "https://linkedin.com",
        position: 2,
      },
      {
        id: "social_x",
        profile_id: profileId,
        platform: "x",
        url: "https://x.com",
        position: 3,
      },
    ],
    analytics_events: events,
    credentials: [
      {
        user_id: userId,
        // demo password: qubelinx123
        password_hash: "demo:qubelinx123",
      },
    ],
    sessions: [],
  };
}

async function ensureStore(): Promise<StoreData> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as StoreData;
  } catch {
    const store = createDemoStore();
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2));
    return store;
  }
}

async function saveStore(store: StoreData) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2));
}

function hashPassword(password: string) {
  return `demo:${password}`;
}

function verifyPassword(password: string, hash: string) {
  return hash === `demo:${password}` || hash === password;
}

export async function getStore() {
  return ensureStore();
}

export async function createSession(userId: string) {
  const store = await ensureStore();
  const token = randomUUID();
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  store.sessions.push({
    token,
    user_id: userId,
    expires_at: expires.toISOString(),
  });
  await saveStore(store);
  return token;
}

export async function destroySession(token: string) {
  const store = await ensureStore();
  store.sessions = store.sessions.filter((s) => s.token !== token);
  await saveStore(store);
}

export async function getUserBySession(
  token: string | undefined | null
): Promise<SessionUser | null> {
  if (!token) return null;
  const store = await ensureStore();
  const session = store.sessions.find(
    (s) => s.token === token && new Date(s.expires_at) > new Date()
  );
  if (!session) return null;
  const user = store.users.find((u) => u.id === session.user_id);
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
  };
}

export async function signUpEmail(input: {
  email: string;
  password: string;
  full_name: string;
}) {
  const store = await ensureStore();
  if (store.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error("An account with this email already exists");
  }
  const user: User = {
    id: randomUUID(),
    email: input.email.toLowerCase(),
    full_name: input.full_name,
    avatar_url: null,
    auth_provider: "email",
    email_verified: false,
    plan: "free",
    created_at: new Date().toISOString(),
  };
  store.users.push(user);
  store.credentials.push({
    user_id: user.id,
    password_hash: hashPassword(input.password),
  });
  await saveStore(store);
  const token = await createSession(user.id);
  return { user, token };
}

export async function signInEmail(email: string, password: string) {
  const store = await ensureStore();
  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error("Invalid email or password");
  const cred = store.credentials.find((c) => c.user_id === user.id);
  if (!cred || !verifyPassword(password, cred.password_hash)) {
    throw new Error("Invalid email or password");
  }
  const token = await createSession(user.id);
  return { user, token };
}

export async function signInOAuth(
  provider: "google" | "apple",
  profile?: { email?: string; name?: string }
) {
  const store = await ensureStore();
  const email =
    profile?.email ??
    `${provider}.user.${Date.now()}@qubelinx.demo`;
  let user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: randomUUID(),
      email,
      full_name: profile?.name ?? (provider === "google" ? "Google User" : "Apple User"),
      avatar_url: null,
      auth_provider: provider,
      email_verified: true,
      plan: "free",
      created_at: new Date().toISOString(),
    };
    store.users.push(user);
    await saveStore(store);
  }
  const token = await createSession(user.id);
  return { user, token };
}

export async function getProfileByUserId(userId: string) {
  const store = await ensureStore();
  return store.profiles.find((p) => p.user_id === userId) ?? null;
}

export async function getProfileByUsername(username: string) {
  const store = await ensureStore();
  return (
    store.profiles.find(
      (p) => p.username.toLowerCase() === username.toLowerCase()
    ) ?? null
  );
}

export async function isUsernameAvailable(username: string, excludeUserId?: string) {
  const store = await ensureStore();
  const existing = store.profiles.find(
    (p) => p.username.toLowerCase() === username.toLowerCase()
  );
  if (!existing) return true;
  if (excludeUserId && existing.user_id === excludeUserId) return true;
  return false;
}

export async function createProfile(input: {
  user_id: string;
  username: string;
  display_name: string;
  bio?: string;
  location?: string | null;
  website?: string | null;
  profile_image?: string | null;
  appearance?: AppearanceSettings;
}) {
  const store = await ensureStore();
  if (!(await isUsernameAvailable(input.username))) {
    throw new Error("Username is already taken");
  }
  const now = new Date().toISOString();
  const profile: Profile = {
    id: randomUUID(),
    user_id: input.user_id,
    username: input.username.toLowerCase(),
    display_name: input.display_name,
    bio: input.bio ?? "",
    profile_image: input.profile_image ?? null,
    location: input.location ?? null,
    website: input.website ?? null,
    appearance: input.appearance ?? { ...DEFAULT_APPEARANCE },
    onboarding_completed: false,
    created_at: now,
    updated_at: now,
  };
  store.profiles.push(profile);
  await saveStore(store);
  return profile;
}

export async function updateProfile(
  profileId: string,
  updates: Partial<Profile>
) {
  const store = await ensureStore();
  const idx = store.profiles.findIndex((p) => p.id === profileId);
  if (idx < 0) throw new Error("Profile not found");
  store.profiles[idx] = {
    ...store.profiles[idx],
    ...updates,
    id: store.profiles[idx].id,
    user_id: store.profiles[idx].user_id,
    updated_at: new Date().toISOString(),
  };
  await saveStore(store);
  return store.profiles[idx];
}

export async function getLinks(profileId: string) {
  const store = await ensureStore();
  return store.links
    .filter((l) => l.profile_id === profileId)
    .sort((a, b) => a.position - b.position);
}

export async function getSocialLinks(profileId: string) {
  const store = await ensureStore();
  return store.social_links
    .filter((s) => s.profile_id === profileId)
    .sort((a, b) => a.position - b.position);
}

export async function getPublicProfile(
  username: string
): Promise<PublicProfilePayload | null> {
  const profile = await getProfileByUsername(username);
  if (!profile) return null;
  const links = (await getLinks(profile.id)).filter((l) => l.is_active);
  const social_links = await getSocialLinks(profile.id);
  return { profile, links, social_links };
}

export async function createLink(
  profileId: string,
  data: Omit<
    LinkItem,
    "id" | "profile_id" | "created_at" | "updated_at" | "position"
  > & { position?: number }
) {
  const store = await ensureStore();
  const existing = store.links.filter((l) => l.profile_id === profileId);
  const now = new Date().toISOString();
  const link: LinkItem = {
    id: randomUUID(),
    profile_id: profileId,
    title: data.title,
    url: data.url,
    type: data.type,
    description: data.description,
    thumbnail: data.thumbnail,
    icon: data.icon,
    position: data.position ?? existing.length,
    is_active: data.is_active,
    created_at: now,
    updated_at: now,
  };
  store.links.push(link);
  await saveStore(store);
  return link;
}

export async function updateLink(linkId: string, updates: Partial<LinkItem>) {
  const store = await ensureStore();
  const idx = store.links.findIndex((l) => l.id === linkId);
  if (idx < 0) throw new Error("Link not found");
  store.links[idx] = {
    ...store.links[idx],
    ...updates,
    id: store.links[idx].id,
    profile_id: store.links[idx].profile_id,
    updated_at: new Date().toISOString(),
  };
  await saveStore(store);
  return store.links[idx];
}

export async function deleteLink(linkId: string) {
  const store = await ensureStore();
  store.links = store.links.filter((l) => l.id !== linkId);
  await saveStore(store);
}

export async function reorderLinks(profileId: string, orderedIds: string[]) {
  const store = await ensureStore();
  orderedIds.forEach((id, index) => {
    const link = store.links.find((l) => l.id === id && l.profile_id === profileId);
    if (link) link.position = index;
  });
  await saveStore(store);
  return getLinks(profileId);
}

export async function duplicateLink(linkId: string) {
  const store = await ensureStore();
  const original = store.links.find((l) => l.id === linkId);
  if (!original) throw new Error("Link not found");
  const siblings = store.links.filter((l) => l.profile_id === original.profile_id);
  const now = new Date().toISOString();
  const copy: LinkItem = {
    ...original,
    id: randomUUID(),
    title: `${original.title} (copy)`,
    position: siblings.length,
    created_at: now,
    updated_at: now,
  };
  store.links.push(copy);
  await saveStore(store);
  return copy;
}

export async function upsertSocialLink(
  profileId: string,
  platform: SocialLink["platform"],
  url: string
) {
  const store = await ensureStore();
  const existing = store.social_links.find(
    (s) => s.profile_id === profileId && s.platform === platform
  );
  if (existing) {
    existing.url = url;
  } else {
    store.social_links.push({
      id: randomUUID(),
      profile_id: profileId,
      platform,
      url,
      position: store.social_links.filter((s) => s.profile_id === profileId).length,
    });
  }
  await saveStore(store);
  return getSocialLinks(profileId);
}

export async function removeSocialLink(profileId: string, platform: string) {
  const store = await ensureStore();
  store.social_links = store.social_links.filter(
    (s) => !(s.profile_id === profileId && s.platform === platform)
  );
  await saveStore(store);
}

export async function trackEvent(input: {
  profile_id: string;
  link_id?: string | null;
  event_type: AnalyticsEvent["event_type"];
}) {
  const store = await ensureStore();
  store.analytics_events.push({
    id: randomUUID(),
    profile_id: input.profile_id,
    link_id: input.link_id ?? null,
    event_type: input.event_type,
    created_at: new Date().toISOString(),
  });
  // Keep store bounded
  if (store.analytics_events.length > 20000) {
    store.analytics_events = store.analytics_events.slice(-15000);
  }
  await saveStore(store);
}

export async function getAnalytics(
  profileId: string,
  rangeDays: number
): Promise<AnalyticsSummary> {
  const store = await ensureStore();
  const since = new Date();
  since.setDate(since.getDate() - (rangeDays - 1));
  since.setHours(0, 0, 0, 0);

  const events = store.analytics_events.filter(
    (e) => e.profile_id === profileId && new Date(e.created_at) >= since
  );
  const views = events.filter((e) => e.event_type === "page_view");
  const clicks = events.filter((e) => e.event_type === "link_click");
  const links = store.links.filter((l) => l.profile_id === profileId);

  const seriesMap = new Map<string, { views: number; clicks: number }>();
  for (let i = 0; i < rangeDays; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    seriesMap.set(key, { views: 0, clicks: 0 });
  }
  for (const e of events) {
    const key = e.created_at.slice(0, 10);
    const bucket = seriesMap.get(key);
    if (!bucket) continue;
    if (e.event_type === "page_view") bucket.views += 1;
    else bucket.clicks += 1;
  }

  const clickCounts = new Map<string, number>();
  for (const c of clicks) {
    if (!c.link_id) continue;
    clickCounts.set(c.link_id, (clickCounts.get(c.link_id) ?? 0) + 1);
  }

  const top_links = [...clickCounts.entries()]
    .map(([id, count]) => {
      const link = links.find((l) => l.id === id);
      return { id, title: link?.title ?? "Deleted link", clicks: count };
    })
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 8);

  const recent_activity = events
    .slice()
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 12)
    .map((e) => {
      const link = e.link_id ? links.find((l) => l.id === e.link_id) : null;
      return {
        id: e.id,
        type: e.event_type,
        label:
          e.event_type === "page_view"
            ? "Page view"
            : `Clicked ${link?.title ?? "a link"}`,
        created_at: e.created_at,
      };
    });

  const total_views = views.length;
  const total_clicks = clicks.length;

  return {
    total_views,
    unique_visitors: Math.round(total_views * 0.72),
    total_clicks,
    click_through_rate:
      total_views === 0 ? 0 : Math.round((total_clicks / total_views) * 1000) / 10,
    active_links: links.filter((l) => l.is_active).length,
    series: [...seriesMap.entries()].map(([date, v]) => ({ date, ...v })),
    top_links,
    recent_activity,
  };
}

export async function updateUser(
  userId: string,
  updates: Partial<Pick<User, "full_name" | "avatar_url" | "email">>
) {
  const store = await ensureStore();
  const idx = store.users.findIndex((u) => u.id === userId);
  if (idx < 0) throw new Error("User not found");
  store.users[idx] = { ...store.users[idx], ...updates };
  await saveStore(store);
  return store.users[idx];
}

export async function changePassword(userId: string, newPassword: string) {
  const store = await ensureStore();
  const cred = store.credentials.find((c) => c.user_id === userId);
  if (!cred) {
    store.credentials.push({
      user_id: userId,
      password_hash: hashPassword(newPassword),
    });
  } else {
    cred.password_hash = hashPassword(newPassword);
  }
  await saveStore(store);
}

export async function deleteAccount(userId: string) {
  const store = await ensureStore();
  const profileIds = store.profiles
    .filter((p) => p.user_id === userId)
    .map((p) => p.id);
  store.users = store.users.filter((u) => u.id !== userId);
  store.profiles = store.profiles.filter((p) => p.user_id !== userId);
  store.links = store.links.filter((l) => !profileIds.includes(l.profile_id));
  store.social_links = store.social_links.filter(
    (s) => !profileIds.includes(s.profile_id)
  );
  store.analytics_events = store.analytics_events.filter(
    (e) => !profileIds.includes(e.profile_id)
  );
  store.credentials = store.credentials.filter((c) => c.user_id !== userId);
  store.sessions = store.sessions.filter((s) => s.user_id !== userId);
  await saveStore(store);
}

export async function getUserById(userId: string) {
  const store = await ensureStore();
  return store.users.find((u) => u.id === userId) ?? null;
}

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export { publicUrl, displayUrl } from "@/lib/urls";
