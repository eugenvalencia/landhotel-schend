-- ============================================================
-- Gaeste-Tabelle: Felder fuer persoenliche Hinweise erweitern.
-- birthday: Geburtstag (DATE, optional)
-- diet: Diaet / Allergien (TEXT, optional)
-- preferences: strukturierte Vorlieben (JSONB)
-- ============================================================

ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS birthday DATE;
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS diet TEXT;
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS preferences JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Demo-Werte fuer die hauptbenutzten Demo-Gaeste
UPDATE public.guests SET birthday = '1962-06-22', diet = 'Vegetarisch', preferences = '{"ruhiges_zimmer": true, "stammgast_seit": 2018}'::jsonb WHERE email = 'reuter.familie@schend-demo.de';
UPDATE public.guests SET birthday = '1985-03-14', diet = 'Allergie: Nuesse', preferences = '{"fruehe_anreise": true}'::jsonb WHERE email = 'p.wittmann@schend-demo.de';
UPDATE public.guests SET birthday = '1978-11-08', diet = 'Glutenfrei', preferences = '{"hund": true, "hundename": "Bruno"}'::jsonb WHERE email = 'berger.familie@schend-demo.de';
UPDATE public.guests SET birthday = '1974-09-30', diet = null, preferences = '{"motorrad_garage": true}'::jsonb WHERE email = 'k.hofmann@schend-demo.de';
UPDATE public.guests SET birthday = '1990-07-12', diet = 'Vegetarisch', preferences = '{"kinder": 2, "kinderalter": "4 und 7"}'::jsonb WHERE email = 'wirth.familie@schend-demo.de';
UPDATE public.guests SET birthday = '1988-05-20', diet = null, preferences = '{"hochzeitsreise": true}'::jsonb WHERE email = 'becker@schend-demo.de';
