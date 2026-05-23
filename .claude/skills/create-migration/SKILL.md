---
name: create-migration
description: Erzeugt eine neue Supabase-Migration fuer das Schend/Conexa Multi-Tenant-Schema. Beachtet RLS-Defaults, search_path bei SECURITY DEFINER, und folgt der Namenskonvention YYYYMMDDHHMMSS_kebab-case. Auto-invoke bei "neue Migration", "Migration anlegen", "Schema-Aenderung".
disable-model-invocation: false
tools: Read, Glob, Grep, Bash, Write
---

# create-migration — Supabase Migration Helper

Du erzeugst eine neue Supabase-Migration. Diese Skill befolgt die Schend-Konventionen.

## Pflicht-Workflow

### 1. Existierende Migrations sichten
```bash
ls -t supabase/migrations/ | head -5
```
Damit weisst du:
- Aktueller Timestamp-Stand
- Welche Tabellen + Spalten existieren (lies die letzten 3 Migrations)

### 2. Filename generieren
Format: `supabase/migrations/{YYYY}{MM}{DD}{HH}{MM}{SS}_{kebab-case-description}.sql`

Beispiel: `supabase/migrations/20260520153000_add_room_amenities.sql`

Verwende fuer Timestamp:
```bash
date +%Y%m%d%H%M%S
```

### 3. Migration-Body folgt diesem Pattern

```sql
-- Migration: <kurze Beschreibung>
-- Author: Conexa Digital
-- Datum: {datum}
-- Why: {warum diese Migration noetig ist}

-- =========================================================
-- 1. SCHEMA-AENDERUNGEN
-- =========================================================

-- Beispiel: Spalte hinzufuegen
alter table public.{tabelle}
  add column if not exists {spalte} {type}
  check ({optional check});

comment on column public.{tabelle}.{spalte} is
  '{Beschreibung was die Spalte tut, in welcher Sprache, etc.}';

-- =========================================================
-- 2. RLS POLICIES (falls neue Tabelle)
-- =========================================================
-- PFLICHT bei neuen Tabellen — sonst openssl

-- alter table public.{neue_tabelle} enable row level security;
--
-- create policy "tenant_member_read" on public.{neue_tabelle}
--   for select
--   using (
--     tenant_id in (
--       select tenant_id from public.tenant_members
--        where user_id = auth.uid()
--     )
--   );
--
-- create policy "tenant_member_write" on public.{neue_tabelle}
--   for all
--   using (
--     tenant_id in (
--       select tenant_id from public.tenant_members
--        where user_id = auth.uid() and role in ('admin','operator')
--     )
--   )
--   with check (
--     tenant_id in (
--       select tenant_id from public.tenant_members
--        where user_id = auth.uid() and role in ('admin','operator')
--     )
--   );

-- =========================================================
-- 3. SECURITY DEFINER Funktionen (falls noetig)
-- =========================================================
-- PFLICHT: 'set search_path = public' wegen Hijacking-Schutz!

-- create or replace function public.my_function(...)
-- returns ... language plpgsql security definer
-- set search_path = public  -- PFLICHT
-- as $$
-- ...
-- $$;
```

## Pflicht-Validierungen vor `Write`

Pruefe automatisch:

1. **RLS:** Wenn `create table public.X` vorkommt → MUSS `alter table public.X enable row level security;` enthalten sein
2. **search_path:** Wenn `security definer` vorkommt → MUSS `set search_path = public` enthalten sein
3. **Tenant-Isolation:** Wenn neue Tabelle in Multi-Tenant-Bereich → MUSS `tenant_id uuid` Spalte oder Begruendung in Kommentar haben
4. **Cancellation:** Wenn Booking-relevante Tabelle → check `payment_status not in ('cancelled')` Filter in Queries
5. **Idempotenz:** Verwende `if not exists` / `or replace` wo moeglich

## Conexa-Conventions (Schend-spezifisch)

- **Anfrage** nicht "Buchung" in user-facing-Text (Finanzamt-Strategie, [[open-problem-finanzamt-online-buchung]])
- **preferred_language** wenn Gast-relevant: TEXT mit CHECK ('de','en','fr','nl')
- **booking_number** Format: `LSC{8-stellige-Ziffer}` (siehe `create_booking` RPC)
- **Audit-Trail:** wenn moeglich `created_at timestamptz default now() not null`

## Output-Format

```
## Migration erstellt: supabase/migrations/20260520153000_add_room_amenities.sql

### Aenderungen
- Neue Spalte `rooms.amenities jsonb default '[]'`
- RLS-Policy ergaenzt (tenant_member_read)
- Index auf (tenant_id, room_id) fuer Performance

### Naechste Schritte
1. Lokal testen: `supabase db reset` (zerstoert lokale Daten!) ODER `supabase db push`
2. RPC-Funktionen aktualisieren falls neue Spalte verwendet wird
3. Frontend-Types neu generieren: `supabase gen types typescript --local > src/integrations/supabase/types.ts`
4. **WICHTIG:** Vor `db push` zu prod: User-Bestaetigung einholen

### Security-Review (falls security-reviewer Subagent verfuegbar)
→ Automatisch invoken auf die neue Datei
```

## Was NIE machen

- Tabellen DROPPEN ohne explizite User-Bestaetigung
- Bestehende Spalten umbenennen (= Breaking-Change, immer Migration mit `add new + copy + drop old`)
- `disable row level security` (gefaehrlich)
- Bestehende Migration-Files NACHTRAEGLICH aendern (immer NEUE Migration anhaengen)
