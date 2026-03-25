import type { Metadata } from "next";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mission Control — Hit Network",
  description: "AI Operations Command Center",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preload Google Fonts */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" as="style" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" as="style" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" as="style" />
        {/* Load Google Fonts */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" />
      </head>
      <body className="mission-bg">
        <ConvexClientProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Left sidebar */}
            <Sidebar />
            {/* Main content area */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              {children}
            </main>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
