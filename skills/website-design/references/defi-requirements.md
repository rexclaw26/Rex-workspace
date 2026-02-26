# DeFi Fund Site — Requirements Checklist

## Security

- [ ] No API keys or secrets in client-side code — server-side only
- [ ] All API endpoints rate-limited (recommend: 100 req/min per IP)
- [ ] Input sanitization on all user-submitted fields
- [ ] HTTPS enforced — no HTTP fallback
- [ ] Content Security Policy (CSP) headers configured
- [ ] No wallet private keys ever touched or stored server-side
- [ ] Read-only on-chain data fetching only — no transaction signing on the server
- [ ] Dependency audit before launch (`npm audit` — no high/critical vulnerabilities)

## Compliance Language

- [ ] Investment disclaimer on homepage and any performance data page:
  > *Past performance is not indicative of future results. This is not investment advice. All investments involve risk, including loss of principal.*
- [ ] Accredited investor acknowledgment gate where required
- [ ] Jurisdiction restrictions noted (no US persons if applicable)
- [ ] Legal review required before launch — flag for Kelly to arrange

## Performance Data Display

- [ ] All figures labeled: `ACTUAL` or `PROJECTED`
- [ ] Source and timestamp on every data point
- [ ] No real-time prices without a verified live feed (no hardcoded values)
- [ ] Clear methodology disclosure for any calculated metrics (e.g., APY calculations)

## Design Standards

- [ ] Institutional-grade visual design — clean, minimal, professional
- [ ] No meme imagery, cartoon graphics, or crypto-bro aesthetics
- [ ] Data tables with clear labels and units
- [ ] Mobile-responsive but optimized for desktop (primary audience)
- [ ] Load time < 3s on 4G connection

## Pre-Launch Gate

- [ ] Full security audit completed
- [ ] Legal review completed
- [ ] All disclaimers reviewed and approved by Kelly
- [ ] Performance data verified against source
- [ ] Human approval from Kelly before any public deployment
