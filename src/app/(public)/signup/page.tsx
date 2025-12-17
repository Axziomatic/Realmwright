import Link from "next/link";
import SignupForm from "./SignupForm";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const error = sp.error;

  return (
    <>
      {error ? (
        <p className="mb-4 rounded-xl border border-border-secondary bg-background-muted p-3 text-sm text-foreground-secondary">
          {error}
        </p>
      ) : null}

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

          <SignupForm />

          <div className="my-6 h-px bg-border-primary opacity-60" />

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
    </>
  );
}
