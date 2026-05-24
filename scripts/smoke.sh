#!/usr/bin/env bash
# Headless-Browser Smoke-Test ohne Node-Dependencies.
# Sucht Chrome/Edge/Brave und prüft eine URL auf Console-Errors + ErrorBoundary.
#
# Usage:
#   bash scripts/smoke.sh                              # default: http://localhost:4173/
#   bash scripts/smoke.sh https://schend.conexadigital.eu/
#   bash scripts/smoke.sh http://localhost:4173/restaurant http://localhost:4173/booking
#
# Exit 0 wenn alle URLs ohne Errors laden, sonst 1.

set -uo pipefail

URLS=("$@")
[ ${#URLS[@]} -eq 0 ] && URLS=("http://localhost:4173/")

# Find a browser
CHROME=""
for cand in \
  "/c/Program Files/Google/Chrome/Application/chrome.exe" \
  "/c/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
  "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
  "/c/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe" \
  "/usr/bin/google-chrome" "/usr/bin/chromium" "/usr/bin/chromium-browser"; do
  if [ -f "$cand" ]; then CHROME="$cand"; break; fi
done
if [ -z "$CHROME" ]; then echo "ERR: kein Chrome/Edge/Brave gefunden" >&2; exit 2; fi

TMP=$(mktemp -d)
trap "rm -rf $TMP" EXIT
FAIL=0

for url in "${URLS[@]}"; do
  echo "--- $url ---"
  LOG="$TMP/$(echo "$url" | md5sum | head -c 8).log"
  "$CHROME" --headless=new --disable-gpu --user-data-dir="$TMP/prof" \
    --enable-logging=stderr --v=0 --virtual-time-budget=8000 \
    "$url" > /dev/null 2> "$LOG"
  ERRORS=$(grep -iE "ERROR|Uncaught|ErrorBoundary|cannot read|is not a function|supabase.*required" "$LOG" \
           | grep -iv "extensions\|external_pref\|installwebapp\|webapps:\|WARNING:\|gcm\\\\engine\|registration_request\|mcs_client\|DEPRECATED_ENDPOINT" \
           | head -5)
  if [ -n "$ERRORS" ]; then
    echo "  FAIL:"
    echo "$ERRORS" | sed 's/^/    /'
    FAIL=1
  else
    echo "  OK"
  fi
done

exit $FAIL
