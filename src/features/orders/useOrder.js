import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getOrder } from "../../services/apiOrders";

export default function useOrder() {
  const { orderId } = useParams();

  const {
    isPending,
    data: order,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
    retry: false,
  });
  console.log("Order from useOrder:", order || "Loading..."); // 👈 Verifica que `is_paid` esté presente

  return { isPending, order: order || null, error };
}
