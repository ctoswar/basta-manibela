"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";

const AUTH_KEY = "basta-manibela:admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    // Mockup auth — accept any non-empty email/password
    if (!email.trim() || !password.trim()) {
      setError("Enter both email and password.");
      return;
    }

    // Set mock auth state
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ email: email.trim(), loggedInAt: Date.now() })
    );
    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        {/* Logo / brand header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-gold/30 bg-surface">
            <Shield className="h-8 w-8 text-gold" />
          </div>
          <h1 className="font-display text-4xl text-paper">Admin</h1>
          <p className="mt-2 font-body text-sm text-muted">
            Sign in to the Basta Manibela control room
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block font-body text-xs uppercase tracking-widest text-muted"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bastamanibela.com"
              className="mt-2 w-full border border-white/10 bg-surface px-4 py-3 font-body text-sm text-paper placeholder:text-muted focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-body text-xs uppercase tracking-widest text-muted"
            >
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-white/10 bg-surface px-4 py-3 pr-12 font-body text-sm text-paper placeholder:text-muted focus:border-gold focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-silver"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 font-body text-xs text-muted">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 accent-gold"
              />
              Remember me
            </label>
            <button
              type="button"
              className="font-body text-xs text-gold hover:text-gold-bright"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 bg-gold px-6 py-3 font-body text-sm font-semibold text-bg transition-colors hover:bg-gold-bright"
          >
            <Lock className="h-4 w-4" />
            Sign in
          </button>
        </form>

        {/* Error notice */}
        {error && (
          <div className="mt-6 border border-red-400/20 bg-red-400/5 px-4 py-3 text-center font-body text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Mockup notice */}
        <p className="mt-4 text-center font-body text-xs text-muted">
          Mockup — any email/password works
        </p>

        {/* Footer link */}
        <p className="mt-8 text-center font-body text-xs text-muted">
          Not an admin?{" "}
          <Link href="/" className="text-gold hover:text-gold-bright">
            Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
