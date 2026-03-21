#!/bin/bash
# Pre-flight check for Master Skills deck delivery
# Runs at 7:25 AM before the 7:30 AM delivery cron

DECK_FILE="/Users/rex/.openclaw/workspace/mission-control/app/slides/master-skills-report/page.tsx"
MC_DIR="/Users/rex/.openclaw/workspace/mission-control"
ERRORS=()

# Check 1: Deck file exists
if [ ! -f "$DECK_FILE" ]; then
  ERRORS+=("MISSING_FILE: master-skills-report/page.tsx was not created")
fi

# Check 2: Deck registered in config
if ! grep -q "master-skills-report" "$MC_DIR/config/decks.ts" 2>/dev/null; then
  ERRORS+=("NOT_REGISTERED: Deck not in config/decks.ts")
fi

# Check 4: Mission Control reachable
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000 2>/dev/null)
if [ "$HTTP_CODE" != "200" ]; then
  ERRORS+=("MC_DOWN: Mission Control not reachable (HTTP $HTTP_CODE)")
fi

if [ ${#ERRORS[@]} -eq 0 ]; then
  echo "ALL_CLEAR"
  exit 0
else
  for err in "${ERRORS[@]}"; do
    echo "$err"
  done
  exit 1
fi
