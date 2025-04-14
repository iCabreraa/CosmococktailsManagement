import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrder } from "../../services/apiOrders";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isLoading: isCheckingIn } = useMutation({
    mutationFn: (orderId) =>
      updateOrder(orderId, {
        status: "completed",
        is_paid: true,
      }),
    onSuccess: (data) => {
      console.log("Update Order ", data);
      toast.success(`Order ${data.id} successfully marked as paid`);
      queryClient.invalidateQueries({ active: true });
      navigate(`/orders/${data.id}`);
    },
    onError: (error) => {
      toast.error(`Failed to confirm payment: ${error.message}`);
    },
  });

  return { isCheckingIn, checkin };
}
