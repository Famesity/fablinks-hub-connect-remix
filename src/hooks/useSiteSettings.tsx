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
        // JSONB values are already parsed by Supabase client
        // Just extract the string value
        try {
          if (typeof setting.value === 'string') {
            settingsMap[setting.key] = setting.value;
          } else {
            // Value is already a parsed object/string, just use it
            settingsMap[setting.key] = String(setting.value);
          }
        } catch (e) {
          console.error(`Error parsing setting ${setting.key}:`, e);
          settingsMap[setting.key] = '';
        }
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
