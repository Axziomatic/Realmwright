import AuthHeader from "@/components/AuthHeader";

export default function WorldsPage() {
  return (
    <main className="min-h-dvh bg-background-main">
      <AuthHeader />
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-foreground-primary">
          Worlds
        </h1>
        <p className="mt-2 text-foreground-secondary">
          Placeholder – här kommer din world list.
        </p>
      </div>
    </main>
  );
}
