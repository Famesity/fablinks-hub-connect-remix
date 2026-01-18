import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Eye, Trash2, MessageSquare, MessageCircle, Phone, Mail } from 'lucide-react';
import AdminBottomNav from '@/components/admin/AdminBottomNav';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { ADMIN_PERMISSIONS } from '@/hooks/usePermissions';

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

interface School {
  id: string;
  name: string;
}

const serviceTypes: Record<string, string> = {
  education: 'Education & Exams',
  university: 'University/Polytechnic Portal',
  academic: 'Academic Support',
  nysc: 'NYSC & Government',
  utilities: 'Utilities & Bills',
  printing: 'Printing & Documents',
  digital: 'Digital Services',
  other: 'Other',
};

const urgencyLabels: Record<string, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
};

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
  const { getSetting } = useSiteSettings();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);

  const whatsappNumber = getSetting('whatsapp_number', '2348106411463');

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    fetchRequests();
    fetchSchools();
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

  const fetchSchools = async () => {
    try {
      const { data } = await supabase
        .from('schools')
        .select('id, name')
        .order('name');
      if (data) setSchools(data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const getSchoolName = (schoolId: string | null) => {
    if (!schoolId) return 'Not specified';
    return schools.find(s => s.id === schoolId)?.name || 'Unknown';
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
      setDetailsOpen(false);
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

  const generateWhatsAppMessage = (request: ServiceRequest) => {
    return `Hello ${request.name}! 

Thank you for submitting your service request for "${serviceTypes[request.service_type] || request.service_type}".

We are reviewing your request and will assist you shortly.

If you have any additional information to share, please reply to this message.

- Fablinks Online Café Team`;
  };

  const openWhatsApp = (request: ServiceRequest) => {
    const phone = request.phone?.replace(/\D/g, '') || '';
    if (!phone) {
      toast({
        title: 'No phone number',
        description: 'This customer did not provide a phone number.',
        variant: 'destructive',
      });
      return;
    }
    const message = generateWhatsAppMessage(request);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
    <PermissionGate permission={ADMIN_PERMISSIONS.MANAGE_SERVICE_REQUESTS}>
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
            <CardTitle className="flex items-center justify-between">
              <span>All Requests ({requests.length})</span>
              <Badge variant="outline" className="font-normal">
                {requests.filter(r => r.status === 'pending' || !r.status).length} pending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No service requests yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="text-sm whitespace-nowrap">
                          {new Date(request.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.name}</p>
                            <p className="text-xs text-muted-foreground">{request.email}</p>
                            {request.phone && (
                              <p className="text-xs text-muted-foreground">{request.phone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {serviceTypes[request.service_type] || request.service_type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={request.urgency === 'urgent' || request.urgency === 'high' ? 'destructive' : 'secondary'}
                          >
                            {urgencyLabels[request.urgency || 'normal'] || 'Normal'}
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
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedRequest(request);
                                setAdminNotes(request.admin_notes || '');
                                setDetailsOpen(true);
                              }}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openWhatsApp(request)}
                              className="text-green-600 hover:text-green-700"
                              title="Reply via WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteRequest(request.id)}
                              className="text-destructive hover:text-destructive"
                              title="Delete"
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
            )}
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div>
                    <Label className="text-muted-foreground text-xs">Customer</Label>
                    <p className="font-medium">{selectedRequest.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-muted-foreground text-xs">Email</Label>
                      <p className="text-sm flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedRequest.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Phone</Label>
                      <p className="text-sm flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedRequest.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-muted-foreground text-xs">Service Type</Label>
                      <p className="text-sm font-medium">
                        {serviceTypes[selectedRequest.service_type] || selectedRequest.service_type}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">School</Label>
                      <p className="text-sm">{getSchoolName(selectedRequest.school_id)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-muted-foreground text-xs">Urgency</Label>
                      <Badge 
                        variant={selectedRequest.urgency === 'urgent' || selectedRequest.urgency === 'high' ? 'destructive' : 'secondary'}
                      >
                        {urgencyLabels[selectedRequest.urgency || 'normal'] || 'Normal'}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Submitted</Label>
                      <p className="text-sm">
                        {new Date(selectedRequest.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground text-xs">Service Details</Label>
                  <p className="text-sm mt-1 p-3 bg-muted/30 rounded-lg whitespace-pre-wrap">
                    {selectedRequest.service_details || 'No details provided'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="notes">Admin Notes</Label>
                  <Textarea
                    id="notes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this request..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveNotes} className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Save Notes
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => openWhatsApp(selectedRequest)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Reply on WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <AdminBottomNav />
    </div>
    </PermissionGate>
  );
};

export default AdminServiceRequests;