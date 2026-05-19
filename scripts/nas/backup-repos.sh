#!/bin/sh
# Conexa NAS Backup — clone GitHub repos as nightly tarballs
# Managed by Roman (CTO). DO NOT EDIT IN PLACE — sync from C:\Projekte\landhotel-schend\scripts\nas\

set -e

DATE=$(date +%Y%m%d-%H%M)
DAY=$(date +%Y%m%d)
ROOT="/volume1/Conexa Digital/Kunden/Landhotel Schend"
BACKUP_ROOT="$ROOT/backups"
LOG_DIR="$ROOT/logs"
LOG="$LOG_DIR/backup-$DAY.log"
SECRETS="$ROOT/secrets"
DOCKER=/var/packages/ContainerManager/target/usr/bin/docker

mkdir -p "$LOG_DIR"
exec >> "$LOG" 2>&1

echo ""
echo "=== Backup run $DATE ==="

# Public repos — direct tarball via codeload, no auth needed
PUBLIC_REPOS="eugenvalencia/landhotel-schend:schend-site"

for entry in $PUBLIC_REPOS; do
  REPO=$(echo $entry | cut -d: -f1)
  TARGET=$(echo $entry | cut -d: -f2)
  OUT_DIR="$BACKUP_ROOT/$TARGET"
  mkdir -p "$OUT_DIR"

  TARBALL="$OUT_DIR/$TARGET-$DATE.tar.gz"
  URL="https://codeload.github.com/$REPO/tar.gz/refs/heads/main"

  echo "[$DATE] Fetching public $REPO -> $TARBALL"
  if curl -sL -f -o "$TARBALL" "$URL"; then
    SIZE=$(stat -c%s "$TARBALL" 2>/dev/null || echo 0)
    if [ "$SIZE" -lt 10000 ]; then
      echo "[$DATE] WARNING: $TARBALL is only $SIZE bytes — may be HTML error page. Removing."
      rm -f "$TARBALL"
    else
      echo "[$DATE] OK $TARBALL ($SIZE bytes)"
    fi
  else
    echo "[$DATE] FAIL fetching $REPO"
    rm -f "$TARBALL"
  fi

  ls -1t "$OUT_DIR"/*.tar.gz 2>/dev/null | tail -n +15 | xargs -r rm -f
done

# Private repos — clone via Deploy-Key in alpine/git container
# Format: "<ssh-url>:<target-folder>:<deploy-key-filename>"
PRIVATE_REPOS="git@github.com:eugenvalencia/conexa-recommendations.git:conexa-recommendations:conexa-recs-deploy-key"

for entry in $PRIVATE_REPOS; do
  REPO_SSH=$(echo $entry | cut -d: -f1-2)
  TARGET=$(echo $entry | cut -d: -f3)
  KEY=$(echo $entry | cut -d: -f4)
  KEY_PATH=$SECRETS/$KEY

  if [ ! -f "$KEY_PATH" ]; then
    echo "[$DATE] SKIP private $REPO_SSH — deploy key $KEY_PATH not found"
    continue
  fi

  OUT_DIR="$BACKUP_ROOT/$TARGET"
  mkdir -p "$OUT_DIR"

  echo "[$DATE] Cloning private $REPO_SSH"
  $DOCKER run --rm \
    -v "$KEY_PATH:/key:ro" \
    -v "$OUT_DIR:/out" \
    --entrypoint sh \
    alpine/git \
    -c "cp /key /tmp/id_ed25519 && chmod 600 /tmp/id_ed25519 && \
        mkdir -p /root/.ssh && ssh-keyscan -t ed25519 github.com > /root/.ssh/known_hosts 2>/dev/null && \
        GIT_SSH_COMMAND='ssh -i /tmp/id_ed25519 -o UserKnownHostsFile=/root/.ssh/known_hosts' \
        git clone --depth 1 $REPO_SSH /tmp/repo && \
        tar czf /out/$TARGET-$DATE.tar.gz -C /tmp/repo --exclude=.git . && \
        echo SIZE=\$(stat -c%s /out/$TARGET-$DATE.tar.gz)" 2>&1 | tail -5

  ls -1t "$OUT_DIR"/*.tar.gz 2>/dev/null | tail -n +15 | xargs -r rm -f
done

# n8n workflow export (NAS-local dev instance)
N8N_OUT="$BACKUP_ROOT/hetzner-n8n"
mkdir -p "$N8N_OUT"
N8N_TARBALL="$N8N_OUT/n8n-conexa-dev-$DATE.tar.gz"

if $DOCKER ps --format '{{.Names}}' | grep -q '^n8n-conexa-dev$'; then
  echo "[$DATE] Exporting n8n-conexa-dev workflows"
  TMP="$N8N_OUT/.tmp-$$"
  mkdir -p "$TMP"
  $DOCKER exec n8n-conexa-dev n8n export:workflow --backup --output=/tmp/workflows.json 2>/dev/null || true
  $DOCKER cp n8n-conexa-dev:/tmp/workflows.json "$TMP/workflows.json" 2>/dev/null || true
  $DOCKER exec n8n-conexa-dev n8n export:credentials --backup --decrypted --output=/tmp/credentials.json 2>/dev/null || true
  $DOCKER cp n8n-conexa-dev:/tmp/credentials.json "$TMP/credentials.json" 2>/dev/null || true
  tar -czf "$N8N_TARBALL" -C "$TMP" . 2>/dev/null || true
  rm -rf "$TMP"
  ls -1t "$N8N_OUT"/*.tar.gz 2>/dev/null | tail -n +15 | xargs -r rm -f
fi

# Rotate logs — keep last 30 days
find "$LOG_DIR" -name "backup-*.log" -mtime +30 -delete 2>/dev/null || true

echo "=== Done $DATE ==="
