import { useMutation } from "@tanstack/react-query";
import { singup as singupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export default function useSingup() {
  const { mutate: singup, isPending } = useMutation({
    mutationFn: singupApi,
    onSuccess: (user) => {
      console.log("User signed up successfully", user);
      toast.success(
        "Account created successfully!!, Please verify the new account from the user's email address"
      );
    },
  });

  return { singup, isPending };
}
