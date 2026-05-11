UPDATE public.rooms
SET room_type = 'Doppelzimmer Einzelnutzung',
    name = 'Doppelzimmer Einzelnutzung ' || room_number,
    price_per_night = 80,
    max_persons = 1,
    bed_description = '1 Doppelbett (Einzelnutzung)',
    description = 'Komfortables Landhauszimmer zur Einzelnutzung – Nichtraucher, DU/WC, Telefon, TV, WLAN, Safe, überwiegend Balkon/Terrasse. Inkl. Frühstück. Halbpension zzgl. 23€/Person/Tag.',
    amenities = '["Frühstück inkl.", "WLAN", "TV", "Telefon", "DU/WC", "Safe", "Balkon/Terrasse", "Nichtraucher"]'::jsonb
WHERE room_number BETWEEN 1 AND 3;

UPDATE public.rooms
SET room_type = 'Doppelzimmer',
    name = 'Doppelzimmer ' || room_number,
    price_per_night = 114,
    max_persons = 2,
    bed_description = '1 Doppelbett',
    description = 'Komfortables Landhauszimmer – Nichtraucher, DU/WC, Telefon, TV, WLAN, Safe, überwiegend Balkon/Terrasse. Inkl. Frühstück (57€ pro Person/Nacht). Halbpension zzgl. 23€/Person/Tag.',
    amenities = '["Frühstück inkl.", "WLAN", "TV", "Telefon", "DU/WC", "Safe", "Balkon/Terrasse", "Nichtraucher"]'::jsonb
WHERE room_number BETWEEN 4 AND 16 OR room_number = 20;

UPDATE public.rooms
SET room_type = 'Familienzimmer',
    name = 'Familienzimmer ' || room_number,
    price_per_night = 170,
    max_persons = 4,
    bed_description = 'Zwei getrennte Zimmer mit 4 Schlafplätzen',
    description = 'Familienzimmer: zwei getrennte Zimmer mit 4 Schlafplätzen. Nutzung mit 2 Personen möglich – ab 130€. Nichtraucher, DU/WC, Telefon, TV, WLAN, Safe. Inkl. Frühstück. Halbpension zzgl. 23€/Person/Tag.',
    amenities = '["Frühstück inkl.", "WLAN", "TV", "Telefon", "DU/WC", "Safe", "Nichtraucher", "2 getrennte Zimmer"]'::jsonb
WHERE room_number IN (17, 18, 19, 21);