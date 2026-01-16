import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Eye, Trash2, MessageSquare } from 'lucide-react';
import AdminBottomNav from '@/components/admin/AdminBottomNav';

interface ServiceRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service_type: string;
  service_details: string | null;
  school_id: string | null;
  urgency: string | null;
  status: string | null;
  admin_notes: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  'in-progress': 'bg-blue-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const AdminServiceRequests = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load service requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      toast({ title: 'Status updated' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const saveNotes = async () => {
    if (!selectedRequest) return;
    
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ admin_notes: adminNotes })
        .eq('id', selectedRequest.id);

      if (error) throw error;
      
      setRequests(prev => prev.map(r => 
        r.id === selectedRequest.id ? { ...r, admin_notes: adminNotes } : r
      ));
      toast({ title: 'Notes saved' });
      setSelectedRequest(null);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save notes', variant: 'destructive' });
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    
    try {
      const { error } = await supabase
        .from('service_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRequests(prev => prev.filter(r => r.id !== id));
      toast({ title: 'Request deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete request', variant: 'destructive' });
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
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Service Requests</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Requests ({requests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="text-sm">
                        {new Date(request.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.name}</p>
                          <p className="text-xs text-muted-foreground">{request.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{request.service_type}</TableCell>
                      <TableCell>
                        <Badge variant={request.urgency === 'urgent' ? 'destructive' : 'secondary'}>
                          {request.urgency || 'normal'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={request.status || 'pending'}
                          onValueChange={(value) => updateStatus(request.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setAdminNotes(request.admin_notes || '');
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Request Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-muted-foreground">Contact</Label>
                                  <p className="font-medium">{request.name}</p>
                                  <p className="text-sm">{request.email}</p>
                                  {request.phone && <p className="text-sm">{request.phone}</p>}
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Service Details</Label>
                                  <p className="text-sm">{request.service_details}</p>
                                </div>
                                <div>
                                  <Label htmlFor="notes">Admin Notes</Label>
                                  <Textarea
                                    id="notes"
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add notes about this request..."
                                    rows={3}
                                  />
                                </div>
                                <Button onClick={saveNotes} className="w-full">
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Save Notes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteRequest(request.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <AdminBottomNav />
    </div>
  );
};

export default AdminServiceRequests;