"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhonePreview } from "@/components/profile/phone-preview";
import { THEME_PRESETS } from "@/lib/themes";
import {
  DEFAULT_APPEARANCE,
  type AppearanceSettings,
  type LinkItem,
  type Profile,
  type ThemePreset,
} from "@/lib/types";
import { normalizeUsername } from "@/lib/validation";
import { cn } from "@/lib/utils";

const steps = ["Username", "Profile", "Links", "Appearance"];

export function OnboardingWizard({
  defaultName,
}: {
  defaultName: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [availability, setAvailability] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [availabilityError, setAvailabilityError] = useState("");
  const [displayName, setDisplayName] = useState(defaultName || "");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [links, setLinks] = useState([{ title: "", url: "" }]);
  const [theme, setTheme] = useState<ThemePreset>("glass");

  useEffect(() => {
    if (!username) {
      setAvailability("idle");
      setAvailabilityError("");
      return;
    }
    const handle = setTimeout(async () => {
      setAvailability("checking");
      const res = await fetch(
        `/api/data?action=username&username=${encodeURIComponent(username)}`
      );
      const data = await res.json();
      if (data.error) {
        setAvailability("invalid");
        setAvailabilityError(data.error);
      } else if (data.available) {
        setAvailability("available");
        setAvailabilityError("");
      } else {
        setAvailability("taken");
        setAvailabilityError("Already taken");
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [username]);

  const previewProfile: Profile = useMemo(() => {
    const appearance = {
      ...DEFAULT_APPEARANCE,
      ...THEME_PRESETS[theme].appearance,
    } as AppearanceSettings;
    return {
      id: "preview",
      user_id: "preview",
      username: username || "you",
      display_name: displayName || "Your Name",
      bio: bio || "Your bio goes here",
      profile_image: profileImage,
      location: location || null,
      website: website || null,
      appearance,
      onboarding_completed: false,
      created_at: "",
      updated_at: "",
    };
  }, [username, displayName, bio, location, website, profileImage, theme]);

  const previewLinks: LinkItem[] = links
    .filter((l) => l.title)
    .map((l, i) => ({
      id: `p-${i}`,
      profile_id: "preview",
      title: l.title,
      url: l.url || "#",
      type: "standard",
      description: null,
      thumbnail: null,
      icon: null,
      position: i,
      is_active: true,
      created_at: "",
      updated_at: "",
    }));

  function canContinue() {
    if (step === 0) return availability === "available";
    if (step === 1) return displayName.trim().length > 0;
    if (step === 2) return links.some((l) => l.title && l.url);
    return true;
  }

  async function finish() {
    setSaving(true);
    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "onboarding",
          username,
          display_name: displayName,
          bio,
          location,
          website,
          profile_image: profileImage,
          theme,
          links: links.filter((l) => l.title && l.url),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Onboarding failed");
      toast.success("Your QubeLinx is ready");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  function onImageChange(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfileImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative px-4 py-8 sm:px-8">
        <div className="pointer-events-none absolute inset-0 qlx-glow opacity-70" />
        <div className="relative mx-auto max-w-xl">
          <Logo />
          <div className="mt-8 mb-6 flex gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex-1">
                <div
                  className={cn(
                    "h-1.5 rounded-full transition",
                    i <= step ? "bg-teal-600 dark:bg-teal-400" : "bg-muted"
                  )}
                />
                <div className="mt-2 text-[11px] text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur sm:p-8"
            >
              {step === 0 && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Choose your QubeLinx
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    This becomes your public URL. Lowercase, numbers, and hyphens
                    only.
                  </p>
                  <div className="flex overflow-hidden rounded-xl border border-border">
                    <span className="flex items-center bg-muted/60 px-3 text-sm text-muted-foreground">
                      qubelinx.com/
                    </span>
                    <Input
                      className="h-11 rounded-none border-0 focus-visible:ring-0"
                      value={username}
                      onChange={(e) =>
                        setUsername(normalizeUsername(e.target.value))
                      }
                      placeholder="krishna"
                      autoFocus
                    />
                  </div>
                  <div className="text-sm">
                    {availability === "checking" && (
                      <span className="text-muted-foreground">Checking…</span>
                    )}
                    {availability === "available" && (
                      <span className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-300">
                        <Check className="h-4 w-4" /> Available
                      </span>
                    )}
                    {(availability === "taken" || availability === "invalid") && (
                      <span className="inline-flex items-center gap-1 text-destructive">
                        <X className="h-4 w-4" />{" "}
                        {availabilityError || "Unavailable"}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Create your profile
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-teal-700 text-lg font-semibold text-white">
                      {profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profileImage}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (displayName || "Q").slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <div>
                      <Label htmlFor="avatar" className="cursor-pointer text-sm underline-offset-4 hover:underline">
                        Upload profile image
                      </Label>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className="mt-1"
                        onChange={(e) => onImageChange(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Display name</Label>
                    <Input
                      className="h-11 rounded-xl"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Entrepreneur · Creator · Building ideas."
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Location (optional)</Label>
                      <Input
                        className="h-11 rounded-xl"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Website (optional)</Label>
                      <Input
                        className="h-11 rounded-xl"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Add your first links
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Start with a few essentials. You can add more anytime.
                  </p>
                  {links.map((link, i) => (
                    <div key={i} className="grid gap-2 sm:grid-cols-2">
                      <Input
                        className="h-11 rounded-xl"
                        placeholder="My Website"
                        value={link.title}
                        onChange={(e) => {
                          const next = [...links];
                          next[i] = { ...next[i], title: e.target.value };
                          setLinks(next);
                        }}
                      />
                      <Input
                        className="h-11 rounded-xl"
                        placeholder="https://example.com"
                        value={link.url}
                        onChange={(e) => {
                          const next = [...links];
                          next[i] = { ...next[i], url: e.target.value };
                          setLinks(next);
                        }}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setLinks([...links, { title: "", url: "" }])}
                  >
                    <Plus className="h-4 w-4" /> Add another link
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Choose appearance
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Preview themes instantly. You can refine everything later.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(THEME_PRESETS).map(([id, preset]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setTheme(id as ThemePreset)}
                        className={cn(
                          "overflow-hidden rounded-2xl border text-left transition",
                          theme === id
                            ? "border-teal-600 ring-2 ring-teal-600/30"
                            : "border-border hover:border-foreground/20"
                        )}
                      >
                        <div
                          className="h-16"
                          style={{ background: preset.preview.bg }}
                        />
                        <div className="p-3">
                          <div className="font-medium">{preset.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {preset.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                >
                  Back
                </Button>
                {step < steps.length - 1 ? (
                  <Button
                    type="button"
                    className="rounded-xl bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950"
                    disabled={!canContinue()}
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="rounded-xl bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950"
                    disabled={saving}
                    onClick={finish}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Launch QubeLinx
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden items-center justify-center border-l border-border/60 bg-muted/20 p-8 lg:flex">
        <PhonePreview
          profile={previewProfile}
          links={
            previewLinks.length
              ? previewLinks
              : [
                  {
                    id: "placeholder",
                    profile_id: "preview",
                    title: "Your first link",
                    url: "#",
                    type: "standard",
                    description: null,
                    thumbnail: null,
                    icon: null,
                    position: 0,
                    is_active: true,
                    created_at: "",
                    updated_at: "",
                  },
                ]
          }
          socialLinks={[]}
        />
      </div>
    </div>
  );
}
