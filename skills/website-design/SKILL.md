---
name: website-design
description: Full-stack website design and development for Rex. Builds frontend, backend, landing pages, and web applications for Hit Network, Discover Crypto, Blockchain Basement, and DeFi fund sites. Trigger on "build a page", "website design", "frontend", "backend", "landing page", "build me a site", or any web development request. Defaults to React/Next.js + Tailwind CSS. Proposes architecture first, builds incrementally, includes documentation.
---

# Website Design (Full-Stack)

**Trigger:** "Build a page," "website design," "frontend," "backend," "landing page"

---

## 1. Design & Frontend

**Default stack:** React / Next.js + Tailwind CSS (specify alternatives if needed)

Standards for every build:
- Follow Hit Network brand guidelines: colors, fonts, imagery style
- **Mobile-first** responsive design — always
- **Accessibility:** proper heading hierarchy, alt text, keyboard navigation (WCAG 2.1 AA minimum)
- **Performance:** optimize images, minimize bundle size, lazy loading, Core Web Vitals target

See [tech-stack.md](references/tech-stack.md) for component patterns, naming conventions, and tooling.

---

## 2. Backend Development

**Default stack:** Node.js / Python (choose based on use case and existing infrastructure)

Standards:
- RESTful API design with clear endpoint documentation
- Authentication: JWT or OAuth (specify requirement)
- Database: schema design with data validation before any writes
- Error handling: graceful failures with user-friendly messages — no raw stack traces to frontend

---

## 3. DeFi Fund Site Specifics

Extra requirements for any site handling fund or investment data:
- **Security-first:** no exposed API keys, rate limiting on all endpoints, input sanitization
- **Compliance language:** proper disclaimers, accredited investor requirements on relevant pages
- **Design standard:** institutional-grade — professional, not crypto-bro aesthetics
- **Performance data:** must be clearly sourced and timestamped on every display

See [defi-requirements.md](references/defi-requirements.md) for full compliance and security checklist.

---

## 4. Development Workflow

1. **Propose architecture and component structure first** — get approval before building

**⏸ ARCHITECTURE GATE — fires before every build starts:**
```
⚙️ ARCHITECTURE GATE — Website Design
⏸ Architecture and component structure presented below.
Build will NOT begin until Kelly approves this design.
Reply "approved" or provide changes.
LAW 6 │ Human Approval: ⏸ HOLDING — no code written until architecture confirmed
```

**⏸ DEPLOYMENT GATE — fires before any production push:**
```
⚙️ DEPLOYMENT GATE — Website Design
LAW 6 │ Human Approval: ⏸ HOLDING — built and tested locally. Not deploying until Kelly approves.
```
2. **Build incrementally:** scaffold → core functionality → styling → testing
3. **Documentation:** README, component docs, API docs — required for every project
4. **Version control:** clear commit messages describing each change

**Deliver at each stage:**
- What was built
- What still needs to be done
- Any blockers or decisions needed from Kelly
- Dependencies or integrations that need verification (flag, don't assume)

---

## Hierarchy Rule — UI Design Skills

For Hit Network builds, use skills in this order:

| Skill | Role | When to use |
|-------|------|-------------|
| **website-design** (this skill) | PRIMARY | All full-stack builds — frontend + backend + APIs + DeFi sites. Architecture gate + deployment gate required. |
| **frontend-design-ultimate** | SECONDARY | High-visual static sites only (landing pages, portfolios, marketing microsites). Routes through this skill's deployment gate before going live. |
| **superdesign** | REFERENCE ONLY | Design guidelines, theme systems, component patterns. Not a builder — do not use to generate production code. Load for design direction, then execute with website-design. |

**Default rule:** When in doubt, use website-design. It has the most complete enforcement, the fullest gates, and the most Hit Network context baked in.

---

## Anti-Hallucination

Never claim code works without testing it. Flag any dependencies or API integrations that need verification before going to production. If a library or API behavior is uncertain, say so and propose how to verify.
