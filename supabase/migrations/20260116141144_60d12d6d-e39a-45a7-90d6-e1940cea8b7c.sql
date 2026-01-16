-- Insert Terms of Service page if not exists
INSERT INTO public.pages (title, slug, content, published, seo_title, seo_description)
VALUES (
  'Terms of Service',
  'terms-of-service',
  '<h1>Terms of Service</h1><p>Welcome to Fablinks Online Café. By using our services, you agree to these terms.</p><h2>1. Services</h2><p>We provide educational support services including exam registration, document processing, and academic assistance.</p><h2>2. User Responsibilities</h2><p>Users must provide accurate information and use our services lawfully.</p><h2>3. Payment Terms</h2><p>Payment is required before service delivery. Refunds are handled on a case-by-case basis.</p><h2>4. Privacy</h2><p>We respect your privacy. See our Privacy Policy for details.</p><h2>5. Limitations</h2><p>We are not liable for delays caused by third-party systems or government portals.</p><h2>6. Contact</h2><p>For questions, contact us via WhatsApp or email.</p>',
  true,
  'Terms of Service - Fablinks Online Café',
  'Read our terms of service for using Fablinks Online Café educational services.'
) ON CONFLICT (slug) DO NOTHING;

-- Insert Privacy Policy page if not exists
INSERT INTO public.pages (title, slug, content, published, seo_title, seo_description)
VALUES (
  'Privacy Policy',
  'privacy-policy',
  '<h1>Privacy Policy</h1><p>At Fablinks Online Café, we are committed to protecting your privacy.</p><h2>1. Information We Collect</h2><p>We collect personal information you provide when using our services, including name, email, phone number, and academic details.</p><h2>2. How We Use Your Information</h2><p>Your information is used to provide services, communicate with you, and improve our offerings.</p><h2>3. Data Security</h2><p>We implement security measures to protect your personal information.</p><h2>4. Third-Party Services</h2><p>We may share information with third parties only to provide our services (e.g., payment processors, exam bodies).</p><h2>5. Cookies</h2><p>We use cookies to improve user experience. You can manage cookie preferences in your browser.</p><h2>6. Your Rights</h2><p>You have the right to access, correct, or delete your personal information.</p><h2>7. Contact Us</h2><p>For privacy concerns, contact us via our Contact page.</p>',
  true,
  'Privacy Policy - Fablinks Online Café',
  'Learn how Fablinks Online Café protects your privacy and handles your personal data.'
) ON CONFLICT (slug) DO NOTHING;

-- Insert default announcement if table empty
INSERT INTO public.announcement_bar (message, link_text, link_url)
SELECT '🎉 Welcome to Fablinks! Get 10% off your first service.', 'Learn More', '/services'
WHERE NOT EXISTS (SELECT 1 FROM public.announcement_bar LIMIT 1);