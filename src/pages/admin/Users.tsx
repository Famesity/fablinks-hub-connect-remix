import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, UserPlus, Trash2, Shield, Copy, Check, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AdminBottomNav from "@/components/admin/AdminBottomNav";

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  email: string | null;
  created_at: string;
}

interface NewUserCredentials {
  email: string;
  password: string;
}

export default function AdminUsers() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Database["public"]["Enums"]["app_role"]>("admin");
  const [adding, setAdding] = useState(false);
  const [newCredentials, setNewCredentials] = useState<NewUserCredentials | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/auth");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddUser = async () => {
    if (!email || !role) {
      toast({
        title: "Error",
        description: "Please provide email and role",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error("Not authenticated");
      }

      const response = await supabase.functions.invoke("add-user-role", {
        body: { email, role },
      });

      // Check for edge function errors (non-2xx responses)
      if (response.error) {
        // The error message from edge function is in response.error.message or response.error.context
        const errorMessage = response.error.message || "Failed to add user role";
        // Check if it's the "already has role" error (409 conflict)
        if (errorMessage.includes("already has this role") || response.error.context?.error) {
          throw new Error(response.error.context?.error || "User already has this role");
        }
        throw new Error(errorMessage);
      }

      // Also check for error in response data
      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      // Show credentials dialog if new user was created
      if (response.data?.isNewUser && response.data?.tempPassword) {
        setNewCredentials({
          email: response.data.email,
          password: response.data.tempPassword,
        });
      } else {
        toast({
          title: "Success",
          description: response.data?.message || "User role added successfully",
        });
      }

      setEmail("");
      setRole("admin");
      fetchUsers();
    } catch (error: any) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add user role",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role removed",
      });

      fetchUsers();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast({
        title: "Error",
        description: "Failed to remove user role",
        variant: "destructive",
      });
    }
  };

  const copyCredentials = () => {
    if (newCredentials) {
      const text = `Email: ${newCredentials.email}\nPassword: ${newCredentials.password}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            onClick={() => navigate("/admin")}
            variant="ghost"
            size="icon"
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold truncate">Manage Admins</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Add or remove admin privileges
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Admin
            </CardTitle>
            <CardDescription>
              Enter an email to create a new admin account or add admin privileges to an existing user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-[1fr,auto,auto] items-end">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="newadmin@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value: any) => setRole(value)}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddUser} disabled={adding} className="w-full sm:w-auto">
                {adding ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                Add Admin
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Current Admins
            </CardTitle>
            <CardDescription>
              {users.length} user{users.length !== 1 ? 's' : ''} with assigned roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No user roles found
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden sm:table-cell">Added</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="text-sm">
                          {user.email || (
                            <span className="text-muted-foreground font-mono text-xs">
                              {user.user_id.slice(0, 8)}...
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-primary/10 text-primary' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRole(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Credentials Dialog */}
      <Dialog open={!!newCredentials} onOpenChange={() => setNewCredentials(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              New Admin Account Created
            </DialogTitle>
            <DialogDescription>
              Share these credentials with the new admin. They should change the password after logging in.
            </DialogDescription>
          </DialogHeader>
          
          {newCredentials && (
            <div className="space-y-4">
              <Alert>
                <AlertDescription className="space-y-2">
                  <div>
                    <strong>Email:</strong> {newCredentials.email}
                  </div>
                  <div>
                    <strong>Password:</strong>{" "}
                    <code className="bg-muted px-2 py-1 rounded">{newCredentials.password}</code>
                  </div>
                </AlertDescription>
              </Alert>
              
              <Button onClick={copyCredentials} variant="outline" className="w-full">
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Credentials
                  </>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                This password will not be shown again. Make sure to copy it now.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AdminBottomNav />
    </div>
  );
}
