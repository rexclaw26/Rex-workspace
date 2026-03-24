#!/usr/bin/env bash
# nightly-mc-review.sh
# Manual trigger for the nightly Mission Control review pipeline.
# The nightly cron (OpenClaw cron ID: b595571f-a9df-4b6c-90c8-d8f4cbc9dca8)
# sends the trigger message automatically at 11 PM PST.
# Run this script to trigger it manually outside of the cron window.
#
# Usage: bash scripts/nightly-mc-review.sh
#
# NOTE: OpenClaw's `openclaw cron run` is the recommended way to trigger manually.
# This script is a reference / fallback.

set -euo pipefail

CRON_ID="b595571f-a9df-4b6c-90c8-d8f4cbc9dca8"
CRON_NAME="Nightly Mission Control Review"

echo "🏗️  Triggering: $CRON_NAME"
echo "Cron ID: $CRON_ID"
echo ""

# Preferred: use openclaw cron run (triggers the registered job immediately)
if command -v openclaw &>/dev/null; then
  echo "Running via openclaw cron run..."
  openclaw cron run "$CRON_ID"
else
  echo "ERROR: openclaw CLI not found. Install OpenClaw or run this from the correct environment."
  exit 1
fi

echo ""
echo "✅ Triggered. Check Telegram for the report (target: 1011362712)."
echo "Check run history: openclaw cron runs $CRON_ID"
