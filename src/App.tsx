
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
import AdminContent from "./pages/admin/Content";
import AdminLanding from "./pages/admin/Landing";
import AdminCustomers from "./pages/admin/Customers";
import AdminAnnouncementBar from "./pages/admin/AnnouncementBar";
import AdminServiceRequests from "./pages/admin/ServiceRequests";
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
          <Route path="/search" element={<Search />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/landing" element={<AdminLanding />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
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
          <Route path="/admin/testimonials" element={<AdminTestimonials />} />
          <Route path="/admin/contact-submissions" element={<AdminContactSubmissions />} />
          <Route path="/admin/faqs" element={<AdminFAQs />} />
          <Route path="/admin/newsletter" element={<AdminNewsletter />} />
          <Route path="/admin/hero-slides" element={<AdminHeroSlides />} />
          <Route path="/admin/trust-badges" element={<AdminTrustBadges />} />
          <Route path="/admin/how-it-works" element={<AdminHowItWorks />} />
          <Route path="/admin/featured-services" element={<AdminFeaturedServices />} />
          <Route path="/admin/why-choose-us" element={<AdminWhyChooseUs />} />
          <Route path="/admin/announcement" element={<AdminAnnouncementBar />} />
          <Route path="/admin/service-requests" element={<AdminServiceRequests />} />
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
