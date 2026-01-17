import { usePermissions, PERMISSION_CATEGORIES } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, ShieldCheck, Lock, Unlock } from "lucide-react";

export function PermissionsWidget() {
  const { user } = useAuth();
  const { permissions, loading, isSuperAdmin } = usePermissions();

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalPermissions = Object.values(PERMISSION_CATEGORIES).flat().length;
  const grantedCount = permissions.length;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isSuperAdmin ? (
              <ShieldCheck className="h-5 w-5 text-primary" />
            ) : (
              <Shield className="h-5 w-5 text-orange-500" />
            )}
            <CardTitle className="text-lg">Your Access Level</CardTitle>
          </div>
          <Badge 
            variant={isSuperAdmin ? "default" : "secondary"}
            className={isSuperAdmin ? "bg-primary" : ""}
          >
            {isSuperAdmin ? "Super Admin" : "Limited Admin"}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          {user?.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isSuperAdmin ? (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Unlock className="h-4 w-4" />
            <span>Full access to all {totalPermissions} permissions</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>{grantedCount} of {totalPermissions} permissions granted</span>
            </div>
            
            <div className="space-y-3">
              {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => {
                const categoryPerms = perms.filter(p => permissions.includes(p.key));
                if (categoryPerms.length === 0) return null;
                
                return (
                  <div key={category}>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">{category}</p>
                    <div className="flex flex-wrap gap-1">
                      {categoryPerms.map(p => (
                        <Badge key={p.key} variant="outline" className="text-xs">
                          {p.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
