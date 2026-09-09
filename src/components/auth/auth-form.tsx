"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.7 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.2-.8-2.2-3.8zM14.5 6.4c.6-.7 1-1.7.9-2.7-0.9.1-1.9.6-2.5 1.3-.6.6-1.1 1.6-1 2.6 1 .1 1.9-.5 2.6-1.2z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.5-5.1 3.5-3.1 0-5.6-2.5-5.6-5.6S8.9 6.1 12 6.1c1.8 0 2.9.7 3.6 1.4l2.4-2.3C16.7 3.8 14.6 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.2-1.5H12z"
      />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(
    null
  );
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode === "login" ? "login" : "signup",
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      toast.success(mode === "login" ? "Welcome back" : "Account created");
      router.push(data.redirect || "/onboarding");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  async function oauth(provider: "google" | "apple") {
    setOauthLoading(provider);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "oauth",
          provider,
          name: provider === "google" ? "Google Creator" : "Apple Creator",
          email: `${provider}.${Date.now()}@qubelinx.demo`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OAuth failed");
      toast.success(`Continued with ${provider === "google" ? "Google" : "Apple"}`);
      router.push(data.redirect || "/onboarding");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "OAuth failed");
    } finally {
      setOauthLoading(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <Logo />
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          {mode === "login" ? "Welcome back" : "Create your QubeLinx"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "login"
            ? "Log in to manage your page, links, and analytics."
            : "Start free. Customize later. Share everywhere."}
        </p>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full justify-center gap-2 rounded-xl"
          disabled={!!oauthLoading}
          onClick={() => oauth("google")}
        >
          {oauthLoading === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="h-4 w-4" />
          )}
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full justify-center gap-2 rounded-xl"
          disabled={!!oauthLoading}
          onClick={() => oauth("apple")}
        >
          {oauthLoading === "apple" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <AppleIcon className="h-4 w-4" />
          )}
          Continue with Apple
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or email</span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === "signup" ? (
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              className="h-11 rounded-xl"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
              autoComplete="name"
            />
          </div>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="h-11 rounded-xl"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {mode === "login" ? (
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </Link>
            ) : null}
          </div>
          <Input
            id="password"
            type="password"
            className="h-11 rounded-xl"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={8}
          />
        </div>
        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {mode === "login" ? "Log in" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href="/signup" className="text-foreground underline-offset-4 hover:underline">
              Create your QubeLinx
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-foreground underline-offset-4 hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>

      {mode === "login" ? (
        <p className="mt-4 rounded-xl border border-border/70 bg-muted/40 px-3 py-2 text-center text-xs text-muted-foreground">
          Demo: <span className="text-foreground">krishna@qubelinx.com</span> /{" "}
          <span className="text-foreground">qubelinx123</span>
        </p>
      ) : null}
    </div>
  );
}
