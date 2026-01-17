import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeft, FileText, MessageSquare, Eye, Settings, User, Shield, Bell, ClipboardList, School, Briefcase, Star, HelpCircle, Image } from "lucide-react";
import { format } from "date-fns";
import { PermissionGate } from "@/components/admin/PermissionGate";
import { ADMIN_PERMISSIONS } from "@/hooks/usePermissions";
import { Badge } from "@/components/ui/badge";

interface ActivityLog {
  id: string;
  admin_id: string;
  admin_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_title: string | null;
  details: Record<string, any> | null;
  created_at: string;
}

const entityIcons: Record<string, any> = {
  blog_post: FileText,
  page: Eye,
  comment: MessageSquare,
  service: Briefcase,
  school: School,
  testimonial: Star,
  contact: MessageSquare,
  faq: HelpCircle,
  hero_slide: Image,
  trust_badge: Shield,
  featured_service: Star,
  how_it_works: ClipboardList,
  why_choose_us: Star,
  announcement: Bell,
  notification: Bell,
  service_request: ClipboardList,
  admin_user: User,
  site_settings: Settings,
  newsletter: Bell,
};

const actionColors: Record<string, string> = {
  created: "bg-green-100 text-green-700",
  updated: "bg-blue-100 text-blue-700",
  deleted: "bg-red-100 text-red-700",
  published: "bg-purple-100 text-purple-700",
  unpublished: "bg-gray-100 text-gray-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  replied: "bg-blue-100 text-blue-700",
  featured: "bg-yellow-100 text-yellow-700",
  unfeatured: "bg-gray-100 text-gray-700",
  activated: "bg-green-100 text-green-700",
  deactivated: "bg-gray-100 text-gray-700",
  sent: "bg-purple-100 text-purple-700",
  exported: "bg-blue-100 text-blue-700",
  imported: "bg-green-100 text-green-700",
};

export default function AdminActivityLogs() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

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
      const { data, error } = await supabase
        .from("admin_activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setActivities((data || []) as ActivityLog[]);
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
    <PermissionGate permission={ADMIN_PERMISSIONS.VIEW_ACTIVITY_LOGS}>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate("/admin")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold mt-4">Activity Logs</h1>
            <p className="text-muted-foreground">Track all admin actions across the platform</p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Last 100 admin actions</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activity logs yet</p>
                  <p className="text-sm">Admin actions will be recorded here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => {
                    const Icon = entityIcons[activity.entity_type] || Settings;
                    const actionColor = actionColors[activity.action] || "bg-gray-100 text-gray-700";
                    
                    return (
                      <div 
                        key={activity.id} 
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                      >
                        <div className="flex items-start space-x-4 min-w-0 flex-1">
                          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={actionColor} variant="secondary">
                                {activity.action}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {activity.entity_type.replace(/_/g, " ")}
                              </span>
                            </div>
                            <p className="font-medium mt-1 truncate">
                              {activity.entity_title || activity.entity_id || "Unknown"}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span className="truncate">{activity.admin_email || "Unknown admin"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-muted-foreground whitespace-nowrap">
                            {format(new Date(activity.created_at), "MMM d, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(activity.created_at), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </PermissionGate>
  );
}
