import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getUpcomingOrdersWithin } from "../../services/apiOrders";

export function useUpcomingOrders() {
  const [searchParams] = useSearchParams();

  // Sincronizado con ?last=7 o fallback a 1
  const numDays = Number(searchParams.get("last") || 1);

  const { isLoading, data: upcomingOrders } = useQuery({
    queryKey: ["upcoming-orders", numDays],
    queryFn: () => getUpcomingOrdersWithin(numDays),
  });

  return { isLoading, upcomingOrders, numDays };
}
