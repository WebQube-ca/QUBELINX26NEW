import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 qlx-glow" />
      <div className="relative w-full max-w-md rounded-3xl border border-border/70 bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur sm:p-8">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
