import Link from "next/link";
import { Search, ExternalLink, BookOpen, FileText, Link as LinkIcon, TrendingUp, DollarSign, Brain, Globe, Shield, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import prisma from "@/lib/db";
import { Memory } from "@prisma/client";

export default async function MemoryPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q || "";
  const category = resolvedParams?.category || "";

  const memories: Memory[] = await prisma.memory.findMany({
    where: {
      AND: [
        category ? { category } : {},
        query ? {
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ]
        } : {},
      ]
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const categories = [
    { id: "news", name: "News", icon: FileText, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400" },
    { id: "bitcoin", name: "Bitcoin", icon: TrendingUp, color: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400" },
    { id: "crypto", name: "Crypto", icon: Activity, color: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400" },
    { id: "gold", name: "Gold", icon: DollarSign, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400" },
    { id: "stocks", name: "Stocks", icon: TrendingUp, color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400" },
    { id: "economy", name: "Economy", icon: Globe, color: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-400" },
    { id: "legislation", name: "Legislation", icon: Shield, color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400" },
    { id: "ai-tech", name: "AI & Tech", icon: Brain, color: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-400" },
    { id: "books", name: "Books", icon: BookOpen, color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-400" },
    { id: "x-posts", name: "X Posts", icon: LinkIcon, color: "bg-muted text-muted-foreground" },
    { id: "context", name: "Context", icon: FileText, color: "bg-muted text-muted-foreground" },
    { id: "reference", name: "Reference", icon: FileText, color: "bg-muted text-muted-foreground" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-sm text-muted-foreground mt-1">Search and manage your research, reports, and context</p>
        </div>
        <Link href="/memory/new">
          <Button>New Entry</Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title or content..."
            defaultValue={query}
            className="pl-10"
          />
        </div>
        {category && (
          <Badge variant="outline">
            Category: {category}
            <Link href="/memory">
              <button className="ml-2 hover:text-muted-foreground">×</button>
            </Link>
          </Badge>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Link href="/memory">
          <Badge
            variant={category === "" ? "default" : "outline"}
            className="cursor-pointer"
          >
            All
          </Badge>
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/memory?category=${cat.id}`}>
            <Badge
              variant={category === cat.id ? "default" : "outline"}
              className={`cursor-pointer ${category === cat.id ? cat.color : ""}`}
            >
              {cat.name}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {memories.length} {memories.length === 1 ? "entry" : "entries"}
      </div>

      {/* Memory Grid */}
      {memories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No entries found</h3>
            <p className="text-muted-foreground mb-4">
              {query ? `No results for "${query}"` : "Your knowledge base is empty. Add your first entry!"}
            </p>
            <Link href="/memory/new">
              <Button>Create First Entry</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} categories={categories} />
          ))}
        </div>
      )}
    </div>
  );
}

function MemoryCard({ memory, categories }: { memory: Memory; categories: any[] }) {
  const tags = memory.tags ? memory.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const catConfig = categories.find((c) => c.id === memory.category);

  return (
    <Link href={`/memory/${memory.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold line-clamp-2">{memory.title}</CardTitle>
            <Badge className={catConfig?.color || "bg-muted text-muted-foreground"}>
              {catConfig?.name || memory.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {memory.content || "No description provided."}
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">+{tags.length - 3}</Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
            <span>{new Date(memory.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
