# Railway Projects Index
_Last updated: 2026-03-27 21:15 PDT_
_Last verified: 2026-03-27 21:12 — clean deploy confirmed from .openclaw source dir_

---

## ⚠️ MANDATORY PRE-CHECK ⚠️

**Before ANY Railway operation (up, logs, restart, status, variables, URL sharing):**
1. Read this file
2. State which service you're targeting by name AND service ID
3. Confirm the service ID matches the table below — NEVER use a service ID from memory alone
4. For URLs: always copy from this table, never construct from memory

**Quick lookup by purpose:**
- Mission Control (ops dashboard) → Service ID: `4f2a644d-030c-443c-9846-116f1615c46f`
- DC Data Hub (market data) → Service ID: `a98ccb85-44f8-49e6-b314-e1d323e3695d`

---

## Active Railway Projects

### Project: dc-data-hub (ONE project, TWO services)
**Railway Project ID:** `02441900-5c37-4d67-a45e-d08f1dcadbb1`
**Railway Dashboard:** https://railway.com/project/02441900-5c37-4d67-a45e-d08f1dcadbb1

> ⚠️ Both services live under the SAME project. The project name "dc-data-hub" is misleading — Mission Control IS deployed here too. Always use the service ID to disambiguate.

| Service | Service ID | Repo Source | GitHub Remote | Deployed URL | Dashboard URL |
|---|---|---|---|---|---|
| **mission-control** | `4f2a644d-030c-443c-9846-116f1615c46f` | `.openclaw/workspace/mission-control/` | `rexclaw26/Rex-workspace` (remote: `rex-workspace`) | https://mission-control-production-b7e2.up.railway.app | https://railway.com/project/02441900-5c37-4d67-a45e-d08f1dcadbb1/service/4f2a644d-030c-443c-9846-116f1615c46f |
| **dc-data-hub** | `a98ccb85-44f8-49e6-b314-e1d323e3695d` | `/Users/rex/dev/dc-data-hub/` | `rexclaw26/dc-data-hub` (remote: `origin`) | https://dc-data-hub-production-cff0.up.railway.app | https://railway.com/project/02441900-5c37-4d67-a45e-d08f1dcadbb1/service/a98ccb85-44f8-49e6-b314-e1d323e3695d |

---

## Repo → Deploy Mapping

| Local Repo | GitHub Remote | Branch | Deploys To |
|---|---|---|---|
| `.openclaw/workspace/mission-control/` | `rex-workspace` → `rexclaw26/Rex-workspace` | `master` | MC service `4f2a644d...` | ✅ Railway CLI linked here as of 2026-03-27 |
| `/Users/rex/dev/dc-data-hub/` | `origin` → `rexclaw26/dc-data-hub` | `main` | DC Hub service `a98ccb85...` |

> ⚠️ `.openclaw/workspace/mission-control/` (capital O in OpenClaw) — this is the working directory Rex uses. The git remote `rex-workspace` is the deploy path for MC. The `origin` remote in this repo points to `openclaw-setup` — NOT for deployment.

---

## Railway CLI Commands

**Verify which project is linked in current directory:**
```bash
railway status
```

**Mission Control (service `4f2a644d...`):**
```bash
railway up --service 4f2a644d-030c-443c-9846-116f1615c46f  # Deploy — only works from /Users/rex/OpenClaw/workspace/mission-control/ (see below)
railway logs --service 4f2a644d-030c-443c-9846-116f1615c46f --tail 20
railway restart --service 4f2a644d-030c-443c-9846-116f1615c46f --yes
railway variables --service 4f2a644d-030c-443c-9846-116f1615c46f
```

**DC Data Hub (service `a98ccb85...`):**
```bash
railway up --service a98ccb85-44f8-49e6-b314-e1d323e3695d
railway logs --service a98ccb85-44f8-49e6-b314-e1d323e3695d --tail 20
railway restart --service a98ccb85-44f8-49e6-b314-e1d323e3695d --yes
railway variables --service a98ccb85-44f8-49e6-b314-e1d323e3695d
```

**⚠️ `railway up` constraint:** Only works from a Railway-linked directory. Currently linked: `/Users/rex/OpenClaw/workspace/mission-control/`. The `.openclaw/` directory is NOT linked — `railway up` will fail or target wrong project from there. Deploy via git push to the correct remote instead (see below).

---

## Deployment Triggers

| Service | Auto-deploy from GitHub? | How to trigger |
|---|---|---|
| MC `4f2a644d...` | YES | `cd .openclaw/workspace/mission-control && git push rex-workspace master` |
| DC Hub `a98ccb85...` | YES | `cd /Users/rex/dev/dc-data-hub && git push origin main` |

If auto-deploy fails or you need a manual rebuild:
1. Push to the correct GitHub remote (see above)
2. If still not deployed after 3 min, ask Kelly to hit **Redeploy** on the Railway dashboard using the service's Dashboard URL from the table above

---

## Local Dev Server Ports

| Service | Local URL | Directory | Note |
|---|---|---|---|
| Mission Control | `http://localhost:3000` | `.openclaw/workspace/mission-control/` | Run `npm run dev` |
| DC Data Hub | `http://localhost:3001` | `/Users/rex/dev/dc-data-hub/` | Run `npm run dev -- -p 3001` |

**Port rule:** MC always port 3000. DC Hub always port 3001. If port 3000 is occupied, MC is down — fix immediately.

---

## Shell Aliases (optional — for Kelly to add to ~/.zshrc)

Kelly: add these to `~/.zshrc` to make Railway commands safe at the CLI layer:
```bash
alias railway-mc='railway --service 4f2a644d-030c-443c-9846-116f1615c46f'
alias railway-dchub='railway --service a98ccb85-44f8-49e6-b314-e1d323e3695d'
alias deploy-mc='cd ~/.openclaw/workspace/mission-control && git push rex-workspace master'
alias deploy-dchub='cd /Users/rex/dev/dc-data-hub && git push origin main'
```
