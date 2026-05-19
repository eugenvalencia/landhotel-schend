#!/bin/sh
# Conexa Preview Loop — runs inside preview-builder container.
# Polls build-preview.sh every 5 min for changes on the preview branch.
# Managed by Roman (CTO).

set +e
apk add --no-cache docker-cli >/dev/null 2>&1

while true; do
  sh /scripts/build-preview.sh 2>&1 | tail -3
  sleep 300
done
