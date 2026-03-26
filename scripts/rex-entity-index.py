#!/usr/bin/env python3
"""
rex-entity-index.py — Rex's memory entity indexer.

Pure regex extraction, no LLM. Fast and deterministic.
Run: python3 /Users/rex/.openclaw/workspace/scripts/rex-entity-index.py [--backfill]
"""

import argparse
import json
import math
import os
import re
import sqlite3
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

WORKSPACE = Path("/Users/rex/.openclaw/workspace")
OUTPUT_FILE = WORKSPACE / "memory" / "entity-index.json"

MEMORY_FILES = [
    "memory/kelly-prefs.md",
    "memory/hit-network-ops.md",
    "memory/crypto-market.md",
    "memory/content-pipeline.md",
    "memory/sponsors.md",
]

DECISIONS_FILES = [
    "decisions/2026-03.md",
]

ALL_FILES = MEMORY_FILES + DECISIONS_FILES


# ── Regex patterns ──────────────────────────────────────────────────────────

# [DECISION] explicit markers
DECISION_EXPLICIT = re.compile(
    r'\[DECISION\]\s*(.+)', re.IGNORECASE
)

# PR-### patterns anywhere in a line (decisions, rules, or projects)
PR_LINE = re.compile(
    r'(PR-\d+)\b\s*(.+)'
)

# Kelly-approved / Kelly-confirmed / Kelly-decided
KELLY_DECIDED = re.compile(
    r'\b(approved|decided|confirmed)\s+by\s+Kelly\b', re.IGNORECASE
)

# HARD RULE
HARD_RULE = re.compile(
    r'\bHARD\s+RULE\b', re.IGNORECASE
)

# Rule keywords: permanent, never, always, must
RULE_KEYWORD = re.compile(
    r'\b(permanent|never\b|always\b|must\b)', re.IGNORECASE
)

# Blocker keywords
BLOCKER = re.compile(
    r'\b(blocked|timeout|failed|waiting\s+on|needs\s+Kelly)\b', re.IGNORECASE
)

# Project-like patterns: TASK-, Rock, initiative names, named tasks
PROJECT_TASK = re.compile(
    r'\b(TASK-\d+)\b'
)
PROJECT_ROCK = re.compile(
    r'\b(Rock\s*\d+[\.\:]\s*\d+|[Rr]ock[-\s]\d+)\b'
)
PROJECT_CAPITALIZED = re.compile(
    r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})\b'  # 2-5 word title-case phrases
)
PROJECT_NAMED = re.compile(
    r'(?:^|[^\w-])(named\s+initiative|initiative|project|program)\s+["\']?(\w[\w\s&/\-]+)["\']?',
    re.IGNORECASE
)

# Last Refreshed date
LAST_REFRESHED = re.compile(
    r'Last\s+Refreshed:\s*(\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}:\d{2})?)',
    re.IGNORECASE
)


def detect_last_refreshed(content: str) -> str | None:
    """Return the first Last Refreshed date found, or None."""
    m = LAST_REFRESHED.search(content)
    return m.group(1) if m else None


# ── A-MAC Scoring Helpers ──────────────────────────────────────────────────

def component_recency(source_path: str) -> float:
    """
    Recency: 1.0 if file mtime is today, decays linearly to 0.0 over 30 days.
    Cap at [0.0, 1.0].
    """
    filepath = WORKSPACE / source_path
    if not filepath.exists():
        return 0.0
    mtime_ts = filepath.stat().st_mtime
    mtime_dt = datetime.fromtimestamp(mtime_ts, tz=timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    today_dt = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    delta_days = (today_dt - mtime_dt).days
    recency = 1.0 - (delta_days / 30.0)
    return max(0.0, min(1.0, recency))


def component_frequency(occurrence_count: int) -> float:
    """Frequency: ln(occurrences). Min 0."""
    return max(0.0, math.log(occurrence_count))


def component_confidence(entity: dict) -> float:
    """
    Confidence: Strong (approved by Kelly, permanent, HARD RULE, must, never) = 1.0.
    Medium (PR-###, decided, confirmed) = 0.5.
    Weak (default) = 0.2.
    """
    tags = entity.get("tags", "")
    content_lower = (entity.get("content", "") + entity.get("name", "")).lower()

    # Strong signals
    strong_signals = [
        "hard_rule", "approved by kelly", "confirmed by kelly",
        "decided by kelly", "permanent", " never ", " must ",
    ]
    for sig in strong_signals:
        if sig in tags.lower() or sig in content_lower:
            return 1.0

    # Medium signals
    medium_signals = ["pr-", "decided", "confirmed"]
    for sig in medium_signals:
        if sig in tags.lower() or sig in content_lower:
            return 0.5

    return 0.2


def component_cross_ref(entity_key: tuple, paragraph_groups: dict) -> float:
    """
    Cross-ref: count of other entities co-mentioned in the same paragraph/section.
    Returns the count (not normalized — the score formula will weight it).
    """
    for group_key, members in paragraph_groups.items():
        if entity_key in members and len(members) > 1:
            return float(len(members) - 1)
    return 0.0


def compute_amac(entity: dict, occurrence_count: int, cross_ref_count: float) -> float:
    """
    A-MAC score = (recency × 0.45) + (frequency × 0.25) + (confidence × 0.20) + (cross_ref × 0.10)
    All components scaled to 0-1 range where possible.
    """
    recency = component_recency(entity["source"])
    frequency = component_frequency(occurrence_count)
    # Normalize frequency: ln(n) grows slowly. Use min-max-ish scaling.
    # ln(100) ≈ 4.6, ln(1000) ≈ 6.9. Cap at ln(1000)=6.9 → normalize to [0,1].
    frequency_norm = min(frequency / 6.9, 1.0) if frequency > 0 else 0.0
    confidence = component_confidence(entity)
    # Cross-ref: assume max ~10 co-mentions → normalize
    cross_ref_norm = min(cross_ref_count / 10.0, 1.0)

    score = (recency * 0.45) + (frequency_norm * 0.25) + (confidence * 0.20) + (cross_ref_norm * 0.10)
    return round(score, 4)


def build_paragraph_groups(all_raw_entities: list[dict]) -> dict:
    """
    Group entities by (source_file, paragraph_index) — paragraph is split by double newlines.
    Returns dict: (source, para_idx) -> set of (type, name, source) entity keys.
    """
    # We need to re-read files to know paragraph boundaries
    groups = {}
    for rel_path in ALL_FILES:
        filepath = WORKSPACE / rel_path
        if not filepath.exists():
            continue
        try:
            content = filepath.read_text(encoding="utf-8")
        except Exception:
            continue

        # Split by double newline to get paragraphs
        paragraphs = content.split("\n\n")
        para_idx = 0
        for para in paragraphs:
            key = (rel_path, para_idx)
            groups[key] = set()
            para_lower = para.lower()
            for raw_ent in all_raw_entities:
                ent_key = (raw_ent["type"], raw_ent["name"], raw_ent["source"])
                if ent_key[2] == rel_path and ent_key[1].lower() in para_lower:
                    groups[key].add(ent_key)
            para_idx += 1
    return groups


def score_entities(all_entities: list[dict], all_raw_entities: list[dict]) -> list[dict]:
    """
    Compute A-MAC scores for all entities.
    Returns entities with a_mac_score added.
    """
    # Build paragraph co-mention groups
    para_groups = build_paragraph_groups(all_raw_entities)

    # Count occurrences per entity key (before dedup)
    occurrence_counts = {}
    for raw in all_raw_entities:
        key = (raw["type"], raw["name"], raw["source"])
        occurrence_counts[key] = occurrence_counts.get(key, 0) + 1

    scored = []
    for entity in all_entities:
        key = (entity["type"], entity["name"], entity["source"])
        occ = occurrence_counts.get(key, 1)
        cross_ref_count = component_cross_ref(key, para_groups)
        score = compute_amac(entity, occ, cross_ref_count)
        entity["a_mac_score"] = score
        entity["_occurrence_count"] = occ  # temp field for SQLite writing
        scored.append(entity)

    # Sort by A-MAC descending
    scored.sort(key=lambda e: e["a_mac_score"], reverse=True)
    return scored


def write_to_sqlite(entities: list[dict]) -> None:
    """INSERT OR REPLACE scored entities into the LCM SQLite DB."""
    db_path = Path.home() / ".openclaw" / "lcm.db"
    conn = sqlite3.connect(str(db_path))
    cur = conn.cursor()

    # Create table if not exists
    cur.execute("""
        CREATE TABLE IF NOT EXISTS entities (
            id INTEGER PRIMARY KEY,
            type TEXT,
            name TEXT,
            content TEXT,
            source TEXT,
            confidence REAL,
            a_mac_score REAL,
            updated_at TEXT
        )
    """)

    now_iso = datetime.now(timezone.utc).isoformat()

    for e in entities:
        # Compute confidence for SQLite column
        conf = component_confidence(e)
        cur.execute("""
            INSERT OR REPLACE INTO entities
                (type, name, content, source, confidence, a_mac_score, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            e["type"],
            e["name"],
            e["content"],
            e["source"],
            conf,
            e["a_mac_score"],
            now_iso,
        ))

    conn.commit()
    conn.close()
    print(f"  [SQLite] Wrote {len(entities)} entities to {db_path}")


# ── Market Data Extraction ─────────────────────────────────────────────────

ASSET_ALIASES = {
    "BTC": "Bitcoin", "ETH": "Ethereum", "SOL": "Solana",
    "XRP": "XRP", "LINK": "Chainlink", "TAO": "Bittensor",
    "BNB": "BNB", "ADA": "Cardano", "DOT": "Polkadot",
    "NEAR": "NEAR", "ATOM": "Cosmos", "GOLD": "Gold",
    "SILVER": "Silver", "SILV": "Silver",
}
SUPPORTED_ASSETS = set(ASSET_ALIASES.keys())

PRICE_ROW = re.compile(
    r'\|\s*(\$?/?[A-Z]{2,5})\s*\|\s*\$?([\d,\.]+)\s*\|?\s*([\w\+\-%]+)?\s*\|?\s*(.*)?\|',
    re.IGNORECASE
)
FG_INDEX = re.compile(r'[Ff]ear\s*&\s*[Gg]reed.*?(\d+)', re.IGNORECASE)
ASI_INDEX = re.compile(r'[Aa]ltcoin\s*Season.*?(\d+)', re.IGNORECASE)
NARRATIVE_PATTERNS = [
    re.compile(r'\b(Iran-US|Iran-US tensions|Iran US tensions)\b', re.IGNORECASE),
    re.compile(r'\bFed\s*(?:rate\b|polic\w*|increase\b|hike\b|statement\b)\b', re.IGNORECASE),
    re.compile(r'\b(Tariff|Trade\s*war)\b', re.IGNORECASE),
    re.compile(r'\b(Inflation|Inflationary)\b', re.IGNORECASE),
    re.compile(r'\b(Geopolitical|Geopolitics)\b', re.IGNORECASE),
]


def extract_market_entities() -> list[dict]:
    """Extract structured market data from rex-notes.md today's section."""
    rex_notes = WORKSPACE / "rex-notes.md"
    if not rex_notes.exists():
        print("  [MARKET] rex-notes.md not found — skipping")
        return []

    try:
        content = rex_notes.read_text(encoding="utf-8")
    except Exception as e:
        print(f"  [MARKET] Could not read rex-notes.md: {e}")
        return []

    entities = []
    today_marker = "## 2026-03-25"
    if today_marker not in content:
        print("  [MARKET] Today's section not found in rex-notes.md")
        return []

    today_section = content.split(today_marker)[1].split("## 2026-03")[0]

    # Price table rows
    for m in PRICE_ROW.finditer(today_section):
        sym_raw = (m.group(1) or "").strip().upper().replace('/', '')
        price_str = (m.group(2) or "").replace(',', '')
        trend = (m.group(3) or "").strip()
        note = (m.group(4) or "").strip()

        sym = ASSET_ALIASES.get(sym_raw, sym_raw)
        if sym_raw not in SUPPORTED_ASSETS and sym_raw not in ASSET_ALIASES.values():
            continue
        try:
            price = float(price_str)
        except ValueError:
            continue

        price_disp = f"${price:,.0f}" if price > 1000 else f"${price:,.2f}" if price > 1 else f"${price:.4f}"
        direction = "↑" if trend in ("Up", "up", "+") else "↓" if trend in ("Down", "down", "-") else ""

        entities.append({
            "type": "market_data",
            "name": sym,
            "content": f"{price_disp} {direction} {note}".strip()[:200],
            "source": "rex-notes.md",
            "tags": f"price,market_data,trend_{trend.lower() if trend else 'neutral'}",
        })

    # Fear & Greed
    for pattern in [FG_INDEX]:
        for m in pattern.finditer(today_section):
            val = int(m.group(1))
            if 1 <= val <= 100:
                level = "Extreme Fear" if val <= 20 else "Fear" if val <= 40 else "Neutral" if val <= 60 else "Greed"
                entities.append({
                    "type": "market_data",
                    "name": "Fear & Greed Index",
                    "content": f"Value: {val} ({level})",
                    "source": "rex-notes.md",
                    "tags": "sentiment,market_data",
                })
                break

    # Altcoin Season Index
    for m in ASI_INDEX.finditer(today_section):
        try:
            val = int(m.group(1))
            if 1 <= val <= 100:
                label = "Altcoin Season" if val >= 75 else "Not Altcoin Season" if val <= 25 else "Neutral"
                entities.append({
                    "type": "market_data",
                    "name": "Altcoin Season Index",
                    "content": f"Value: {val}/100 ({label})",
                    "source": "rex-notes.md",
                    "tags": "market_data,sentiment",
                })
        except ValueError:
            pass

    # Key narratives
    for pattern in NARRATIVE_PATTERNS:
        m = pattern.search(today_section)
        if m:
            entities.append({
                "type": "market_data",
                "name": m.group(0),
                "content": f"Active narrative: {m.group(0)}",
                "source": "rex-notes.md",
                "tags": "narrative,macro",
            })

    print(f"  [MARKET] Extracted {len(entities)} market entities from rex-notes.md")
    return entities


def classify_line(line: str, rel_path: str) -> list[dict]:
    """
    Classify a single line into one or more entity dicts.
    rel_path is the relative path from the workspace root (e.g. 'decisions/2026-03.md').
    """
    entities = []
    stripped = line.strip()
    if not stripped or stripped.startswith('#') or stripped.startswith('//'):
        return entities

    tags = []

    # ── DECISIONS ─────────────────────────────────────────────────────────
    # 1. [DECISION] explicit
    for m in DECISION_EXPLICIT.finditer(stripped):
        entities.append({
            "type": "decision",
            "name": m.group(1).strip()[:120],
            "content": stripped[:300],
            "source": rel_path,
            "tags": ""
        })
        break  # one decision per line max

    # 2. PR-### lines (from decisions/*.md files — these ARE decisions)
    for m in PR_LINE.finditer(stripped):
        pr = m.group(1)
        rest = m.group(2).strip()
        is_decision = False
        tags = ["PR"]
        if KELLY_DECIDED.search(stripped):
            is_decision = True
            tags.append("Kelly")
        elif rel_path.startswith("decisions/"):
            # In the decisions file, every PR entry is a decision
            is_decision = True
        if is_decision:
            entities.append({
                "type": "decision",
                "name": f"{pr} — {rest[:80]}".strip(),
                "content": stripped[:300],
                "source": rel_path,
                "tags": ",".join(tags)
            })

    # ── RULES ─────────────────────────────────────────────────────────────
    is_decision_file = rel_path.startswith("decisions/")

    # HARD RULE
    if HARD_RULE.search(stripped):
        # Extract the rule text (everything after HARD RULE)
        rest = HARD_RULE.split(stripped, maxsplit=1)[-1].strip()
        entities.append({
            "type": "rule",
            "name": rest[:100] if rest else stripped[:100],
            "content": stripped[:300],
            "source": rel_path,
            "tags": "HARD_RULE"
        })

    # PR-### line with rule keywords (skip if already captured as a decision)
    for m in PR_LINE.finditer(stripped):
        pr = m.group(1)
        rest = m.group(2).strip()
        if RULE_KEYWORD.search(stripped) and not is_decision_file:
            entities.append({
                "type": "rule",
                "name": f"{pr} — {rest[:80]}".strip(),
                "content": stripped[:300],
                "source": rel_path,
                "tags": "PR,rule-keyword"
            })

    # Non-PR lines with permanent / never / always / must
    if not any(e["type"] == "rule" for e in entities):
        if RULE_KEYWORD.search(stripped) and len(stripped) < 400:
            entities.append({
                "type": "rule",
                "name": stripped[:100],
                "content": stripped[:300],
                "source": rel_path,
                "tags": "rule-keyword"
            })

    # ── BLOCKERS ──────────────────────────────────────────────────────────
    if BLOCKER.search(stripped):
        entities.append({
            "type": "blocker",
            "name": stripped[:100],
            "content": stripped[:300],
            "source": rel_path,
            "tags": ""
        })

    # ── PROJECTS ──────────────────────────────────────────────────────────
    # TASK-XXX
    for m in PROJECT_TASK.finditer(stripped):
        entities.append({
            "type": "project",
            "name": m.group(1),
            "content": stripped[:300],
            "source": rel_path,
            "tags": "task"
        })

    # Rock references
    for m in PROJECT_ROCK.finditer(stripped):
        entities.append({
            "type": "project",
            "name": m.group(0),
            "content": stripped[:300],
            "source": rel_path,
            "tags": "rock"
        })

    # Capitalized initiative/project names (only if not already captured)
    # Skip lines that are just headers or short labels
    if len(stripped) > 20:
        for m in PROJECT_CAPITALIZED.finditer(stripped):
            phrase = m.group(1)
            # Filter out common false positives
            skip = {
                "Last Refreshed", "Updated At", "Table of Contents",
                "No Record", "Memory Checkpoint", "Session Handoff",
                "Monday Morning", "Friday Afternoon",
            }
            if phrase not in skip and len(phrase) > 4:
                # Deduplicate against existing project names in this line
                existing = [e["name"] for e in entities if e["type"] == "project"]
                if phrase not in existing:
                    entities.append({
                        "type": "project",
                        "name": phrase,
                        "content": stripped[:300],
                        "source": rel_path,
                        "tags": "named-initiative"
                    })

    return entities


def process_file(filepath: Path) -> tuple[list[dict], str | None]:
    """Parse a file and return (entities, last_refreshed_or_none)."""
    entities = []
    last_refreshed = None

    try:
        content = filepath.read_text(encoding="utf-8")
    except Exception as e:
        print(f"  [WARN] Could not read {filepath}: {e}", file=sys.stderr)
        return [], None

    last_refreshed = detect_last_refreshed(content)

    # Compute relative path from workspace
    try:
        rel_path = str(filepath.relative_to(WORKSPACE))
    except ValueError:
        rel_path = filepath.name

    # Split into lines, but also catch multi-line code/blockquote blocks
    lines = content.split('\n')
    for line in lines:
        classified = classify_line(line, rel_path)
        entities.extend(classified)

    return entities, last_refreshed


def deduplicate(entities: list[dict]) -> list[dict]:
    """Deduplicate entities by (type, name, source)."""
    seen = set()
    out = []
    for e in entities:
        key = (e["type"], e["name"], e["source"])
        if key not in seen:
            seen.add(key)
            out.append(e)
    return out


def run(backfill: bool = False) -> None:
    print(f"[rex-entity-index] Starting at {datetime.now(timezone.utc).isoformat()}")
    if backfill:
        print("  [--backfill] Full backfill mode — processing all files")

    all_entities = []
    file_refreshes = {}

    for rel_path in ALL_FILES:
        filepath = WORKSPACE / rel_path
        if not filepath.exists():
            print(f"  [SKIP] Not found: {filepath}")
            continue

        print(f"  Processing: {rel_path}")
        entities, last_refreshed = process_file(filepath)
        if last_refreshed:
            file_refreshes[rel_path] = last_refreshed
        all_entities.extend(entities)

    # ── Market data entities ───────────────────────────────────────────────
    market_entities = extract_market_entities()
    all_entities.extend(market_entities)

    # Deduplicate
    raw_entities = list(all_entities)  # keep pre-dedup for frequency counting
    all_entities = deduplicate(all_entities)

    # Score with A-MAC
    scored_entities = score_entities(all_entities, raw_entities)

    # Sort by type then name for readability (after scoring)
    scored_entities.sort(key=lambda e: (e["type"], e["name"]))

    # Write to SQLite
    write_to_sqlite(scored_entities)

    now_iso = datetime.now(timezone.utc).isoformat()

    output = {
        "updated": now_iso,
        "file_refreshes": file_refreshes if file_refreshes else {},
        "entity_count": len(scored_entities),
        "entities": scored_entities
    }

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\n[rex-entity-index] Done.")
    print(f"  Entities extracted: {len(scored_entities)}")
    print(f"  Output: {OUTPUT_FILE}")

    # Summary by type
    from collections import Counter
    by_type = Counter(e["type"] for e in scored_entities)
    for t, count in sorted(by_type.items()):
        print(f"    {t}: {count}")

    # Top 10 by A-MAC score
    top10 = scored_entities[:10]
    print(f"\n  Top 10 entities by A-MAC score:")
    for i, e in enumerate(top10, 1):
        print(f"    {i:2d}. [{e['a_mac_score']:.4f}] {e['type']}: {e['name'][:60]}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Rex entity indexer — pure regex, no LLM.")
    parser.add_argument("--backfill", action="store_true", help="Force full backfill of all files")
    args = parser.parse_args()

    run(backfill=args.backfill)


if __name__ == "__main__":
    main()
