# Paper Boy — SKILL.md

_Market data pipeline: ingest, convert, sync DC Hub, sync Mission Control._

---

## TRIGGER CONDITIONS

Load and execute this skill when:
- Cron message: `PAPERBOY_RUN — Run the Paper Boy skill`
- Kelly says: `"run paper boy"` or `"paperboy"`

---

## CONSTANTS

```
MARKET_DIR=/Users/rex/.openclaw/workspace/market-reports
DC_HUB_DIR=/Users/rex/dev/dc-data-hub
STATE_FILE=$MARKET_DIR/paperboy-state.json
LOCK_FILE=$MARKET_DIR/paperboy.lock
SENTINEL_FILE=$MARKET_DIR/.paperboy-active
```

All paths are absolute. Never use relative paths in this skill.

---

## DIVISION OF RESPONSIBILITIES

**Gmail hook** (before Paper Boy cutover):
- Saves raw files to `market-reports/`
- Sends "✅ Market notes received" Telegram
- Runs `update-market-data.sh` ONLY if `.paperboy-active` sentinel does NOT exist

**Paper Boy** (this skill — after cutover):
- All processing: HTML→MD conversion, rex-notes.md update
- DC Hub update + Railway deploy
- Mission Control sync
- State file management
- Telegram summary

---

## CUTOVER PROCEDURE (one-time, do after Paper Boy tested)

1. Deploy Paper Boy skill (done)
2. Run manually: "run paper boy" — verify it works end-to-end
3. `touch /Users/rex/.openclaw/workspace/market-reports/.paperboy-active`
4. Gmail hook will now defer to Paper Boy for all DC Hub/processing work

⚠️ Do NOT create `.paperboy-active` until step 2 is verified.

---

## FULL EXECUTION PIPELINE

Execute all steps in order. Do not skip steps. On error: log, alert, continue unless step is fatal.

---

### STEP 0 — LOCKFILE CHECK

```bash
LOCK_FILE=/Users/rex/.openclaw/workspace/market-reports/paperboy.lock

if [ -f "$LOCK_FILE" ]; then
    LOCK_AGE=$(( $(date +%s) - $(stat -f %m "$LOCK_FILE" 2>/dev/null || echo 0) ))
    if [ "$LOCK_AGE" -lt 900 ]; then
        LOCK_TIME=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$LOCK_FILE" 2>/dev/null || echo "unknown")
        # Send Telegram: "📰 Paper Boy already running (started at $LOCK_TIME). Will check back."
        exit 0
    else
        # Stale lock (>15 min old) — remove and proceed
        rm -f "$LOCK_FILE"
    fi
fi

# Create lock with current timestamp
date -u +"%Y-%m-%dT%H:%M:%SZ" > "$LOCK_FILE"
```

**On Mac (Darwin):** Use `stat -f %m` for mtime. On Linux: use `stat -c %Y`.

After creating lock: all subsequent steps must `rm -f "$LOCK_FILE"` before any `exit` call, or the cleanup at STEP 9 handles it.

---

### STEP 1 — MC STATUS CHECK

```bash
mc_status=$(curl --max-time 3 -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
```

- Store as `mc_status` variable.
- Do NOT exit if MC is down. Track `mc_status` for use in STEP 7 and the Telegram summary.
- `mc_status=200` → MC is up
- `mc_status=000` or any non-2xx → MC is down/unreachable

---

### STEP 2 — DETECT NEW FILES

```bash
TODAY=$(date +%Y-%m-%d)
TODAY_COMPACT=$(date +%Y%m%d)
MARKET_DIR=/Users/rex/.openclaw/workspace/market-reports

STATE_FILE=$MARKET_DIR/paperboy-state.json

# Read state
last_run_date=$(python3 -c "import json,sys; d=json.load(open('$STATE_FILE')); print(d.get('lastRunDate',''))" 2>/dev/null || echo "")
last_status=$(python3 -c "import json,sys; d=json.load(open('$STATE_FILE')); print(d.get('status',''))" 2>/dev/null || echo "")
last_run_time=$(python3 -c "import json,sys; d=json.load(open('$STATE_FILE')); print(d.get('lastRunTime',''))" 2>/dev/null || echo "")
stored_mtime=$(python3 -c "import json,sys; d=json.load(open('$STATE_FILE')); print(d.get('lastMarketNotesModified','') or '')" 2>/dev/null || echo "")

# Check for new HTML report — glob for any MARKET_REPORT HTML with today's date
# Handles all naming conventions: MARKET_REPORT_20260325.html, MARKET_REPORT_2026_0325.html, MARKET_REPORT_2026-03-25.html, etc.
TODAY_YEAR=$(date +%Y)
TODAY_MONTH=$(date +%m)
TODAY_DAY=$(date +%d)
TODAY_COMPACT=$(date +%Y%m%d)
MARKET_DIR=/Users/rex/.openclaw/workspace/market-reports

# Find any HTML file matching today's date in various formats
HTML_MATCH=$(ls $MARKET_DIR/MARKET_REPORT_${TODAY_COMPACT}*.html 2>/dev/null | head -1)
if [ -z "$HTML_MATCH" ]; then
    HTML_MATCH=$(ls $MARKET_DIR/MARKET_REPORT_${TODAY_YEAR}_${TODAY_MONTH}${TODAY_DAY}*.html 2>/dev/null | head -1)
fi
if [ -z "$HTML_MATCH" ]; then
    HTML_MATCH=$(ls $MARKET_DIR/MARKET_REPORT_${TODAY_YEAR}-${TODAY_MONTH}-${TODAY_DAY}*.html 2>/dev/null | head -1)
fi
HTML_FILE="$HTML_MATCH"
MD_FILE="$MARKET_DIR/MARKET_REPORT_${TODAY_COMPACT}.md"
has_new_html=false
if [ -n "$HTML_FILE" ] && [ -f "$HTML_FILE" ] && [ ! -f "$MD_FILE" ]; then
    has_new_html=true
fi

# Check market-notes.md mtime
NOTES_FILE="$MARKET_DIR/market-notes.md"
has_new_notes=false
if [ -f "$NOTES_FILE" ]; then
    actual_mtime=$(stat -f %m "$NOTES_FILE" 2>/dev/null || stat -c %Y "$NOTES_FILE" 2>/dev/null || echo "0")
    if [ "$actual_mtime" != "$stored_mtime" ]; then
        has_new_notes=true
    fi
fi

# Nothing new check
if [ "$has_new_html" = false ] && [ "$has_new_notes" = false ]; then
    if [ "$last_run_date" = "$TODAY" ] && [ "$last_status" = "success" ]; then
        # Send Telegram: "📰 Paper Boy: no new data since $last_run_time"
        rm -f "$LOCK_FILE"
        exit 0
    fi
fi
```

Variables set after this step:
- `has_new_html` (true/false)
- `has_new_notes` (true/false)
- `HTML_FILE`, `MD_FILE`, `NOTES_FILE`
- `actual_mtime` (current mtime of market-notes.md)

---

### STEP 3 — HTML → MD CONVERSION (only if has_new_html=true)

```bash
if [ "$has_new_html" = true ]; then
    python3 - <<'PYEOF'
import sys, os, re

html_path = os.environ.get('HTML_FILE')
md_path = os.environ.get('MD_FILE')

try:
    with open(html_path, 'r', encoding='utf-8', errors='replace') as f:
        html = f.read()
except Exception as e:
    print(f"ERROR reading HTML: {e}", file=sys.stderr)
    sys.exit(1)

# Remove script/style blocks
html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL|re.IGNORECASE)
html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL|re.IGNORECASE)

# Convert common tags to markdown
html = re.sub(r'<h1[^>]*>(.*?)</h1>', r'# \1', html, flags=re.DOTALL|re.IGNORECASE)
html = re.sub(r'<h2[^>]*>(.*?)</h2>', r'## \1', html, flags=re.DOTALL|re.IGNORECASE)
html = re.sub(r'<h3[^>]*>(.*?)</h3>', r'### \1', html, flags=re.DOTALL|re.IGNORECASE)
html = re.sub(r'<h4[^>]*>(.*?)</h4>', r'#### \1', html, flags=re.DOTALL|re.IGNORECASE)
html = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', html, flags=re.DOTALL|re.IGNORECASE)
html = re.sub(r'<b[^>]*>(.*?)</b>', r'**\1**', html, flags=re.DOTALL|re.IGNORECASE)
html = re.sub(r'<em[^>]*>(.*?)</em>', r'*\1*', html, flags=re.DOTALL|re.IGNORECASE)
html = re.sub(r'<i[^>]*>(.*?)</i>', r'*\1*', html, flags=re.DOTALL|re.IGNORECASE)
html = re.sub(r'<li[^>]*>(.*?)</li>', r'- \1', html, flags=re.DOTALL|re.IGNORECASE)
html = re.sub(r'<br\s*/?>', '\n', html, flags=re.IGNORECASE)
html = re.sub(r'<p[^>]*>(.*?)</p>', r'\1\n\n', html, flags=re.DOTALL|re.IGNORECASE)
html = re.sub(r'<a[^>]*href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', r'[\2](\1)', html, flags=re.DOTALL|re.IGNORECASE)
html = re.sub(r'<[^>]+>', '', html)  # strip remaining tags

# Decode HTML entities
import html as html_lib
text = html_lib.unescape(html)

# Normalize whitespace
lines = [line.strip() for line in text.splitlines()]
# Collapse 3+ blank lines to 2
result = []
blank_count = 0
for line in lines:
    if line == '':
        blank_count += 1
        if blank_count <= 2:
            result.append(line)
    else:
        blank_count = 0
        result.append(line)

output = '\n'.join(result).strip() + '\n'

with open(md_path, 'w', encoding='utf-8') as f:
    f.write(output)

print(f"Converted: {len(output)} bytes")
PYEOF

    CONVERSION_EXIT=$?
    if [ $CONVERSION_EXIT -ne 0 ]; then
        html_conversion_status="failed — python3 error"
    else
        # Validate output size
        MD_SIZE=$(wc -c < "$MD_FILE" 2>/dev/null || echo 0)
        if [ "$MD_SIZE" -lt 500 ]; then
            html_conversion_status="failed — output too small (${MD_SIZE} bytes)"
            # Alert Kelly via Telegram: "⚠️ Paper Boy: HTML conversion output too small for $HTML_FILE (${MD_SIZE} bytes). Skipping HTML steps."
            rm -f "$MD_FILE"  # Remove bad output
            has_new_html=false
            # FALLBACK: copy MD from market-notes.md if it has today's data
            if [ -f "$NOTES_FILE" ] && [ ! -f "$MD_FILE" ]; then
                python3 -c "
import sys
notes = open('$NOTES_FILE', 'r', encoding='utf-8', errors='ignore').read()
today = '$TODAY'
marker = '## ' + today
idx = notes.find(marker)
if idx == -1:
    print('FALLBACK: no today section in market-notes.md')
    sys.exit(0)
search_from = idx + len(marker)
next_sec = notes.find('\\n## ', search_from)
next_sec = next_sec if next_sec > -1 else len(notes)
section = notes[idx:next_sec].strip()
with open('$MD_FILE', 'w', encoding='utf-8') as f:
    f.write(section + '\\n')
print(f'FALLBACK: wrote {len(section)} chars from market-notes.md')
"
                if [ -f "$MD_FILE" ]; then
                    MD_SIZE=$(wc -c < "$MD_FILE" 2>/dev/null || echo 0)
                    if [ "$MD_SIZE" -gt 500 ]; then
                        html_conversion_status="fallback-converted"
                    fi
                fi
            fi
        else
            html_conversion_status="converted"
        fi
    fi
else
    if [ -f "$MD_FILE" ]; then
        html_conversion_status="skipped (already exists)"
    else
        html_conversion_status="skipped (no HTML report for today)"
        # FALLBACK: copy MD from market-notes.md if it has today's data
        if [ -f "$NOTES_FILE" ]; then
            python3 -c "
import sys
notes = open('$NOTES_FILE', 'r', encoding='utf-8', errors='ignore').read()
today = '$TODAY'
marker = '## ' + today
idx = notes.find(marker)
if idx == -1:
    print('FALLBACK: no today section in market-notes.md')
    sys.exit(0)
search_from = idx + len(marker)
next_sec = notes.find('\\n## ', search_from)
next_sec = next_sec if next_sec > -1 else len(notes)
section = notes[idx:next_sec].strip()
with open('$MD_FILE', 'w', encoding='utf-8') as f:
    f.write(section + '\\n')
print(f'FALLBACK: wrote {len(section)} chars from market-notes.md')
"
            if [ -f "$MD_FILE" ]; then
                MD_SIZE=$(wc -c < "$MD_FILE" 2>/dev/null || echo 0)
                if [ "$MD_SIZE" -gt 500 ]; then
                    html_conversion_status="fallback-converted"
                fi
            fi
        fi
    fi
fi
```

Export `HTML_FILE` and `MD_FILE` before the python3 heredoc block so os.environ picks them up.

---

### STEP 4 — SYNC DATED BACKUP

```bash
if [ -f "$NOTES_FILE" ]; then
    BACKUP_FILE="$MARKET_DIR/marketnotes_${TODAY}.md"
    cp "$NOTES_FILE" "$BACKUP_FILE"
    notes_backup_status="ok"
else
    notes_backup_status="skipped (market-notes.md not found)"
fi
```

Always overwrite — ensures dated backup matches the current market-notes.md.

---

### STEP 5 — UPDATE REX-NOTES.MD

```bash
REX_NOTES=/Users/rex/.openclaw/workspace/rex-notes.md
TEMP_NOTES="${REX_NOTES}.tmp"

python3 - <<'PYEOF'
import os, re, sys

notes_file = os.environ.get('NOTES_FILE')
rex_notes_path = os.environ.get('REX_NOTES')
temp_path = os.environ.get('TEMP_NOTES')

# Read market-notes.md
try:
    with open(notes_file, 'r', encoding='utf-8') as f:
        market_notes = f.read()
except Exception as e:
    print(f"ERROR: cannot read market-notes.md: {e}", file=sys.stderr)
    sys.exit(1)

# Read rex-notes.md (may not exist yet)
try:
    with open(rex_notes_path, 'r', encoding='utf-8') as f:
        rex_notes = f.read()
except FileNotFoundError:
    rex_notes = ""

# Parse date sections from market-notes.md
# Sections start with ## YYYY-MM-DD
section_pattern = re.compile(r'(^## \d{4}-\d{2}-\d{2}.*?)(?=^## \d{4}-\d{2}-\d{2}|\Z)', re.MULTILINE | re.DOTALL)
new_sections = section_pattern.findall(market_notes)

if not new_sections:
    print("No date sections found in market-notes.md", file=sys.stderr)
    sys.exit(0)

prepend_sections = []
replaced_count = 0
skipped_count = 0

for section in new_sections:
    # Extract date from section header
    date_match = re.match(r'^## (\d{4}-\d{2}-\d{2})', section)
    if not date_match:
        continue
    section_date = date_match.group(1)
    
    # Check if date already exists in rex-notes.md
    existing_pattern = re.compile(
        r'(^## ' + re.escape(section_date) + r'.*?)(?=^## \d{4}-\d{2}-\d{2}|\Z)',
        re.MULTILINE | re.DOTALL
    )
    existing_match = existing_pattern.search(rex_notes)
    
    if existing_match:
        existing_content = existing_match.group(1)
        # Count chars after the header line
        header_end = existing_content.index('\n') + 1 if '\n' in existing_content else len(existing_content)
        content_after_header = existing_content[header_end:].strip()
        
        if len(content_after_header) < 500:
            # Incomplete — replace it
            rex_notes = existing_pattern.sub('', rex_notes)
            prepend_sections.append(section.strip())
            replaced_count += 1
            print(f"⚠️ replaced incomplete section for {section_date} ({len(content_after_header)} chars)")
        else:
            skipped_count += 1
    else:
        # New date — prepend
        prepend_sections.append(section.strip())

# Build new rex-notes.md: prepend new sections at top
if prepend_sections:
    new_content = '\n\n'.join(prepend_sections) + '\n\n' + rex_notes.lstrip()
else:
    new_content = rex_notes

# Write to temp file
with open(temp_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Done: {len(prepend_sections)} added/replaced, {skipped_count} skipped")
PYEOF

REX_NOTES_EXIT=$?
if [ $REX_NOTES_EXIT -ne 0 ]; then
    rex_notes_status="failed"
    # Alert Kelly via Telegram: "⚠️ Paper Boy: rex-notes.md update failed. Check logs."
else
    # Validate temp file (must be non-empty)
    TEMP_SIZE=$(wc -c < "$TEMP_NOTES" 2>/dev/null || echo 0)
    if [ "$TEMP_SIZE" -gt 0 ]; then
        mv "$TEMP_NOTES" "$REX_NOTES"
        rex_notes_status="updated"
    else
        rm -f "$TEMP_NOTES"
        rex_notes_status="failed — empty output"
    fi
fi
```

Export `NOTES_FILE`, `REX_NOTES`, and `TEMP_NOTES` before the heredoc.

---

### STEP 6 — RUN UPDATE SCRIPT (with timeout)

```bash
UPDATE_SCRIPT=/Users/rex/dev/dc-data-hub/scripts/update-market-data.sh

if [ ! -f "$UPDATE_SCRIPT" ]; then
    dchub_status="failed — script not found at $UPDATE_SCRIPT"
else
    timeout 120 bash "$UPDATE_SCRIPT"
    SCRIPT_EXIT=$?
    
    case $SCRIPT_EXIT in
        0)
            dchub_status="deployed"
            ;;
        1)
            dchub_status="failed — validation error (exit 1)"
            # Alert Kelly via Telegram: "⚠️ Paper Boy: DC Hub deploy failed — market data validation error (exit 1). Showing last good data."
            ;;
        124)
            dchub_status="failed — timeout (git push may have hung)"
            # Alert Kelly via Telegram: "⚠️ Paper Boy: DC Hub update timed out after 120s (likely git push). Will retry on next run."
            ;;
        *)
            dchub_status="failed — exit code $SCRIPT_EXIT"
            # Alert Kelly via Telegram: "⚠️ Paper Boy: DC Hub update failed with exit code $SCRIPT_EXIT."
            ;;
    esac
fi
```

---

### STEP 7 — SYNC MISSION CONTROL

```bash
if [ "$mc_status" = "200" ]; then
    mc_sync_response=$(curl --max-time 10 -s -w "\n%{http_code}" -X POST http://localhost:3000/api/headlines/marketnotes 2>/dev/null)
    mc_sync_code=$(echo "$mc_sync_response" | tail -1)
    
    if [ "$mc_sync_code" = "200" ] || [ "$mc_sync_code" = "201" ]; then
        mc_sync_status="synced ✅"
        mc_sync_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    else
        mc_sync_status="failed ❌ (HTTP $mc_sync_code)"
        mc_sync_time=""
    fi
else
    mc_sync_status="skipped ⚠️ (not running)"
    mc_sync_time=""
fi
```

---

### STEP 8 — WRITE STATE FILE (atomic)

```bash
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TODAY=$(date +%Y-%m-%d)

# Determine overall status
if [ "$rex_notes_status" = "updated" ] || [ "$rex_notes_status" = "skipped" ] && [ "$dchub_status" = "deployed" ]; then
    overall_status="success"
elif [ "$dchub_status" = "deployed" ] || [ "$rex_notes_status" = "updated" ]; then
    overall_status="partial"
else
    overall_status="failed"
fi

# Build filesProcessed array
files_processed="[]"
if [ "$has_new_notes" = true ] && [ -n "$actual_mtime" ]; then
    files_processed="[\"market-notes.md@${actual_mtime}\"]"
fi
if [ "$has_new_html" = true ]; then
    html_basename=$(basename "$HTML_FILE")
    files_processed=$(echo "$files_processed" | python3 -c "
import json, sys
arr = json.load(sys.stdin)
arr.append('$html_basename')
print(json.dumps(arr))
")
fi

# Determine last report processed
if [ "$has_new_html" = true ]; then
    last_report=$(basename "$HTML_FILE")
else
    last_report=$(python3 -c "import json; d=json.load(open('$STATE_FILE')); print(d.get('lastReportProcessed') or 'null')" 2>/dev/null || echo "null")
fi

# Write temp state file
python3 - <<PYEOF
import json, os

state = {
    "lastRunDate": "$TODAY",
    "lastRunTime": "$NOW",
    "lastMarketNotesModified": "${actual_mtime}" if "${actual_mtime}" else None,
    "lastReportProcessed": "$last_report" if "$last_report" != "null" else None,
    "filesProcessed": $files_processed,
    "status": "$overall_status",
    "lastMCSync": "${mc_sync_time}" if "${mc_sync_time}" else None,
    "lastTelegramAlert": "$NOW"
}

tmp_path = "$STATE_FILE" + ".tmp"
with open(tmp_path, 'w') as f:
    json.dump(state, f, indent=2)
    f.write('\n')

os.rename(tmp_path, "$STATE_FILE")
print("State file written.")
PYEOF
```

---

### STEP 9 — REMOVE LOCKFILE

```bash
rm -f "$LOCK_FILE"
```

Always run this step. If any earlier step `exit`s early (lock check, no-new-data), it must also remove the lock before exiting.

---

### STEP 10 — SEND TELEGRAM SUMMARY

Send to Kelly (Telegram chat ID: 1011362712):

```
📰 Paper Boy ✅ [YYYY-MM-DD HH:MM PDT]
Market notes: [updated/skipped/failed]
Report [date]: [converted/skipped/failed]
DC Hub: [deployed/failed — reason]
Mission Control: [synced ✅ / skipped ⚠️ (not running) / failed ❌]
```

**Variable mapping:**
- `[YYYY-MM-DD HH:MM PDT]` → current local time at run
- `Market notes:` → `$rex_notes_status`
- `Report [date]:` → use `$TODAY_COMPACT` for the date label, `$html_conversion_status` for the value. If no HTML report today: `Report: no report for today`
- `DC Hub:` → `$dchub_status`
- `Mission Control:` → `$mc_sync_status`

Use the `message` tool with `action: send`, `channel: telegram`, `target: 1011362712`.

---

## ERROR HANDLING SUMMARY

| Step | Failure mode | Action |
|------|-------------|--------|
| 0 | Lock exists, fresh | Telegram alert, exit 0 |
| 0 | Lock exists, stale | Remove lock, continue |
| 2 | No new data + already ran today | Telegram "no new data", exit 0 |
| 3 | HTML conversion fails | Telegram alert, skip HTML, continue |
| 3 | MD output < 500 bytes | Telegram alert, skip HTML, continue |
| 5 | rex-notes.md update fails | Telegram alert, continue |
| 6 | Exit 1 (validation) | Telegram alert, skip deploy, continue |
| 6 | Exit 124 (timeout) | Telegram alert, continue |
| 6 | Other non-zero | Telegram alert with code, continue |
| 7 | MC not running | Log as "skipped (not running)", continue |
| 7 | MC sync HTTP error | Log as "failed", continue |
| 8 | State write fails | Log error, do NOT remove lock until state written |
| 9 | Lock removal | Always run — even on partial/failed runs |

**Never leave the lockfile behind** — every exit path must remove it.

---

## IMPLEMENTATION NOTES FOR REX

When executing this skill:

1. **Use `exec` tool** to run the shell commands. Keep each step as a discrete exec call for easy debugging.
2. **Export variables** between steps — shell heredocs need env vars exported before they're used.
3. **Python3 heredocs** — the inline python3 scripts handle JSON and text parsing. Pass values via environment variables, not string interpolation inside the heredoc.
4. **Telegram alerts mid-pipeline** — use the `message` tool immediately when an alert is needed. Don't batch mid-run alerts into the final summary.
5. **macOS stat syntax** — use `stat -f %m` for mtime on macOS (Darwin). The pipeline runs on macOS.
6. **Atomic writes** — always write temp file then `mv`/`os.rename`. Never write state directly.
7. **Log verbose output** — print step results to stdout as you go. This appears in exec output and aids debugging.

---

## DEPENDENCIES

- `python3` (system) — HTML parsing, JSON state management, rex-notes.md parsing
- `curl` — MC status check and MC sync
- `bash` + `timeout` — update script execution
- `stat` — file mtime checking (macOS: `stat -f %m`)
- `cp`, `mv`, `rm` — file management

All dependencies are standard macOS system tools. No pip installs required.

---

## RELATED FILES

| File | Purpose |
|------|---------|
| `market-reports/paperboy-state.json` | Run state / idempotency tracker |
| `market-reports/paperboy.lock` | Concurrent run prevention |
| `market-reports/.paperboy-active` | Sentinel: tells Gmail hook Paper Boy is active |
| `market-reports/market-notes.md` | Kelly's raw market notes (source of truth) |
| `market-reports/marketnotes_YYYY-MM-DD.md` | Dated backup of market-notes.md |
| `market-reports/MARKET_REPORT_YYYYMMDD.html` | Raw HTML market report from Kelly |
| `market-reports/MARKET_REPORT_YYYYMMDD.md` | Converted markdown market report |
| `rex-notes.md` | Rex's canonical normalized market notes |
| `/Users/rex/dev/dc-data-hub/scripts/update-market-data.sh` | DC Hub update + Railway deploy script |
