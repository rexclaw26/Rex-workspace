// convex/crons.ts
// Scheduled background jobs for Mission Control.
// Headlines fetch runs every 15 minutes — real RSS sources, no fabrication.

import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Fetch headlines from all RSS sources every 15 minutes.
// Runs silently — inserts new items, skips duplicates, prunes items >7 days old.
crons.interval(
  "fetch-headlines",
  { minutes: 15 },
  api.headlines.fetchAndStore,
  {}
);

export default crons;
