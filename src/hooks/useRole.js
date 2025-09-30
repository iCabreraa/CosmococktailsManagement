import { useMemo } from "react";
import { useUser } from "../features/authentication/useUser";

export function useRole() {
  const { user, isLoading } = useUser();

  const role = useMemo(() => {
    if (!user) return "client";
    const userRole = user.user_metadata?.role || "client";
    
    // Debug logging
    console.log("useRole Debug:", {
      user: user ? { id: user.id, email: user.email } : null,
      user_metadata: user?.user_metadata,
      role: userRole,
      isLoading
    });
    
    return userRole;
  }, [user, isLoading]);

  const isAdmin = useMemo(() => role === "admin", [role]);
  const isClient = useMemo(() => role === "client", [role]);
  const isStaff = useMemo(() => role === "staff", [role]);

  const hasPermission = useMemo(() => {
    return requiredRole => {
      if (isLoading) return false;

      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      return roles.includes(role);
    };
  }, [role, isLoading]);

  return {
    role,
    isAdmin,
    isClient,
    isStaff,
    hasPermission,
    isLoading,
  };
}

