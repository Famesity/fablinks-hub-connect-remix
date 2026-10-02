import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, BriefcaseBusiness, FileText, Loader2, Mail, MessageSquare, School, Sparkles } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  totalPosts: number;
  totalServices: number;
  totalSchools: number;
  pendingRequests: number;
  pendingContacts: number;
  pendingComments: number;
}

const initialStats: DashboardStats = {
  totalPosts: 0,
  totalServices: 0,
  totalSchools: 0,
  pendingRequests: 0,
  pendingContacts: 0,
  pendingComments: 0,
};

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [stats, setStats] = useState(initialStats);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/auth", { replace: true });
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchStats = async () => {
      try {
        const results = await Promise.all([
          supabase.from("blog_posts").select("id", { count: "exact", head: true }),
          supabase.from("services").select("id", { count: "exact", head: true }),
          supabase.from("schools").select("id", { count: "exact", head: true }),
          supabase.from("service_requests").select("id", { count: "exact", head: true }).or("status.eq.pending,status.is.null"),
          supabase.from("contact_submissions").select("id", { count: "exact", head: true }).or("status.eq.pending,status.is.null"),
          supabase.from("blog_comments").select("id", { count: "exact", head: true }).or("approved.eq.false,approved.is.null"),
        ]);

        const failedResult = results.find(({ error }) => error);
        if (failedResult?.error) throw failedResult.error;

        setStats({
          totalPosts: results[0].count ?? 0,
          totalServices: results[1].count ?? 0,
          totalSchools: results[2].count ?? 0,
          pendingRequests: results[3].count ?? 0,
          pendingContacts: results[4].count ?? 0,
          pendingComments: results[5].count ?? 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [isAdmin]);

  if (loading || loadingStats) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const metrics = [
    { label: "Blog posts", value: stats.totalPosts, detail: "Manage your content library", href: "/admin/blog", icon: FileText, tone: "text-blue-600 bg-blue-50" },
    { label: "Services", value: stats.totalServices, detail: "Services available on the platform", href: "/admin/services", icon: BriefcaseBusiness, tone: "text-emerald-600 bg-emerald-50" },
    { label: "Schools", value: stats.totalSchools, detail: "Schools in your directory", href: "/admin/schools", icon: School, tone: "text-violet-600 bg-violet-50" },
    { label: "Open requests", value: stats.pendingRequests, detail: "Service requests to review", href: "/admin/service-requests", icon: MessageSquare, tone: "text-amber-600 bg-amber-50" },
  ];

  const highlights = [
    { label: "Service requests", value: stats.pendingRequests, message: "Waiting for your review", href: "/admin/service-requests", icon: MessageSquare, tone: "text-amber-700 bg-amber-50" },
    { label: "Contact submissions", value: stats.pendingContacts, message: "Awaiting a response", href: "/admin/contact-submissions", icon: Mail, tone: "text-sky-700 bg-sky-50" },
    { label: "Comments to moderate", value: stats.pendingComments, message: "Pending approval", href: "/admin/comments", icon: MessageSquare, tone: "text-violet-700 bg-violet-50" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            Admin workspace
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Platform overview</h1>
          <p className="mt-1.5 text-sm text-slate-500">A clear snapshot of your content, services, and items that need attention.</p>
        </div>
        <Button asChild className="shrink-0 bg-indigo-600 hover:bg-indigo-700">
          <Link to="/admin/analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            View analytics
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      <section aria-labelledby="overview-metrics-title">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="overview-metrics-title" className="text-lg font-semibold text-slate-900">At a glance</h2>
            <p className="mt-1 text-sm text-slate-500">Key totals across your platform</p>
          </div>
          <Link to="/admin/analytics" className="hidden items-center gap-1 text-sm font-medium text-indigo-700 hover:text-indigo-800 sm:inline-flex">
            Detailed analytics <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, detail, href, icon: Icon, tone }) => (
            <Link key={label} to={href} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
              <Card className="h-full border-slate-200 shadow-sm transition-all group-hover:-translate-y-0.5 group-hover:border-indigo-200 group-hover:shadow-md">
                <CardContent className="flex items-start justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
                    <p className="mt-1 text-xs text-slate-500">{detail}</p>
                  </div>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="highlights-title">
        <div className="mb-4">
          <h2 id="highlights-title" className="text-lg font-semibold text-slate-900">Needs your attention</h2>
          <p className="mt-1 text-sm text-slate-500">Actionable updates to help keep things moving.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {highlights.map(({ label, value, message, href, icon: Icon, tone }) => (
            <Card key={label} className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <CardTitle className="text-sm font-semibold text-slate-900">{label}</CardTitle>
                    <CardDescription className="mt-1">{message}</CardDescription>
                  </div>
                </div>
                <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild variant="ghost" size="sm" className="-ml-3 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800">
                  <Link to={href}>
                    View more <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
