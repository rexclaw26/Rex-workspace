# Tech Stack Reference

## Frontend (Default)

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 14+ (App Router) | SSR/SSG/ISR as needed |
| Styling | Tailwind CSS | Utility-first, mobile-first |
| Components | shadcn/ui | Accessible, unstyled base |
| Animations | Framer Motion | Subtle, purposeful |
| State | Zustand | Lightweight global state |
| Forms | React Hook Form + Zod | Validation built in |
| Data fetching | TanStack Query | Caching, loading states |
| Icons | Lucide React | Consistent icon library |

## Backend (Default)

| Layer | Choice | Notes |
|-------|--------|-------|
| Runtime | Node.js (TypeScript) | Type safety throughout |
| Framework | Express or Next.js API routes | Keep it in Next.js when possible |
| Auth | NextAuth.js / Clerk | OAuth + JWT handling |
| Database | PostgreSQL + Prisma ORM | Type-safe queries |
| File storage | Cloudflare R2 | S3-compatible, cost-effective |
| Email | Resend | Simple transactional email |

## Dev Tooling

| Tool | Purpose |
|------|---------|
| TypeScript | Type safety — required on all new projects |
| ESLint + Prettier | Code consistency |
| Vitest | Unit testing |
| Playwright | E2E testing |
| Vercel | Deployment (default) |
| GitHub Actions | CI/CD |

## File & Component Naming

- **Components:** PascalCase (`HeroSection.tsx`)
- **Utilities:** camelCase (`formatCurrency.ts`)
- **Pages (App Router):** `app/page-name/page.tsx`
- **API routes:** `app/api/endpoint/route.ts`
- **Imports:** absolute paths via tsconfig (`@/components/...`)

## Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |
| Lighthouse score | 90+ across all categories |

## Commit Message Format

```
type(scope): short description

feat(auth): add JWT refresh token flow
fix(dashboard): correct revenue calculation rounding
docs(api): add endpoint documentation for /sponsors
```
