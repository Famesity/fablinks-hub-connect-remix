import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Experience from "./pages/Experience";
import Services from "./pages/Services";
import Request from "./pages/Request";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Search from "./pages/Search";
// Admin pages are code-split so the public landing stays lean.
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminSchools = lazy(() => import("./pages/admin/Schools"));
const AdminServices = lazy(() => import("./pages/admin/Services"));
const AdminBlogPosts = lazy(() => import("./pages/admin/BlogPosts"));
const AdminSiteSettings = lazy(() => import("./pages/admin/SiteSettings"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminComments = lazy(() => import("./pages/admin/Comments"));
const AdminPages = lazy(() => import("./pages/admin/Pages"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminActivityLogs = lazy(() => import("./pages/admin/ActivityLogs"));
const AdminProfile = lazy(() => import("./pages/admin/Profile"));
const AdminTestimonials = lazy(() => import("./pages/admin/Testimonials"));
const AdminContactSubmissions = lazy(() => import("./pages/admin/ContactSubmissions"));
const AdminFAQs = lazy(() => import("./pages/admin/FAQs"));
const AdminNewsletter = lazy(() => import("./pages/admin/Newsletter"));
const AdminHeroSlides = lazy(() => import("./pages/admin/HeroSlides"));
const AdminTrustBadges = lazy(() => import("./pages/admin/TrustBadges"));
const AdminHowItWorks = lazy(() => import("./pages/admin/HowItWorks"));
const AdminFeaturedServices = lazy(() => import("./pages/admin/FeaturedServices"));
const AdminWhyChooseUs = lazy(() => import("./pages/admin/WhyChooseUs"));
const AdminEvents = lazy(() => import("./pages/admin/Events"));
const AdminContent = lazy(() => import("./pages/admin/Content"));
const AdminLanding = lazy(() => import("./pages/admin/Landing"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminServiceRequests = lazy(() => import("./pages/admin/ServiceRequests"));
const AdminAnnouncement = lazy(() => import("./pages/admin/Announcement"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications"));
import BlogPost from "./pages/BlogPost";
import Page from "./pages/Page";
import Install from "./pages/Install";

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

function AppContent() {
  useTheme();
  return (
    <Suspense fallback={<RouteFallback />}>
    <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/services" element={<Services />} />
          <Route path="/request" element={<Request />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/search" element={<Search />} />
          <Route path="/install" element={<Install />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="landing" element={<AdminLanding />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="schools" element={<AdminSchools />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="blog" element={<AdminBlogPosts />} />
            <Route path="settings" element={<AdminSiteSettings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="activity" element={<AdminActivityLogs />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="contact-submissions" element={<AdminContactSubmissions />} />
            <Route path="faqs" element={<AdminFAQs />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
            <Route path="hero-slides" element={<AdminHeroSlides />} />
            <Route path="trust-badges" element={<AdminTrustBadges />} />
            <Route path="how-it-works" element={<AdminHowItWorks />} />
            <Route path="featured-services" element={<AdminFeaturedServices />} />
            <Route path="why-choose-us" element={<AdminWhyChooseUs />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="service-requests" element={<AdminServiceRequests />} />
            <Route path="announcement" element={<AdminAnnouncement />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Route>
          <Route path="/page/:slug" element={<Page />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Suspense>
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
