export default async function WorldPage({
  params,
}: {
  params: Promise<{ worldId: string }>;
}) {
  const { worldId } = await params;

  return (
    <div>
      <h1 className="text-xl font-semibold">World</h1>
      <p className="text-sm text-foreground-secondary">World ID: {worldId}</p>
    </div>
  );
}
