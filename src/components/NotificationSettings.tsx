import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  isSubscribedToPush
} from '@/lib/pushNotifications';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const isSupported = await isPushSupported();
    setSupported(isSupported);
    
    if (isSupported) {
      const perm = await getNotificationPermission();
      setPermission(perm);
      
      if (perm === 'granted') {
        const isSub = await isSubscribedToPush();
        setSubscribed(isSub);
      }
    }
    
    setLoading(false);
  };

  const handleToggle = async () => {
    setLoading(true);
    
    try {
      if (subscribed) {
        // Unsubscribe
        const success = await unsubscribeFromPush();
        if (success) {
          setSubscribed(false);
          toast({
            title: 'Notifications disabled',
            description: 'You will no longer receive push notifications.',
          });
        }
      } else {
        // Request permission first if needed
        if (permission !== 'granted') {
          const newPermission = await requestNotificationPermission();
          setPermission(newPermission);
          
          if (newPermission !== 'granted') {
            toast({
              title: 'Permission denied',
              description: 'Please enable notifications in your browser settings.',
              variant: 'destructive',
            });
            setLoading(false);
            return;
          }
        }
        
        // Subscribe
        const subscription = await subscribeToPush();
        if (subscription) {
          setSubscribed(true);
          toast({
            title: 'Notifications enabled!',
            description: 'You will now receive updates and announcements.',
          });
        } else {
          toast({
            title: 'Subscription failed',
            description: 'Could not enable notifications. Please try again.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  if (!supported) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-muted-foreground">
            <BellOff className="h-5 w-5" />
            <p className="text-sm">Push notifications are not supported in this browser.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (permission === 'denied') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-muted-foreground">
            <BellOff className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Notifications blocked</p>
              <p className="text-xs">Please enable notifications in your browser settings.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${subscribed ? 'bg-primary/10' : 'bg-muted'}`}>
              {subscribed ? (
                <Bell className="h-5 w-5 text-primary" />
              ) : (
                <BellOff className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <CardTitle className="text-base">Push Notifications</CardTitle>
              <CardDescription>
                {subscribed ? 'Receiving updates' : 'Get notified about updates'}
              </CardDescription>
            </div>
          </div>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Switch
              checked={subscribed}
              onCheckedChange={handleToggle}
            />
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default NotificationSettings;