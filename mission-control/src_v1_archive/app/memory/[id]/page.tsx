import Link from "next/link";
import { ArrowLeft, Calendar, Edit2, Trash2, ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";

export default async function MemoryDetailPage({ params }: { params: { id: string } }) {
  const memory = await prisma.memory.findUnique({
    where: { id: params.id },
  });

  if (!memory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Entry Not Found</h2>
            <Link href="/memory">
              <Button>Back to Knowledge Base</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Categories configuration
  const categories = [
    { id: "news", name: "News", icon: FileText },
    { id: "bitcoin", name: "Bitcoin", icon: FileText },
    { id: "crypto", name: "Crypto", icon: FileText },
    { id: "gold", name: "Gold", icon: FileText },
    { id: "stocks", name: "Stocks", icon: FileText },
    { id: "economy", name: "Economy", icon: FileText },
    { id: "legislation", name: "Legislation", icon: FileText },
    { id: "ai-tech", name: "AI & Tech", icon: FileText },
    { id: "books", name: "Books", icon: FileText },
    { id: "x-posts", name: "X Posts", icon: FileText },
    { id: "context", name: "Context", icon: FileText },
    { id: "reference", name: "Reference", icon: FileText },
  ];

  // Extract tags from comma-separated string
  const tags = memory.tags ? memory.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/memory">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Knowledge Base
              </Button>
            </Link>
            <div className="flex-1" />
            <Button variant="outline">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl font-bold">{memory.title}</CardTitle>
            <Badge className={categories.find((c) => c.id === memory.category)?.color || "bg-gray-100 text-gray-800"}>
              {categories.find((c) => c.id === memory.category)?.name || memory.category}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Content */}
          <div className="col-span-2 space-y-6">
            {/* Content Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {memory.content || "No content available."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <Badge key={i} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Meta */}
          <div className="space-y-6">
            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium">
                    {new Date(memory.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(memory.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium">
                    {new Date(memory.updatedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(memory.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Source Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-900">{memory.id}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Memory ID: {memory.id}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/memory/edit">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Entry
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Entry
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
