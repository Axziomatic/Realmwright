import { signIn } from "@/app/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-background-main px-4 pt-10">
      {/* Back link */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground-primary"
      >
        ← Back to welcome
      </Link>

      {/* Logo */}
      <h1 className="mb-10 text-center font-heading text-2xl tracking-wide text-foreground-primary">
        REALMWRIGHT
      </h1>

      {/* Card */}
      <div className="mx-auto w-full max-w-sm rounded-2xl border border-border-secondary bg-background-card p-6">
        <header className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-foreground-primary">
            Welcome Back
          </h2>
          <p className="mt-1 text-sm text-foreground-secondary">
            Sign in to continue your worldbuilding
          </p>
        </header>

        <form action={signIn} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-foreground-secondary">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-border-primary bg-background-muted px-3 py-2 text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-foreground-secondary">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-xl border border-border-primary bg-background-muted px-3 py-2 text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
            />
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-foreground-secondary">
              <input type="checkbox" className="accent-accent-primary" />
              Remember me
            </label>

            <a
              href="/forgot-password"
              className="text-accent-highlight hover:text-accent-primary"
            >
              Forgot password?
            </a>
          </div>

          {/* Primary button */}
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-accent-primary py-2 font-medium text-black hover:bg-accent-highlight focus:outline-none focus:ring-2 focus:ring-accent-highlight"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 h-px bg-border-primary opacity-60" />

        {/* OAuth */}
        <button
          type="button"
          className="w-full rounded-xl border border-border-secondary bg-background-muted py-2 text-sm text-foreground-primary hover:bg-background-card"
        >
          Continue with Google
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-foreground-secondary">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-accent-highlight hover:text-accent-primary"
          >
            Create one now
          </a>
        </p>
      </div>
    </main>
  );
}
