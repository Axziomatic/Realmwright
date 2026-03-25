# Map Making Tool — Feature Plan

Iterativ implementation i 4 branches. Branch 1 är detaljplanerad; 2–4 är på roadmap-nivå.
TDD tillämpas genomgående: tester skrivs innan implementation för varje modul.

---

## Testinfrastruktur (en gång, innan Branch 1-kod)

### Paket
```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

### `vitest.config.ts` (i projektroten)
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
})
```

### `src/test/setup.ts`
```typescript
import '@testing-library/jest-dom'
```

### `package.json` — lägg till scripts
```json
"test": "vitest",
"test:run": "vitest run"
```

### Mock av react-konva — `src/__mocks__/react-konva.tsx`
Konva ritar på ett HTML canvas-element som jsdom inte stöder. Vi mockar hela biblioteket i tester:
```typescript
export const Stage = ({ children, ...props }: any) => (
  <div data-testid="konva-stage" {...props}>{children}</div>
)
export const Layer = ({ children }: any) => <div>{children}</div>
export const Line = () => null
```

### Strategi per lager

| Lager | Verktyg | Vad testas |
|-------|---------|-----------|
| Ren logik (`terrain.ts`, stores, hooks) | Vitest | Beteende och tillståndsövergångar |
| Komponenter | Vitest + RTL | Rendering, interaktion, store-integration |
| Server actions | Vitest + mockad Supabase-klient | Validering, auth-check, DB-anrop |
| Canvas-rendering | Hoppas över | Visuell korrekthet verifieras manuellt |
| E2E-flöden | Manuellt i Browser 1 | Fullständigt draw→save→reload-flöde |

> **Canvas-rendering testas inte automatiskt i Branch 1.** Konva-renderingen (faktiska streck på canvas) verifieras via manuell genomkörning. Automatiserade E2E-tester (t.ex. Playwright) läggs till i en framtida branch om behovet uppstår.

---

## Branch 1: Drawing Foundation

### Bibliotek
```bash
npm install konva react-konva
```

react-konva valdes för sitt React-native API (`<Stage>`, `<Layer>`, `<Line>`), inbyggd pan/zoom via `draggable` + `onWheel`, och enkel JSON-serialisering. React 19-kompatibelt.

---

### Databas (kör i Supabase SQL editor)

```sql
create table public.maps (
  id          uuid primary key default gen_random_uuid(),
  world_id    uuid not null references public.worlds(id) on delete cascade,
  canvas_data jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint maps_world_id_unique unique (world_id)
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger maps_updated_at
  before update on public.maps
  for each row execute procedure public.set_updated_at();

alter table public.maps enable row level security;

create policy "owner can read map" on public.maps for select
  using (exists (select 1 from public.worlds where worlds.id = maps.world_id and worlds.owner_id = auth.uid()));

create policy "owner can insert map" on public.maps for insert
  with check (exists (select 1 from public.worlds where worlds.id = maps.world_id and worlds.owner_id = auth.uid()));

create policy "owner can update map" on public.maps for update
  using (exists (select 1 from public.worlds where worlds.id = maps.world_id and worlds.owner_id = auth.uid()));
```

`canvas_data` lagrar `{ lines: LineData[], version: 1 }`. `UNIQUE (world_id)` säkerställer en karta per värld på DB-nivå. RLS speglar befintligt worlds/locations-mönster.

---

### Server Actions — `src/app/actions/maps.ts`

Modelleras efter `src/app/actions/locations.ts`.

**`getMap(worldId: string)`**
- Använder `supabaseServerClient` (read-only)
- Returnerar raden eller `null` — ingen redirect om den saknas (tom canvas är giltigt)

**`upsertMap(worldId: string, canvasData: object): Promise<{ ok: boolean; error?: string }>`**
- Använder `supabaseActionClient`
- Validerar: `z.string().uuid()` för worldId, `z.record(z.unknown())` för canvasData
- Auth-check via `supabase.auth.getUser()`
- `INSERT ... ON CONFLICT (world_id) DO UPDATE SET canvas_data = ..., updated_at = now()`
- Returnerar `{ ok: true/false }` — ingen redirect (anropas från klient-auto-save-loop, inte ett formulär)
- `revalidatePath(\`/worlds/${worldId}/map\`)`

**`clearMap(worldId: string)`** — stub för Branch 2, sätter `canvas_data = '{}'`

#### Tester — `src/app/actions/maps.test.ts`
Mockar `supabaseActionClient` och `supabaseServerClient`.
```
upsertMap
  ✓ returnerar { ok: false } om worldId inte är ett giltigt UUID
  ✓ returnerar { ok: false } om användaren inte är inloggad
  ✓ anropar supabase.from('maps').upsert() med korrekt data
  ✓ returnerar { ok: true } vid lyckad upsert
  ✓ returnerar { ok: false, error } vid Supabase-fel

getMap
  ✓ returnerar null om ingen karta finns för worldId
  ✓ returnerar map-raden om den finns
```

---

### Nya filer

```
src/app/(protected)/worlds/[worldId]/map/
  page.tsx

src/components/map/
  MapCanvas.tsx
  MapCanvas.test.tsx
  MapToolPalette.tsx
  MapToolPalette.test.tsx
  MapSaveIndicator.tsx
  MapSaveIndicator.test.tsx
  useMapStore.ts
  useMapStore.test.ts
  useMapAutosave.ts
  useMapAutosave.test.ts
  terrain.ts
  terrain.test.ts

src/__mocks__/
  react-konva.tsx

src/test/
  setup.ts

src/app/actions/
  maps.test.ts
```

---

### `terrain.ts` + tester

```typescript
export const TERRAIN_TYPES = {
  land:   { label: "Land",   color: "#8B7355" },
  water:  { label: "Water",  color: "#1E6091" },
  forest: { label: "Forest", color: "#2D6A4F" },
  desert: { label: "Desert", color: "#C9A84C" },
  snow:   { label: "Snow",   color: "#E8F0F2" },
  erase:  { label: "Erase",  color: "#020617" },
} as const;
export type TerrainKey = keyof typeof TERRAIN_TYPES;

export type LineData = {
  points: number[];
  color: string;
  size: number;
};
```

#### Tester — `terrain.test.ts`
```
✓ Innehåller exakt de förväntade nycklarna
✓ Varje terrängtyp har label och color
✓ erase-färgen matchar background-main (#020617)
```

---

### `useMapStore.ts` + tester

```typescript
type MapState = {
  activeTool: TerrainKey;   // default: 'land'
  brushSize: number;        // default: 20, range 4–80
  setActiveTool: (t: TerrainKey) => void;
  setBrushSize: (s: number) => void;
};
```

#### Tester — `useMapStore.test.ts`
```
✓ Initialtillstånd: activeTool='land', brushSize=20
✓ setActiveTool('water') uppdaterar activeTool
✓ setBrushSize(40) uppdaterar brushSize
✓ Store återställs mellan tester (ingen persistence)
```

---

### `useMapAutosave.ts` + tester

Logik:
- isDirty=true → starta 2s debounce-timer
- Efter 2s → anropa `upsertMap(worldId, { lines, version: 1 })`
- Lyckas → setIsDirty(false), status="saved" (tonar ut efter 2s)
- Misslyckas → status="error", retry efter 5s, max 3 försök
- `beforeunload`-lyssnare: varna om isDirty=true

#### Tester — `useMapAutosave.test.ts`
Använder `vi.useFakeTimers()` för deterministisk timer-kontroll.
```
✓ Sparar inte direkt när isDirty sätts till true
✓ Anropar upsertMap efter 2s om isDirty=true
✓ Anropar inte upsertMap om isDirty=false
✓ Sätter isDirty=false efter lyckad sparning
✓ Sätter status='error' vid misslyckat anrop
✓ Försöker igen efter 5s vid fel (max 3 gånger)
✓ Registrerar beforeunload-lyssnare när isDirty=true
✓ Tar bort beforeunload-lyssnare när isDirty=false
```

---

### `MapSaveIndicator.tsx` + tester

Liten badge absolut positionerad i canvas-hörnet. Status: idle/saving/saved/error.

#### Tester — `MapSaveIndicator.test.tsx`
```
✓ Renderar ingenting vid status='idle'
✓ Visar "Saving..." vid status='saving'
✓ Visar "Saved" vid status='saved'
✓ Visar feltext vid status='error'
```

---

### `MapToolPalette.tsx` + tester

Vertikalt staplade terrängknappar + penselstorlek-slider. Läser/skriver från `useMapStore`.

#### Tester — `MapToolPalette.test.tsx`
```
✓ Renderar en knapp för varje terrängtyp
✓ Aktivt verktyg har active-styling (ring-2 ring-accent-primary)
✓ Klick på terrängknapp uppdaterar activeTool i store
✓ Penselstorlek-slider finns och visar aktuellt värde
✓ Ändring av slider uppdaterar brushSize i store
```

---

### `MapCanvas.tsx` + tester

Konva Stage med frihandsteckning, pan/zoom, laddar/sparar `LineData[]`.

#### Tester — `MapCanvas.test.tsx`
Canvas-rendering verifieras manuellt. Automatiserade tester täcker komponentens logik via den mockade react-konva.
```
✓ Renderar utan krasch
✓ Renderar konva-stage container
✓ Laddar initialData.lines vid mount
✓ Tom lines-array om initialData är null
```

---

### Sidebar — `src/components/Sidebar.tsx`

```typescript
import { ..., Map } from "lucide-react";
{ key: "map", label: "Map", icon: Map, path: "/map", worldScoped: true }
```

---

### Implementationsordning (TDD)

Varje punkt följer Red → Green → Refactor:

1. **DB-migration** — Kör SQL i Supabase dashboard (inga tester)
2. **Testinfrastruktur** — Installera testpaket, `vitest.config.ts`, `src/test/setup.ts`, `src/__mocks__/react-konva.tsx`, lägg till `test`-script
3. **Server actions** — Skriv `maps.test.ts` → implementera `maps.ts` → grön
4. **terrain.ts** — Skriv `terrain.test.ts` → implementera → grön
5. **useMapStore.ts** — Skriv `useMapStore.test.ts` → implementera → grön
6. **useMapAutosave.ts** — Skriv `useMapAutosave.test.ts` → implementera → grön
7. **MapSaveIndicator.tsx** — Skriv `MapSaveIndicator.test.tsx` → implementera → grön
8. **MapToolPalette.tsx** — Skriv `MapToolPalette.test.tsx` → implementera → grön
9. **MapCanvas.tsx** — Skriv `MapCanvas.test.tsx` → implementera → grön
10. **Sidebar** — Lägg till Map-item
11. **Map page** — Skapa route, verifiera manuellt att hela flödet fungerar
12. **Pan/zoom** — Lägg till draggable + onWheel, verifiera manuellt

---

### Verifiering

**Automatiserat (`npm test`):**
- Alla tester gröna
- `upsertMap` hanterar ogiltigt input och Supabase-fel
- Auto-save debounce och retry-logik beter sig korrekt
- Komponenter renderar rätt beroende på tillstånd

**Manuellt i webbläsaren:**
- Rita streck av varje terrängtyp → korrekt färg
- Penselstorlek-slider → tjocklek ändras
- Efter 2s idle → Supabase `maps`-rad uppdateras
- Ladda om sidan → streck återladdas
- Panna och zooma → korrekt beteende
- Stäng flik med osparade ändringar → webbläsarvarning
- Annan värld → separat (eller tom) canvas

---

## Roadmap

| Branch | Innehåll |
|--------|----------|
| **1** | Testinfrastruktur, canvas, terrängmålning, pan/zoom, auto-save |
| **2** | Undo/redo (50 steg), Clear canvas, Export PNG (`stage.toDataURL()`), bakgrundstextur |
| **3** | `map_pins`-tabell, Pin-verktyg, länka pins till Locations/NPCs/Items/Gods, klicka pin → info-panel |
| **4** | Namngivna lager, flood-fill bucket-verktyg, fog-of-war-lager |
