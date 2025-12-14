import { signOut } from "@/app/actions/auth";

export default function AuthHeader() {
  return (
    <header className="flex items-center justify-between p-4">
      <div className="font-heading text-foreground-primary">Realmwright</div>
      <form action={signOut}>
        <button className="rounded-xl border border-border-secondary bg-background-card px-3 py-2 text-sm text-foreground-primary hover:bg-background-muted">
          Log Out
        </button>
      </form>
    </header>
  );
}
