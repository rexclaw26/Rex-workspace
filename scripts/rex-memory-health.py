#!/usr/bin/env python3
"""
rex-memory-health.py
Health check script for Rex's memory system.

Run:  python3 /Users/rex/.openclaw/workspace/scripts/rex-memory-health.py
Output: writes to memory/health-report.md
Exit:  0 = all healthy, 1 = issues found
Stdlib only — no external dependencies.
"""

import os
import sys
import re
import sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path

# ── Paths ────────────────────────────────────────────────────────────────────
WORKSPACE  = Path("/Users/rex/.openclaw/workspace")
MEMORY_DIR = WORKSPACE / "memory"
REPORT_OUT = MEMORY_DIR / "health-report.md"
LCM_DB     = Path("/Users/rex/.openclaw/lcm.db")

# ── Timestamps ───────────────────────────────────────────────────────────────
NOW         = datetime.now(timezone.utc)
TODAY_STR   = NOW.strftime("%Y-%m-%d")
REPORT_TIME = NOW.strftime("%Y-%m-%d %H:%M PDT")

# ── Topic-file staleness thresholds (in days) ─────────────────────────────────
TOPIC_THRESHOLDS = {
    "crypto-market.md":    3,
    "sponsors.md":         7,
    "hit-network-ops.md":  7,
    "kelly-prefs.md":     14,
    "content-pipeline.md": 7,
}

# ── Result accumulation ───────────────────────────────────────────────────────
checks = []   # list of (name, status, detail)
ISSUES_FOUND = False


def pass_(name: str, detail: str = ""):
    checks.append(("PASS", name, detail))


def fail(name: str, detail: str = ""):
    checks.append(("FAIL", name, detail))
    global ISSUES_FOUND
    ISSUES_FOUND = True


def mtime(path: Path) -> datetime | None:
    """Return file mtime as a naive UTC datetime, or None if file doesn't exist."""
    try:
        ts = path.stat().st_mtime
        return datetime.fromtimestamp(ts, tz=timezone.utc)
    except OSError:
        return None


def age_days(path: Path) -> float | None:
    """Age of file in days (relative to NOW), or None if file doesn't exist."""
    mt = mtime(path)
    if mt is None:
        return None
    delta = NOW - mt
    return delta.total_seconds() / 86400.0


# ════════════════════════════════════════════════════════════════════════════
# CHECK 1 — Today's daily memory file exists + has content
# ════════════════════════════════════════════════════════════════════════════
def check_daily_memory_exists():
    fname = f"{TODAY_STR}.md"
    fpath = MEMORY_DIR / fname
    if not fpath.exists():
        fail("C1: Daily memory file exists", f"Missing: {MEMORY_DIR}/{fname}")
        return
    try:
        content = fpath.read_text().strip()
    except Exception as e:
        fail("C1: Daily memory file exists", f"Exists but unreadable: {e}")
        return
    if not content:
        fail("C1: Daily memory file exists", f"File exists but is empty: {fname}")
        return
    pass_("C1: Daily memory file exists", f"{fname} — {len(content)} chars")


# ════════════════════════════════════════════════════════════════════════════
# CHECK 2 — Daily memory file has [HH:MM] timestamp prefixes
# ════════════════════════════════════════════════════════════════════════════
def check_daily_memory_timestamps():
    fname = f"{TODAY_STR}.md"
    fpath = MEMORY_DIR / fname
    if not fpath.exists():
        # Already flagged in C1; skip to avoid redundant fail.
        return
    try:
        content = fpath.read_text()
    except Exception as e:
        fail("C2: Daily memory timestamps", f"Could not read file: {e}")
        return
    ts_pattern = re.compile(r"^\[(\d{2}:\d{2})\]", re.MULTILINE)
    matches = ts_pattern.findall(content)
    if not matches:
        fail("C2: Daily memory timestamps", "No [HH:MM] timestamp prefixes found")
        return
    pass_("C2: Daily memory timestamps", f"Found {len(matches)} timestamp(s): {', '.join(matches[-5:])}")


# ════════════════════════════════════════════════════════════════════════════
# CHECK 3 — QUICKREF.md freshness (< 24 h old)
# ════════════════════════════════════════════════════════════════════════════
def check_quickref_fresh():
    fpath = WORKSPACE / "QUICKREF.md"
    age = age_days(fpath)
    if age is None:
        fail("C3: QUICKREF.md freshness", "File not found")
        return
    if age >= 1.0:
        fail("C3: QUICKREF.md freshness", f"Last modified {age:.1f} days ago (threshold: 24 h)")
        return
    hours = age * 24
    pass_("C3: QUICKREF.md freshness", f"Last modified {hours:.1f} h ago")


# ════════════════════════════════════════════════════════════════════════════
# CHECK 4 — Topic files staleness
# ════════════════════════════════════════════════════════════════════════════
def check_topic_files():
    stale = []
    ok    = []
    for fname, threshold in TOPIC_THRESHOLDS.items():
        fpath = MEMORY_DIR / fname
        age = age_days(fpath)
        if age is None:
            stale.append((fname, "file missing", threshold))
        elif age >= threshold:
            stale.append((fname, f"{age:.1f} days old (limit: {threshold}d)", threshold))
        else:
            ok.append((fname, age))
    if stale:
        detail = " | ".join(f"{f} ({msg})" for f, msg, _ in stale)
        fail("C4: Topic files staleness", detail)
    else:
        names = ", ".join(f"{n} ({a:.1f}d)" for n, a in ok)
        pass_("C4: Topic files staleness", f"All fresh — {names}")


# ════════════════════════════════════════════════════════════════════════════
# CHECK 5 — LCM has records (> 0 summaries)
# ════════════════════════════════════════════════════════════════════════════
def check_lcm_summaries():
    if not LCM_DB.exists():
        fail("C5: LCM summary records", f"LCM database not found at {LCM_DB}")
        return
    try:
        conn = sqlite3.connect(str(LCM_DB))
        cur  = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM summaries")
        count = cur.fetchone()[0]
        conn.close()
    except Exception as e:
        fail("C5: LCM summary records", f"Could not query LCM DB: {e}")
        return
    if count <= 0:
        fail("C5: LCM summary records", f"0 summaries found in LCM DB")
        return
    pass_("C5: LCM summary records", f"{count} summary record(s)")


# ════════════════════════════════════════════════════════════════════════════
# CHECK 6 — Session handoff updated (last 48 h)
# ════════════════════════════════════════════════════════════════════════════
def check_session_handoff():
    fpath = WORKSPACE / "session-handoff.md"
    age = age_days(fpath)
    if age is None:
        fail("C6: Session handoff updated", "session-handoff.md not found")
        return
    if age >= 2.0:
        fail("C6: Session handoff updated", f"Last modified {age:.1f} days ago (limit: 48 h)")
        return
    hours = age * 24
    pass_("C6: Session handoff updated", f"Last modified {hours:.1f} h ago")


# ════════════════════════════════════════════════════════════════════════════
# REPORT BUILDER
# ════════════════════════════════════════════════════════════════════════════
def build_report() -> str:
    lines = [
        f"# Rex Memory Health Report",
        f"**Generated:** {REPORT_TIME}",
        f"**Workspace:** {WORKSPACE}",
        "",
        "## Checks",
        "",
        "| Status | Check | Detail |",
        "|--------|-------|--------|",
    ]
    for status, name, detail in checks:
        icon = "✅" if status == "PASS" else "❌"
        detail_cell = detail if detail else "—"
        # escape pipes in detail for markdown table safety
        detail_cell = detail_cell.replace("|", "\\|")
        lines.append(f"| {icon} {status} | {name} | {detail_cell} |")

    lines += ["", "## Summary", ""]
    passed = sum(1 for s, _, _ in checks if s == "PASS")
    total  = len(checks)
    lines.append(f"**{passed}/{total} checks passed.**")
    if ISSUES_FOUND:
        lines.append("")
        lines.append("⚠️  Issues detected — review FAIL rows above.")
    else:
        lines.append("✅ All checks passing.")
    lines.append("")
    return "\n".join(lines)


# ════════════════════════════════════════════════════════════════════════════
# MAIN
# ════════════════════════════════════════════════════════════════════════════
def main():
    global ISSUES_FOUND

    check_daily_memory_exists()
    check_daily_memory_timestamps()
    check_quickref_fresh()
    check_topic_files()
    check_lcm_summaries()
    check_session_handoff()

    report = build_report()

    # Write report
    try:
        REPORT_OUT = MEMORY_DIR / "health-report.md"
        REPORT_OUT.write_text(report)
        print(f"Report written → {REPORT_OUT}")
    except Exception as e:
        print(f"ERROR: Could not write report: {e}", file=sys.stderr)
        sys.exit(1)

    passed = sum(1 for s, _, _ in checks if s == "PASS")
    total  = len(checks)
    print(f"\n{passed}/{total} checks passed.")
    if ISSUES_FOUND:
        print("⚠️  Issues found — exit 1")
        sys.exit(1)
    else:
        print("✅ All checks passing — exit 0")
        sys.exit(0)


if __name__ == "__main__":
    main()
