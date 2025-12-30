# Realmwright

Realmwright är en webbaserad worldbuilding-plattform för Game Masters. Skapa och organisera världar med resurser som Locations, NPCs, Items och Gods – med säker autentisering och Row Level Security (RLS) i Supabase.

## Live

✅ Deployad på Vercel: https://realmwright.vercel.app/

---

## Tech stack

- **Next.js 15** (App Router, Server Components, Server Actions)
- **TypeScript**
- **TailwindCSS** + custom theme
- **Supabase** (Auth, Postgres, RLS)
- **Zustand** (global UI state)
- **React Hook Form** + **Zod**
- **Deployment:** Vercel

---

## Funktioner (kort)

- Autentisering (Sign up / Log in / Log out)
- CRUD för:
  - Worlds
  - Locations
  - NPCs
  - Items
  - Gods
- Global search
- World-aware sidebar/navigation
- Server Actions + validering med Zod
- Row Level Security (RLS) korrekt implementerat
- Responsiv design (mobile-first → desktop)
- WCAG 2.1-anpassningar (semantisk HTML, labels, fokus-states m.m.)

---

## Kom igång lokalt

### 1) Klona repot

```bash
git clone <https://github.com/Axziomatic/Realmwright>
cd realmwright
```

### 2) Installera dependencies

npm install

# eller

pnpm install

### 3) Skapa .env.local

NEXT_PUBLIC_SUPABASE_URL=din_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=din_anon_key

Obs: Lägg inte SUPABASE_SERVICE_ROLE_KEY i klientkod eller publika miljöer.
Om du använder service role i server-only kod: håll den strikt på serversidan och aldrig i browsern.

### 4) Kör projektet

npm run dev

### Checklista Godkänt (G)

## Planering och Research

Utfört en målgruppsanalys - [x]
Använt projekthanteringsverktyg för backlog (GitHub Projects) - [x]

## Design och Prototyping

Skapat wireframes och prototyp i Figma enligt UX/UI-principer - [x]
Designen är responsiv för minst två skärmstorlekar - [x]
Designen följer WCAG 2.1-standarder - [x]

## Applikationsutveckling

Utvecklad med ett modernt JavaScript-ramverk (Next.js / React) - [x]
Använder databas för lagring och hämtning av data (Supabase / Postgres) - [x]
Implementerad state-hantering och dynamiska komponenter (Zustand) - [x]
Semantisk HTML och WCAG 2.1-anpassningar - [x]
Responsiv webbapp (mobil + desktop) - [x]
README med: - [x]
Instruktioner för att köra projektet - [x]
Publik deploy-länk - [x]
Checklista för betygskriterier - [x]

## Versionshantering

Git-användning med repo på GitHub - [x]

## Slutrapport

Skrivit slutrapport (2–3 sidor) - []
Abstract på engelska - []
Tech stack och motivering av val - []
Dokumentation av arbetsprocess, planering och research - []

## Deploy

Projektet är deployat och publikt tillgängligt (Vercel) - [x]

## Helhetsupplevelse

Inga kraschande sidor eller döda länkar - [x]
Konsekvent design - [x]
Obruten navigation genom hela applikationen - [x]

### Checklista - Väl Godkänt (VG)

## Grundkrav

Uppfyller samtliga krav för Godkänt (G) - [ ]

## Design och Prototyping

Interaktiv prototyp som demonstrerar användarflöden - [x]
Prototypen är mycket lik den färdiga produkten - [x]
Designen följer WCAG 2.1 nivå A och AA utan undantag - [x]

## Applikationsutveckling

Global state management (Zustand) - [x]
WCAG 2.1 nivå A och AA utan undantag - [x]
Testad i WebAIM WAVE utan error- eller warning-nivåproblem - [x]
Optimerad kod: - [x]
Återanvändning av komponenter - [x]
Rimliga filformat - [x]
Optimering där det behövs - [x]
Full CRUD (Create, Read, Update, Delete) för samtliga resurser - [x]
Säker autentisering och behörighetshantering (Supabase Auth + RLS) - [x]
Fullt responsiv design för flera skärmstorlekar (mobil → desktop) - [x]

## Versionshantering

Arbetat med feature branches - [x]
Pull requests före merge till main - [x]
Tydlig och spårbar commit-historik - [x]

## Deploy

Automatiserat deploy-flöde via Vercel (CI/CD) - [x]

## Slutrapport (fördjupning)

Djupgående analys (3–6 sidor) - [ ]
Reflektion kring tekniska och designrelaterade utmaningar - [ ]
Motivering av teknikval (t.ex. React vs Vue) - [ ]
Motiverade beslut inom UX/UI och tillgänglighet - [ ]

## Helhetsupplevelse

Professionell och sammanhållen användarupplevelse - [x]
Snabba laddtider och tydlig återkoppling - [x]
Testad på flera enheter och webbläsare - [x]
