import { useQuery } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { subDays, formatISO } from "date-fns";

export async function getCocktailSalesData(cocktailId, days) {
  const since = formatISO(subDays(new Date(), Number(days)));

  // 1. Obtén los IDs de órdenes dentro del rango de fechas
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, order_date")
    .gte("order_date", since);

  if (ordersError) throw new Error("Could not load orders");

  const validOrderIds = orders.map((o) => o.id);

  if (validOrderIds.length === 0) {
    return { sizeCounts: {}, dailySales: {} };
  }

  // 2. Usa esos IDs para filtrar `order_items`
  const { data, error } = await supabase
    .from("order_items")
    .select("quantity, order_id, sizes(name), orders(order_date)")
    .eq("cocktail_id", cocktailId)
    .in("order_id", validOrderIds);

  if (error) throw new Error("Could not load cocktail chart data");

  const sizeCounts = {};
  const dailySales = {};

  data.forEach((item) => {
    const size = item.sizes?.name ?? "Unknown";
    sizeCounts[size] = (sizeCounts[size] || 0) + item.quantity;

    const date = item.orders?.order_date?.split("T")[0];
    if (date) dailySales[date] = (dailySales[date] || 0) + item.quantity;
  });

  return { sizeCounts, dailySales };
}

export function useCocktailSalesData(cocktailId, days) {
  return useQuery({
    queryKey: ["cocktail-sales-data", cocktailId, days],
    queryFn: () => getCocktailSalesData(cocktailId, days),
    enabled: Boolean(cocktailId),
  });
}
