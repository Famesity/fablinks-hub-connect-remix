import { useEffect } from "react";
import { useSiteSettings } from "./useSiteSettings";

export function useTheme() {
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    if (!loading && settings) {
      const root = document.documentElement;
      
      // Apply theme colors from site settings
      if (settings.theme_primary_color) {
        root.style.setProperty('--primary', settings.theme_primary_color);
      }
      if (settings.theme_primary_foreground) {
        root.style.setProperty('--primary-foreground', settings.theme_primary_foreground);
      }
      if (settings.theme_accent_color) {
        root.style.setProperty('--accent', settings.theme_accent_color);
      }
      if (settings.theme_background) {
        root.style.setProperty('--background', settings.theme_background);
      }
      if (settings.theme_foreground) {
        root.style.setProperty('--foreground', settings.theme_foreground);
      }
      if (settings.theme_border_radius) {
        root.style.setProperty('--radius', settings.theme_border_radius);
      }
    }
  }, [settings, loading]);

  return { loading };
}
