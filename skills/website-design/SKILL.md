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
2. **Build incrementally:** scaffold → core functionality → styling → testing
3. **Documentation:** README, component docs, API docs — required for every project
4. **Version control:** clear commit messages describing each change

**Deliver at each stage:**
- What was built
- What still needs to be done
- Any blockers or decisions needed from Kelly
- Dependencies or integrations that need verification (flag, don't assume)

---

## Anti-Hallucination

Never claim code works without testing it. Flag any dependencies or API integrations that need verification before going to production. If a library or API behavior is uncertain, say so and propose how to verify.
