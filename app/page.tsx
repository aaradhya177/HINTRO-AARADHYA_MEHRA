"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    login("u2");
    router.replace("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-main-bg)] px-4 py-8">
      <section className="w-full max-w-[420px] rounded-lg bg-[var(--color-main-bg)] px-2 py-6 sm:px-8 sm:py-8">
        <h1 className="text-center text-2xl font-bold text-[var(--color-main-text)]">
          Login
        </h1>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-muted)]"
              />
              <Input
                id="email"
                type="email"
                placeholder="Example@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-12"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pr-12"
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] transition-colors hover:text-[var(--color-main-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="h-5 w-5" />
                ) : (
                  <Eye aria-hidden="true" className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error ? (
            <p
              className="text-sm font-medium text-[var(--color-accent-red)]"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="h-12 w-full bg-[var(--color-upgrade-btn)] text-base font-semibold text-[var(--color-sidebar-active-text)] hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </section>
    </main>
  );
}
