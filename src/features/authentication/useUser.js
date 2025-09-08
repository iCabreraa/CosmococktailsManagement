import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import supabase from "../../services/supabase";

export function useUser() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        queryClient.setQueryData(["user"], session.user);
      } else {
        queryClient.setQueryData(["user"], null);
      }
      setIsLoading(false);
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        queryClient.setQueryData(["user"], session.user);
      } else {
        queryClient.setQueryData(["user"], null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const user = queryClient.getQueryData(["user"]);

  return {
    isLoading,
    user,
    isAuthenticated: !!user,
  };
}
