import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { usePermissions, ADMIN_PERMISSIONS, PERMISSION_CATEGORIES, AdminPermission } from "@/hooks/usePermissions";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowLeft, UserPlus, Trash2, Shield, Copy, Check, Key, Settings, Crown } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  email: string | null;
  created_at: string;
}

interface UserPermission {
  id: string;
  user_id: string;
  permission: string;
}

interface NewUserCredentials {
  email: string;
  password: string;
}

export default function AdminUsers() {
  const { isAdmin, loading, user: currentUser } = useAdmin();
  const { isSuperAdmin, hasPermission } = usePermissions();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRole[]>([]);
  const [userPermissions, setUserPermissions] = useState<Record<string, string[]>>({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Database["public"]["Enums"]["app_role"]>("admin");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [newCredentials, setNewCredentials] = useState<NewUserCredentials | null>(null);
  const [copied, setCopied] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRole | null>(null);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [savingPermissions, setSavingPermissions] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/auth");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchAllPermissions();
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

  const fetchAllPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_permissions")
        .select("*");

      if (error) throw error;

      // Group permissions by user_id
      const grouped: Record<string, string[]> = {};
      (data || []).forEach((p: UserPermission) => {
        if (!grouped[p.user_id]) {
          grouped[p.user_id] = [];
        }
        grouped[p.user_id].push(p.permission);
      });
      setUserPermissions(grouped);
    } catch (error) {
      console.error("Error fetching permissions:", error);
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
        body: { email, role, permissions: role === "admin" ? selectedPermissions : [] },
      });

      if (response.error) {
        const errorMessage = response.error.message || "Failed to add user role";
        if (errorMessage.includes("already has this role") || response.error.context?.error) {
          throw new Error(response.error.context?.error || "User already has this role");
        }
        throw new Error(errorMessage);
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

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
      setSelectedPermissions([]);
      fetchUsers();
      fetchAllPermissions();
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

  const handleDeleteRole = async (id: string, userId: string) => {
    try {
      // Delete permissions first
      await supabase
        .from("admin_permissions")
        .delete()
        .eq("user_id", userId);

      // Then delete the role
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
      fetchAllPermissions();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast({
        title: "Error",
        description: "Failed to remove user role",
        variant: "destructive",
      });
    }
  };

  const openEditPermissions = (user: UserRole) => {
    setEditingUser(user);
    setEditPermissions(userPermissions[user.user_id] || []);
  };

  const handleSavePermissions = async () => {
    if (!editingUser) return;

    setSavingPermissions(true);
    try {
      // Delete existing permissions
      await supabase
        .from("admin_permissions")
        .delete()
        .eq("user_id", editingUser.user_id);

      // Insert new permissions if any are selected
      if (editPermissions.length > 0) {
        const permissionsToInsert = editPermissions.map((permission) => ({
          user_id: editingUser.user_id,
          permission,
        }));

        const { error } = await supabase
          .from("admin_permissions")
          .insert(permissionsToInsert);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: editPermissions.length === 0 
          ? "Admin now has full access (Super Admin)" 
          : "Permissions updated successfully",
      });

      setEditingUser(null);
      fetchAllPermissions();
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast({
        title: "Error",
        description: "Failed to update permissions",
        variant: "destructive",
      });
    } finally {
      setSavingPermissions(false);
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

  const togglePermission = (permission: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(permission)) {
      setList(list.filter((p) => p !== permission));
    } else {
      setList([...list, permission]);
    }
  };

  const selectAllPermissions = (list: string[], setList: (v: string[]) => void) => {
    setList(Object.values(ADMIN_PERMISSIONS));
  };

  const clearAllPermissions = (setList: (v: string[]) => void) => {
    setList([]);
  };

  const getPermissionCount = (userId: string): number => {
    return userPermissions[userId]?.length || 0;
  };

  const isUserSuperAdmin = (userId: string): boolean => {
    return !userPermissions[userId] || userPermissions[userId].length === 0;
  };

  // Check if current user can manage admins
  const canManageAdmins = isSuperAdmin || hasPermission(ADMIN_PERMISSIONS.MANAGE_ADMINS);

  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  if (!canManageAdmins) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b sticky top-0 bg-background z-10">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <Button onClick={() => navigate("/admin")} variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-bold">Manage Admins</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="py-8 text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold mb-2">Access Restricted</h2>
              <p className="text-muted-foreground">
                You don't have permission to manage admin users.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
              Add admins with specific permissions
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Add New Admin Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Admin
            </CardTitle>
            <CardDescription>
              Create a new admin with full access or restricted permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {role === "admin" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Permissions</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => clearAllPermissions(setSelectedPermissions)}
                    >
                      <Crown className="h-4 w-4 mr-1" />
                      Super Admin
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => selectAllPermissions(selectedPermissions, setSelectedPermissions)}
                    >
                      Select All
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Leave empty for full access (Super Admin), or select specific permissions to restrict access.
                </p>
                
                <Accordion type="multiple" className="w-full">
                  {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center gap-2">
                          {category}
                          <Badge variant="secondary" className="ml-2">
                            {perms.filter((p) => selectedPermissions.includes(p.key)).length}/{perms.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pl-4">
                          {perms.map((perm) => (
                            <div key={perm.key} className="flex items-start space-x-3">
                              <Checkbox
                                id={`new-${perm.key}`}
                                checked={selectedPermissions.includes(perm.key)}
                                onCheckedChange={() => 
                                  togglePermission(perm.key, selectedPermissions, setSelectedPermissions)
                                }
                              />
                              <div className="grid gap-0.5 leading-none">
                                <label
                                  htmlFor={`new-${perm.key}`}
                                  className="text-sm font-medium leading-none cursor-pointer"
                                >
                                  {perm.label}
                                </label>
                                <p className="text-xs text-muted-foreground">
                                  {perm.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            <Button onClick={handleAddUser} disabled={adding} className="w-full sm:w-auto">
              {adding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Add Admin
            </Button>
          </CardContent>
        </Card>

        {/* Current Admins Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Current Admins
            </CardTitle>
            <CardDescription>
              {users.length} user{users.length !== 1 ? "s" : ""} with assigned roles
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
                      <TableHead>Access Level</TableHead>
                      <TableHead className="hidden sm:table-cell">Added</TableHead>
                      <TableHead className="w-28">Actions</TableHead>
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
                          <Badge
                            variant={user.role === "admin" ? "default" : "secondary"}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.role === "admin" ? (
                            isUserSuperAdmin(user.user_id) ? (
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                                <Crown className="h-3 w-3 mr-1" />
                                Super Admin
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                {getPermissionCount(user.user_id)} permissions
                              </Badge>
                            )
                          ) : (
                            <span className="text-muted-foreground text-sm">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {user.role === "admin" && user.user_id !== currentUser?.id && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditPermissions(user)}
                                title="Edit permissions"
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            )}
                            {user.user_id !== currentUser?.id && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteRole(user.id, user.user_id)}
                                title="Remove role"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
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
      </main>

      {/* Edit Permissions Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Edit Permissions
            </DialogTitle>
            <DialogDescription>
              {editingUser?.email || "Unknown user"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between py-2">
            <p className="text-sm text-muted-foreground">
              Clear all for Super Admin access
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => clearAllPermissions(setEditPermissions)}
              >
                <Crown className="h-4 w-4 mr-1" />
                Super Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => selectAllPermissions(editPermissions, setEditPermissions)}
              >
                Select All
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 pr-4">
            <Accordion type="multiple" className="w-full" defaultValue={Object.keys(PERMISSION_CATEGORIES)}>
              {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      {category}
                      <Badge variant="secondary" className="ml-2">
                        {perms.filter((p) => editPermissions.includes(p.key)).length}/{perms.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pl-4">
                      {perms.map((perm) => (
                        <div key={perm.key} className="flex items-start space-x-3">
                          <Checkbox
                            id={`edit-${perm.key}`}
                            checked={editPermissions.includes(perm.key)}
                            onCheckedChange={() =>
                              togglePermission(perm.key, editPermissions, setEditPermissions)
                            }
                          />
                          <div className="grid gap-0.5 leading-none">
                            <label
                              htmlFor={`edit-${perm.key}`}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {perm.label}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {perm.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleSavePermissions} disabled={savingPermissions}>
              {savingPermissions ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Permissions
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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

    </div>
  );
}
