import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Layout, 
  Users, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Content",
    icon: FileText,
    href: "/admin/content",
  },
  {
    label: "Landing",
    icon: Layout,
    href: "/admin/landing",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/admin/customers",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export default function AdminBottomNav() {
  const location = useLocation();
  
  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors",
                active 
                  ? "text-primary" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-1", active && "text-primary")} />
              <span className={cn(
                "text-xs font-medium",
                active && "text-primary"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
