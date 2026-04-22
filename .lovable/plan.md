
# Landhotel Schend – Direktbuchungssystem

Komplettes Buchungssystem in deutscher Sprache mit öffentlicher Buchungsseite und privatem Hotel-Dashboard. Design: Navy #0D1B4B / Blau #1a4fa0, professionell und mobil-optimiert.

## Backend (Lovable Cloud)

**Tabellen:**
- `rooms` – 21 Zimmer mit Name, Typ, Betten, max. Personen, Preis, Ausstattung, Fotos, Status
- `bookings` – Buchungen mit Zimmer, Gast, Zeitraum, Preis, Extras, Typ (online/intern), Zahlungsstatus
- `guests` – Gästeliste (Name, E-Mail, Telefon)
- `extras` – Konfigurierbare Zusatzleistungen (Frühstück, Halbpension, Fahrrad, Late/Früh Check-in, Haustier)
- `profiles` + `user_roles` – Admin-Rollen (separater Tabelle, RLS-sicher)

**Storage Bucket:** `room-photos` (öffentlich) für Zimmerbilder-Upload im Dashboard

**Auth:** Supabase Auth, Admin-User wird geseedet: `admin@landhotel-schend.de` / `Demo2026`

**Seed-Daten:** 21 Zimmer + 4 Beispielbuchungen wie spezifiziert

## Teil 1: Öffentliche Buchungsseite (`/booking`)

- **Hero-Header** mit Hotel-Branding "Landhotel Schend – Vulkaneifel"
- **Datums-Auswahl** (Anreise/Abreise) mit Verfügbarkeitsprüfung in Echtzeit
- **Zimmer-Karten-Grid**: Foto, Name, Bettentyp, Ausstattungs-Icons (WLAN, TV, etc.), max. Personen, Preis pro Nacht, "Auswählen"-Button. Nicht verfügbare Zimmer ausgegraut.
- **Extras-Auswahl** mit Checkboxen und Preisen (pro Nacht/Aufenthalt korrekt berechnet)
- **Gästedaten-Formular**: Name, E-Mail, Telefon (Zod-Validierung)
- **Preis-Zusammenfassung**: Zimmer × Nächte + Extras = Gesamtpreis
- **Mock-Zahlung**: Stripe-ähnlicher Checkout-Screen mit Testkarte 4242 4242 4242 4242 (Demo-Modus, keine echte Zahlung)
- **Bestätigungsseite** nach Zahlung mit Buchungsnummer + Zusammenfassung
- **Telegram-Mock**: Toast "📱 Telegram: Neue Buchung gesendet!" beim Bestätigen

## Teil 2: Hotel-Dashboard (`/dashboard`)

Login-Schutz über Admin-Rolle. Tab-Navigation mit 6 Bereichen:

### 1. ÜBERSICHT
- Kennzahlen-Karten: Umsatz heute, Umsatz Monat, Buchungen aktiv, Belegung %
- Kommende Anreisen / Abreisen (heute & morgen)

### 2. KALENDER
- Gantt-ähnliche Matrix: 21 Zimmer (Zeilen) × Tage (Spalten, scrollbar, Monatsnavigation)
- Farben: **grün** = frei, **blau** = bezahlte Buchung, **grau** = intern/Familie
- Klick auf Zelle → Buchungsdetails / "+ Intern eintragen"
- Button **„+ Intern eintragen"** öffnet Dialog (Zimmer, Zeitraum, Name, Notiz – ohne Zahlung, grau markiert)

### 3. BUCHUNGEN
- Tabelle aller Buchungen mit Filtern (Status, Typ, Zeitraum, Zimmer)
- Aktionen: Details ansehen, stornieren

### 4. GÄSTE
- Gästeliste mit Kontaktdaten und Anzahl Buchungen
- Suchfunktion

### 5. ZIMMER VERWALTEN
- Karten-/Listenansicht aller 21 Zimmer
- Bearbeiten-Dialog: Name, Typ, Betten, max. Personen, Preis, Ausstattung (Checkboxen: WLAN, TV, Bad, Balkon, Minibar, Haustiere erlaubt …), Status (aktiv/wartung), Foto-Upload (mehrere)

### 6. EINNAHMEN
- Monats-Umsatz-Chart (Recharts Bar/Line)
- Aufschlüsselung nach Zimmer-Kategorie und Online vs. Intern (intern = €0)

## Design & UX
- Farbsystem in `index.css`: Navy `#0D1B4B` (primary), `#1a4fa0` (secondary), saubere Whites/Grays
- Typografie professionell (Inter), großzügige Abstände
- Vollständig responsiv: Karten-Grid auf Mobile 1-spaltig, Dashboard-Tabs scrollbar, Kalender horizontal scrollbar auf Smartphone
- Alle Texte auf Deutsch (Buttons, Labels, Toasts, Fehlermeldungen)

## Sicherheit
- RLS auf allen Tabellen
- Admin-Funktionen nur über `has_role()` Security-Definer-Funktion
- Öffentliche Buchung nur für Insert auf `bookings`/`guests` erlaubt
- Eingabevalidierung mit Zod auf allen Formularen
