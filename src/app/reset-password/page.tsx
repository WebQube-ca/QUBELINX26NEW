"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 qlx-glow" />
      <div className="relative w-full max-w-md rounded-3xl border border-border/70 bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur sm:p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Choose a new password
          </h1>
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Password updated (demo)");
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              className="h-11 rounded-xl"
              minLength={8}
              required
            />
          </div>
          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950"
          >
            Update password
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-foreground">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
