import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getOrdersAfterDate } from "../../services/apiOrders";

export function useRecentPaid() {
  const [searchParams] = useSearchParams();
  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));
  const queryDate = subDays(new Date(), numDays).toISOString();

  const { isLoading, data: orders } = useQuery({
    queryFn: () => getOrdersAfterDate(queryDate),
    queryKey: ["paid-orders", `last-${numDays}`],
  });

  const paidOrders = orders?.filter(order => order.is_paid);

  return { isLoading, paidOrders };
}
