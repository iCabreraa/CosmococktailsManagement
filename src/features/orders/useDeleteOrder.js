import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteOrder as deleteOrderApi } from "../../services/apiOrders";

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteOrder } = useMutation({
    mutationFn: deleteOrderApi,
    onSuccess: () => {
      toast.success("Order has been deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["orders"],
        invalidate: true,
      });
    },
    onError: (error) => {
      toast.error("Failed to delete the order: " + error.message);
    },
  });

  return { isDeleting, deleteOrder };
}
