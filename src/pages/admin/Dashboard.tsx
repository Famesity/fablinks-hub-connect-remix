import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, School, Briefcase, FileText, LogOut, Settings, Users, MessageSquare, FileCode, BarChart3, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdmin();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalServices: 0,
    totalComments: 0,
    totalSchools: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/auth");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const [posts, services, comments, schools] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact" }),
        supabase.from("services").select("id", { count: "exact" }),
        supabase.from("blog_comments").select("id", { count: "exact" }),
        supabase.from("schools").select("id", { count: "exact" }),
      ]);

      setStats({
        totalPosts: posts.count || 0,
        totalServices: services.count || 0,
        totalComments: comments.count || 0,
        totalSchools: schools.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    navigate("/auth");
  };

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Premium Header with Gradient */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back, manage your platform</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/admin/profile">
                <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
                  <Users className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button 
                onClick={handleSignOut} 
                variant="outline"
                className="border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Posts</p>
                  <h3 className="text-3xl font-bold">{stats.totalPosts}</h3>
                </div>
                <FileText className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-green-100 text-sm mb-1">Services</p>
                  <h3 className="text-3xl font-bold">{stats.totalServices}</h3>
                </div>
                <Briefcase className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-purple-100 text-sm mb-1">Comments</p>
                  <h3 className="text-3xl font-bold">{stats.totalComments}</h3>
                </div>
                <MessageSquare className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-orange-100 text-sm mb-1">Schools</p>
                  <h3 className="text-3xl font-bold">{stats.totalSchools}</h3>
                </div>
                <School className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/schools" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <School className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Manage Schools</CardTitle>
                <CardDescription className="text-gray-600">Add, edit, or remove schools from the database</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/services" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="h-7 w-7 text-green-600" />
                </div>
                <CardTitle className="text-xl">Manage Services</CardTitle>
                <CardDescription className="text-gray-600">Configure services offered on the platform</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/blog" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-7 w-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Blog Posts</CardTitle>
                <CardDescription className="text-gray-600">Create and publish engaging content</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/settings" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Settings className="h-7 w-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Site Settings</CardTitle>
                <CardDescription className="text-gray-600">Customize website appearance and branding</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/users" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7 text-orange-600" />
                </div>
                <CardTitle className="text-xl">User Management</CardTitle>
                <CardDescription className="text-gray-600">Manage admins and user permissions</CardDescription>
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

          <Link to="/admin/analytics" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-cyan-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-7 w-7 text-cyan-600" />
                </div>
                <CardTitle className="text-xl">Analytics</CardTitle>
                <CardDescription className="text-gray-600">View detailed platform statistics</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/activity" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-teal-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="h-7 w-7 text-teal-600" />
                </div>
                <CardTitle className="text-xl">Activity Logs</CardTitle>
                <CardDescription className="text-gray-600">Track recent platform activities</CardDescription>
              </CardHeader>
            </Card>
          </Link>

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
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-red-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-7 w-7 text-red-600" />
                </div>
                <CardTitle className="text-xl">Contact Forms</CardTitle>
                <CardDescription className="text-gray-600">View and respond to contact submissions</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/faqs" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-lime-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-lime-100 to-lime-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-7 w-7 text-lime-600" />
                </div>
                <CardTitle className="text-xl">FAQs</CardTitle>
                <CardDescription className="text-gray-600">Manage frequently asked questions</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/newsletter" className="group">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-emerald-300 cursor-pointer group-hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Newsletter</CardTitle>
                <CardDescription className="text-gray-600">Manage email subscribers</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
