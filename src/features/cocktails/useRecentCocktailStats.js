// src/features/cocktails/useRecentCocktailStats.js
import { useQuery } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { subDays, formatISO } from "date-fns";

export async function getRecentCocktailStats(cocktailId, days) {
  const since = formatISO(subDays(new Date(), Number(days)));

  // Primero obtenemos los IDs de las órdenes dentro del rango
  const { data: recentOrders, error: ordersError } = await supabase
    .from("orders")
    .select("id, user_id")
    .gte("order_date", since);

  if (ordersError) throw new Error("Could not fetch recent orders");

  const recentOrderIds = recentOrders.map(o => o.id);
  const uniqueUserIds = new Set(recentOrders.map(o => o.user_id));

  if (recentOrderIds.length === 0) {
    return {
      numClients: 0,
      numOrders: 0,
      totalRevenue: 0,
      topSize: null,
    };
  }

  // Ahora buscamos los order_items para este cocktail dentro de esas órdenes
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("quantity, unit_price, size_id, sizes(name)")
    .in("order_id", recentOrderIds)
    .eq("cocktail_id", cocktailId);

  if (itemsError) throw new Error("Could not fetch cocktail order items");

  const numClients = uniqueUserIds.size;
  const numOrders = orderItems.length;
  const totalRevenue = orderItems.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const sizeCounts = orderItems.reduce((acc, item) => {
    const size = item.sizes?.name || "Unknown";
    acc[size] = (acc[size] || 0) + item.quantity;
    return acc;
  }, {});

  const topSize =
    Object.entries(sizeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return { numClients, numOrders, totalRevenue, topSize };
}

export function useRecentCocktailStats(cocktailId, days) {
  return useQuery({
    queryKey: ["cocktail-stats", cocktailId, days],
    queryFn: () => getRecentCocktailStats(cocktailId, days),
    enabled: Boolean(cocktailId),
  });
}
