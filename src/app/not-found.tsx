import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Logo />
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        This QubeLinx doesn&apos;t exist — or the username may have changed.
      </p>
      <Button
        className="mt-6 rounded-xl bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950"
        render={<Link href="/" />}
      >
        Back home
      </Button>
    </div>
  );
}
