#!/bin/sh
# Conexa Telegram-Roman-Bot — Inbox-Modus
# Wird von n8n aufgerufen sobald Eugen dem Bot eine Nachricht schickt.
# Speichert Text/Sprache als Markdown-Datei in /volume1/Conexa Digital/Inbox/
# damit Roman in der naechsten Session alles findet.
# Managed by Roman (CTO).

# Erwartet Env-Vars von n8n:
#   TG_TEXT    — Nachrichtentext (oder Whisper-Transkript bei Voice)
#   TG_FROM    — Eugen-Username oder ID
#   TG_KIND    — "text" | "voice" | "command"
#   TG_DATE    — ISO 8601 timestamp

set -e

ROOT="/volume1/Conexa Digital"
INBOX="$ROOT/Inbox"
TODAY=$(date +%Y-%m-%d)
NOW=$(date +%H-%M-%S)
mkdir -p "$INBOX/$TODAY"

FILE="$INBOX/$TODAY/$NOW-from-eugen.md"

cat > "$FILE" <<EOF
---
from: ${TG_FROM:-eugen}
kind: ${TG_KIND:-text}
received: ${TG_DATE:-$(date -Iseconds)}
status: open
---

$TG_TEXT
EOF

echo "Saved: $FILE"

# Open-Counter fuer Status-Antwort an Telegram
COUNT=$(find "$INBOX" -type f -name '*.md' | wc -l)
echo "INBOX_TOTAL=$COUNT"
