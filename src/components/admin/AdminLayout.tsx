import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  FileText,
  Globe2,
  HelpCircle,
  Image,
  LayoutDashboard,
  LayoutGrid,
  ListChecks,
  Mail,
  Megaphone,
  Menu,
  LogOut,
  MessageSquare,
  Newspaper,
  PanelTop,
  School,
  Settings,
  Shield,
  Sparkles,
  Star,
  UserRound,
  Users,
  Award,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Content", href: "/admin/content", icon: FileText },
      { label: "Landing page", href: "/admin/landing", icon: PanelTop },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Schools", href: "/admin/schools", icon: School },
      { label: "Services", href: "/admin/services", icon: BriefcaseBusiness },
      { label: "Service requests", href: "/admin/service-requests", icon: MessageSquare },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Blog posts", href: "/admin/blog", icon: Newspaper },
      { label: "Pages", href: "/admin/pages", icon: LayoutGrid },
      { label: "Comments", href: "/admin/comments", icon: MessageSquare },
      { label: "Hero slides", href: "/admin/hero-slides", icon: Image },
      { label: "Trust badges", href: "/admin/trust-badges", icon: Shield },
      { label: "How it works", href: "/admin/how-it-works", icon: ListChecks },
      { label: "Featured services", href: "/admin/featured-services", icon: Star },
      { label: "Why choose us", href: "/admin/why-choose-us", icon: Award },
      { label: "Events", href: "/admin/events", icon: CalendarDays },
    ],
  },
  {
    label: "Engagement",
    items: [
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
      { label: "Contact submissions", href: "/admin/contact-submissions", icon: Mail },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
      { label: "Newsletter", href: "/admin/newsletter", icon: Newspaper },
      { label: "Announcement", href: "/admin/announcement", icon: Megaphone },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Activity logs", href: "/admin/activity", icon: Activity },
      { label: "Site settings", href: "/admin/settings", icon: Settings },
      { label: "Manage admins", href: "/admin/users", icon: UserRound },
      { label: "Profile", href: "/admin/profile", icon: UserRound },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin" || pathname === "/admin/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();

  return (
    <nav className="space-y-6" aria-label="Admin navigation">
      {navigation.map((section) => (
        <section key={section.label}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {section.label}
          </p>
          <div className="space-y-1">
            {section.items.map(({ label, href, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  to={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                    active
                      ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-inset ring-indigo-100"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {active && <ChevronRight className="h-3.5 w-3.5 text-indigo-600" />}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </nav>
  );
}

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-slate-200 bg-white text-slate-900 lg:flex">
      <Link to="/admin" className="flex h-[72px] items-center gap-3 border-b border-slate-200 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold tracking-wide">Fablinks Hub</span>
          <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Administration</span>
        </span>
      </Link>

      <div className="flex-1 overflow-y-auto px-3 py-6">
        <NavigationLinks />
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="flex min-w-0 items-center gap-3 rounded-lg bg-slate-50 p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {user?.email?.charAt(0).toUpperCase() ?? "A"}
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-medium text-slate-900">Administrator</span>
            <span className="mt-1 block truncate text-[11px] text-slate-500">{user?.email}</span>
          </span>
        </div>
      </div>
    </aside>
  );
}

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPage = navigation
    .flatMap((section) => section.items)
    .find(({ href }) => isActive(location.pathname, href))?.label ?? "Admin";

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen lg:pl-[264px]">
        <header className="relative z-20 flex h-[64px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 lg:hidden" aria-label="Open admin menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[290px] border-slate-200 bg-white p-0 text-slate-900 sm:max-w-[290px]">
                <div className="flex h-[72px] items-center gap-3 border-b border-slate-200 px-5 pr-12">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">Fablinks Hub</span>
                    <SheetTitle className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Administration</SheetTitle>
                  </span>
                </div>
                <div className="h-[calc(100%-72px)] overflow-y-auto px-3 py-6">
                  <NavigationLinks onNavigate={() => setMenuOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{currentPage}</p>
              <p className="hidden text-xs text-slate-500 sm:block">Fablinks Hub <span className="px-1.5 text-slate-300">/</span> Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <span className="hidden max-w-[190px] truncate text-xs text-slate-500 md:block">{user?.email}</span>
            <Button asChild variant="ghost" size="sm" className="hidden text-slate-600 hover:text-slate-900 sm:inline-flex">
              <Link to="/">
                <Globe2 className="mr-2 h-4 w-4" />
                View site
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to="/admin/profile">
                <UserRound className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="px-2 text-slate-600 hover:text-rose-600 sm:px-3">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
