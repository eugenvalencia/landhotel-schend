#!/bin/sh
# Conexa Notion-Backup
# Exportiert via Notion-API alle wichtigen Pages als Markdown nach /volume1/Conexa Digital/Notion-Backup/<datum>/
# Geplant: täglich 03:30 via DSM Task Scheduler.
# Managed by Roman (CTO).

set -e

ROOT="/volume1/Conexa Digital"
BACKUP_DIR="$ROOT/Notion-Backup"
SECRETS="$ROOT/Kunden/Landhotel Schend/secrets"
DATE=$(date +%Y-%m-%d)
LATEST="$BACKUP_DIR/latest"
DOCKER=/var/packages/ContainerManager/target/usr/bin/docker
TODAY="$BACKUP_DIR/$DATE"

mkdir -p "$TODAY"

# Notion-Token aus secrets/notion.env lesen (NOTION_TOKEN=secret_xxx)
if [ ! -f "$SECRETS/notion.env" ]; then
  echo "ERROR: $SECRETS/notion.env fehlt — siehe Notion-Backup-Setup-Page"
  exit 1
fi
. "$SECRETS/notion.env"

if [ -z "$NOTION_TOKEN" ]; then
  echo "ERROR: NOTION_TOKEN nicht gesetzt in $SECRETS/notion.env"
  exit 1
fi

# Pages-Liste aus pages.txt — Format: <page_id>|<dateiname>
PAGES_FILE="$ROOT/Kunden/Landhotel Schend/scripts/notion-backup-pages.txt"
if [ ! -f "$PAGES_FILE" ]; then
  echo "ERROR: $PAGES_FILE fehlt"
  exit 1
fi

echo "=== Notion-Backup $DATE ==="

# Hilfsfunktion: einzelne Page als Markdown ziehen via API + curl im alpine-Container
fetch_page() {
  PAGE_ID="$1"
  OUTFILE="$2"
  $DOCKER run --rm \
    -e NOTION_TOKEN="$NOTION_TOKEN" \
    -e PAGE_ID="$PAGE_ID" \
    alpine sh -c '
      apk add --no-cache curl jq >/dev/null 2>&1
      # 1) Page-Properties
      curl -s "https://api.notion.com/v1/pages/$PAGE_ID" \
        -H "Authorization: Bearer $NOTION_TOKEN" \
        -H "Notion-Version: 2022-06-28" | jq .
      echo "---BLOCKS---"
      # 2) Children-Blocks (rekursiv flach)
      curl -s "https://api.notion.com/v1/blocks/$PAGE_ID/children?page_size=100" \
        -H "Authorization: Bearer $NOTION_TOKEN" \
        -H "Notion-Version: 2022-06-28" | jq .
    ' > "$OUTFILE" 2>&1
  echo "  -> $OUTFILE ($(wc -c < "$OUTFILE") bytes)"
}

while IFS='|' read -r PAGE_ID NAME; do
  [ -z "$PAGE_ID" ] && continue
  case "$PAGE_ID" in \#*) continue ;; esac
  echo "Saving '$NAME' ($PAGE_ID)..."
  fetch_page "$PAGE_ID" "$TODAY/$NAME.json"
done < "$PAGES_FILE"

# "latest" Symlink updaten
rm -f "$LATEST"
ln -s "$DATE" "$LATEST"

# Retention: 30 Tage
find "$BACKUP_DIR" -maxdepth 1 -type d -name '20*' -mtime +30 -exec rm -rf {} \;

echo "Done. Size: $(du -sh "$TODAY" | cut -f1)"
