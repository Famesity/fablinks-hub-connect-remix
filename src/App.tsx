
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSchools from "./pages/admin/Schools";
import AdminServices from "./pages/admin/Services";
import AdminBlogPosts from "./pages/admin/BlogPosts";
import AdminSiteSettings from "./pages/admin/SiteSettings";
import AdminUsers from "./pages/admin/Users";
import AdminComments from "./pages/admin/Comments";
import AdminPages from "./pages/admin/Pages";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminActivityLogs from "./pages/admin/ActivityLogs";
import AdminProfile from "./pages/admin/Profile";
import BlogPost from "./pages/BlogPost";
import Page from "./pages/Page";

const queryClient = new QueryClient();

function AppContent() {
  useTheme();
  return (
    <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/schools" element={<AdminSchools />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/blog" element={<AdminBlogPosts />} />
          <Route path="/admin/settings" element={<AdminSiteSettings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/comments" element={<AdminComments />} />
          <Route path="/admin/pages" element={<AdminPages />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/activity" element={<AdminActivityLogs />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/page/:slug" element={<Page />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
