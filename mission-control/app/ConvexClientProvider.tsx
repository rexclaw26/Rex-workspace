"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useState } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Lazy init — only runs in the browser, not during SSR prerendering
  const [convex] = useState(
    () => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud")
  );
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
