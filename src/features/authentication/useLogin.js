import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import supabase from "../../services/supabase";

export function useLogin() {
  const navigate = useNavigate();

  const { mutate: login, isPending } = useMutation({
    mutationFn: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Sesión iniciada correctamente");
      navigate("/dashboard");
    },
    onError: error => {
      toast.error(error.message);
      console.error(error);
    },
  });

  return { login, isPending };
}
