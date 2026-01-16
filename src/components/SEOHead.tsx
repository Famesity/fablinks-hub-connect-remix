import { Helmet } from 'react-helmet';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
  noIndex?: boolean;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
}

export default function SEOHead({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonicalUrl,
  noIndex = false,
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
}: SEOHeadProps) {
  const { getSetting } = useSiteSettings();
  
  const siteTitle = getSetting('site_title', 'Fablinks Computers');
  const siteDescription = getSetting('site_description', 'Your trusted partner for WAEC, JAMB, NECO registrations, printing services, and all computer-assisted services in Nigeria');
  const siteLogo = getSetting('site_logo', '');
  const contactPhone = getSetting('contact_phone', '+234 706 812 2861');
  const contactEmail = getSetting('contact_email', 'fablinkscomputers@gmail.com');
  
  // Build the full title
  const fullTitle = title 
    ? `${title} | ${siteTitle}`
    : `${siteTitle} - Home for All Computer Assisted Services`;
  
  // Use provided values or fall back to site settings
  const metaDescription = description || siteDescription;
  const metaKeywords = keywords || 'WAEC, JAMB, NECO, NYSC, computer services, printing, Nigeria, student services, online registration';
  
  // Site base URL
  const siteUrl = 'https://fablinks-cyber-cafe.lovable.app';
  
  // Default OG image - use the generated OG image
  const defaultOgImage = `${siteUrl}/og-image.png`;
  const metaOgImage = ogImage || defaultOgImage;
  
  // Get the current URL for canonical
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const canonical = canonicalUrl || currentUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={siteTitle} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_NG" />
      
      {/* Article-specific Open Graph */}
      {ogType === 'article' && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {ogType === 'article' && articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      {ogType === 'article' && articleAuthor && (
        <meta property="article:author" content={articleAuthor} />
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaOgImage} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#1A73E8" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteTitle} />
      
      {/* Contact Information for Search Engines */}
      <meta name="contact" content={contactEmail} />
      
      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="NG-AB" />
      <meta name="geo.placename" content="Abia State, Nigeria" />
      
      {/* Language */}
      <meta httpEquiv="content-language" content="en-NG" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": siteTitle,
          "description": siteDescription,
          "url": siteUrl,
          "logo": metaOgImage,
          "image": metaOgImage,
          "telephone": contactPhone,
          "email": contactEmail,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Shop NO 35, Student Affairs",
            "addressLocality": "Abia State University Uturu",
            "addressRegion": "Abia State",
            "addressCountry": "NG"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "5.8837",
            "longitude": "7.3908"
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "08:00",
            "closes": "18:00"
          },
          "priceRange": "₦",
          "servesCuisine": "Computer Services",
          "sameAs": [
            getSetting('social_facebook', ''),
            getSetting('social_twitter', ''),
            getSetting('social_instagram', '')
          ].filter(Boolean)
        })}
      </script>
    </Helmet>
  );
}
