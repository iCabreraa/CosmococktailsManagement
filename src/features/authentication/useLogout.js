import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import supabase from "../../services/supabase";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Sesión cerrada correctamente");
      queryClient.removeQueries();
      navigate("/login", { replace: true });
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  return { logout, isLoading };
}
