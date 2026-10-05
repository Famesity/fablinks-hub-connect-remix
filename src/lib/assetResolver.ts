// Utility for resolving asset URLs that may be stored as /src/assets/ paths in the database
// In production, Vite bundles assets with hashed filenames, so direct paths don't work

import defaultLogo from '@/assets/defabs-logo.jpg';
import heroComputerServices from '@/assets/hero-computer-services.jpg';
import heroPrintingServices from '@/assets/hero-printing-services.jpg';
import heroOnlineRegistrations from '@/assets/hero-online-registrations.jpg';
import heroGraphicsDesign from '@/assets/hero-graphics-design.jpg';

// Map of asset paths to imported images for production builds
const assetMap: Record<string, string> = {
  '/src/assets/fablinks-logo.jpg': defaultLogo,
  '/src/assets/defabs-logo.jpg': defaultLogo,
  '/src/assets/hero-computer-services.jpg': heroComputerServices,
  '/src/assets/hero-printing-services.jpg': heroPrintingServices,
  '/src/assets/hero-online-registrations.jpg': heroOnlineRegistrations,
  '/src/assets/hero-graphics-design.jpg': heroGraphicsDesign,
};

/**
 * Resolves an image URL that may be stored as a /src/assets/ path in the database
 * to the actual bundled asset URL for production builds.
 * 
 * @param imageUrl - The URL from the database (could be /src/assets/..., external URL, or null)
 * @param fallback - Optional fallback image to use if the URL can't be resolved
 * @returns The resolved image URL
 */
export const resolveAssetUrl = (imageUrl: string | null | undefined, fallback?: string): string => {
  if (!imageUrl) {
    return fallback || defaultLogo;
  }
  
  // Check if it's a mapped asset path
  if (assetMap[imageUrl]) {
    return assetMap[imageUrl];
  }
  
  // Check if it's a relative src/assets path that we might not have mapped
  if (imageUrl.startsWith('/src/assets/')) {
    console.warn(`Unmapped asset path: ${imageUrl}. Using fallback.`);
    return fallback || defaultLogo;
  }
  
  // External URL or public folder path - use as-is
  return imageUrl;
};

/**
 * Export the default logo for direct use
 */
export { defaultLogo };

/**
 * Export hero images for direct use
 */
export const heroImages = {
  computerServices: heroComputerServices,
  printingServices: heroPrintingServices,
  onlineRegistrations: heroOnlineRegistrations,
  graphicsDesign: heroGraphicsDesign,
};
