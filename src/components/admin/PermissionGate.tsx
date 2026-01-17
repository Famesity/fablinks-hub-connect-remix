import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions, AdminPermission } from "@/hooks/usePermissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { Loader2 } from "lucide-react";

interface PermissionGateProps {
  children: ReactNode;
  permission: AdminPermission;
  fallback?: ReactNode;
  showAccessDenied?: boolean;
}

export function PermissionGate({ 
  children, 
  permission, 
  fallback,
  showAccessDenied = true 
}: PermissionGateProps) {
  const { hasPermission, loading } = usePermissions();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission(permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (!showAccessDenied) {
      return null;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <ShieldX className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              You don't have permission to access this section. Contact a super admin to request access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={() => navigate("/admin")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate("/")}>
              <Home className="mr-2 h-4 w-4" />
              Go to Website
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

// Inline permission check for hiding specific UI elements
interface PermissionCheckProps {
  permission: AdminPermission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionCheck({ permission, children, fallback = null }: PermissionCheckProps) {
  const { hasPermission, loading } = usePermissions();

  if (loading) return null;
  if (!hasPermission(permission)) return <>{fallback}</>;

  return <>{children}</>;
}
