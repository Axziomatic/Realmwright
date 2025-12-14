import Link from "next/link";
import { signUp } from "@/app/actions/auth";

export default function SignUpPage() {
  return (
    <main className="min-h-dvh bg-background-main px-4 pt-10">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground-primary"
      >
        ← Back to welcome
      </Link>

      <h1 className="mb-10 text-center font-headeing text-2xl tracking-wide text-foreground-primary">
        REALMWRIGHT
      </h1>

      <div className="mx-auto w-full max-w-sm rounded-2xl border border-border-secondary bg-background-card p-6">
        <header className="mn-6 text-center">
          <h2 className="text-xl font-semibold text-foreground-primary">
            Create account
          </h2>
          <p className="mt-1 text-sn text-foreground-secondary">
            Start building your world
          </p>
        </header>

        <form action={signUp} className="space-y-4">
          <div>
            <label className="text-sm text-foreground-secondary">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              className="mt-1 w-full rounded-xl border border-border-secondary bg-background-muted px-3 py-2 text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
            ></input>
          </div>

          <div>
            <label className="text-sm text-foreground-secondary">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-border-secondary bg-background-muted px-3 py-2 text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm text-foreground-secondary">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-xl border border-border-secondary bg-background-muted px-3 py-2 text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="text-sm text-foreground-secondary">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-xl border border-border-secondary bg-background-muted px-3 py-2 text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent-highlight"
              autoComplete="new-password"
            />
          </div>

          <div className="pt-1 text-sm">
            <label className="flex items-start gap-3 text-foreground-secondary">
              <input
                name="acceptTerms"
                type="checkbox"
                required
                className="mt-1 accent-accent-primary"
              />
              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-accent-highlight underline underline-offset-4 hover:text-accent-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-accent-highlight underline underline-offset-4 hover:text-accent-primary"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-accent-primary py-2 font-medium text-black hover:bg-accent-highlight focus:outline-none focus:ring-2 focus:ring-accent-highlight"
          >
            Create Account
          </button>
        </form>

        <div className="my-6 h-px bg-border-primary opacity-60" />

        {/* OAuth placeholder */}
        <button
          type="button"
          className="w-full rounded-xl border border-border-secondary bg-background-muted py-2 text-sm text-foreground-primary hover:bg-background-card"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-foreground-secondary">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent-highlight hover:text-accent-primary"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
