import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Mail, Phone, School, Clock, AlertTriangle, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import AdminBottomNav from "@/components/admin/AdminBottomNav";

interface ServiceRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  school_id: string | null;
  service_type: string;
  service_details: string | null;
  urgency: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  schools?: { name: string; abbreviation: string | null } | null;
}

export default function AdminServiceRequests() {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/auth");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchRequests();
    }
  }, [isAdmin]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("service_requests")
        .select(`
          *,
          schools (name, abbreviation)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("service_requests")
        .update({ status: newStatus, admin_notes: adminNotes || null })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Request status updated",
      });
      
      fetchRequests();
      setSelectedRequest(null);
      setAdminNotes("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "in_progress":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const filteredRequests = statusFilter === "all" 
    ? requests 
    : requests.filter(r => r.status === statusFilter);

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
      <header className="border-b sticky top-0 z-40 bg-background">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/customers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Button>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
            <h1 className="text-2xl font-bold">Service Requests</h1>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No service requests found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className={selectedRequest?.id === request.id ? "ring-2 ring-primary" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getUrgencyIcon(request.urgency)}
                      <CardTitle className="text-lg">{request.service_type}</CardTitle>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Name:</span> {request.name}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {request.email}
                      </p>
                      {request.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {request.phone}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      {request.schools && (
                        <p className="flex items-center gap-2">
                          <School className="h-4 w-4" />
                          {request.schools.abbreviation || request.schools.name}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {format(new Date(request.created_at), "PPp")}
                      </p>
                      <p className="capitalize">
                        <span className="font-medium">Urgency:</span> {request.urgency}
                      </p>
                    </div>
                  </div>

                  {request.service_details && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">Details:</p>
                      <p className="text-sm text-muted-foreground">{request.service_details}</p>
                    </div>
                  )}

                  {request.admin_notes && (
                    <div className="bg-primary/5 p-3 rounded-lg border-l-4 border-primary">
                      <p className="text-sm font-medium mb-1">Admin Notes:</p>
                      <p className="text-sm">{request.admin_notes}</p>
                    </div>
                  )}

                  {selectedRequest?.id === request.id ? (
                    <div className="space-y-3 pt-2 border-t">
                      <Textarea
                        placeholder="Add admin notes (optional)..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={2}
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(request.id, "in_progress")}
                          disabled={updating}
                        >
                          <Clock className="mr-1 h-3 w-3" /> In Progress
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600"
                          onClick={() => updateStatus(request.id, "completed")}
                          disabled={updating}
                        >
                          <CheckCircle className="mr-1 h-3 w-3" /> Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600"
                          onClick={() => updateStatus(request.id, "cancelled")}
                          disabled={updating}
                        >
                          <XCircle className="mr-1 h-3 w-3" /> Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedRequest(null);
                            setAdminNotes("");
                          }}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest(request);
                        setAdminNotes(request.admin_notes || "");
                      }}
                    >
                      Manage Request
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AdminBottomNav />
    </div>
  );
}
