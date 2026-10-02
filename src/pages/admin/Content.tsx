import { Link } from "react-router-dom";
import { FileText, FileCode, MessageSquare } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Content Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage blog posts, pages, and comments</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/blog" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-7 w-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Blog Posts</CardTitle>
                <CardDescription className="text-gray-600">Create, edit, and publish blog content</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/pages" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-indigo-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileCode className="h-7 w-7 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Pages</CardTitle>
                <CardDescription className="text-gray-600">Create and manage custom pages</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/comments" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-pink-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-7 w-7 text-pink-600" />
                </div>
                <CardTitle className="text-xl">Comments</CardTitle>
                <CardDescription className="text-gray-600">Moderate and respond to user comments</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>

    </div>
  );
}
