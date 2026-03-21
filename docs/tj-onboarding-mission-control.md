# Hit Network: Mission Control + OpenClaw Onboarding
### For: TJ (and future teammates)
### Last Updated: March 2026

---

> **⚠️ Read this first.**
>
> You're setting up your **own independent instance** of Mission Control and OpenClaw. Nothing you do here touches Kelly's setup. You'll be consuming a shared, read-only RSS feed — that's the only thing you and Kelly have in common. Your Convex backend is yours. Your Telegram bot is yours. Your OpenClaw gateway is yours. They run completely separately. You can't break Kelly's setup from here, and she can't affect yours.

---

## Overview

Here's what you're building:

- **Mission Control** — a local Next.js + Convex web app that pulls headlines and surfaces them in a dashboard. You'll access it from anywhere via Tailscale.
- **OpenClaw** — your own AI gateway instance with its own Telegram bot. Your agents fire to your Telegram, not Kelly's.
- **Shared feed** — the Hit Network RSS feed at `https://feed-adapter-production.up.railway.app/rss` is a read-only endpoint. You're just consuming it, same as Kelly does on her end.

Total setup time: about 30–45 minutes if everything goes smoothly.

---

## Prerequisites

Make sure you've got these before starting:

- **Node.js 18+** — run `node -v` to check. Download at [nodejs.org](https://nodejs.org) if needed.
- **npm 9+** — run `npm -v` to check.
- **Git** — run `git --version`. Install via [git-scm.com](https://git-scm.com) if missing.
- **A Convex account** — free at [convex.dev](https://convex.dev). Sign up now if you haven't.
- **A Telegram account** — you'll need it to create your own bot.
- **Tailscale installed** — [tailscale.com/download](https://tailscale.com/download). Log in with the Hit Network account or your own, depending on what Kelly's told you.

That's it. Let's go.

---

## Step 1: Set Up Mission Control

This is your personal dashboard. It's a Next.js app backed by Convex for real-time data. You're running this locally and accessing it via Tailscale when you're away from your machine.

### 1.1 — Create the Next.js app

Open your terminal and navigate to wherever you keep projects, then run:

```bash
npx create-next-app@latest mission-control --typescript --tailwind --app
```

When it asks questions, here's what to pick:
- ESLint: **Yes**
- `src/` directory: **Your call** (Kelly uses the default, no `src/`)
- Import alias: **Yes, use the default `@/*`**

Once it finishes, move into the folder:

```bash
cd mission-control
```

### 1.2 — Install Convex

```bash
npm install convex
```

### 1.3 — Initialize your Convex project

```bash
npx convex dev
```

This will open a browser window and ask you to log into your Convex account. Do that. Then it'll ask you to create a new project — name it something like `mission-control-tj`. Hit enter.

**Important:** This creates a brand new Convex backend that's entirely yours. It's not connected to Kelly's project in any way. They're separate deployments on separate Convex accounts (or at minimum, separate projects).

Keep this terminal running — it's your live Convex dev server. Open a second terminal tab for the next steps.

### 1.4 — Create the headlines schema

In the second terminal tab, still inside the `mission-control` folder, create the Convex schema file:

```bash
mkdir -p convex
touch convex/schema.ts
```

Open `convex/schema.ts` and add:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  headlines: defineTable({
    title: v.string(),
    link: v.string(),
    pubDate: v.optional(v.string()),
    source: v.optional(v.string()),
    fetchedAt: v.number(),
  }).index("by_fetchedAt", ["fetchedAt"]),
});
```

### 1.5 — Create the headlines functions

Create `convex/headlines.ts`:

```typescript
import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// The shared Hit Network RSS feed — read-only endpoint
const RSS_SOURCES = [
  "https://feed-adapter-production.up.railway.app/rss",
];

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("headlines")
      .withIndex("by_fetchedAt")
      .order("desc")
      .take(50);
  },
});

export const store = mutation({
  args: {
    title: v.string(),
    link: v.string(),
    pubDate: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("headlines", {
      ...args,
      fetchedAt: Date.now(),
    });
  },
});

export const fetchAndStore = action({
  args: {},
  handler: async (ctx) => {
    for (const url of RSS_SOURCES) {
      try {
        const response = await fetch(url);
        const text = await response.text();

        // Basic RSS item parsing
        const items = text.match(/<item>([\s\S]*?)<\/item>/g) || [];

        for (const item of items.slice(0, 20)) {
          const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
            || item.match(/<title>(.*?)<\/title>/)?.[1]
            || "Untitled";

          const link = item.match(/<link>(.*?)<\/link>/)?.[1]
            || item.match(/<guid>(.*?)<\/guid>/)?.[1]
            || "";

          const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];

          if (title && link) {
            await ctx.runMutation(api.headlines.store, {
              title,
              link,
              pubDate,
              source: "Hit Network Feed",
            });
          }
        }
      } catch (err) {
        console.error(`Failed to fetch ${url}:`, err);
      }
    }
  },
});
```

### 1.6 — Build a basic headlines page

Open `app/page.tsx` and replace its contents with:

```tsx
"use client";

import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function Home() {
  const headlines = useQuery(api.headlines.list);
  const fetchHeadlines = useAction(api.headlines.fetchAndStore);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    await fetchHeadlines({});
    setLoading(false);
  };

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Mission Control</h1>

      <button
        onClick={handleFetch}
        disabled={loading}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Fetching..." : "Fetch Headlines"}
      </button>

      {headlines === undefined && <p>Loading...</p>}
      {headlines?.length === 0 && <p>No headlines yet. Hit "Fetch Headlines" to pull from the feed.</p>}

      <ul className="space-y-4">
        {headlines?.map((h) => (
          <li key={h._id} className="border rounded p-4">
            <a
              href={h.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              {h.title}
            </a>
            {h.pubDate && (
              <p className="text-sm text-gray-500 mt-1">{h.pubDate}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
```

### 1.7 — Wire up the Convex provider

Open `app/layout.tsx` and update it to wrap your app with the Convex provider:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const inter = Inter({ subsets: ["latin"] });
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Hit Network Mission Control",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexProvider client={convex}>
          {children}
        </ConvexProvider>
      </body>
    </html>
  );
}
```

### 1.8 — Start the app

In your second terminal tab:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see your Mission Control dashboard. Hit "Fetch Headlines" and watch the feed populate.

Your `npx convex dev` tab is still running in the background — leave it open whenever you're developing.

---

## Step 2: Set Up OpenClaw

This is your own OpenClaw gateway instance. It's completely separate from Kelly's. Your Telegram bot, your agents, your config.

### 2.1 — Install OpenClaw

```bash
npm install -g openclaw
```

Verify it installed:

```bash
openclaw --version
```

### 2.2 — Create your Telegram bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Follow the prompts — give it a name (e.g. "TJ Mission Control") and a username (e.g. `tj_hitnetwork_bot`)
4. BotFather will give you a **bot token** — copy it and save it somewhere safe. You'll need it in the next step.

**This is your bot, not Kelly's.** Kelly has her own separate bot. Your agents will message your bot, not hers.

### 2.3 — Run the OpenClaw setup wizard

```bash
openclaw wizard
```

The wizard will walk you through:
- Setting your Telegram bot token (paste the one from BotFather)
- Configuring your gateway
- Setting up your workspace

Follow the prompts. When it asks about your workspace directory, use something like `~/mission-control-workspace` or wherever you want your agent files to live.

### 2.4 — Start the OpenClaw gateway

```bash
openclaw gateway start
```

Check that it's running:

```bash
openclaw gateway status
```

You should see it confirm the gateway is active. From here, any agents you configure will fire through your gateway to your Telegram bot.

---

## Step 3: Connect the Shared Feeds

You already did most of this in Step 1 when you set `RSS_SOURCES` in `convex/headlines.ts`. This step is just making sure everything's pointed correctly and you understand what you're connecting to.

### The shared feed

The Hit Network RSS feed is:

```
https://feed-adapter-production.up.railway.app/rss
```

It's a read-only endpoint. You're fetching from it, not writing to it. Nothing you do to your Convex instance affects this feed or Kelly's instance. They're completely independent consumers of the same source.

### Verify your connection

With your app running, open the browser console or just hit "Fetch Headlines" on your dashboard. If you're getting articles, you're connected.

You can also test the feed directly:

```bash
curl https://feed-adapter-production.up.railway.app/rss | head -100
```

You should see RSS XML come back. If you see items, the feed is live.

### Optional: Set up a recurring fetch

Right now your dashboard has a manual "Fetch Headlines" button. If you want it to auto-refresh, you can set up a Convex scheduled function. Add this to `convex/headlines.ts`:

```typescript
import { cronJobs } from "convex/server";

const crons = cronJobs();

crons.interval(
  "fetch headlines every 30 minutes",
  { minutes: 30 },
  api.headlines.fetchAndStore,
  {}
);

export default crons;
```

This tells Convex to call your fetch action every 30 minutes automatically. Your Convex backend handles the scheduling — you don't need a separate cron job or any server running.

---

## Step 4: Test It

Here's your end-to-end checklist before you call it done.

**Mission Control:**
- [ ] `npx convex dev` is running without errors
- [ ] `npm run dev` is running and the app loads at `http://localhost:3000`
- [ ] Clicking "Fetch Headlines" pulls articles from the shared feed
- [ ] Headlines appear in the list with titles and links

**OpenClaw:**
- [ ] `openclaw gateway status` shows the gateway is active
- [ ] Your Telegram bot is live — message it from Telegram and see if it responds
- [ ] Your workspace directory is configured correctly

**Tailscale access (do this when you're away from your desk):**
1. Find your machine's Tailscale IP: open the Tailscale app and look for your machine's IP (it'll be something like `100.x.x.x`)
2. From another device on Tailscale, open `http://[your-tailscale-ip]:3000`
3. You should see your Mission Control dashboard

**To find your Tailscale IP quickly:**

```bash
tailscale ip -4
```

Bookmark that address on your phone. That's your remote URL for Mission Control.

---

## Important Notes

**Your instance is fully independent.** Kelly's Mission Control, her Convex backend, her OpenClaw gateway, and her Telegram bot are not affected by anything you do. There's no shared backend. The only thing you share is consuming the same RSS feed URL.

**The RSS feed is read-only.** You're fetching from it. You can't write to it, break it, or affect what Kelly sees on her end.

**Keep `npx convex dev` running during development.** Convex needs this process active to sync your schema and function changes. When you're just using the app (not developing), you don't need it running — the deployed Convex backend handles everything.

**Your Telegram bot token is sensitive.** Don't commit it to git. OpenClaw stores it in your local config. If you're pushing this project to GitHub, make sure `.env.local` and your OpenClaw config directory are in `.gitignore`.

**Tailscale has to be on.** For remote access to work, Tailscale needs to be running on your machine and on whatever device you're accessing from. If it's off, the `100.x.x.x` URL won't respond.

**If you hit issues:**
- Convex errors: check the `npx convex dev` terminal — it shows function errors in real time
- OpenClaw issues: run `openclaw gateway status` and check `~/.openclaw/` for logs
- Feed not loading: test the URL directly with `curl` first to confirm the feed is up

---

Questions? Hit up Kelly or check the OpenClaw docs at [openclaw.dev](https://openclaw.dev).
