import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  [key: string]: string;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;

      const settingsMap: SiteSettings = {};
      data?.forEach((setting) => {
        // Parse the JSONB value - it's stored as a JSON string
        settingsMap[setting.key] = typeof setting.value === 'string' 
          ? setting.value 
          : JSON.parse(JSON.stringify(setting.value));
      });

      setSettings(settingsMap);
    } catch (error) {
      console.error("Error fetching site settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: string, defaultValue: string = ""): string => {
    return settings[key] || defaultValue;
  };

  return { settings, loading, getSetting, refetch: fetchSettings };
}
