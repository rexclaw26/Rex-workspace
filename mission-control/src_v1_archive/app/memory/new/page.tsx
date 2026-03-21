import Link from "next/link";
import { ArrowLeft, BookOpen, FileText, Link as LinkIcon, TrendingUp, DollarSign, Brain, Globe, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Categories configuration
const categories = [
  { id: "news", name: "News", icon: FileText },
  { id: "bitcoin", name: "Bitcoin", icon: TrendingUp },
  { id: "crypto", name: "Crypto", icon: Activity },
  { id: "gold", name: "Gold", icon: DollarSign },
  { id: "stocks", name: "Stocks", icon: TrendingUp },
  { id: "economy", name: "Economy", icon: Globe },
  { id: "legislation", name: "Legislation", icon: Shield },
  { id: "ai-tech", name: "AI & Tech", icon: Brain },
  { id: "books", name: "Books", icon: BookOpen },
  { id: "x-posts", name: "X Posts", icon: LinkIcon },
  { id: "context", name: "Context", icon: FileText },
  { id: "reference", name: "Reference", icon: FileText },
];

export default function NewMemoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/memory">
              <Button variant="outline">← Back to Knowledge Base</Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Entry</h1>
              <p className="text-sm text-gray-500 mt-1">Add a new knowledge entry to your database</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Entry Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter entry title..."
                  required
                  className="mt-2"
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="news"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select the category that best fits this entry
                </p>
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter the content of this entry..."
                  rows={10}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Full text, analysis, or reference content
                </p>
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="bitcoin, market, report, 2026"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add tags to help organize and filter entries
                </p>
              </div>

              {/* Source URL (optional) */}
              <div>
                <Label htmlFor="sourceUrl">Source URL</Label>
                <Input
                  id="sourceUrl"
                  name="sourceUrl"
                  type="url"
                  placeholder="https://github.com/..."
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to original source (GitHub, Railway app, etc.)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Link href="/memory">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit">Create Entry</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Category Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {categories.slice(0, 6).map((cat) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <cat.icon className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
