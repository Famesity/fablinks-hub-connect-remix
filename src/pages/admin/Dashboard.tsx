import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, School, Briefcase, FileText, LogOut, Settings, Users, MessageSquare, FileCode, BarChart3, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdmin();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/auth");
    }
  }, [isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    navigate("/auth");
  };

  if (loading) {
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/schools">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <School className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Schools</CardTitle>
                <CardDescription>Add, edit, or remove schools</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/services">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Briefcase className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Services</CardTitle>
                <CardDescription>Add, edit, or remove services</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/blog">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <FileText className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Blog Posts</CardTitle>
                <CardDescription>Create and edit blog content</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/settings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Settings className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Customize website appearance</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Users className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>Add admins and manage roles</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/comments">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <MessageSquare className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Comments</CardTitle>
                <CardDescription>Moderate and reply to comments</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/pages">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <FileCode className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Pages</CardTitle>
                <CardDescription>Create and edit custom pages</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <BarChart3 className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Analytics</CardTitle>
                <CardDescription>View platform statistics</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/activity">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Activity className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>Recent platform activity</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
