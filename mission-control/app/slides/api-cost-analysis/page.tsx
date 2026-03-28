'use client';

import { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────
interface Slide {
  id: number;
  title: string;
  tag?: string;
  content: React.ReactNode;
}

// ── Shared UI primitives ─────────────────────────────────────────────────
function Tag({ children, color = 'orange' }: { children: React.ReactNode; color?: 'orange' | 'green' | 'red' | 'blue' | 'yellow' | 'gray' | 'amber' }) {
  const colors: Record<string, string> = {
    orange: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    green:  'bg-green-500/15 text-green-400 border-green-500/30',
    red:    'bg-red-500/15 text-red-400 border-red-500/30',
    blue:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
    yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    amber:  'bg-amber-500/15 text-amber-400 border-amber-500/30',
    gray:   'bg-white/5 text-white/50 border-white/10',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border tracking-wide uppercase ${colors[color]}`}>
      {children}
    </span>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/4 p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ children, color = 'orange' }: { children: React.ReactNode; color?: 'orange' | 'green' | 'amber' | 'zinc' }) {
  const colors: Record<string, string> = {
    orange: 'text-orange-500',
    green:  'text-green-500',
    amber:  'text-amber-400',
    zinc:   'text-zinc-400',
  };
  return (
    <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${colors[color]}`}>{children}</p>
  );
}

function Bullet({ children, icon = '→', color = 'text-orange-500' }: { children: React.ReactNode; icon?: string; color?: string }) {
  return (
    <li className="flex gap-3 items-start">
      <span className={`mt-0.5 shrink-0 ${color} font-bold`}>{icon}</span>
      <span className="text-white/80 text-sm leading-relaxed">{children}</span>
    </li>
  );
}

function TwoCol({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

// ── All 11 slides ─────────────────────────────────────────────────────────
const slides: Slide[] = [
  // 1 ── Title
  {
    id: 1,
    title: 'DC Data Hub: API Integration Cost Analysis',
    tag: 'Internal · March 2026',
    content: (
      <div className="space-y-6">
        <div className="text-center space-y-3 pt-2">
          <p className="text-white/50 text-sm tracking-widest uppercase">What to buy, what to skip, what to build free</p>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-orange-500/60 bg-orange-500/10">
            <span className="text-orange-400 text-xl font-black tracking-tight">Three data categories. Budget caps. One clear decision framework.</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card>
            <SectionLabel>CoinGlass</SectionLabel>
            <p className="text-white/80 text-sm">Liquidation heatmaps and order book depth. Cap: $150/mo.</p>
          </Card>
          <Card>
            <SectionLabel>CryptoQuant</SectionLabel>
            <p className="text-white/80 text-sm">On-chain intelligence and whale tracking. Cap: $100/mo.</p>
          </Card>
          <Card>
            <SectionLabel>Price Charts</SectionLabel>
            <p className="text-white/80 text-sm">Real-time OHLCV for Mission Control. Available free.</p>
          </Card>
        </div>
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Tag color="orange">CoinGlass ~$149/mo ESTIMATE</Tag>
          <Tag color="green">CryptoQuant $99/mo CONFIRMED</Tag>
          <Tag color="green">Charts $0</Tag>
        </div>
      </div>
    ),
  },

  // 2 ── Overview
  {
    id: 2,
    title: 'Three Categories. Three Decisions.',
    tag: 'OVERVIEW',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">Each data category is independent. Each has its own budget cap and its own decision. Evaluate them separately.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/6 p-5">
            <SectionLabel>CoinGlass</SectionLabel>
            <p className="text-white font-bold text-sm mb-2">Liquidation heatmaps, order book depth</p>
            <p className="text-white/60 text-xs">Cap: $150/mo</p>
            <p className="text-white/60 text-xs mt-2">Pricing not publicly listed. Pro tier (~$149/mo ESTIMATE) unlocks tick-level heatmaps. Get a sales quote before committing.</p>
            <div className="mt-3">
              <Tag color="amber">Quote required</Tag>
            </div>
          </div>
          <div className="rounded-xl border border-green-500/30 bg-green-500/6 p-5">
            <SectionLabel color="green">CryptoQuant</SectionLabel>
            <p className="text-white font-bold text-sm mb-2">On-chain intelligence, whale tracking</p>
            <p className="text-white/60 text-xs">Cap: $100/mo</p>
            <p className="text-white/60 text-xs mt-2">Professional at $99/mo CONFIRMED. Just under cap. Existing key activates same day on plan upgrade.</p>
            <div className="mt-3">
              <Tag color="green">Ready to upgrade</Tag>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-500/30 bg-white/3 p-5">
            <SectionLabel color="zinc">Price Charts</SectionLabel>
            <p className="text-white font-bold text-sm mb-2">Real-time OHLCV for Mission Control</p>
            <p className="text-white/60 text-xs">Cost: $0</p>
            <p className="text-white/60 text-xs mt-2">TradingView Lightweight Charts + Binance public API. Ship now. Upgrade only if rate limits hit production.</p>
            <div className="mt-3">
              <Tag color="green">Ship today</Tag>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 3 ── CoinGlass Tiers
  {
    id: 3,
    title: 'CoinGlass: Go Pro',
    tag: 'LIQUIDATION DATA',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">Pro tier unlocks tick-level heatmaps. Nothing below it does.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 pr-4 text-white/50 text-xs font-bold tracking-widest uppercase">Tier</th>
                <th className="text-left py-2 pr-4 text-white/50 text-xs font-bold tracking-widest uppercase">Key Features</th>
                <th className="text-left py-2 text-white/50 text-xs font-bold tracking-widest uppercase">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3 pr-4 text-white/70 font-medium">Free</td>
                <td className="py-3 pr-4 text-white/50 text-xs">Dashboard only, aggregated liquidation view, no API access</td>
                <td className="py-3 text-white/70">$0</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-white/70 font-medium">Starter</td>
                <td className="py-3 pr-4 text-white/50 text-xs">Aggregated heatmap (downgrade from Pro), limited history, no L2</td>
                <td className="py-3 text-white/70">~$79/mo <span className="text-white/30 text-xs">ESTIMATE</span></td>
              </tr>
              <tr className="bg-orange-500/8 border border-orange-500/20 rounded-lg">
                <td className="py-3 pr-4 font-bold">
                  <span className="text-orange-400">Pro</span>
                  <Tag color="orange" >RECOMMENDED</Tag>
                </td>
                <td className="py-3 pr-4 text-white/80 text-xs">Tick-level heatmap, L2 order book, historical replay, websockets, full altcoin coverage</td>
                <td className="py-3 text-orange-400 font-bold">~$149/mo <span className="text-orange-300/60 text-xs">ESTIMATE</span></td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-white/70 font-medium">Enterprise</td>
                <td className="py-3 pr-4 text-white/50 text-xs">L3 institutional data, dedicated support, SLA guarantees</td>
                <td className="py-3 text-white/70">Custom</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/8">
          <p className="text-amber-400 text-xs font-bold">Pricing not publicly listed.</p>
          <p className="text-white/60 text-xs mt-1">Get a CoinGlass sales quote before committing. The ~$149/mo figure is an estimate from third-party sources — the real number could be higher or lower.</p>
        </div>
      </div>
    ),
  },

  // 4 ── CoinGlass Context
  {
    id: 4,
    title: 'Before You Buy CoinGlass',
    tag: 'CAUTION',
    content: (
      <div className="space-y-5">
        <TwoCol
          left={
            <Card className="border-orange-500/20 bg-orange-500/6 h-full">
              <SectionLabel>What Pro Unlocks</SectionLabel>
              <ul className="space-y-2">
                <Bullet>Tick-level liquidation clusters (real trader data, not aggregated)</Bullet>
                <Bullet>L2 order book + historical replay</Bullet>
                <Bullet>Websocket feeds for live Mission Control panels</Bullet>
                <Bullet>Full altcoin coverage</Bullet>
              </ul>
            </Card>
          }
          right={
            <Card className="border-amber-500/20 bg-amber-500/6 h-full">
              <SectionLabel color="amber">Before You Sign</SectionLabel>
              <ul className="space-y-2">
                <Bullet icon="⚠" color="text-amber-400">Pricing is not publicly listed [ESTIMATE only]</Bullet>
                <Bullet icon="⚠" color="text-amber-400">~$149/mo puts us exactly at the $150/mo cap — zero buffer</Bullet>
                <Bullet icon="⚠" color="text-amber-400">Get a sales quote first — price could be higher</Bullet>
                <Bullet icon="✗" color="text-red-400">Starter tier aggregated heatmap is a downgrade — skip it</Bullet>
              </ul>
            </Card>
          }
        />
        <Card>
          <p className="text-white/70 text-sm"><span className="text-orange-400 font-bold">Bottom line:</span> CoinGlass Pro is the right tier if we buy at all. But confirm the price with sales before committing. At ~$149/mo there is zero budget buffer.</p>
        </Card>
      </div>
    ),
  },

  // 5 ── CryptoQuant Tiers
  {
    id: 5,
    title: 'CryptoQuant: Professional at $99',
    tag: 'ON-CHAIN SIGNALS',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">$99/mo confirmed. Just under cap. Covers every on-chain signal we need.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 pr-4 text-white/50 text-xs font-bold tracking-widest uppercase">Tier</th>
                <th className="text-left py-2 pr-4 text-white/50 text-xs font-bold tracking-widest uppercase">Key Features</th>
                <th className="text-left py-2 text-white/50 text-xs font-bold tracking-widest uppercase">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3 pr-4 text-white/70 font-medium">Free</td>
                <td className="py-3 pr-4 text-white/50 text-xs">Dashboard only, no API data endpoints at all</td>
                <td className="py-3 text-white/70">$0</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-white/70 font-medium">Basic</td>
                <td className="py-3 pr-4 text-white/50 text-xs">Limited indicators, partial API access, rate-capped</td>
                <td className="py-3 text-white/70">~$39/mo <span className="text-white/30 text-xs">ESTIMATE</span></td>
              </tr>
              <tr className="bg-orange-500/8">
                <td className="py-3 pr-4 font-bold">
                  <span className="text-orange-400">Professional</span>{' '}
                  <Tag color="orange">RECOMMENDED</Tag>
                </td>
                <td className="py-3 pr-4 text-white/80 text-xs">SOPR, MVRV Z-Score, NUPL, LTH/STH ratio, whale tracking, full API access</td>
                <td className="py-3 text-orange-400 font-bold">$99/mo <span className="text-green-400 text-xs">CONFIRMED</span></td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-white/70 font-medium">Premium</td>
                <td className="py-3 pr-4 text-white/50 text-xs">Institutional feeds, miner data, custom alerts, priority support</td>
                <td className="py-3 text-white/70">~$199/mo <span className="text-white/30 text-xs">ESTIMATE</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/8">
          <p className="text-green-400 text-xs font-bold">$99/mo confirmed pricing — multiple independent sources.</p>
          <p className="text-white/60 text-xs mt-1">No sales call required. Billing upgrade activates same day. Existing API key starts working immediately on plan change.</p>
        </div>
      </div>
    ),
  },

  // 6 ── CryptoQuant Fix
  {
    id: 6,
    title: 'The Key Exists. Wrong Plan.',
    tag: 'ACTION REQUIRED',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">One billing upgrade activates the existing key. Same-day fix.</p>
        <TwoCol
          left={
            <Card className="border-amber-500/20 bg-amber-500/6 h-full">
              <SectionLabel color="amber">Right Now</SectionLabel>
              <ul className="space-y-2">
                <Bullet icon="·" color="text-white/40">Kelly has an active CryptoQuant API key</Bullet>
                <Bullet icon="✗" color="text-red-400">Every API call returns 403 Forbidden</Bullet>
                <Bullet icon="→" color="text-amber-400">Root cause: Free tier has no API data endpoints at all</Bullet>
                <Bullet icon="·" color="text-white/40">Dashboard access only on current plan</Bullet>
              </ul>
            </Card>
          }
          right={
            <Card className="border-orange-500/20 bg-orange-500/6 h-full">
              <SectionLabel>What to Do</SectionLabel>
              <ul className="space-y-2">
                <Bullet>Upgrade to Professional ($99/mo CONFIRMED)</Bullet>
                <Bullet>Existing API key activates immediately on plan change</Bullet>
                <Bullet icon="✓" color="text-green-400">No new integration work required</Bullet>
                <Bullet icon="✓" color="text-green-400">On-chain signals live same day</Bullet>
              </ul>
            </Card>
          }
        />
        <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/8">
          <p className="text-green-400 text-xs font-bold">This is the easiest win in the entire deck.</p>
          <p className="text-white/60 text-xs mt-1">Kelly logs into CryptoQuant billing, upgrades to Professional, and the API key we already have starts returning data. Five minutes of work.</p>
        </div>
      </div>
    ),
  },

  // 7 ── Price Charts
  {
    id: 7,
    title: 'Price Charts: CoinGecko Free → Analyst',
    tag: 'CHARTS',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">Binance is geo-blocked on Railway US servers (HTTP 451). CoinGecko free tier is live and working. Upgrade path is clear.</p>
        <TwoCol
          left={
            <Card className="border-green-500/20 bg-green-500/6 h-full">
              <SectionLabel color="green">Current — CoinGecko Free · $0/mo</SectionLabel>
              <ul className="space-y-2">
                <Bullet icon="✓" color="text-green-400">TradingView Lightweight Charts (open-source)</Bullet>
                <Bullet icon="✓" color="text-green-400">CoinGecko free OHLC — no auth, works on Railway</Bullet>
                <Bullet icon="✓" color="text-green-400">1H (30min candles), 4H, 1D, 1W intervals live</Bullet>
                <Bullet icon="!" color="text-amber-400">Free tier: no volume data · 30-day history cap · 30 calls/min</Bullet>
              </ul>
            </Card>
          }
          right={
            <Card className="border-blue-500/20 bg-blue-500/6 h-full">
              <SectionLabel color="zinc">Upgrade — CoinGecko Analyst · $129/mo</SectionLabel>
              <ul className="space-y-2">
                <Bullet icon="→" color="text-blue-400">True 1H, 4H, 1D, 1W, <strong>1M</strong> OHLCV candles</Bullet>
                <Bullet icon="→" color="text-blue-400">Volume data included</Bullet>
                <Bullet icon="→" color="text-blue-400">History back to <strong>2013</strong> — full cycle context</Bullet>
                <Bullet icon="→" color="text-blue-400">500 calls/min · 18,000+ coins</Bullet>
                <Bullet icon="→" color="text-blue-400">Annual billing: ~$103/mo</Bullet>
              </ul>
            </Card>
          }
        />
        <Card>
          <p className="text-white/70 text-sm"><span className="text-green-400 font-bold">Status:</span> Free tier is deployed and working. Upgrade trigger: Kelly wants 1M candles, 2+ years of history shown, or volume bars. CoinGecko Analyst is the only provider that checks all three at a reasonable price.</p>
        </Card>
      </div>
    ),
  },

  // 8 ── Budget Scenarios
  {
    id: 8,
    title: 'Four Scenarios',
    tag: 'BUDGET',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">Five scenarios. Current live stack is E. Scenario C adds on-chain. Scenario C+ adds full charts.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 pr-4 text-white/50 text-xs font-bold tracking-widest uppercase">Scenario</th>
                <th className="text-left py-2 pr-4 text-white/50 text-xs font-bold tracking-widest uppercase">Stack</th>
                <th className="text-left py-2 text-white/50 text-xs font-bold tracking-widest uppercase">Monthly Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="bg-green-500/5">
                <td className="py-3 pr-4">
                  <span className="text-green-400 font-bold">E</span>
                  <span className="ml-2 text-green-400 text-xs font-bold">LIVE NOW</span>
                </td>
                <td className="py-3 pr-4 text-white/60 text-xs">CoinGecko free OHLC + TradingView Charts (30-day history, no volume)</td>
                <td className="py-3 text-green-400 font-bold">$0</td>
              </tr>
              <tr className="bg-orange-500/8">
                <td className="py-3 pr-4">
                  <span className="text-orange-400 font-bold">C</span>{' '}
                  <Tag color="orange">RECOMMENDED</Tag>
                </td>
                <td className="py-3 pr-4 text-white/80 text-xs">CryptoQuant Professional + CoinGecko free charts</td>
                <td className="py-3 text-orange-400 font-bold">$99/mo <span className="text-green-400 text-xs">CONFIRMED</span></td>
              </tr>
              <tr className="bg-blue-500/5">
                <td className="py-3 pr-4">
                  <span className="text-blue-400 font-bold">C+</span>
                  <span className="ml-2 text-blue-400 text-xs">Full Charts</span>
                </td>
                <td className="py-3 pr-4 text-white/70 text-xs">CryptoQuant Professional + CoinGecko Analyst (1M candles, 2013 history, volume)</td>
                <td className="py-3 text-blue-400 font-bold">$228/mo <span className="text-green-400 text-xs">CONFIRMED</span></td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <span className="text-white/70 font-medium">B</span>
                  <span className="ml-2 text-white/40 text-xs">Liquidations First</span>
                </td>
                <td className="py-3 pr-4 text-white/60 text-xs">CoinGlass Pro + CoinGecko free charts</td>
                <td className="py-3 text-white/70">~$149/mo <span className="text-white/30 text-xs">ESTIMATE</span></td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <span className="text-white/70 font-medium">A</span>
                  <span className="ml-2 text-white/40 text-xs">Full Stack</span>
                </td>
                <td className="py-3 pr-4 text-white/60 text-xs">CoinGlass Pro + CryptoQuant Pro + CoinGecko Analyst</td>
                <td className="py-3 text-white/70">~$377/mo <span className="text-white/30 text-xs">PARTLY ESTIMATE</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <Card>
          <p className="text-white/70 text-sm"><span className="text-orange-400 font-bold">The call:</span> Start at E (live). Move to C for on-chain signals ($99/mo). Add CoinGecko Analyst ($129/mo) when Kelly wants 1M candles, 2+ year history, or volume bars — making it C+ at $228/mo total.</p>
        </Card>
      </div>
    ),
  },

  // 9 ── Recommended Path
  {
    id: 9,
    title: 'Three Phases',
    tag: 'ROADMAP',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">Phase 1 is live. On-chain this week. Full charts when Kelly wants 1M/history/volume.</p>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-green-500/40 bg-green-500/6">
            <div className="flex items-center gap-3 mb-2">
              <Tag color="green">Phase 1 · LIVE</Tag>
              <p className="text-white font-bold">Charts Deployed</p>
              <span className="ml-auto text-green-400 text-xs font-bold">$0/mo</span>
            </div>
            <p className="text-white/70 text-sm">TradingView Lightweight Charts + CoinGecko free OHLC. 1H/4H/1D/1W live. 30-day history, no volume. Binance was blocked on Railway (451) — CoinGecko free is the working replacement.</p>
          </div>
          <div className="p-4 rounded-xl border border-orange-500/40 bg-orange-500/6">
            <div className="flex items-center gap-3 mb-2">
              <Tag color="orange">Phase 2</Tag>
              <p className="text-white font-bold">Activate CryptoQuant</p>
              <span className="ml-auto text-orange-400 text-xs font-bold">This Week · $99/mo CONFIRMED</span>
            </div>
            <p className="text-white/70 text-sm">Upgrade CryptoQuant to Professional. Existing API key activates immediately. SOPR, MVRV, NUPL, LTH/STH, whale tracking — all live same day. Total stack: $99/mo.</p>
          </div>
          <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
            <div className="flex items-center gap-3 mb-2">
              <Tag color="blue">Phase 2.5 · Optional</Tag>
              <p className="text-white font-bold">CoinGecko Analyst</p>
              <span className="ml-auto text-blue-400 text-xs font-bold">When ready · $129/mo CONFIRMED</span>
            </div>
            <p className="text-white/70 text-sm">Unlocks 1M candles, 2013 history, volume bars, and 500 calls/min. Trigger: Kelly wants monthly chart view or 2+ years of history shown. Stack becomes $228/mo total.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-white/3">
            <div className="flex items-center gap-3 mb-2">
              <Tag color="gray">Phase 3</Tag>
              <p className="text-white font-bold">Add CoinGlass Heatmaps</p>
              <span className="ml-auto text-white/40 text-xs font-bold">Budget Expansion · ~$149/mo ESTIMATE</span>
            </div>
            <p className="text-white/70 text-sm">Get CoinGlass sales quote, confirm Pro pricing. Tick-level liquidation heatmaps. Only after quote confirms price is within cap.</p>
          </div>
        </div>
      </div>
    ),
  },

  // 10 ── What to Defer
  {
    id: 10,
    title: 'Four Things to Skip',
    tag: 'DEFER',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">Four things not worth buying yet.</p>
        <div className="space-y-3">
          {[
            {
              label: 'CoinGlass Starter',
              cost: '~$79/mo ESTIMATE',
              reason: 'Aggregated heatmap is a downgrade from Pro. Skip the middle tier entirely — it doesn\'t give us what we need and costs $79/mo for less value.',
            },
            {
              label: 'CryptoQuant Premium',
              cost: '~$199/mo ESTIMATE',
              reason: 'Institutional feeds and miner data we cannot use at current scale. Professional covers 100% of our signals. Premium is $100/mo more for data we won\'t touch.',
            },
            {
              label: 'CoinGecko Pro',
              cost: '$499/mo CONFIRMED',
              reason: 'Enterprise-scale plan with sub-second granularity and dedicated support. 4x the price of Analyst for features we won\'t use. Analyst at $129/mo covers everything DC Hub needs.',
            },
            {
              label: 'CoinGlass Enterprise',
              cost: 'Custom',
              reason: 'L3 institutional depth data is overkill for current Mission Control scope. This tier is for quant funds and market makers, not a content platform.',
            },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/8 bg-white/2 flex gap-4 items-start">
              <span className="text-white/20 font-bold text-sm shrink-0 mt-0.5">{i + 1}.</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white/70 font-bold text-sm">{item.label}</span>
                  <Tag color="gray">{item.cost}</Tag>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{item.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // 11 ── Action Items
  {
    id: 11,
    title: 'Four Actions',
    tag: 'NEXT STEPS',
    content: (
      <div className="space-y-5">
        <p className="text-white/70 text-sm">Two are free. One is a billing change. One is an email.</p>
        <div className="space-y-3">
          {[
            {
              num: '1',
              title: 'Charts Live ✓',
              timing: 'Done',
              detail: 'TradingView Lightweight Charts + CoinGecko free OHLC deployed on DC Hub. Binance was blocked on Railway (geo-restricted). CoinGecko free is the working replacement — 1H/4H/1D/1W live at $0.',
              owner: 'Dev',
              cost: '$0 · LIVE',
              border: 'border-green-500/30 bg-green-500/6',
              tagColor: 'green' as const,
            },
            {
              num: '2',
              title: 'Upgrade CryptoQuant',
              timing: 'This Week',
              detail: 'Switch to Professional, $99/mo CONFIRMED. Existing API key activates immediately on plan change.',
              owner: 'Kelly',
              cost: '$99/mo',
              border: 'border-orange-500/30 bg-orange-500/6',
              tagColor: 'orange' as const,
            },
            {
              num: '3',
              title: 'Decide on CoinGecko Analyst',
              timing: 'When Ready',
              detail: 'CoinGecko Analyst ($129/mo, $103/mo annual) unlocks 1M candles, 2013 history, volume data. Trigger: Kelly wants monthly chart view or 2+ years of history on DC Hub. One API key swap, same chart component.',
              owner: 'Kelly',
              cost: '$129/mo CONFIRMED',
              border: 'border-blue-500/30 bg-blue-500/5',
              tagColor: 'blue' as const,
            },
            {
              num: '4',
              title: 'Email CoinGlass Sales',
              timing: 'This Week',
              detail: 'Request Pro tier pricing quote before committing. Confirms or revises ~$149/mo estimate.',
              owner: 'Kelly',
              cost: '5 minutes',
              border: 'border-amber-500/30 bg-amber-500/6',
              tagColor: 'amber' as const,
            },
            {
              num: '5',
              title: 'Set Phase 3 Trigger',
              timing: 'Before Month-End',
              detail: 'Define the condition that unlocks CoinGlass spend: budget expansion OR confirmed sales quote within cap.',
              owner: 'Kelly + Rex',
              cost: 'Decision only',
              border: 'border-white/8 bg-white/2',
              tagColor: 'gray' as const,
            },
          ].map((action) => (
            <div key={action.num} className={`p-4 rounded-xl border ${action.border}`}>
              <div className="flex items-start gap-3">
                <span className="text-orange-500/60 font-black text-lg shrink-0">{action.num}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white font-bold">{action.title}</span>
                    <Tag color={action.tagColor}>{action.timing}</Tag>
                    <span className="ml-auto text-white/40 text-xs">Owner: {action.owner}</span>
                  </div>
                  <p className="text-white/60 text-sm">{action.detail}</p>
                  <p className="text-white/40 text-xs mt-1">Cost: {action.cost}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center pt-2">
          <p className="text-white/30 text-xs">DC Data Hub · API Cost Analysis · Internal · March 2026</p>
          <p className="text-white/20 text-xs mt-1">Live: Scenario E ($0). Recommended next: Scenario C ($99/mo) → C+ ($228/mo) when 1M charts needed</p>
        </div>
      </div>
    ),
  },
];

// ── Main component ────────────────────────────────────────────────────────
export default function ApiCostAnalysis() {
  const [current, setCurrent] = useState(0);
  const total = slides.length;
  const slide = slides[current];

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(total - 1, c + 1));

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="border-b border-white/8 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/decks" className="text-white/40 hover:text-white/70 text-xs transition-colors">← Decks</a>
          <span className="text-white/20 text-xs">|</span>
          <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">API Cost Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-xs">Slide {current + 1} of {total}</span>
          <div className="flex gap-1 ml-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? 'bg-orange-500 w-4 h-2' : 'bg-white/20 hover:bg-white/40 w-2 h-2'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Slide area ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-6 py-8">

        {/* Slide header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-orange-500/60 text-xs font-bold tracking-widest uppercase">
              {String(slide.id).padStart(2, '0')}
            </span>
            {slide.tag && <Tag color="gray">{slide.tag}</Tag>}
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">{slide.title}</h1>
          <div className="mt-3 h-px bg-gradient-to-r from-orange-500/60 via-orange-500/20 to-transparent" />
        </div>

        {/* Slide content */}
        <div className="flex-1">
          {slide.content}
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <div className="border-t border-white/8 px-6 py-4 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
        >
          ← Previous
        </button>

        <div className="text-center">
          <p className="text-white/30 text-xs">{slide.title}</p>
        </div>

        <button
          onClick={next}
          disabled={current === total - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-500/40 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
