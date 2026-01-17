import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type ActivityAction = 
  | "created"
  | "updated"
  | "deleted"
  | "published"
  | "unpublished"
  | "approved"
  | "rejected"
  | "replied"
  | "featured"
  | "unfeatured"
  | "activated"
  | "deactivated"
  | "sent"
  | "exported"
  | "imported";

export type EntityType = 
  | "blog_post"
  | "page"
  | "comment"
  | "service"
  | "school"
  | "testimonial"
  | "contact"
  | "faq"
  | "hero_slide"
  | "trust_badge"
  | "featured_service"
  | "how_it_works"
  | "why_choose_us"
  | "announcement"
  | "notification"
  | "service_request"
  | "admin_user"
  | "site_settings"
  | "newsletter";

interface LogActivityParams {
  action: ActivityAction;
  entityType: EntityType;
  entityId?: string;
  entityTitle?: string;
  details?: Record<string, any>;
}

export function useActivityLog() {
  const { user } = useAuth();

  const logActivity = useCallback(async ({
    action,
    entityType,
    entityId,
    entityTitle,
    details
  }: LogActivityParams) => {
    if (!user) return;

    try {
      await supabase
        .from("admin_activity_logs")
        .insert({
          admin_id: user.id,
          admin_email: user.email,
          action,
          entity_type: entityType,
          entity_id: entityId || null,
          entity_title: entityTitle || null,
          details: details || null,
        });
    } catch (error) {
      console.error("Failed to log activity:", error);
      // Silently fail - don't interrupt user flow for logging
    }
  }, [user]);

  return { logActivity };
}
