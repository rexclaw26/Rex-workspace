# Technical SEO Checklist — Hit Network 2026
*Sources: Google Search Central, developers.google.com, web.dev — confirmed 2026*

---

## Core Web Vitals — Exact Thresholds

| Metric | Good | Needs Work | Poor | Notes |
|--------|------|-----------|------|-------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5–4.0s | > 4.0s | Hero images, video thumbnails, large text blocks |
| **INP** (Interaction to Next Paint) | < 200ms | 200–500ms | > 500ms | Replaced FID in March 2024 |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1–0.25 | > 0.25 | Layout stability as page loads |

**Measurement rule:** 75th percentile of page loads over 28 days must hit "Good" to pass.
**Search Console:** Core Web Vitals report shows field data — use this, not just lab data.

**Crypto-specific risks:**
- Live price feeds and chart widgets are major INP culprits — defer non-critical scripts
- Ad networks frequently cause CLS — set explicit size reservations for ad slots
- Next.js/React sites: SSR or static generation required — Googlebot renders JS but with delay

---

## Crawlability Requirements

- [ ] Critical content in initial HTML response — not JS-rendered only
- [ ] Googlebot not blocked in robots.txt or WAF/Cloudflare rules
- [ ] All important pages reachable via crawlable HTML links (not JS-only nav)
- [ ] No orphan pages (every indexable page linked from somewhere)
- [ ] Crawl budget: canonicalize price/ticker pages to avoid duplicate content waste

**Crypto-specific:** Price pages, token pages, paginated archives — canonicalize aggressively or noindex thin variants.

---

## XML Sitemap Rules

- UTF-8 encoded XML, max 50,000 URLs per file, max 50MB uncompressed
- Sitemap index file if multiple sitemaps
- Reference in robots.txt: `Sitemap: https://yourdomain.com/sitemap.xml`
- Submit in Google Search Console

**News Sitemap (critical for crypto media):**
Use `<news:news>` extension — tells Google which content is breaking news:
```xml
<news:news>
  <news:publication>
    <news:name>Discover Crypto</news:name>
    <news:language>en</news:language>
  </news:publication>
  <news:publication_date>2026-03-14T08:00:00-08:00</news:publication_date>
  <news:title>Bitcoin ETF Hits Record $5B Daily Volume</news:title>
</news:news>
```
**News sitemap only includes articles published in the last 2 days** — Google ignores older entries.

**Separate sitemaps for:** News articles, evergreen guides, videos, images.

---

## robots.txt Rules

- Accessible at `yourdomain.com/robots.txt`
- Reference sitemap: `Sitemap: https://yourdomain.com/sitemap.xml`
- **Block:** Admin, search result pages, filtered/sorted URL params (`?sort=`, `?filter=`), user account pages, login pages
- **Never block:** CSS and JS files needed for rendering
- **Never block:** Pages you want indexed (obvious but common mistake)
- **Disallow:** Pagination parameters, session IDs, duplicate content URL patterns

---

## Canonical Tags

- `<link rel="canonical" href="https://yourdomain.com/exact-url/" />` on every indexable page
- Self-referencing canonicals on all pages
- Always point to HTTPS version — never HTTP
- Syndicated crypto news: original must be canonical; syndicated version points back to original
- Paginated content: do NOT canonical all pages to page 1 — use proper pagination or noindex beyond page 1
- Crypto-specific: if `/bitcoin-price/` and `/crypto/bitcoin/` are similar, one must canonical to the other

---

## Schema Markup — Priority List for News/Crypto Media

All JSON-LD in `<head>`. Priority order:

**1. NewsArticle (Critical — every news article)**
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Bitcoin ETF Hits Record $5B Daily Volume",
  "image": [
    "https://discovercrypto.com/img/article-16x9.jpg",
    "https://discovercrypto.com/img/article-4x3.jpg",
    "https://discovercrypto.com/img/article-1x1.jpg"
  ],
  "datePublished": "2026-03-14T08:00:00-08:00",
  "dateModified": "2026-03-14T10:30:00-08:00",
  "author": [{"@type": "Person", "name": "Jane Doe", "url": "https://discovercrypto.com/authors/jane-doe"}]
}
```
**Image requirement:** At least 1200px wide, all three ratios (16:9, 4:3, 1:1) specified.

**2. Article** — evergreen guides, explainers
**3. BlogPosting** — opinion/analysis
**4. BreadcrumbList** — every page, site hierarchy
**5. FAQPage** — articles with Q&A sections (generates rich snippets)
**6. VideoObject** — pages embedding YouTube videos
**7. Organization** — homepage only (address, logo, sameAs social links)
**8. Person** — author profile pages (critical for E-E-A-T)

---

## HTTPS Requirements

- HTTPS is a confirmed Google ranking signal
- All resources (images, CSS, JS) must be HTTPS — no mixed content
- HSTS header recommended
- All HTTP URLs → 301 redirect to HTTPS
- Especially critical for YMYL/crypto — security = trust signal

---

## Redirect Handling

- Use 301 (permanent) — never 302 for changed URLs
- **Maximum redirect chain: 3 hops** — more wastes crawl budget and dilutes PageRank
- Flatten chains: if A→B→C, update to A→C directly
- Fix redirect loops
- Previously indexed 404s: 301 to best relevant replacement (or 410 if permanently removed)

---

## Mobile-First Rules

- Google uses mobile-first indexing — the mobile version is what gets ranked
- Responsive design required (not a separate mobile subdomain)
- Mobile speed more critical than desktop — optimize for 4G loads
- Touch targets: minimum 48×48px
- No horizontal scrolling
- Body font: minimum 16px
- **Stat:** Over 70% of crypto searches happen on mobile [Source: SerpWizards 2026]
- Test with Google Mobile-Friendly Test + Search Console mobile CWV field data

---

## SEO Tools

| Tool | Cost | Best for |
|------|------|---------|
| Google Search Console | Free | Index coverage, CWV, manual penalties, real query data |
| Google PageSpeed Insights | Free | CWV diagnosis with specific fix recommendations |
| Ahrefs | $99+/mo | Backlinks, keyword rankings, competitor gap analysis |
| Semrush | $129+/mo | All-in-one: keyword research, technical, content audit |
| Screaming Frog | £259/yr | Full crawl, broken links, schema audit, redirect chains |
| Ahrefs Webmaster Tools | Free | Backlink monitoring for your own domain |
| Google Rich Results Test | Free | Validate schema markup before deploying |
