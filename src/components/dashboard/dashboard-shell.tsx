"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  ExternalLink,
  LayoutDashboard,
  Link2,
  LogOut,
  Palette,
  Settings,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShareQrDialog } from "@/components/dashboard/share-qr-dialog";
import type { Profile, SessionUser } from "@/lib/types";
import { displayUrl } from "@/lib/urls";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/links", label: "My Links", icon: Link2 },
  { href: "/dashboard/appearance", label: "Appearance", icon: Palette },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function NavItems({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1">
      {nav.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition",
              active
                ? "bg-teal-600/10 font-medium text-teal-800 dark:text-teal-300"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({
  user,
  profile,
  children,
  preview,
}: {
  user: SessionUser;
  profile: Profile;
  children: React.ReactNode;
  preview?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");

  async function logout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5">
        <Logo href="/dashboard" />
      </div>
      <div className="flex-1 px-3">
        <NavItems pathname={pathname} onNavigate={() => setOpen(false)} />
      </div>
      <div className="space-y-3 border-t border-border/70 p-4">
        <ShareQrDialog username={profile.username} />
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl"
          render={<Link href={`/${profile.username}`} target="_blank" />}
        >
          <ExternalLink className="h-4 w-4" />
          View public page
        </Button>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url || profile.profile_image || undefined} />
              <AvatarFallback>
                {user.full_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.full_name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {displayUrl(profile.username)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle compact />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Log out"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-border/70 bg-sidebar lg:block">
        {sidebar}
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/70 bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                className="inline-flex size-7 items-center justify-center rounded-lg hover:bg-muted"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                {sidebar}
              </SheetContent>
            </Sheet>
            <Logo size="sm" href="/dashboard" />
          </div>
          {preview ? (
            <div className="flex rounded-lg bg-muted p-1 text-xs">
              <button
                className={cn(
                  "rounded-md px-2.5 py-1",
                  mobileTab === "editor" && "bg-background shadow-sm"
                )}
                onClick={() => setMobileTab("editor")}
              >
                Editor
              </button>
              <button
                className={cn(
                  "rounded-md px-2.5 py-1",
                  mobileTab === "preview" && "bg-background shadow-sm"
                )}
                onClick={() => setMobileTab("preview")}
              >
                Preview
              </button>
            </div>
          ) : null}
        </header>

        <div
          className={cn(
            "lg:grid",
            preview ? "lg:grid-cols-[minmax(0,1fr)_340px]" : ""
          )}
        >
          <div
            className={cn(
              "min-w-0 px-4 py-6 sm:px-6 lg:px-8",
              preview && mobileTab === "preview" ? "hidden lg:block" : "block"
            )}
          >
            {children}
          </div>
          {preview ? (
            <aside
              className={cn(
                "border-border/70 bg-muted/20 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-l lg:p-6",
                mobileTab === "preview" ? "block p-4" : "hidden lg:block"
              )}
            >
              <div className="mb-4 hidden text-sm font-medium text-muted-foreground lg:block">
                Live preview
              </div>
              {preview}
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
