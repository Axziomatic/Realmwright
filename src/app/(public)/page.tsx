import Link from "next/link";
import Image from "next/image";
import {
  Crown,
  MapPin,
  Users,
  Package,
  Swords,
  Sparkles,
  Zap,
  BookOpen,
  Wand2,
  ArrowRight,
} from "lucide-react";
import { getSessionUser } from "../actions/session";

// Om du har auth-helpern redan: importera den och toggla CTA.
// import { getSessionUser } from "@/app/actions/session";

type Feature = {
  title: string;
  description: string;
  Icon: React.ElementType;
  iconBgClass: string;
  iconClass: string;
};

function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium no-underline transition";
  const styles =
    variant === "primary"
      ? "bg-accent-highlight text-background-main hover:brightness-110"
      : "border border-border-secondary bg-background-card text-foreground-primary hover:bg-background-muted";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

function FeatureCard({ f }: { f: Feature }) {
  return (
    <div className="rounded-2xl border border-border-secondary bg-background-card/70 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition hover:bg-background-card hover:border-border-primary">
      <div className="flex items-start gap-4">
        <div className={`rounded-xl p-2.5 ${f.iconBgClass}`}>
          <f.Icon className={`h-5 w-5 ${f.iconClass}`} />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-foreground-primary">
            {f.title}
          </h3>
          <p className="text-sm text-foreground-secondary">{f.description}</p>
        </div>
      </div>
    </div>
  );
}

function BuiltForCard({
  title,
  description,
  Icon,
}: {
  title: string;
  description: string;
  Icon: React.ElementType;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-3 rounded-full bg-accent-highlight/10 p-3">
        <Icon className="h-5 w-5 text-accent-highlight" />
      </div>
      <div className="text-sm font-semibold text-foreground-primary">
        {title}
      </div>
      <p className="mt-2 max-w-xs text-xs leading-relaxed text-foreground-secondary">
        {description}
      </p>
    </div>
  );
}

export default async function LandingPage() {
  const user = await getSessionUser();
  const isAuthed = Boolean(user);

  const heroSrc = "/hero.jpg";

  const features: Feature[] = [
    {
      title: "Worlds",
      description:
        "Create and manage complete campaign settings with rich lore and history",
      Icon: Crown,
      iconBgClass: "bg-accent-highlight/10",
      iconClass: "text-accent-highlight",
    },
    {
      title: "Locations",
      description:
        "Build detailed maps and locations, from grand cities to hidden dungeons",
      Icon: MapPin,
      iconBgClass: "bg-emerald-400/10",
      iconClass: "text-emerald-300",
    },
    {
      title: "NPCs",
      description:
        "Develop memorable characters with personalities, motivations, and backstories",
      Icon: Users,
      iconBgClass: "bg-sky-400/10",
      iconClass: "text-sky-300",
    },
    {
      title: "Items",
      description:
        "Catalog magical artifacts, weapons, and treasures for your players to discover",
      Icon: Package,
      iconBgClass: "bg-violet-400/10",
      iconClass: "text-violet-300",
    },
    {
      title: "Factions",
      description: "Coming soon...",
      Icon: Swords,
      iconBgClass: "bg-rose-400/10",
      iconClass: "text-rose-300",
    },
    {
      title: "Gods",
      description:
        "Design pantheons and divine beings that shape your world’s mythology",
      Icon: Sparkles,
      iconBgClass: "bg-indigo-400/10",
      iconClass: "text-indigo-300",
    },
  ];

  return (
    <div className="min-h-dvh bg-background-main text-foreground-primary">
      {/* Background glow (matchar screenshotens “soft spotlight”) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),rgba(0,0,0,0)_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,170,0,0.10),rgba(0,0,0,0)_60%)]" />
      </div>

      {/* Top brand */}
      <header className="mx-auto w-full max-w-6xl px-4 pt-10">
        <div className="flex items-center justify-center gap-3">
          <div className="rounded-xl bg-accent-highlight p-2 shadow-[0_8px_25px_rgba(0,0,0,0.35)]">
            <Wand2 className="h-5 w-5 text-background-main" />
          </div>
          <div className="font-heading text-xl text-foreground-primary">
            Realmwright
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-14">
        {/* HERO */}
        <section className="pt-10 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            <span className="text-foreground-primary">Forge Your Worlds,</span>{" "}
            <span className="text-accent-highlight">Command Your Stories</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-foreground-secondary sm:text-base">
            The ultimate worldbuilding companion for Game Masters. Create,
            organize, and manage everything from sprawling kingdoms to the
            smallest tavern detail.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isAuthed ? (
              <ButtonLink href="/(protected)/worlds" variant="primary">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/signup" variant="primary">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </>
            )}
          </div>

          {/* Hero image panel */}
          <div className="mx-auto mt-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-border-secondary bg-background-card shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
            <div className="relative aspect-[16/7] w-full">
              <Image
                src={heroSrc}
                alt="Realmwright preview"
                fill
                priority
                className="object-cover"
              />
              {/* vignette overlay som i screenshot */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background-main/70 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        {/* FEATURES heading */}
        <section className="mt-16 text-center">
          <h2 className="text-xl font-semibold text-foreground-primary sm:text-2xl">
            Everything You Need to Build Worlds
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-foreground-secondary">
            Organize your campaign with powerful tools designed for storytellers
          </p>

          {/* Features grid (3x2) */}
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((f) => (
              <FeatureCard key={f.title} f={f} />
            ))}
          </div>

          {/* Built for GMs panel */}
          <div className="mt-10 rounded-2xl border border-border-secondary bg-background-card/60 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            <h3 className="text-base font-semibold text-foreground-primary">
              Built for Game Masters
            </h3>

            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <BuiltForCard
                title="Quick Access"
                description="Find what you need instantly with powerful search and organized categories"
                Icon={Zap}
              />
              <BuiltForCard
                title="Detailed Records"
                description="Keep track of relationships, events, and intricate world details"
                Icon={BookOpen}
              />
              <BuiltForCard
                title="Game-Ready"
                description="Dark theme optimized for use during sessions in low-light environments"
                Icon={Sparkles}
              />
            </div>
          </div>
        </section>

        {/* Bottom CTA (med “divider”-känsla) */}
        <section className="mt-14 border-t border-border-secondary pt-12 text-center">
          <h2 className="text-3xl font-semibold text-foreground-primary sm:text-4xl">
            Ready to Begin Your Journey?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-foreground-secondary sm:text-base">
            Join Game Masters who trust Realmwright to bring their worlds to
            life
          </p>

          <div className="mt-7 flex justify-center">
            {isAuthed ? (
              <ButtonLink href="/(protected)/worlds" variant="primary">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            ) : (
              <ButtonLink href="/signup" variant="primary">
                Get Started Now <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            )}
          </div>
        </section>
      </main>

      {/* Minimal footer (kan byggas ut senare) */}
      <footer className="border-t border-border-secondary bg-background-card/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-center text-xs text-foreground-secondary sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>© {new Date().getFullYear()} Realmwright</div>
          <div className="flex justify-center gap-4 sm:justify-end">
            <Link href="/login" className="hover:text-foreground-primary">
              Log in
            </Link>
            <Link href="/signup" className="hover:text-foreground-primary">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
