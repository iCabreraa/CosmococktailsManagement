import { useRole } from "../hooks/useRole";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Spinner from "../ui/Spinner";

export default function RoleGuard({
  children,
  allowedRoles,
  fallback,
  redirectTo = "/login",
}) {
  const { role, isLoading, hasPermission } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !hasPermission(allowedRoles)) {
      navigate(redirectTo);
    }
  }, [isLoading, hasPermission, allowedRoles, redirectTo, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!hasPermission(allowedRoles)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Acceso Denegado
            </h1>
            <p className="text-gray-600 mb-4">
              No tienes permisos para acceder a esta página.
            </p>
            <p className="text-sm text-gray-500">
              Rol requerido: {allowedRoles.join(" o ")}
            </p>
            <p className="text-sm text-gray-500">Tu rol actual: {role}</p>
          </div>
        </div>
      )
    );
  }

  return children;
}

