import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, FileText, MessageSquare, Eye, Settings } from "lucide-react";
import { format } from "date-fns";

interface Activity {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  icon: any;
}

export default function AdminActivityLogs() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/auth");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchActivities();
    }
  }, [isAdmin]);

  const fetchActivities = async () => {
    try {
      const activities: Activity[] = [];

      // Fetch recent blog posts
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("id, title, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .limit(10);

      posts?.forEach(post => {
        activities.push({
          id: post.id,
          type: "blog_post",
          title: `Blog Post: ${post.title}`,
          timestamp: post.updated_at,
          icon: FileText,
        });
      });

      // Fetch recent comments
      const { data: comments } = await supabase
        .from("blog_comments")
        .select("id, content, created_at, author_name")
        .order("created_at", { ascending: false })
        .limit(10);

      comments?.forEach(comment => {
        activities.push({
          id: comment.id,
          type: "comment",
          title: `Comment by ${comment.author_name}`,
          timestamp: comment.created_at,
          icon: MessageSquare,
        });
      });

      // Fetch recent pages
      const { data: pages } = await supabase
        .from("pages")
        .select("id, title, updated_at")
        .order("updated_at", { ascending: false })
        .limit(10);

      pages?.forEach(page => {
        activities.push({
          id: page.id,
          type: "page",
          title: `Page: ${page.title}`,
          timestamp: page.updated_at,
          icon: Eye,
        });
      });

      // Sort all activities by timestamp
      activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(activities.slice(0, 20));
    } catch (error) {
      console.error("Error fetching activities:", error);
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold mt-4">Activity Logs</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div 
                    key={activity.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(activity.timestamp), "PPpp")}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">
                      {activity.type.replace("_", " ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
