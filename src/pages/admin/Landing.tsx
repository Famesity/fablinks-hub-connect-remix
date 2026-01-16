import { Link } from "react-router-dom";
import { Image, Shield, ListChecks, Star, Award } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminBottomNav from "@/components/admin/AdminBottomNav";

export default function AdminLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-20">
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Landing Page
          </h1>
          <p className="text-sm text-gray-500 mt-1">Customize your homepage sections</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/hero-slides" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-rose-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-rose-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Image className="h-7 w-7 text-rose-600" />
                </div>
                <CardTitle className="text-xl">Hero Carousel</CardTitle>
                <CardDescription className="text-gray-600">Manage hero section slides, headlines, and CTAs</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/trust-badges" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-amber-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-amber-600" />
                </div>
                <CardTitle className="text-xl">Trust Badges</CardTitle>
                <CardDescription className="text-gray-600">Configure trust strip icons and text</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/how-it-works" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-sky-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-sky-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ListChecks className="h-7 w-7 text-sky-600" />
                </div>
                <CardTitle className="text-xl">How It Works</CardTitle>
                <CardDescription className="text-gray-600">Edit process steps and descriptions</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/featured-services" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-rose-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-rose-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Star className="h-7 w-7 text-rose-600" />
                </div>
                <CardTitle className="text-xl">Featured Services</CardTitle>
                <CardDescription className="text-gray-600">Manage landing page service cards</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/why-choose-us" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-emerald-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-7 w-7 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Why Choose Us</CardTitle>
                <CardDescription className="text-gray-600">Manage features and statistics</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>

      <AdminBottomNav />
    </div>
  );
}
