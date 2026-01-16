import { useEffect } from "react";
import { useSiteSettings } from "./useSiteSettings";

export function useTheme() {
  const { loading } = useSiteSettings();

  // Theme is now purely CSS-based from index.css
  // No dynamic theme switching

  return { loading };
}
