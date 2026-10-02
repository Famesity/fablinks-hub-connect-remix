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
