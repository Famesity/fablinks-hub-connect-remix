
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
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminContactSubmissions from "./pages/admin/ContactSubmissions";
import AdminFAQs from "./pages/admin/FAQs";
import AdminNewsletter from "./pages/admin/Newsletter";
import AdminHeroSlides from "./pages/admin/HeroSlides";
import AdminTrustBadges from "./pages/admin/TrustBadges";
import AdminHowItWorks from "./pages/admin/HowItWorks";
import AdminFeaturedServices from "./pages/admin/FeaturedServices";
import AdminWhyChooseUs from "./pages/admin/WhyChooseUs";
import AdminEvents from "./pages/admin/Events";
import AdminContent from "./pages/admin/Content";
import AdminLanding from "./pages/admin/Landing";
import AdminCustomers from "./pages/admin/Customers";
import AdminServiceRequests from "./pages/admin/ServiceRequests";
import AdminAnnouncement from "./pages/admin/Announcement";
import AdminNotifications from "./pages/admin/Notifications";
import BlogPost from "./pages/BlogPost";
import Page from "./pages/Page";
import Install from "./pages/Install";

const queryClient = new QueryClient();

function AppContent() {
  useTheme();
  return (
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
