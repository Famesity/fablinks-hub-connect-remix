import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Send, Bell, Users } from 'lucide-react';
import AdminBottomNav from '@/components/admin/AdminBottomNav';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { ADMIN_PERMISSIONS } from '@/hooks/usePermissions';

interface NotificationHistory {
  id: string;
  title: string;
  body: string;
  url: string | null;
  sent_at: string;
  recipients_count: number;
}

const AdminNotifications = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    url: ''
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get subscriber count
      const { count } = await supabase
        .from('push_subscriptions')
        .select('*', { count: 'exact', head: true });
      
      setSubscriberCount(count || 0);
      
      // Get notification history
      const { data: historyData } = await supabase
        .from('notification_history')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(20);
      
      setHistory(historyData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!formData.title.trim() || !formData.body.trim()) {
      toast({
        title: 'Error',
        description: 'Title and message are required',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);
    
    try {
      // Call the edge function to send notifications
      const { data, error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          title: formData.title,
          body: formData.body,
          url: formData.url || '/'
        }
      });

      if (error) throw error;
      
      toast({
        title: 'Notifications sent!',
        description: `Sent to ${data?.sent || 0} subscribers.`
      });
      
      setFormData({ title: '', body: '', url: '' });
      fetchData();
    } catch (error) {
      console.error('Error sending notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to send notifications. Make sure the edge function is deployed.',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <PermissionGate permission={ADMIN_PERMISSIONS.MANAGE_NOTIFICATIONS}>
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Push Notifications</h1>
        </div>

        {/* Stats */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{subscriberCount}</p>
                <p className="text-sm text-muted-foreground">Active subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Send Notification Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Send Notification
            </CardTitle>
            <CardDescription>
              Send a push notification to all subscribers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="New Service Available!"
                maxLength={50}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="body">Message *</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Check out our latest services and special offers..."
                rows={3}
                maxLength={200}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">Link URL (Optional)</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="/services"
              />
              <p className="text-xs text-muted-foreground">
                Where users go when they click the notification
              </p>
            </div>

            <Button 
              onClick={handleSend} 
              disabled={sending || subscriberCount === 0}
              className="w-full"
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send to {subscriberCount} subscribers
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No notifications sent yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Recipients</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{item.body}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(item.sent_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{item.recipients_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <AdminBottomNav />
    </div>
    </PermissionGate>
  );
};

export default AdminNotifications;