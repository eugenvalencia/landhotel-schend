#!/bin/sh
# Conexa NAS Backup — clone GitHub repos as nightly tarballs
# Managed by Roman (CTO). DO NOT EDIT IN PLACE — sync from C:\Projekte\landhotel-schend\scripts\nas\

set -e

DATE=$(date +%Y%m%d-%H%M)
DAY=$(date +%Y%m%d)
ROOT=/volume1/CONEXA-SCHEND
BACKUP_ROOT=$ROOT/backups
LOG_DIR=$ROOT/logs
LOG=$LOG_DIR/backup-$DAY.log

mkdir -p $LOG_DIR
exec >> $LOG 2>&1

echo ""
echo "=== Backup run $DATE ==="

# Public repos — direct tarball, no git needed
REPOS="eugenvalencia/landhotel-schend:schend-site"

for entry in $REPOS; do
  REPO=$(echo $entry | cut -d: -f1)
  TARGET=$(echo $entry | cut -d: -f2)
  OUT_DIR=$BACKUP_ROOT/$TARGET
  mkdir -p $OUT_DIR

  TARBALL=$OUT_DIR/$TARGET-$DATE.tar.gz
  URL="https://codeload.github.com/$REPO/tar.gz/refs/heads/main"

  echo "[$DATE] Fetching $REPO -> $TARBALL"
  if curl -sL -f -o $TARBALL "$URL"; then
    SIZE=$(stat -c%s $TARBALL 2>/dev/null || echo 0)
    if [ "$SIZE" -lt 10000 ]; then
      echo "[$DATE] WARNING: $TARBALL is only $SIZE bytes — may be HTML error page. Removing."
      rm -f $TARBALL
    else
      echo "[$DATE] OK $TARBALL ($SIZE bytes)"
    fi
  else
    echo "[$DATE] FAIL fetching $REPO"
    rm -f $TARBALL
  fi

  # Retention: keep last 14
  ls -1t $OUT_DIR/*.tar.gz 2>/dev/null | tail -n +15 | xargs -r rm -f
done

# n8n workflow export (NAS-local dev instance)
N8N_OUT=$BACKUP_ROOT/hetzner-n8n
mkdir -p $N8N_OUT
DOCKER=/var/packages/ContainerManager/target/usr/bin/docker
N8N_TARBALL=$N8N_OUT/n8n-conexa-dev-$DATE.tar.gz

if $DOCKER ps --format '{{.Names}}' | grep -q '^n8n-conexa-dev$'; then
  echo "[$DATE] Exporting n8n-conexa-dev workflows"
  TMP=$N8N_OUT/.tmp-$$
  mkdir -p $TMP
  $DOCKER exec n8n-conexa-dev n8n export:workflow --backup --output=/tmp/workflows.json 2>/dev/null || true
  $DOCKER cp n8n-conexa-dev:/tmp/workflows.json $TMP/workflows.json 2>/dev/null || true
  $DOCKER exec n8n-conexa-dev n8n export:credentials --backup --decrypted --output=/tmp/credentials.json 2>/dev/null || true
  $DOCKER cp n8n-conexa-dev:/tmp/credentials.json $TMP/credentials.json 2>/dev/null || true
  tar -czf $N8N_TARBALL -C $TMP . 2>/dev/null || true
  rm -rf $TMP
  ls -1t $N8N_OUT/*.tar.gz 2>/dev/null | tail -n +15 | xargs -r rm -f
fi

# Rotate logs — keep last 30 days
find $LOG_DIR -name "backup-*.log" -mtime +30 -delete 2>/dev/null || true

echo "=== Done $DATE ==="
