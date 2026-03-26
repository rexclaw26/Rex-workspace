#!/usr/bin/env python3
"""
rex-recall-log.py — Rex's memory recall logging system.

Usage:
  python3 scripts/rex-recall-log.py log --type TYPE --name "NAME" --trigger "WHAT PROMPTED THIS"
  python3 scripts/rex-recall-log.py report --days 7

JSONL file: memory/recall-log.jsonl
Append is atomic (write to temp file, then mv).
"""

import argparse
import json
import os
import shutil
import sys
import tempfile
from datetime import datetime, timedelta
from pathlib import Path
from collections import Counter

WORKSPACE = Path("/Users/rex/.openclaw/workspace")
LOG_FILE = WORKSPACE / "memory" / "recall-log.jsonl"
VALID_TYPES = {"decision", "rule", "blocker", "project", "preference"}


def ensure_memory_dir():
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)


def atomic_append(entry: dict):
    """Write a JSONL entry atomically: write to temp file, then rename."""
    ensure_memory_dir()
    line = json.dumps(entry, ensure_ascii=False) + "\n"

    fd, tmp_path = tempfile.mkstemp(dir=LOG_FILE.parent, suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(line)
        shutil.move(tmp_path, str(LOG_FILE))
    except Exception:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
        raise


def cmd_log(args) -> int:
    if args.type not in VALID_TYPES:
        print(f"ERROR: --type must be one of: {', '.join(sorted(VALID_TYPES))}", file=sys.stderr)
        return 1

    now = datetime.now()
    entry = {
        "date": now.isoformat(),
        "type": args.type,
        "name": args.name,
        "trigger": args.trigger,
        "session_date": now.strftime("%Y-%m-%d"),
    }

    atomic_append(entry)
    # Silent success — passive logging, no output to Kelly
    return 0


def read_log() -> list[dict]:
    """Read all entries from the JSONL log. Returns [] if file doesn't exist."""
    if not LOG_FILE.exists():
        return []
    entries = []
    with LOG_FILE.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    entries.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    return entries


def cmd_report(args) -> int:
    cutoff = datetime.now() - timedelta(days=args.days)
    stale_cutoff = datetime.now() - timedelta(days=14)

    entries = read_log()
    if not entries:
        print(f"recall-log.jsonl is empty or missing (path: {LOG_FILE})")
        return 0

    # Filter to entries within the report window
    recent = []
    stale_candidates: list[dict] = []

    for e in entries:
        try:
            dt = datetime.fromisoformat(e["date"])
        except (KeyError, ValueError):
            continue

        if dt >= cutoff:
            recent.append(e)

        # Stale candidates: topic/project files with no recall in 14+ days
        if dt < stale_cutoff:
            stale_candidates.append(e)

    # --- Top-10 most-recalled (by name) in last N days ---
    name_counts = Counter(e["name"] for e in recent)

    print(f"=== Recall Report ({args.days}-day window) ===")
    print(f"Total recall events: {len(recent)}")
    print()

    print("--- Top 10 Most-Recalled Entities ---")
    if name_counts:
        for i, (name, count) in enumerate(name_counts.most_common(10), 1):
            type_counts = Counter(e["type"] for e in recent if e["name"] == name)
            types_str = ", ".join(f"{t}({c})" for t, c in type_counts.most_common())
            print(f"  {i:2d}. {name} — {count} recall(s) [{types_str}]")
    else:
        print("  (no recalls in this window)")

    print()

    # --- Stale candidates ---
    # Only flag entities that existed at all but have ZERO recent recalls
    all_names = set(e["name"] for e in stale_candidates)
    recent_names = set(e["name"] for e in recent)
    stale_names = sorted(all_names - recent_names)

    print("--- Stale Candidates (0 recalls in 14+ days) ---")
    if stale_names:
        for name in stale_names:
            print(f"  ⚠ {name}")
    else:
        print("  (none — all entities have recent recall)")

    return 0


def main():
    parser = argparse.ArgumentParser(
        description="Rex recall log — passive logging of memory reads."
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # log subcommand
    log_parser = sub.add_parser("log", help="Log a recall event")
    log_parser.add_argument("--type", required=True, help=f"Type: {', '.join(VALID_TYPES)}")
    log_parser.add_argument("--name", required=True, help="Entity name (e.g. rule file, project)")
    log_parser.add_argument("--trigger", required=True, help="What prompted this recall")

    # report subcommand
    report_parser = sub.add_parser("report", help="Generate a recall summary")
    report_parser.add_argument(
        "--days", type=int, default=7, help="Report window in days (default: 7)"
    )

    args = parser.parse_args()

    if args.command == "log":
        return cmd_log(args)
    elif args.command == "report":
        return cmd_report(args)
    else:
        parser.print_help()
        return 1


if __name__ == "__main__":
    sys.exit(main())
