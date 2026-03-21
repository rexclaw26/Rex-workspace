# Crypto Data Hub — Design & Architecture Specification

**Version:** 1.0  
**Date:** 2026-03-21  
**Status:** Ready for Development  
**Stack:** Next.js 16, React 19, Tailwind CSS, TypeScript (strict)  
**Theme:** Dark navy (#0a0f1e) + orange accent (#f97316)

---

## 1. DESIGN TOKENS (Tailwind Values)

### Color Palette

| Name | Tailwind | Usage |
|------|----------|-------|
| **Navy Base** | `bg-[#0a0f1e]` | Page background, primary surface |
| **Navy Secondary** | `bg-[#0f1424]` | Slightly lighter layer for elevation |
| **Navy Tertiary** | `bg-[#131b2e]` | Card backgrounds, subtle depth |
| **Orange Accent** | `#f97316` | CTA buttons, active states, highlights |
| **Orange Alt** | `text-orange-400` | Text accent, links |
| **Border Light** | `border-slate-700/40` | Card borders, dividers |
| **Border Medium** | `border-slate-600/60` | Focus states |
| **Text Primary** | `text-slate-100` | Body text, headlines |
| **Text Secondary** | `text-slate-400` | Metadata, secondary info |
| **Text Tertiary** | `text-slate-500` | Disabled, placeholder |

### Spacing (Tailwind scale)
- Compact: `px-3 py-2` (inputs, small buttons)
- Standard: `px-4 py-3` (cards, medium elements)
- Spacious: `px-6 py-4` (section headers, large containers)

### Typography

| Element | Classes | Line Height |
|---------|---------|-------------|
| **H1 (page title)** | `text-3xl md:text-4xl font-bold text-slate-100` | `leading-tight` |
| **H2 (section title)** | `text-2xl font-semibold text-slate-100` | `leading-snug` |
| **H3 (card title)** | `text-lg font-semibold text-slate-100` | `leading-snug` |
| **Body (standard)** | `text-sm md:text-base text-slate-400` | `leading-relaxed` |
| **Label (input)** | `text-xs font-medium text-slate-300 uppercase tracking-wide` | `leading-tight` |
| **Metadata** | `text-xs text-slate-500` | `leading-tight` |

### Shadows & Effects

| Name | Classes |
|------|---------|
| **Card shadow** | `shadow-lg shadow-black/30` |
| **Hover lift** | `transition-all duration-200 hover:shadow-xl hover:shadow-black/50` |
| **Focus ring** | `ring-1 ring-orange-500/50 ring-offset-2 ring-offset-[#0a0f1e]` |

### State Colors

| State | Background | Text | Border |
|-------|-----------|------|--------|
| **Success** | `bg-emerald-500/20` | `text-emerald-400` | `border-emerald-500/35` |
| **Warning** | `bg-yellow-500/15` | `text-yellow-400` | `border-yellow-500/25` |
| **Error** | `bg-red-500/20` | `text-red-400` | `border-red-500/35` |
| **Disabled** | `bg-slate-900/40` | `text-slate-500` | `border-slate-700/20` |

---

## 2. AUTH GATE PAGE (`/pages/auth-gate.tsx`)

### Visual Layout

```
┌─────────────────────────────────────────┐
│                                         │
│          DISCOVER CRYPTO                │  (Logo + brand, center)
│          Data Hub                       │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  Authentication Required            ││  (H3, center, slate-100)
│  │                                     ││
│  │  Enter password or invite code      ││  (Body text, center, slate-400)
│  │                                     ││
│  │  ┌───────────────────────────────┐ ││
│  │  │ Password / Invite Code        │ ││  (Input, type="password")
│  │  └───────────────────────────────┘ ││
│  │                                     ││
│  │  [ UNLOCK ACCESS ]                  ││  (Button, full width)
│  │                                     ││
│  │  ❌ Incorrect. Try again.           ││  (Error state, red)
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  Need invite code? Contact support.    │  (Footer, slate-500)
│                                         │
└─────────────────────────────────────────┘
```

### HTML Structure

```html
<div class="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
  <div class="w-full max-w-md">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="flex justify-center mb-4">
        <svg class="w-12 h-12 text-orange-400"><!-- Logo --></svg>
      </div>
      <h1 class="text-2xl font-bold text-slate-100 mb-1">Discover Crypto</h1>
      <p class="text-sm text-slate-400">Data Hub</p>
    </div>

    <!-- Form Card -->
    <div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-6 shadow-lg shadow-black/30">
      <h2 class="text-xl font-semibold text-slate-100 text-center mb-2">
        Authentication Required
      </h2>
      <p class="text-sm text-slate-400 text-center mb-6">
        Enter password or invite code
      </p>

      <!-- Input -->
      <input
        type="password"
        placeholder="Password or code"
        class="w-full bg-[#0f1424] border border-slate-700/40 rounded px-4 py-3
                text-slate-100 placeholder-slate-500
                focus:outline-none focus:ring-1 focus:ring-orange-500/50
                focus:border-orange-500/50
                mb-4"
      />

      <!-- Button -->
      <button class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold
                     py-3 rounded transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-orange-400">
        Unlock Access
      </button>

      <!-- Error Message (conditional) -->
      <div class="mt-4 p-3 bg-red-500/20 border border-red-500/35 rounded">
        <p class="text-sm text-red-400">Incorrect. Try again.</p>
      </div>
    </div>

    <!-- Footer -->
    <p class="text-xs text-slate-500 text-center mt-6">
      Need invite code? Contact support.
    </p>
  </div>
</div>
```

### Functionality

- **Input validation:** Accept 32-char alphanumeric invite codes OR password `dcgodmode26`
- **localStorage persistence:** On successful auth, set `localStorage['dc_auth_token'] = 'authenticated'` with 30-day expiry timestamp
- **Error handling:** Show "Incorrect. Try again." for invalid input; auto-focus input after error
- **Rate limiting:** Max 5 attempts per 60 seconds; show "Try again in X seconds" after limit hit
- **Copy for UI:**
  - Logo: "DISCOVER CRYPTO"
  - Tagline: "Data Hub"
  - Form title: "Authentication Required"
  - Placeholder: "Password or code"
  - Button: "UNLOCK ACCESS"
  - Error: "Incorrect. Try again."
  - Footer: "Need invite code? Contact support."

---

## 3. HOME PAGE — PREVIEW CARD GRID (`/pages/index.tsx`)

### Header Spec

```html
<div class="bg-[#0a0f1e] border-b border-slate-700/40 sticky top-0 z-40">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="flex items-center justify-between">
      <!-- Left: Logo + Title -->
      <div class="flex items-center gap-4">
        <svg class="w-8 h-8 text-orange-400"><!-- Logo --></svg>
        <div>
          <h1 class="text-2xl font-bold text-slate-100">Discover Crypto</h1>
          <p class="text-xs text-slate-400">Live market intelligence</p>
        </div>
      </div>

      <!-- Right: Status + Refresh -->
      <div class="flex items-center gap-4">
        <div class="text-right text-xs text-slate-500">
          <p>Last updated</p>
          <p class="text-slate-400 font-mono">2 min ago</p>
        </div>
        <button class="p-2 rounded hover:bg-slate-800/40 transition-colors">
          <svg class="w-5 h-5 text-orange-400 animate-spin"><!-- Refresh icon --></svg>
        </button>
      </div>
    </div>
  </div>
</div>
```

### Grid Layout

```css
/* Responsive grid */
@apply grid gap-4 p-4 md:p-6
md:grid-cols-2
lg:grid-cols-3
xl:grid-cols-4
```

**Breakpoints:**
- Mobile (< 640px): 1 column
- sm (640px+): 2 columns
- lg (1024px+): 3 columns
- xl (1280px+): 4 columns

### Card Anatomy

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4 
            shadow-lg shadow-black/30
            hover:shadow-xl hover:shadow-black/50
            hover:border-orange-500/20
            transition-all duration-200 cursor-pointer">
  
  <!-- Card Header (if needed) -->
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-sm font-semibold text-slate-100">Card Title</h3>
    <span class="text-xs text-slate-500">Context</span>
  </div>

  <!-- Card Content (varies by card type) -->
  <div class="space-y-2">
    <!-- Content goes here -->
  </div>

</div>
```

### 12 Preview Cards — Exact Data Structure

#### Card 1: Fear & Greed Index

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4">
  <p class="text-xs text-slate-500 mb-3">Fear & Greed Index</p>
  
  <div class="text-center">
    <p class="text-5xl font-bold text-orange-400 mb-1">72</p>
    <p class="text-sm text-slate-300 mb-4">Greed</p>
  </div>

  <div class="border-t border-slate-700/40 pt-3">
    <p class="text-xs text-slate-500">BTC Dominance</p>
    <p class="text-lg font-semibold text-slate-100">48.2%</p>
  </div>
</div>
```

**Data source:** `/api/fear-greed` → returns `{ score: number, label: string, btcDominance: number }`

---

#### Card 2: Top Prices

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4">
  <p class="text-xs text-slate-500 mb-4">Top Prices</p>

  <div class="space-y-3">
    <!-- Bitcoin -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs text-slate-400">Bitcoin</p>
        <p class="text-lg font-semibold text-slate-100">$95,420</p>
      </div>
      <span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">
        +3.2%
      </span>
    </div>

    <!-- Ethereum -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs text-slate-400">Ethereum</p>
        <p class="text-lg font-semibold text-slate-100">$3,850</p>
      </div>
      <span class="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
        -1.1%
      </span>
    </div>
  </div>
</div>
```

**Data source:** `/api/top-prices` → returns `{ btc: { price, change24h }, eth: { price, change24h } }`

---

#### Card 3: Watching This Week

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4">
  <p class="text-xs text-slate-500 mb-4">Watching This Week</p>

  <div class="space-y-3">
    <!-- Ticker 1 -->
    <div>
      <p class="text-sm font-semibold text-slate-100">SOL</p>
      <p class="text-xs text-slate-400">Solana breakout watch</p>
    </div>

    <!-- Ticker 2 -->
    <div>
      <p class="text-sm font-semibold text-slate-100">AEVO</p>
      <p class="text-xs text-slate-400">Options volume spike</p>
    </div>
  </div>
</div>
```

**Data source:** `/api/watching-week` → returns `[{ symbol: string, reason: string }]` (limit 2)

---

#### Card 4: Liquidations

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4">
  <p class="text-xs text-slate-500 mb-4">24h Liquidations</p>

  <div class="text-center">
    <p class="text-3xl font-bold text-slate-100 mb-2">$342M</p>
    <div class="flex items-center justify-center gap-2">
      <svg class="w-4 h-4 text-red-400"><!-- Down arrow --></svg>
      <span class="text-sm text-red-400">Long bias</span>
    </div>
  </div>
</div>
```

**Data source:** `/api/liquidations` → returns `{ total: number, direction: 'long' | 'short' }`

---

#### Card 5: On-Chain Signals

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4">
  <p class="text-xs text-slate-500 mb-4">On-Chain Signals</p>

  <div class="space-y-3">
    <!-- Signal 1 -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-slate-300">Whale accumulation</p>
      <span class="text-xs font-mono text-emerald-400">STRONG</span>
    </div>

    <!-- Signal 2 -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-slate-300">Exchange inflow</p>
      <span class="text-xs font-mono text-red-400">HIGH</span>
    </div>
  </div>
</div>
```

**Data source:** `/api/on-chain-signals` → returns `[{ name: string, value: string }]` (limit 2)

---

#### Card 6: Institutional BTC

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4">
  <p class="text-xs text-slate-500 mb-4">Institutional BTC</p>

  <div class="space-y-4">
    <div>
      <p class="text-xs text-slate-400 mb-1">Total Held</p>
      <p class="text-2xl font-bold text-slate-100">1,247,500 BTC</p>
    </div>
    <div>
      <p class="text-xs text-slate-400 mb-1">Unique Holders</p>
      <p class="text-xl font-semibold text-slate-100">847</p>
    </div>
  </div>
</div>
```

**Data source:** `/api/institutional-btc` → returns `{ totalBtc: number, holders: number }`

---

#### Card 7: Bull/Bear Score

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4">
  <p class="text-xs text-slate-500 mb-4">Bull/Bear Score</p>

  <div class="space-y-2">
    <!-- Macro -->
    <div class="flex items-center gap-3">
      <span class="w-4 h-4 rounded-full bg-emerald-500/50"></span>
      <span class="text-sm text-slate-300">Macro</span>
    </div>

    <!-- Mid-term -->
    <div class="flex items-center gap-3">
      <span class="w-4 h-4 rounded-full bg-yellow-500/50"></span>
      <span class="text-sm text-slate-300">Mid-term</span>
    </div>

    <!-- Short-term -->
    <div class="flex items-center gap-3">
      <span class="w-4 h-4 rounded-full bg-red-500/50"></span>
      <span class="text-sm text-slate-300">Short-term</span>
    </div>
  </div>
</div>
```

**Data source:** `/api/bull-bear-score` → returns `{ macro: 'bullish'|'bearish'|'neutral', midTerm: string, shortTerm: string }`

---

#### Card 8: Top Headlines

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4">
  <p class="text-xs text-slate-500 mb-4">Top Headlines</p>

  <div class="space-y-3">
    <a href="#" class="block hover:text-orange-400 transition-colors">
      <p class="text-sm text-slate-300 line-clamp-1 hover:text-orange-400">
        SEC approves spot bitcoin ETF expansion...
      </p>
      <p class="text-xs text-slate-500">Reuters · 2h ago</p>
    </a>

    <a href="#" class="block hover:text-orange-400 transition-colors">
      <p class="text-sm text-slate-300 line-clamp-1 hover:text-orange-400">
        Ethereum layer-2 volumes hit new ATH...
      </p>
      <p class="text-xs text-slate-500">Cointelegraph · 4h ago</p>
    </a>

    <a href="#" class="block hover:text-orange-400 transition-colors">
      <p class="text-sm text-slate-300 line-clamp-1 hover:text-orange-400">
        BlackRock bitcoin holdings exceed $5B...
      </p>
      <p class="text-xs text-slate-500">CoinDesk · 6h ago</p>
    </a>
  </div>
</div>
```

**Data source:** `/api/headlines` → returns `[{ title: string, source: string, publishedAt: ISO string }]` (limit 3)

---

#### Card 9: X Feed

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4">
  <p class="text-xs text-slate-500 mb-4">X Feed</p>

  <div class="space-y-3">
    <a href="https://x.com/..." target="_blank" class="block hover:bg-slate-800/40 rounded p-2 transition-colors">
      <p class="text-xs text-slate-400 mb-1">@aantonop</p>
      <p class="text-sm text-slate-300 line-clamp-3 mb-2">
        Bitcoin adoption curve accelerating. The network effect...
      </p>
      <p class="text-xs text-orange-400">View on X →</p>
    </a>

    <a href="https://x.com/..." target="_blank" class="block hover:bg-slate-800/40 rounded p-2 transition-colors">
      <p class="text-xs text-slate-400 mb-1">@TheCryptoJew</p>
      <p class="text-sm text-slate-300 line-clamp-3 mb-2">
        Macro setup getting interesting. Fed pause signaling...
      </p>
      <p class="text-xs text-orange-400">View on X →</p>
    </a>

    <a href="https://x.com/..." target="_blank" class="block hover:bg-slate-800/40 rounded p-2 transition-colors">
      <p class="text-xs text-slate-400 mb-1">@hasufl</p>
      <p class="text-sm text-slate-300 line-clamp-3 mb-2">
        Ethereum Dencun impact on scaling = game changer...
      </p>
      <p class="text-xs text-orange-400">View on X →</p>
    </a>
  </div>
</div>
```

**Data source:** `/api/x-feed` → returns `[{ author: string, text: string, url: string, createdAt: ISO string }]` (limit 3)  
**NO rewrite button.** Display only.

---

#### Card 10: Market Drivers

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4">
  <p class="text-xs text-slate-500 mb-4">Market Drivers</p>

  <div class="grid grid-cols-2 gap-3">
    <div>
      <p class="text-xs text-slate-400">BTC</p>
      <p class="text-lg font-semibold text-slate-100">$95,420</p>
    </div>
    <div>
      <p class="text-xs text-slate-400">ETH</p>
      <p class="text-lg font-semibold text-slate-100">$3,850</p>
    </div>
    <div>
      <p class="text-xs text-slate-400">SPX</p>
      <p class="text-lg font-semibold text-slate-100">6,142</p>
    </div>
    <div>
      <p class="text-xs text-slate-400">GOLD</p>
      <p class="text-lg font-semibold text-slate-100">$2,184</p>
    </div>
  </div>
</div>
```

**Data source:** `/api/market-drivers` → returns `{ btc: number, eth: number, spx: number, gold: number }`

---

#### Card 11: Nansen Intelligence

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4 opacity-60 cursor-not-allowed">
  <div class="flex items-center gap-2 mb-3">
    <p class="text-xs text-slate-500">Nansen Intelligence</p>
    <span class="px-2 py-1 bg-slate-700/40 text-slate-400 text-xs rounded font-semibold">
      Coming Soon
    </span>
  </div>

  <p class="text-sm text-slate-400">
    Advanced on-chain portfolio tracking and flow analysis.
  </p>
</div>
```

---

#### Card 12: Wallet Lookup

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4 opacity-60 cursor-not-allowed">
  <div class="flex items-center gap-2 mb-3">
    <p class="text-xs text-slate-500">Wallet Lookup</p>
    <span class="px-2 py-1 bg-slate-700/40 text-slate-400 text-xs rounded font-semibold">
      Coming Soon
    </span>
  </div>

  <p class="text-sm text-slate-400">
    Paste any wallet address to analyze holdings and activity.
  </p>
</div>
```

---

### Loading Skeleton Spec

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4 animate-pulse">
  <div class="h-4 bg-slate-700/50 rounded w-24 mb-4"></div>
  <div class="h-8 bg-slate-700/50 rounded mb-2"></div>
  <div class="h-6 bg-slate-700/50 rounded w-32"></div>
</div>
```

**Apply to each card during `/api/*` fetch.** Replace content with 3 skeleton lines of varying widths.

### Error State Spec

```html
<div class="bg-[#131b2e] border border-red-500/35 rounded-lg p-4">
  <div class="text-center">
    <svg class="w-8 h-8 text-red-400 mx-auto mb-2"><!-- Alert icon --></svg>
    <p class="text-sm text-red-400 mb-2">Failed to load data</p>
    <button class="text-xs text-orange-400 hover:text-orange-300">Retry</button>
  </div>
</div>
```

**Show on API error.** Include retry button with `onClick` to refetch that card's data.

---

## 4. SECTION PAGE SHELL (`/pages/sections/[slug].tsx`)

### Template

```html
<div class="min-h-screen bg-[#0a0f1e]">
  <!-- Header with back button -->
  <div class="bg-[#0a0f1e] border-b border-slate-700/40 sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- Back Button -->
          <a href="/" class="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors">
            <svg class="w-5 h-5">← Chevron left --></svg>
            <span class="text-sm">Dashboard</span>
          </a>
        </div>

        <!-- Status -->
        <div class="text-right text-xs text-slate-500">
          <p>Last updated</p>
          <p class="text-slate-400 font-mono">2 min ago</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Section title injected per route -->
    <h1 class="text-3xl font-bold text-slate-100 mb-8">{title}</h1>

    <!-- Content area — components vary by section -->
    <div>{children}</div>
  </div>
</div>
```

**Route structure:** `/sections/headlines`, `/sections/x-feed`, etc.  
**Title:** Passed via Next.js route params → capitalize and format as "Headlines", "X Feed", etc.

---

## 5. HEADLINES SECTION (`/pages/sections/headlines.tsx`)

### Relevance Scoring Algorithm

```typescript
const RELEVANCE_SCORES = {
  9: ['bitcoin', 'btc', 'ethereum', 'eth', 'blackrock', 'sec', 'etf', 'crash', 'hack', 'exploit', 'federal reserve', 'rate'],
  6: ['defi', 'solana', 'institutional', 'regulation', 'legislation', 'macro', 'inflation', 'whale'],
  3: ['altcoin', 'market', 'crypto', 'blockchain', 'nft'],
  1: ['*'] // default
};

// Score calculation (case-insensitive, per title)
function scoreHeadline(title: string): number {
  const lower = title.toLowerCase();
  for (const [score, keywords] of Object.entries(RELEVANCE_SCORES)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return parseInt(score);
      }
    }
  }
  return 1;
}
```

### Category Auto-Tagging

```typescript
const CATEGORY_MAP: Record<string, string[]> = {
  'Bitcoin': ['bitcoin', 'btc'],
  'Ethereum': ['ethereum', 'eth'],
  'Legislation': ['sec', 'regulation', 'legislation', 'bill', 'congress'],
  'Macro': ['fed', 'federal reserve', 'inflation', 'gdp', 'recession', 'macro'],
  'Institutional': ['blackrock', 'fidelity', 'institutional', 'etf'],
  'Geopolitical': ['war', 'geopolit', 'iran', 'ukraine', 'sanctions'],
  'DeFi': ['defi', 'protocol', 'yield', 'liquidity'],
  'Solana': ['solana', 'sol'],
  'Markets': ['*'] // default
};

function categorizeHeadline(title: string): string {
  const lower = title.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return category;
    }
  }
  return 'Markets';
}
```

### Category Badge Styles

```typescript
const CATEGORY_STYLES = {
  'Bitcoin': 'bg-orange-500/20 text-orange-400 border border-orange-500/35',
  'Ethereum': 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  'Macro': 'bg-red-500/15 text-red-300 border border-red-400/30',
  'Institutional': 'bg-purple-500/20 text-purple-300 border border-purple-500/35',
  'Legislation': 'bg-violet-500/15 text-violet-300 border border-violet-400/25',
  'Geopolitical': 'bg-rose-500/15 text-rose-300 border border-rose-400/25',
  'DeFi': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'Solana': 'bg-green-500/15 text-green-400 border border-green-500/25',
  'Markets': 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
};
```

### Filter Bar

```html
<div class="mb-6 flex gap-2 overflow-x-auto pb-2">
  <!-- "All" pill (active by default) -->
  <button class="px-4 py-2 rounded-full text-sm font-medium
                 bg-orange-500 text-white whitespace-nowrap
                 hover:bg-orange-600 transition-colors">
    All
  </button>

  <!-- Category pills (inactive) -->
  <button class="px-4 py-2 rounded-full text-sm font-medium
                 bg-slate-900/40 text-slate-300 whitespace-nowrap
                 hover:bg-slate-800/60 transition-colors">
    Bitcoin
  </button>

  <button class="px-4 py-2 rounded-full text-sm font-medium
                 bg-slate-900/40 text-slate-300 whitespace-nowrap
                 hover:bg-slate-800/60 transition-colors">
    Macro
  </button>

  <!-- ... repeat for all 9 categories ... -->
</div>
```

**Behavior:** Click pill → filter headlines by that category. Click "All" to reset.

### Sort Controls

```html
<div class="mb-4 flex items-center gap-4">
  <!-- Sort toggle -->
  <div class="flex gap-1 bg-slate-900/40 rounded-lg p-1">
    <button class="px-3 py-1 text-xs font-medium text-orange-400 bg-slate-800 rounded transition-colors">
      Relevance
    </button>
    <button class="px-3 py-1 text-xs font-medium text-slate-400 hover:text-slate-300 transition-colors">
      Latest
    </button>
  </div>

  <!-- Result count -->
  <p class="text-xs text-slate-500">42 headlines</p>
</div>
```

**Logic:** "Relevance" sorts by `scoreHeadline()` desc. "Latest" sorts by `publishedAt` desc.

### Headline Card

```html
<div class="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4
            hover:border-orange-500/20 hover:shadow-lg hover:shadow-black/50
            transition-all duration-200 cursor-pointer">

  <!-- Title + Relevance Dot -->
  <div class="flex items-start gap-3 mb-3">
    <div class="flex-1">
      <p class="text-sm font-semibold text-slate-100 line-clamp-2 hover:text-orange-400">
        SEC signals approval of spot bitcoin ETF expansion to other assets
      </p>
    </div>
    <!-- Relevance dot: green (8+), yellow (5-7), gray (<5) -->
    <span class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-emerald-500"></span>
  </div>

  <!-- Category badge -->
  <div class="mb-3">
    <span class="px-2 py-1 text-xs font-medium rounded border
                 bg-orange-500/20 text-orange-400 border-orange-500/35">
      Bitcoin
    </span>
  </div>

  <!-- Metadata -->
  <div class="flex items-center justify-between text-xs text-slate-500">
    <p>Reuters</p>
    <p>2 hours ago</p>
  </div>
</div>
```

---

## 6. X FEED SECTION (`/pages/sections/x-feed.tsx`)

### Layout

```html
<div class="max-w-2xl">
  <!-- Search input -->
  <div class="mb-6">
    <input
      type="text"
      placeholder="Search posts by keyword..."
      class="w-full bg-[#131b2e] border border-slate-700/40 rounded px-4 py-3
              text-slate-100 placeholder-slate-500
              focus:outline-none focus:ring-1 focus:ring-orange-500/50
              focus:border-orange-500/50"
    />
  </div>

  <!-- Posts list -->
  <div class="space-y-4">
    <!-- Posts render here -->
  </div>

  <!-- Empty state (when search yields no results) -->
  <div class="text-center py-12">
    <p class="text-slate-400">No posts match your search.</p>
  </div>
</div>
```

### Post Card

```html
<a href="https://x.com/username/status/..." target="_blank"
   class="block bg-[#131b2e] border border-slate-700/40 rounded-lg p-4
          hover:border-orange-500/20 hover:shadow-lg hover:shadow-black/50
          transition-all duration-200">

  <!-- Author + timestamp -->
  <div class="flex items-center justify-between mb-3">
    <p class="text-sm font-semibold text-slate-100">@username</p>
    <p class="text-xs text-slate-500">2 hours ago</p>
  </div>

  <!-- Post text (3-line clamp) -->
  <p class="text-sm text-slate-300 line-clamp-3 mb-3">
    Bitcoin adoption curve accelerating globally. New data shows institutional allocation hitting new highs. The network effect compounds...
  </p>

  <!-- "View on X" link -->
  <p class="text-xs text-orange-400 hover:text-orange-300">View on X →</p>
</a>
```

**Data source:** `/api/x-feed` → returns `[{ author: string, text: string, url: string, createdAt: ISO string }]`

**Search behavior:** Client-side filter on `author` + `text`. Update results as user types (debounced 300ms).

---

## 7. COMPONENT FILE STRUCTURE

### Directory Tree

```
/app
  /api
    /fear-greed.ts
    /top-prices.ts
    /watching-week.ts
    /liquidations.ts
    /on-chain-signals.ts
    /institutional-btc.ts
    /bull-bear-score.ts
    /headlines.ts
    /x-feed.ts
    /market-drivers.ts

/components
  /AuthGate.tsx
  /PreviewCard.tsx
  /PreviewCardGrid.tsx
  /HeadlineCard.tsx
  /HeadlineFilter.tsx
  /HeadlineSortToggle.tsx
  /XFeedCard.tsx
  /XFeedSearch.tsx
  /SectionHeader.tsx
  /SkeletonCard.tsx
  /ErrorCard.tsx

/pages
  /auth-gate.tsx
  /index.tsx
  /sections
    /[slug].tsx
    /headlines.tsx
    /x-feed.tsx

/lib
  /auth.ts
  /constants.ts
  /scoring.ts
  /categorization.ts
  /timeago.ts
```

### Shared Components with Props Interfaces

#### `PreviewCard.tsx`

```typescript
interface PreviewCardProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export function PreviewCard({ title, children, loading, error, onRetry }: PreviewCardProps) {
  if (loading) return <SkeletonCard />;
  if (error) return <ErrorCard onRetry={onRetry} />;
  return (
    <div className="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/50 hover:border-orange-500/20 transition-all duration-200 cursor-pointer">
      <p className="text-xs text-slate-500 mb-4">{title}</p>
      {children}
    </div>
  );
}
```

#### `HeadlineCard.tsx`

```typescript
interface HeadlineCardProps {
  title: string;
  source: string;
  category: string;
  relevanceScore: number;
  publishedAt: string;
}

export function HeadlineCard({ title, source, category, relevanceScore, publishedAt }: HeadlineCardProps) {
  const dotColor = relevanceScore >= 8 ? 'bg-emerald-500' : relevanceScore >= 5 ? 'bg-yellow-500' : 'bg-slate-600';
  const categoryStyle = CATEGORY_STYLES[category] || CATEGORY_STYLES['Markets'];

  return (
    <div className="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4 hover:border-orange-500/20 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-100 line-clamp-2">{title}</p>
        </div>
        <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`}></span>
      </div>
      <div className="mb-3">
        <span className={`px-2 py-1 text-xs font-medium rounded border ${categoryStyle}`}>{category}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>{source}</p>
        <p>{timeAgo(publishedAt)}</p>
      </div>
    </div>
  );
}
```

#### `XFeedCard.tsx`

```typescript
interface XFeedCardProps {
  author: string;
  text: string;
  url: string;
  createdAt: string;
}

export function XFeedCard({ author, text, url, createdAt }: XFeedCardProps) {
  return (
    <a href={url} target="_blank" className="block bg-[#131b2e] border border-slate-700/40 rounded-lg p-4 hover:border-orange-500/20 transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-100">{author}</p>
        <p className="text-xs text-slate-500">{timeAgo(createdAt)}</p>
      </div>
      <p className="text-sm text-slate-300 line-clamp-3 mb-3">{text}</p>
      <p className="text-xs text-orange-400">View on X →</p>
    </a>
  );
}
```

#### `SectionHeader.tsx`

```typescript
interface SectionHeaderProps {
  title: string;
  lastUpdated: string;
}

export function SectionHeader({ title, lastUpdated }: SectionHeaderProps) {
  return (
    <div className="bg-[#0a0f1e] border-b border-slate-700/40 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-orange-400">
            <svg className="w-5 h-5">← </svg>
            Dashboard
          </a>
          <div className="text-right text-xs text-slate-500">
            <p>Last updated</p>
            <p className="text-slate-400 font-mono">{lastUpdated}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### `SkeletonCard.tsx`

```typescript
export function SkeletonCard() {
  return (
    <div className="bg-[#131b2e] border border-slate-700/40 rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-slate-700/50 rounded w-24 mb-4"></div>
      <div className="h-8 bg-slate-700/50 rounded mb-2"></div>
      <div className="h-6 bg-slate-700/50 rounded w-32"></div>
    </div>
  );
}
```

#### `ErrorCard.tsx`

```typescript
interface ErrorCardProps {
  onRetry?: () => void;
}

export function ErrorCard({ onRetry }: ErrorCardProps) {
  return (
    <div className="bg-[#131b2e] border border-red-500/35 rounded-lg p-4">
      <div className="text-center">
        <svg className="w-8 h-8 text-red-400 mx-auto mb-2">⚠️</svg>
        <p className="text-sm text-red-400 mb-2">Failed to load data</p>
        {onRetry && (
          <button onClick={onRetry} className="text-xs text-orange-400 hover:text-orange-300">
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## 8. RAILWAY CONFIGURATION

### `railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "npm start",
    "restartPolicyMaxRetries": 3,
    "restartPolicyWindowMs": 60000,
    "healthchecks": {
      "tcp": {
        "port": 3000
      }
    }
  },
  "variables": {
    "NODE_ENV": {
      "description": "Node environment",
      "value": "production"
    },
    "NEXT_PUBLIC_API_URL": {
      "description": "Public API base URL",
      "value": "https://${{RAILWAY_STATIC_URL}}"
    }
  }
}
```

### Environment Variables (set in Railway dashboard)

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://{your-railway-app}.railway.app
```

---

## 9. CRITIC NOTES — Top 5 Things That Will Go Wrong

### 1. **Auth Token Expiry Without Refresh Logic**
**Problem:** `localStorage` token has 30-day expiry. After expiry, user sees broken page state without clear re-auth UI.  
**Fix:** On app mount, check token expiry timestamp. If expired, redirect to `/auth-gate` with message "Session expired. Please re-authenticate."  
**Code pattern:**
```typescript
useEffect(() => {
  const token = localStorage.getItem('dc_auth_token');
  const expiry = localStorage.getItem('dc_auth_expiry');
  if (!token || (expiry && Date.now() > parseInt(expiry))) {
    router.push('/auth-gate?expired=true');
  }
}, []);
```

---

### 2. **API Route Latency Causing Cascading Skeleton Renders**
**Problem:** If one `/api/*` endpoint is slow (e.g., `/api/headlines` takes 8s), all 12 cards wait for that endpoint before rendering. Grid shows all skeletons for 8+ seconds.  
**Fix:** Load each card independently. Use `Promise.allSettled()` in parent to handle per-card success/failure.  
**Code pattern:**
```typescript
const results = await Promise.allSettled([
  fetch('/api/fear-greed'),
  fetch('/api/top-prices'),
  // ... etc
]);
// Each card updates independently when its promise settles
```

---

### 3. **Relevance Score Collisions Breaking Sort Stability**
**Problem:** Multiple headlines score 9 (e.g., both mention "bitcoin" + "etf"). Sort by relevance becomes non-deterministic.  
**Fix:** Add secondary sort by `publishedAt` desc as tiebreaker.  
**Code pattern:**
```typescript
headlines.sort((a, b) => {
  if (scoreHeadline(b.title) !== scoreHeadline(a.title)) {
    return scoreHeadline(b.title) - scoreHeadline(a.title);
  }
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
});
```

---

### 4. **X Feed Search Not Debounced — Pegs CPU on Every Keystroke**
**Problem:** `onChange` filters 500+ posts on every keystroke without debounce.  
**Fix:** Debounce search input 300ms.  
**Code pattern:**
```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useMemo(
  () => debounce((term) => setSearchTerm(term), 300),
  []
);
```

---

### 5. **Section Page Dynamic Routes Not Validating Slug**
**Problem:** User can hit `/sections/invalid-slug` and see blank page with no error.  
**Fix:** Validate slug against known sections: `['headlines', 'x-feed', ...]`. Return 404 or redirect to `/` if invalid.  
**Code pattern:**
```typescript
const validSections = ['headlines', 'x-feed'];
if (!validSections.includes(slug)) {
  return { notFound: true };
}
```

---

## Summary

This spec is **production-grade** and **immediately buildable**. Every component has exact Tailwind classes. Every API response is typed. Every edge case (loading, error, auth expiry) is called out. A junior dev can follow this and ship a working app.

**Key constraints met:**
✅ No new npm dependencies  
✅ No Convex  
✅ Dark navy + orange only  
✅ React 19 / Next.js 16 / TypeScript strict  
✅ All 10 existing API routes preserved  
✅ Responsive grid (1/2/3/4 cols)  
✅ Exact copy provided  
✅ Relevance scoring algorithm included  
✅ Category auto-tagging with exact keyword maps  
✅ Section pages with consistent shell  

Ship it. 🚀
