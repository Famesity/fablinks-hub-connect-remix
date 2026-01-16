import { useEffect } from "react";
import { useSiteSettings } from "./useSiteSettings";

// Convert hex color to HSL values (without hsl() wrapper)
function hexToHSL(hex: string): string | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return null;
  }

  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Check if value is already HSL format (e.g., "217 91% 50%")
function isHSLFormat(value: string): boolean {
  return /^\d+\s+\d+%\s+\d+%$/.test(value.trim());
}

// Convert any color format to HSL values
function toHSLValues(color: string): string | null {
  if (!color) return null;
  
  const trimmed = color.trim();
  
  // Already in HSL values format
  if (isHSLFormat(trimmed)) {
    return trimmed;
  }
  
  // Hex format
  if (trimmed.startsWith('#')) {
    return hexToHSL(trimmed);
  }
  
  // hsl() or hsla() format - extract values
  const hslMatch = trimmed.match(/hsla?\(\s*(\d+)\s*,?\s*(\d+)%?\s*,?\s*(\d+)%?/);
  if (hslMatch) {
    return `${hslMatch[1]} ${hslMatch[2]}% ${hslMatch[3]}%`;
  }
  
  return null;
}

export function useTheme() {
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    if (!loading && settings) {
      const root = document.documentElement;
      
      // Apply theme colors from site settings (convert to HSL format)
      if (settings.theme_primary_color) {
        const hsl = toHSLValues(settings.theme_primary_color);
        if (hsl) {
          root.style.setProperty('--primary', hsl);
          root.style.setProperty('--ring', hsl);
        }
      }
      if (settings.theme_primary_foreground) {
        const hsl = toHSLValues(settings.theme_primary_foreground);
        if (hsl) root.style.setProperty('--primary-foreground', hsl);
      }
      if (settings.theme_accent_color) {
        const hsl = toHSLValues(settings.theme_accent_color);
        if (hsl) root.style.setProperty('--accent', hsl);
      }
      if (settings.theme_background) {
        const hsl = toHSLValues(settings.theme_background);
        if (hsl) root.style.setProperty('--background', hsl);
      }
      if (settings.theme_foreground) {
        const hsl = toHSLValues(settings.theme_foreground);
        if (hsl) root.style.setProperty('--foreground', hsl);
      }
      if (settings.theme_border_radius) {
        // Border radius doesn't need conversion
        root.style.setProperty('--radius', settings.theme_border_radius);
      }
    }
  }, [settings, loading]);

  return { loading };
}
