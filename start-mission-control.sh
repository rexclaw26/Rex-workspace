#!/bin/bash
# ── Mission Control Startup ─────────────────────────────────────────────────
# Starts the Next.js dev server for Mission Control.
# Run this any time after a restart — just type: mission-control
#
# URL: http://localhost:3000  (or your Tailscale IP on port 3000)
# ────────────────────────────────────────────────────────────────────────────

MC_DIR="/Users/rex/.openclaw/workspace/mission-control"

echo ""
echo "  ██████╗ ███████╗██╗  ██╗"
echo "  ██╔══██╗██╔════╝╚██╗██╔╝"
echo "  ██████╔╝█████╗   ╚███╔╝ "
echo "  ██╔══██╗██╔══╝   ██╔██╗ "
echo "  ██║  ██║███████╗██╔╝ ██╗"
echo "  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝"
echo ""
echo "  MISSION CONTROL — Hit Network"
echo "  ─────────────────────────────"
echo "  Local:     http://localhost:3000"
echo "  Tailscale: http://100.70.46.41:3000"
echo ""

cd "$MC_DIR" || { echo "ERROR: $MC_DIR not found"; exit 1; }

# Check node_modules exist
if [ ! -d "node_modules" ]; then
  echo "  Installing dependencies first..."
  npm install --silent
fi

echo "  Server starting... (takes ~3 seconds)"
echo "  Press Ctrl+C to stop."
echo ""

npm run dev
