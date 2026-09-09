"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  Link2,
  Palette,
  Share2,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { PhonePreview } from "@/components/profile/phone-preview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DEFAULT_APPEARANCE, type LinkItem, type Profile, type SocialLink } from "@/lib/types";
import { THEME_PRESETS } from "@/lib/themes";

const rotating = ["Your links", "Your content", "Your business", "Your world"];

const demoProfile: Profile = {
  id: "demo",
  user_id: "demo",
  username: "krishna",
  display_name: "Krishna Midha",
  bio: "Entrepreneur · Creator · Vancouver",
  profile_image: null,
  location: "Vancouver",
  website: "https://example.com",
  appearance: {
    ...DEFAULT_APPEARANCE,
    ...THEME_PRESETS.glass.appearance,
  } as Profile["appearance"],
  onboarding_completed: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const demoLinks: LinkItem[] = [
  {
    id: "1",
    profile_id: "demo",
    title: "🌐 My Website",
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
  {
    id: "2",
    profile_id: "demo",
    title: "📸 Instagram",
    url: "#",
    type: "standard",
    description: null,
    thumbnail: null,
    icon: null,
    position: 1,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    profile_id: "demo",
    title: "💼 LinkedIn",
    url: "#",
    type: "standard",
    description: null,
    thumbnail: null,
    icon: null,
    position: 2,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    profile_id: "demo",
    title: "🎥 YouTube",
    url: "#",
    type: "standard",
    description: null,
    thumbnail: null,
    icon: null,
    position: 3,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "5",
    profile_id: "demo",
    title: "📩 Contact Me",
    url: "#",
    type: "standard",
    description: null,
    thumbnail: null,
    icon: null,
    position: 4,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
];

const demoSocial: SocialLink[] = [
  {
    id: "s1",
    profile_id: "demo",
    platform: "instagram",
    url: "#",
    position: 0,
  },
  {
    id: "s2",
    profile_id: "demo",
    platform: "youtube",
    url: "#",
    position: 1,
  },
  {
    id: "s3",
    profile_id: "demo",
    platform: "linkedin",
    url: "#",
    position: 2,
  },
];

const features = [
  {
    title: "One Link. Everything Connected.",
    description: "Bring all your important links into one place.",
    icon: Link2,
  },
  {
    title: "Make It Yours.",
    description: "Customize colors, layouts, profile images, backgrounds and more.",
    icon: Palette,
  },
  {
    title: "Know What Works.",
    description: "Track clicks and discover what your audience interacts with.",
    icon: BarChart3,
  },
  {
    title: "Share Anywhere.",
    description: "One QubeLinx works everywhere — bios, cards, QR, email.",
    icon: Share2,
  },
  {
    title: "Mobile First.",
    description: "Your page looks beautiful on every screen.",
    icon: Smartphone,
  },
  {
    title: "Instant Updates.",
    description: "Update your links anytime without changing the URL.",
    icon: Zap,
  },
];

const faqs = [
  {
    q: "Is QubeLinx free?",
    a: "Yes. QubeLinx is completely free to use. Future Pro and Business plans may unlock advanced analytics and custom domains — the free product stays excellent.",
  },
  {
    q: "Can I change my username later?",
    a: "Yes. You can change your username in Settings. Keep in mind this also changes your public URL.",
  },
  {
    q: "Does it work on Instagram and TikTok?",
    a: "Absolutely. Put your QubeLinx URL in any bio, QR code, email signature, or business card.",
  },
  {
    q: "Can I track clicks?",
    a: "Yes. QubeLinx includes privacy-friendly analytics for page views, link clicks, CTR, and top-performing links.",
  },
];

export function LandingPage() {
  const [index, setIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % rotating.length), 2400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 qlx-glow" />
      <div className="pointer-events-none absolute inset-0 qlx-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />

      <header
        className={`sticky top-0 z-50 transition-all ${
          scrolled
            ? "border-b border-border/70 bg-background/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#how" className="hover:text-foreground">
              How It Works
            </a>
            <a href="#templates" className="hover:text-foreground">
              Templates
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" render={<Link href="/login" />}>
              Log in
            </Button>
            <Button
              className="hidden bg-teal-700 text-white hover:bg-teal-800 sm:inline-flex dark:bg-teal-400 dark:text-teal-950 dark:hover:bg-teal-300"
              render={<Link href="/signup" />}
            >
              Create your QubeLinx
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-600/20 bg-teal-600/10 px-3 py-1 text-xs font-medium text-teal-800 dark:text-teal-300"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Premium link-in-bio for modern creators
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]"
            >
              Everything you share.{" "}
              <span className="relative inline-block min-w-[9.5ch]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotating[index]}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.28 }}
                    className="bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent dark:from-teal-300 dark:to-cyan-300"
                  >
                    {rotating[index]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              One powerful link.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg"
            >
              Create a beautiful page for everything you are and everything you
              share. Put your QubeLinx anywhere and let people discover
              everything from one simple link.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button
                size="lg"
                className="h-11 rounded-xl bg-teal-700 px-5 text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950 dark:hover:bg-teal-300"
                render={<Link href="/signup" />}
              >
                Create Your QubeLinx Free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-xl"
                render={<Link href="/krishna" />}
              >
                View Demo
              </Button>
            </motion.div>

            <p className="mt-4 text-sm text-muted-foreground">
              Free forever · No credit card · qubelinx.com/you
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="absolute -inset-10 -z-10 rounded-full bg-teal-500/10 blur-3xl" />
            <PhonePreview
              profile={demoProfile}
              links={demoLinks}
              socialLinks={demoSocial}
            />
          </motion.div>
        </section>

        <section id="features" className="border-t border-border/60 bg-background/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
                Features
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Built to feel premium — not like a basic link list.
              </h2>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.05 }}
                  className="group"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700 transition group-hover:scale-105 dark:text-teal-300">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
                How it works
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Live in three calm steps.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Create",
                  text: "Create your free QubeLinx account.",
                },
                {
                  step: "02",
                  title: "Customize",
                  text: "Add your profile, links and personalize your page.",
                },
                {
                  step: "03",
                  title: "Share",
                  text: "Put your QubeLinx anywhere and share everything from one link.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/50 p-6"
                >
                  <div className="text-4xl font-semibold text-teal-700/15 dark:text-teal-300/20">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="templates" className="border-y border-border/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
                Templates
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Themes that feel designed — not decorated.
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(THEME_PRESETS).map(([id, theme]) => (
                <div
                  key={id}
                  className="overflow-hidden rounded-2xl border border-border/70"
                >
                  <div
                    className="flex h-28 items-end p-4"
                    style={{ background: theme.preview.bg }}
                  >
                    <div
                      className="h-8 w-full rounded-lg"
                      style={{ background: theme.preview.link }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="font-medium">{theme.name}</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {theme.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
                FAQ
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Questions, answered.
              </h2>
            </div>
            <Accordion>
              {faqs.map((item, i) => (
                <AccordionItem key={item.q} value={`item-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-teal-700/15 bg-gradient-to-br from-teal-950 via-teal-900 to-slate-950 px-6 py-14 text-center text-teal-50 sm:px-12">
              <div className="pointer-events-none absolute inset-0 qlx-grid opacity-20" />
              <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">
                Your digital identity, connected.
              </h2>
              <p className="relative mx-auto mt-3 max-w-xl text-teal-100/75">
                Create your QubeLinx free and share one link that works
                everywhere.
              </p>
              <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  className="h-11 rounded-xl bg-white text-teal-950 hover:bg-teal-50"
                  render={<Link href="/signup" />}
                >
                  Create Your QubeLinx — Free
                </Button>
                <div className="flex items-center gap-2 text-sm text-teal-100/70">
                  <Check className="h-4 w-4" /> No credit card required
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} QubeLinx. Built for creators.
          </p>
        </div>
      </footer>
    </div>
  );
}
