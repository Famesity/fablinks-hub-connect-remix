import { Link } from "react-router-dom";
import { MessageSquare, Mail, HelpCircle, Newspaper } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminBottomNav from "@/components/admin/AdminBottomNav";

export default function AdminCustomers() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20">
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Customers
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer interactions and feedback</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/testimonials" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-yellow-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-7 w-7 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Testimonials</CardTitle>
                <CardDescription className="text-gray-600">Manage customer reviews and ratings</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/contact-submissions" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-lime-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-lime-100 to-lime-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="h-7 w-7 text-lime-600" />
                </div>
                <CardTitle className="text-xl">Contact Submissions</CardTitle>
                <CardDescription className="text-gray-600">View and respond to contact form messages</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/faqs" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-violet-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-violet-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <HelpCircle className="h-7 w-7 text-violet-600" />
                </div>
                <CardTitle className="text-xl">FAQs</CardTitle>
                <CardDescription className="text-gray-600">Manage frequently asked questions</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/newsletter" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-fuchsia-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-100 to-fuchsia-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Newspaper className="h-7 w-7 text-fuchsia-600" />
                </div>
                <CardTitle className="text-xl">Newsletter</CardTitle>
                <CardDescription className="text-gray-600">Manage newsletter subscribers</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>

      <AdminBottomNav />
    </div>
  );
}
