"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile, SessionUser, User } from "@/lib/types";
import { displayUrl } from "@/lib/urls";

export function SettingsClient({
  user,
  profile: initialProfile,
  account,
}: {
  user: SessionUser;
  profile: Profile;
  account: User;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const [fullName, setFullName] = useState(account.full_name);
  const [email, setEmail] = useState(account.email);
  const [password, setPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");

  async function saveAccount() {
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_profile",
        full_name: fullName,
        email,
        display_name: profile.display_name,
        username: profile.username,
        bio: profile.bio,
        profile_image: profile.profile_image,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed");
      return;
    }
    setProfile(data.profile);
    toast.success("Settings saved");
    router.refresh();
  }

  async function changePassword() {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change_password", password }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed");
      return;
    }
    setPassword("");
    toast.success("Password updated");
  }

  async function removeAccount() {
    if (confirmDelete !== profile.username) {
      toast.error("Type your username to confirm");
      return;
    }
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_account" }),
    });
    if (!res.ok) {
      toast.error("Could not delete account");
      return;
    }
    toast.success("Account deleted");
    router.push("/");
    router.refresh();
  }

  return (
    <DashboardShell user={user} profile={profile}>
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account, username, and security.
          </p>
        </div>

        <section className="space-y-4 rounded-2xl border border-border/70 p-5">
          <h2 className="font-semibold">Account</h2>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              className="rounded-xl"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              className="rounded-xl"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Display name</Label>
            <Input
              className="rounded-xl"
              value={profile.display_name}
              onChange={(e) =>
                setProfile({ ...profile, display_name: e.target.value })
              }
            />
          </div>
          <Button className="rounded-xl" onClick={saveAccount}>
            Save account
          </Button>
        </section>

        <section className="space-y-4 rounded-2xl border border-border/70 p-5">
          <h2 className="font-semibold">Username</h2>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Changing your username changes your public URL from{" "}
            <span className="font-medium">{displayUrl(profile.username)}</span>.
          </p>
          <div className="flex overflow-hidden rounded-xl border border-border">
            <span className="flex items-center bg-muted/60 px-3 text-sm text-muted-foreground">
              qubelinx.com/
            </span>
            <Input
              className="rounded-none border-0 focus-visible:ring-0"
              value={profile.username}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                })
              }
            />
          </div>
          <Button className="rounded-xl" onClick={saveAccount}>
            Update username
          </Button>
        </section>

        {account.auth_provider === "email" ? (
          <section className="space-y-4 rounded-2xl border border-border/70 p-5">
            <h2 className="font-semibold">Password & Security</h2>
            <div className="space-y-2">
              <Label>New password</Label>
              <Input
                className="rounded-xl"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="rounded-xl" onClick={changePassword}>
              Update password
            </Button>
          </section>
        ) : null}

        <section className="space-y-4 rounded-2xl border border-border/70 p-5">
          <h2 className="font-semibold">Connected Accounts</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
              <span>Google</span>
              <span className="text-muted-foreground">
                {account.auth_provider === "google" ? "Connected" : "Not connected"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
              <span>Apple</span>
              <span className="text-muted-foreground">
                {account.auth_provider === "apple" ? "Connected" : "Not connected"}
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-destructive/30 p-5">
          <h2 className="font-semibold text-destructive">Delete Account</h2>
          <p className="text-sm text-muted-foreground">
            This permanently removes your profile, links, and analytics. Type{" "}
            <span className="font-medium text-foreground">{profile.username}</span>{" "}
            to confirm.
          </p>
          <Input
            className="rounded-xl"
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
            placeholder={profile.username}
          />
          <Button variant="destructive" className="rounded-xl" onClick={removeAccount}>
            Delete my account
          </Button>
        </section>
      </div>
    </DashboardShell>
  );
}
