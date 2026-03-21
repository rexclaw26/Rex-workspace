import prisma from "@/lib/db";
import * as fs from "fs";
import * as path from "path";

const KB_PATH = "/Users/rex/Desktop/Blockchain Brain";

async function main() {
  console.log("🚀 Starting Blockchain Brain import into Mission Control Memory...\n");

  let totalImported = 0;

  // 1. Import Market Reports (Final Reports folder)
  console.log("📊 Importing Market Reports...");
  const reportsPath = path.join(KB_PATH, "Final Reports");
  const reportFiles = fs.readdirSync(reportsPath).filter(f => !f.startsWith("."));

  for (const file of reportFiles) {
    try {
      const filePath = path.join(reportsPath, file);
      const content = fs.readFileSync(filePath, "utf-8");

      // Extract date from filename (e.g., MARKET_REPORT_20260302)
      const dateMatch = file.match(/(\d{8})/);
      const date = dateMatch ? dateMatch[1] : "unknown";
      const formattedDate = date !== "unknown"
        ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
        : "unknown";

      // Determine report type
      const isXArticle = file.includes("X_ARTICLE");
      const isYoutubeScript = file.includes("YOUTUBE_SCRIPT");
      const category = isXArticle ? "x-posts" : isYoutubeScript ? "context" : "news";

      // Build tags
      const tags = [
        "market report",
        formattedDate,
        "bitcoin",
        "crypto",
        isXArticle ? "x article" : isYoutubeScript ? "youtube script" : "market analysis",
      ].join(", ");

      await prisma.memory.create({
        data: {
          title: `Market Report — ${formattedDate}${isXArticle ? " (X Article)" : isYoutubeScript ? " (YouTube Script)" : ""}`,
          content: content.slice(0, 10000), // Limit content length for DB
          category,
          tags,
        },
      });

      console.log(`  ✓ ${file}`);
      totalImported++;
    } catch (err) {
      console.log(`  ⚠ Failed: ${file}`);
    }
  }

  // 2. Import Price History (BTC + ETH summary)
  console.log("\n📈 Importing Price History...");
  try {
    const priceHistoryPath = path.join(KB_PATH, "daily-reports/price-history.json");
    const priceData = JSON.parse(fs.readFileSync(priceHistoryPath, "utf-8"));

    // BTC price history
    if (priceData.assets?.BTC?.history) {
      const btcHistory = priceData.assets.BTC.history;
      const summary = btcHistory
        .map((h: any) => `${h.date}: $${h.price.toLocaleString()} (${h.change_pct > 0 ? "+" : ""}${h.change_pct}%)${h.note ? ` — ${h.note}` : ""}`)
        .join("\n");

      await prisma.memory.create({
        data: {
          title: "BTC Price History (Jan 2026 — Present)",
          content: `Bitcoin price history since January 2026:\n\n${summary}`,
          category: "bitcoin",
          tags: "bitcoin, BTC, price history, 2026, market data",
        },
      });
      console.log("  ✓ BTC Price History");
      totalImported++;
    }

    // ETH price history
    if (priceData.assets?.ETH?.history) {
      const ethHistory = priceData.assets.ETH.history;
      const summary = ethHistory
        .map((h: any) => `${h.date}: $${h.price.toLocaleString()} (${h.change_pct > 0 ? "+" : ""}${h.change_pct}%)${h.note ? ` — ${h.note}` : ""}`)
        .join("\n");

      await prisma.memory.create({
        data: {
          title: "ETH Price History (Jan 2026 — Present)",
          content: `Ethereum price history since January 2026:\n\n${summary}`,
          category: "crypto",
          tags: "ethereum, ETH, price history, 2026, market data",
        },
      });
      console.log("  ✓ ETH Price History");
      totalImported++;
    }
  } catch (err) {
    console.log("  ⚠ Failed: Price History");
  }

  // 3. Import Today's Market Notes
  console.log("\n📝 Importing Market Notes...");
  try {
    const marketNotesPath = path.join(KB_PATH, "daily-reports/market-notes.md");
    const content = fs.readFileSync(marketNotesPath, "utf-8");

    await prisma.memory.create({
      data: {
        title: "Daily Market Notes — 2026-03-02 (Latest)",
        content: content.slice(0, 10000),
        category: "news",
        tags: "market notes, daily update, prices, sentiment, on-chain, 2026-03-02",
      },
    });
    console.log("  ✓ Market Notes");
    totalImported++;
  } catch (err) {
    console.log("  ⚠ Failed: Market Notes");
  }

  // 4. Import Books
  console.log("\n📚 Importing Books...");
  try {
    const booksPath = path.join(KB_PATH, "sources/books.json");
    const books = JSON.parse(fs.readFileSync(booksPath, "utf-8"));

    const bookList = Array.isArray(books) ? books : Object.values(books);
    for (const book of bookList) {
      const title = book.title || book.name || "Unknown Book";
      const author = book.author || "Unknown Author";
      const content = `Title: ${title}\nAuthor: ${author}\n\n${book.description || book.summary || book.notes || ""}`;

      await prisma.memory.create({
        data: {
          title: `Book: ${title} — ${author}`,
          content: content.slice(0, 5000),
          category: "books",
          tags: `books, ${author.toLowerCase()}, ${title.toLowerCase().slice(0, 30)}, reference, bitcoin, crypto`,
        },
      });
      console.log(`  ✓ ${title}`);
      totalImported++;
    }
  } catch (err) {
    console.log("  ⚠ Failed: Books");
  }

  // 5. Import On-Chain Metrics
  console.log("\n🔗 Importing On-Chain Metrics...");
  try {
    const onchainPath = path.join(KB_PATH, "sources/onchain-metrics.json");
    const metrics = JSON.parse(fs.readFileSync(onchainPath, "utf-8"));

    await prisma.memory.create({
      data: {
        title: "On-Chain Metrics Reference Guide",
        content: JSON.stringify(metrics, null, 2).slice(0, 8000),
        category: "reference",
        tags: "on-chain, metrics, MVRV, SOPR, glassnode, reference, bitcoin",
      },
    });
    console.log("  ✓ On-Chain Metrics");
    totalImported++;
  } catch (err) {
    console.log("  ⚠ Failed: On-Chain Metrics");
  }

  // 6. Import X Accounts
  console.log("\n🐦 Importing X/Twitter Accounts...");
  try {
    const xAccountsPath = path.join(KB_PATH, "sources/x-accounts.json");
    const accounts = JSON.parse(fs.readFileSync(xAccountsPath, "utf-8"));

    await prisma.memory.create({
      data: {
        title: "X/Twitter Accounts — Tracked Sources",
        content: JSON.stringify(accounts, null, 2).slice(0, 5000),
        category: "x-posts",
        tags: "twitter, x, accounts, sources, coinbureau, kobeissiletter, glassnode",
      },
    });
    console.log("  ✓ X Accounts");
    totalImported++;
  } catch (err) {
    console.log("  ⚠ Failed: X Accounts");
  }

  // 7. Import Top 50 Concepts
  console.log("\n💡 Importing Top 50 Crypto Concepts...");
  try {
    const conceptsPath = path.join(KB_PATH, "concepts/top-50-concepts.json");
    const concepts = JSON.parse(fs.readFileSync(conceptsPath, "utf-8"));

    const conceptList = Array.isArray(concepts) ? concepts : Object.values(concepts);
    for (const concept of conceptList.slice(0, 50)) {
      const name = concept.name || concept.title || concept.concept || String(concept);
      const description = concept.description || concept.definition || concept.explanation || "";

      await prisma.memory.create({
        data: {
          title: `Concept: ${name}`,
          content: description.slice(0, 3000),
          category: "context",
          tags: `concept, ${name.toLowerCase()}, bitcoin, crypto, education, reference`,
        },
      });
    }
    console.log(`  ✓ ${Math.min(conceptList.length, 50)} concepts imported`);
    totalImported += Math.min(conceptList.length, 50);
  } catch (err) {
    console.log("  ⚠ Failed: Concepts");
  }

  // 8. Import RULES.md
  console.log("\n📏 Importing System Rules...");
  try {
    const rulesPath = path.join(KB_PATH, "RULES.md");
    const content = fs.readFileSync(rulesPath, "utf-8");

    await prisma.memory.create({
      data: {
        title: "Blockchain Brain — System Rules & Guidelines",
        content: content.slice(0, 8000),
        category: "reference",
        tags: "rules, guidelines, system, blockchain brain, DCI, reference",
      },
    });
    console.log("  ✓ RULES.md");
    totalImported++;
  } catch (err) {
    console.log("  ⚠ Failed: RULES.md");
  }

  console.log(`\n🎉 Import Complete! Total entries imported: ${totalImported}`);
  console.log("📊 View in Mission Control: http://localhost:3000/memory");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
