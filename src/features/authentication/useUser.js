// import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";
// import supabase from "../../services/supabase";

export function useUser() {
  // const queryClient = useQueryClient();

  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });
  return { isLoading, user, isAuthenticated: user?.role === "authenticated" };

  // useEffect(() => {
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((event, session) => {
  //     if (session?.user) {
  //       queryClient.setQueryData(["user"], session.user);
  //     } else {
  //       queryClient.setQueryData(["user"], null);
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, [queryClient]);

  // return {
  //   isLoading,
  //   user,
  //   isAuthenticated: !!user,
  // };
}
