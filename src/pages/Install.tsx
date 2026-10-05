import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, Apple, Chrome, Share, Plus, MoreVertical, Check } from 'lucide-react';
import NotificationSettings from '@/components/NotificationSettings';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);
    
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone) {
    return (
      <Layout>
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="h-20 w-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">App Already Installed!</h1>
            <p className="text-muted-foreground mb-8">
              You're already using the Defabs Media app. Enjoy the full experience!
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Go to Home
            </Button>
          </div>
        </main>
      </Layout>
    );
  }

  if (isInstalled) {
    return (
      <Layout>
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="h-20 w-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Successfully Installed!</h1>
            <p className="text-muted-foreground mb-8">
              Defabs Media has been added to your home screen. Open it anytime like a regular app!
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Continue Browsing
            </Button>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="h-24 w-24 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Smartphone className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Install Defabs Media App</h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Get quick access to all our services right from your home screen. No app store needed!
            </p>
          </div>

          {/* Install Button for Android/Chrome */}
          {deferredPrompt && (
            <div className="text-center mb-12">
              <Button size="lg" onClick={handleInstallClick} className="gap-2 text-lg px-8 py-6">
                <Download className="h-5 w-5" />
                Install Now
              </Button>
            </div>
          )}

          {/* Benefits */}
          <div className="grid gap-4 md:grid-cols-3 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Works Offline</h3>
                <p className="text-sm text-muted-foreground">
                  Access key features even without internet connection
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Home Screen Access</h3>
                <p className="text-sm text-muted-foreground">
                  Launch instantly from your phone like any other app
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Fast & Lightweight</h3>
                <p className="text-sm text-muted-foreground">
                  No storage space needed, updates automatically
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Notification Settings */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-center">Stay Updated</h2>
            <NotificationSettings />
          </div>

          {/* iOS Instructions */}
          {isIOS && (
            <Card className="mb-6 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5" />
                  Install on iPhone/iPad
                </CardTitle>
                <CardDescription>Follow these simple steps to install</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <p className="font-medium">Tap the Share button</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Look for the <Share className="h-4 w-4" /> icon at the bottom of Safari
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <p className="font-medium">Scroll down and tap "Add to Home Screen"</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Look for the <Plus className="h-4 w-4" /> icon with this option
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <p className="font-medium">Tap "Add" to confirm</p>
                      <p className="text-sm text-muted-foreground">The app will appear on your home screen</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          )}

          {/* Android Instructions (when prompt not available) */}
          {isAndroid && !deferredPrompt && (
            <Card className="mb-6 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Chrome className="h-5 w-5" />
                  Install on Android
                </CardTitle>
                <CardDescription>Follow these simple steps to install</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <p className="font-medium">Tap the menu button</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Look for <MoreVertical className="h-4 w-4" /> in the top right corner of Chrome
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <p className="font-medium">Tap "Install app" or "Add to Home screen"</p>
                      <p className="text-sm text-muted-foreground">This option appears in the menu</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <p className="font-medium">Confirm the installation</p>
                      <p className="text-sm text-muted-foreground">The app will be added to your home screen</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          )}

          {/* Desktop Instructions */}
          {!isIOS && !isAndroid && !deferredPrompt && (
            <Card className="mb-6 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Chrome className="h-5 w-5" />
                  Install on Desktop
                </CardTitle>
                <CardDescription>Install using Chrome or Edge browser</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <p className="font-medium">Look for the install icon in the address bar</p>
                      <p className="text-sm text-muted-foreground">
                        You may see a <Download className="h-4 w-4 inline" /> or <Plus className="h-4 w-4 inline" /> icon
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <p className="font-medium">Click "Install" to add the app</p>
                      <p className="text-sm text-muted-foreground">The app will open in its own window</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Install;