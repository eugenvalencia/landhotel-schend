-- ============================================================
-- Schend's branding-JSONB hat primary/secondary/accent ueberschrieben,
-- aber NICHT die *-foreground-Werte. Im Dark-Mode war primary=dunkel
-- und primary-foreground=dunkel → Header-Text und aktive Buttons
-- (z.B. "Monat" im Kalender) komplett unsichtbar.
--
-- Loesung: index.css enthaelt bereits die Schend-Editorial-Palette
-- (warm parchment / deep slate / brushed brass). Tenant-Branding leeren
-- damit der Default-Style aus index.css greift. Logo-Class bleibt drin.
--
-- Spaetere Tenants (Hilton, Sonnenblick) setzen alle 6 Werte komplett
-- (primary + primary_foreground + secondary + secondary_foreground +
-- accent + accent_foreground) und sind dann kontrast-sicher.
-- ============================================================

UPDATE public.tenants
SET branding = jsonb_build_object('logo_class', 'schend-mark')
WHERE slug = 'schend';
