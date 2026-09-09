import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";
import {
  getProfileByUserId,
  getUserBySession,
  signInEmail,
  signInOAuth,
  signUpEmail,
  destroySession,
} from "@/lib/data/store";
import { emailSchema, passwordSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body as { action: string };

    if (action === "signup") {
      const email = emailSchema.parse(body.email);
      const password = passwordSchema.parse(body.password);
      const full_name = String(body.full_name || "").trim();
      if (!full_name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
      }
      const { user, token } = await signUpEmail({ email, password, full_name });
      const jar = await cookies();
      jar.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      const profile = await getProfileByUserId(user.id);
      return NextResponse.json({
        user,
        profile,
        redirect: profile?.onboarding_completed ? "/dashboard" : "/onboarding",
      });
    }

    if (action === "login") {
      const email = emailSchema.parse(body.email);
      const password = String(body.password || "");
      const { user, token } = await signInEmail(email, password);
      const jar = await cookies();
      jar.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      const profile = await getProfileByUserId(user.id);
      return NextResponse.json({
        user,
        profile,
        redirect: profile?.onboarding_completed ? "/dashboard" : "/onboarding",
      });
    }

    if (action === "oauth") {
      const provider = body.provider as "google" | "apple";
      if (provider !== "google" && provider !== "apple") {
        return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
      }
      const { user, token } = await signInOAuth(provider, {
        email: body.email,
        name: body.name,
      });
      const jar = await cookies();
      jar.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      const profile = await getProfileByUserId(user.id);
      return NextResponse.json({
        user,
        profile,
        redirect: profile?.onboarding_completed ? "/dashboard" : "/onboarding",
      });
    }

    if (action === "logout") {
      const jar = await cookies();
      const token = jar.get(SESSION_COOKIE)?.value;
      if (token) await destroySession(token);
      jar.delete(SESSION_COOKIE);
      return NextResponse.json({ ok: true });
    }

    if (action === "me") {
      const jar = await cookies();
      const token = jar.get(SESSION_COOKIE)?.value;
      const user = await getUserBySession(token);
      if (!user) return NextResponse.json({ user: null });
      const profile = await getProfileByUserId(user.id);
      return NextResponse.json({ user, profile });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
