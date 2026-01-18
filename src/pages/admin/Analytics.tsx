import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeft, TrendingUp, Users, FileText, Eye, MessageSquare } from "lucide-react";
import { PermissionGate } from "@/components/admin/PermissionGate";
import { ADMIN_PERMISSIONS } from "@/hooks/usePermissions";

export default function AdminAnalytics() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalComments: 0,
    approvedComments: 0,
    totalPages: 0,
    publishedPages: 0,
    totalServices: 0,
    totalSchools: 0,
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/auth");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
    }
  }, [isAdmin]);

  const fetchAnalytics = async () => {
    try {
      const [posts, comments, pages, services, schools] = await Promise.all([
        supabase.from("blog_posts").select("id, published", { count: "exact" }),
        supabase.from("blog_comments").select("id, approved", { count: "exact" }),
        supabase.from("pages").select("id, published", { count: "exact" }),
        supabase.from("services").select("id", { count: "exact" }),
        supabase.from("schools").select("id", { count: "exact" }),
      ]);

      setStats({
        totalPosts: posts.count || 0,
        publishedPosts: posts.data?.filter(p => p.published).length || 0,
        totalComments: comments.count || 0,
        approvedComments: comments.data?.filter(c => c.approved).length || 0,
        totalPages: pages.count || 0,
        publishedPages: pages.data?.filter(p => p.published).length || 0,
        totalServices: services.count || 0,
        totalSchools: schools.count || 0,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const analyticsCards = [
    {
      title: "Blog Posts",
      value: stats.totalPosts,
      subtitle: `${stats.publishedPosts} published`,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Comments",
      value: stats.totalComments,
      subtitle: `${stats.approvedComments} approved`,
      icon: MessageSquare,
      color: "text-green-600",
    },
    {
      title: "Pages",
      value: stats.totalPages,
      subtitle: `${stats.publishedPages} published`,
      icon: Eye,
      color: "text-purple-600",
    },
    {
      title: "Services",
      value: stats.totalServices,
      subtitle: "Active services",
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      title: "Schools",
      value: stats.totalSchools,
      subtitle: "Registered schools",
      icon: Users,
      color: "text-indigo-600",
    },
  ];

  return (
    <PermissionGate permission={ADMIN_PERMISSIONS.VIEW_ANALYTICS}>
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold mt-4">Analytics Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
            <CardDescription>Overview of your platform's performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Engagement Rate</span>
              <span className="text-sm text-muted-foreground">
                {stats.totalPosts > 0 
                  ? ((stats.totalComments / stats.totalPosts) * 100).toFixed(1) 
                  : 0}% comments per post
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Comment Approval Rate</span>
              <span className="text-sm text-muted-foreground">
                {stats.totalComments > 0 
                  ? ((stats.approvedComments / stats.totalComments) * 100).toFixed(1) 
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Content Publication Rate</span>
              <span className="text-sm text-muted-foreground">
                {stats.totalPosts > 0 
                  ? ((stats.publishedPosts / stats.totalPosts) * 100).toFixed(1) 
                  : 0}% posts published
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
    </PermissionGate>
  );
}
