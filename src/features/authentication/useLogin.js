import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }) =>
      loginApi({
        email,
        password,
      }),
    onSuccess: (data) => {
      // 👇 Establece manualmente el usuario justo después del login exitoso
      if (data.user) queryClient.setQueryData(["user"], data.user);

      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  return { login, isPending };
}
