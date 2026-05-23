#!/usr/bin/env bash
# Landhotel Schend — Deploy zu Hetzner (https://schend.conexadigital.eu)
#
# Verwendung:
#   ./deploy.sh             # Build + Upload
#   ./deploy.sh --skip-build # Nur Upload (wenn dist/ schon aktuell)
#
# Setup:
#   - Git-Bash auf Windows
#   - SSH-Alias `conexa-hetzner` in ~/.ssh/config (eingerichtet)
#   - bun oder npm im PATH (Vite-Build)

set -e

START=$(date +%s)
SKIP_BUILD=false
[ "${1:-}" = "--skip-build" ] && SKIP_BUILD=true

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

echo "============================================================"
echo "  Landhotel Schend Deploy — $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================================"

if [ "${SKIP_BUILD}" = "false" ]; then
  echo "[1/3] Vite-Build..."
  if command -v bun >/dev/null 2>&1; then
    bun run build
  else
    npx vite build
  fi
else
  echo "[1/3] Build übersprungen (--skip-build)"
fi

if [ ! -d "dist" ]; then
  echo "FEHLER: dist/ existiert nicht. Build fehlgeschlagen oder vergessen?"
  exit 1
fi

SIZE=$(du -sh dist | awk '{print $1}')
FILES=$(find dist -type f | wc -l)
echo "  dist/: ${SIZE}, ${FILES} Files"

echo "[2/3] Upload zu Hetzner (scp)..."
scp -q -r dist/* conexa-hetzner:/srv/conexa/sites/landhotel-schend/

echo "[3/3] Verifikation..."
REMOTE_SIZE=$(ssh conexa-hetzner "du -sh /srv/conexa/sites/landhotel-schend/" | awk '{print $1}')
HTTP=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://schend.conexadigital.eu)
TITLE=$(curl -s --max-time 10 https://schend.conexadigital.eu | grep -oE '<title[^>]*>[^<]+</title>' | head -1 | sed 's/<[^>]*>//g')

END=$(date +%s)
DUR=$((END - START))

echo "============================================================"
echo "  ✓ Deploy fertig in ${DUR}s"
echo "    Remote-Size: ${REMOTE_SIZE}"
echo "    HTTP-Status: ${HTTP}"
echo "    Title:       ${TITLE:0:60}"
echo "    Live unter:  https://schend.conexadigital.eu"
echo "============================================================"
