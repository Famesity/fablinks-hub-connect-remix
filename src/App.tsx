import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
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
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute><AdminContent /></ProtectedRoute>} />
          <Route path="/admin/landing" element={<ProtectedRoute><AdminLanding /></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute><AdminCustomers /></ProtectedRoute>} />
          <Route path="/admin/schools" element={<ProtectedRoute><AdminSchools /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
          <Route path="/admin/blog" element={<ProtectedRoute><AdminBlogPosts /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSiteSettings /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/comments" element={<ProtectedRoute><AdminComments /></ProtectedRoute>} />
          <Route path="/admin/pages" element={<ProtectedRoute><AdminPages /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/admin/activity" element={<ProtectedRoute><AdminActivityLogs /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
          <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
          <Route path="/admin/contact-submissions" element={<ProtectedRoute><AdminContactSubmissions /></ProtectedRoute>} />
          <Route path="/admin/faqs" element={<ProtectedRoute><AdminFAQs /></ProtectedRoute>} />
          <Route path="/admin/newsletter" element={<ProtectedRoute><AdminNewsletter /></ProtectedRoute>} />
          <Route path="/admin/hero-slides" element={<ProtectedRoute><AdminHeroSlides /></ProtectedRoute>} />
          <Route path="/admin/trust-badges" element={<ProtectedRoute><AdminTrustBadges /></ProtectedRoute>} />
          <Route path="/admin/how-it-works" element={<ProtectedRoute><AdminHowItWorks /></ProtectedRoute>} />
          <Route path="/admin/featured-services" element={<ProtectedRoute><AdminFeaturedServices /></ProtectedRoute>} />
          <Route path="/admin/why-choose-us" element={<ProtectedRoute><AdminWhyChooseUs /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute><AdminEvents /></ProtectedRoute>} />
          <Route path="/admin/service-requests" element={<ProtectedRoute><AdminServiceRequests /></ProtectedRoute>} />
          <Route path="/admin/announcement" element={<ProtectedRoute><AdminAnnouncement /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute><AdminNotifications /></ProtectedRoute>} />
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
