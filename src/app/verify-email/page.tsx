import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 qlx-glow" />
      <div className="relative w-full max-w-md rounded-3xl border border-border/70 bg-card/80 p-8 text-center shadow-xl shadow-black/5 backdrop-blur">
        <Logo className="justify-center" />
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          Verify your email
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a verification link to your inbox. In demo mode, you can
          continue to onboarding.
        </p>
        <Button
          className="mt-6 h-11 rounded-xl bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950"
          render={<Link href="/onboarding" />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
