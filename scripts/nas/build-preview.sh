#!/bin/sh
# Conexa NAS Preview Builder — clones landhotel-schend preview branch and builds it.
# Triggered every 5 min by cron container (preview-builder-loop).
# Output is served by caddy-preview at https://preview.conexadigital.eu
# Managed by Roman (CTO).

set -e

ROOT="/volume1/Conexa Digital/Kunden/Landhotel Schend"
PREVIEW="$ROOT/preview"
REPO="$PREVIEW/repo"
DIST="$PREVIEW/dist"
SECRETS="$ROOT/secrets"
LOG_DIR="$ROOT/logs"
LOG="$LOG_DIR/preview-build.log"
BRANCH=preview
GIT_REMOTE=https://github.com/eugenvalencia/landhotel-schend.git
# Script laeuft INNERHALB preview-builder Container, dort wird docker-cli via apk
# installiert (siehe preview-loop.sh). Auf der Host-Seite waere der Pfad
# /var/packages/ContainerManager/target/usr/bin/docker — den gibt's hier nicht.
DOCKER=docker
# Synology DSM 7.3 nutzt Docker API 1.43; alpine docker-cli ist neuer und faellt
# sonst mit "client version too new" auf die Nase.
export DOCKER_API_VERSION=1.43

mkdir -p "$PREVIEW" "$DIST" "$LOG_DIR"
exec >> "$LOG" 2>&1

echo ""
echo "=== Preview build $(date +'%Y-%m-%d %H:%M:%S') ==="

# Determine if work is needed (Container hat /volume1 als Host-Bind, daher
# funktionieren sowohl FS-Checks als auch Docker-Volume-Mounts mit demselben Pfad)
if [ -d "$REPO/.git" ]; then
  # --force, weil mirror-preview.yml mit --force-with-lease pusht
  $DOCKER run --rm -v "$REPO:/repo" -w /repo alpine/git fetch --force origin "$BRANCH" >/dev/null 2>&1
  REMOTE_SHA=$($DOCKER run --rm -v "$REPO:/repo" -w /repo alpine/git rev-parse "origin/$BRANCH" 2>/dev/null || echo "")
  LOCAL_SHA=$($DOCKER run --rm -v "$REPO:/repo" -w /repo alpine/git rev-parse HEAD 2>/dev/null || echo "")
  if [ -n "$REMOTE_SHA" ] && [ "$REMOTE_SHA" = "$LOCAL_SHA" ] && [ -f "$DIST/index.html" ]; then
    echo "No changes ($LOCAL_SHA), skipping build"
    exit 0
  fi
  echo "Update: $LOCAL_SHA -> $REMOTE_SHA"
  $DOCKER run --rm -v "$REPO:/repo" -w /repo alpine/git reset --hard "origin/$BRANCH"
else
  echo "Initial clone of branch $BRANCH"
  rm -rf "$REPO"
  $DOCKER run --rm -v "$PREVIEW:/work" alpine/git clone --depth 1 -b "$BRANCH" "$GIT_REMOTE" /work/repo
fi

# Vite liest VITE_* nur aus .env-Files im Projekt-Root. Direkt in den Repo-Tree kopieren
# (Bind-Mount mit Spaces im Host-Pfad ist fragil in shell-Variablen-Expansion)
ENV_FILE="$SECRETS/schend.env"
if [ -f "$ENV_FILE" ]; then
  cp "$ENV_FILE" "$REPO/.env"
  echo "Injected $(wc -l < "$ENV_FILE") env vars from $ENV_FILE"
else
  echo "WARNING: $ENV_FILE missing -> Supabase-Init crasht zur Laufzeit (createClient(undefined))"
fi

echo "Building with node + npm..."
$DOCKER run --rm \
  -v "$REPO:/src" \
  -v "$DIST:/dist-out" \
  -w /src \
  -e CI=true \
  -e NPM_CONFIG_FUND=false \
  -e NPM_CONFIG_AUDIT=false \
  -e NPM_CONFIG_PRODUCTION=false \
  node:20-alpine \
  sh -c "npm install --include=dev --no-audit --no-fund && npm run build && rm -rf /dist-out/* && cp -r dist/. /dist-out/ && chmod -R a+rX /dist-out && echo BUILD_OK"

SIZE=$(du -sh "$DIST" 2>/dev/null | cut -f1)
echo "Done. dist size: $SIZE"

# Rotate log (keep last 5 MB)
LOG_SIZE=$(stat -c%s "$LOG" 2>/dev/null || echo 0)
if [ "$LOG_SIZE" -gt 5000000 ]; then
  tail -c 2000000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi
