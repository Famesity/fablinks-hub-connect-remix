import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

// Define all available admin permissions
export const ADMIN_PERMISSIONS = {
  // Content Management
  MANAGE_BLOG: "manage_blog",
  MANAGE_PAGES: "manage_pages",
  MANAGE_COMMENTS: "manage_comments",
  
  // Services & Schools
  MANAGE_SERVICES: "manage_services",
  MANAGE_SCHOOLS: "manage_schools",
  MANAGE_SERVICE_REQUESTS: "manage_service_requests",
  
  // Landing Page
  MANAGE_HERO: "manage_hero",
  MANAGE_FEATURED_SERVICES: "manage_featured_services",
  MANAGE_WHY_CHOOSE_US: "manage_why_choose_us",
  MANAGE_TRUST_BADGES: "manage_trust_badges",
  MANAGE_HOW_IT_WORKS: "manage_how_it_works",
  
  // Customer Engagement
  MANAGE_TESTIMONIALS: "manage_testimonials",
  MANAGE_CONTACTS: "manage_contacts",
  MANAGE_FAQS: "manage_faqs",
  MANAGE_NEWSLETTER: "manage_newsletter",
  
  // Settings & System
  MANAGE_SETTINGS: "manage_settings",
  MANAGE_ANNOUNCEMENT: "manage_announcement",
  MANAGE_NOTIFICATIONS: "manage_notifications",
  VIEW_ANALYTICS: "view_analytics",
  VIEW_ACTIVITY_LOGS: "view_activity_logs",
  
  // Admin Management - Only super admins (no restrictions) can do this
  MANAGE_ADMINS: "manage_admins",
} as const;

export type AdminPermission = typeof ADMIN_PERMISSIONS[keyof typeof ADMIN_PERMISSIONS];

// Permission categories for UI grouping
export const PERMISSION_CATEGORIES = {
  "Content Management": [
    { key: ADMIN_PERMISSIONS.MANAGE_BLOG, label: "Blog Posts", description: "Create, edit, and delete blog posts" },
    { key: ADMIN_PERMISSIONS.MANAGE_PAGES, label: "Pages", description: "Manage custom pages" },
    { key: ADMIN_PERMISSIONS.MANAGE_COMMENTS, label: "Comments", description: "Moderate blog comments" },
  ],
  "Services & Schools": [
    { key: ADMIN_PERMISSIONS.MANAGE_SERVICES, label: "Services", description: "Manage service listings" },
    { key: ADMIN_PERMISSIONS.MANAGE_SCHOOLS, label: "Schools", description: "Manage school profiles" },
    { key: ADMIN_PERMISSIONS.MANAGE_SERVICE_REQUESTS, label: "Service Requests", description: "View and respond to requests" },
  ],
  "Landing Page": [
    { key: ADMIN_PERMISSIONS.MANAGE_HERO, label: "Hero Carousel", description: "Edit hero slides" },
    { key: ADMIN_PERMISSIONS.MANAGE_FEATURED_SERVICES, label: "Featured Services", description: "Manage featured services" },
    { key: ADMIN_PERMISSIONS.MANAGE_WHY_CHOOSE_US, label: "Why Choose Us", description: "Edit features section" },
    { key: ADMIN_PERMISSIONS.MANAGE_TRUST_BADGES, label: "Trust Badges", description: "Manage trust indicators" },
    { key: ADMIN_PERMISSIONS.MANAGE_HOW_IT_WORKS, label: "How It Works", description: "Edit process steps" },
  ],
  "Customer Engagement": [
    { key: ADMIN_PERMISSIONS.MANAGE_TESTIMONIALS, label: "Testimonials", description: "Approve and manage reviews" },
    { key: ADMIN_PERMISSIONS.MANAGE_CONTACTS, label: "Contacts", description: "View contact submissions" },
    { key: ADMIN_PERMISSIONS.MANAGE_FAQS, label: "FAQs", description: "Manage FAQ entries" },
    { key: ADMIN_PERMISSIONS.MANAGE_NEWSLETTER, label: "Newsletter", description: "Manage subscribers" },
  ],
  "Settings & System": [
    { key: ADMIN_PERMISSIONS.MANAGE_SETTINGS, label: "Site Settings", description: "Configure site settings" },
    { key: ADMIN_PERMISSIONS.MANAGE_ANNOUNCEMENT, label: "Announcements", description: "Manage announcement bar" },
    { key: ADMIN_PERMISSIONS.MANAGE_NOTIFICATIONS, label: "Notifications", description: "Send push notifications" },
    { key: ADMIN_PERMISSIONS.VIEW_ANALYTICS, label: "Analytics", description: "View site analytics" },
    { key: ADMIN_PERMISSIONS.VIEW_ACTIVITY_LOGS, label: "Activity Logs", description: "View system logs" },
  ],
  "Administration": [
    { key: ADMIN_PERMISSIONS.MANAGE_ADMINS, label: "Manage Admins", description: "Add and remove other admins" },
  ],
};

interface UsePermissionsReturn {
  permissions: string[];
  loading: boolean;
  isSuperAdmin: boolean;
  hasPermission: (permission: AdminPermission) => boolean;
  refreshPermissions: () => Promise<void>;
}

export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const fetchPermissions = useCallback(async () => {
    if (!user) {
      setPermissions([]);
      setIsSuperAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("admin_permissions")
        .select("permission")
        .eq("user_id", user.id);

      if (error) throw error;

      // If no permissions are set, the admin is a super admin with full access
      if (!data || data.length === 0) {
        setIsSuperAdmin(true);
        setPermissions(Object.values(ADMIN_PERMISSIONS));
      } else {
        setIsSuperAdmin(false);
        setPermissions(data.map((p) => p.permission));
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
      setPermissions([]);
      setIsSuperAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const hasPermission = useCallback(
    (permission: AdminPermission): boolean => {
      if (isSuperAdmin) return true;
      return permissions.includes(permission);
    },
    [permissions, isSuperAdmin]
  );

  return {
    permissions,
    loading,
    isSuperAdmin,
    hasPermission,
    refreshPermissions: fetchPermissions,
  };
}
