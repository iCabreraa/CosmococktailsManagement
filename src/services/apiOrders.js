import { ORDER_PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

/**
 * Fetch paginated list of orders with optional filter/sorting
 */
export async function getOrders({ filter, sortBy, page }) {
  let query = supabase.from("orders").select(
    `
    id,
    status,
    total_amount,
    order_date,
    delivery_date,
    delivery_address,
    payment_method,
    is_paid,
    notes,
    users (id, full_name, email, phone, avatar_url),
    order_items (
      id, quantity, unit_price, item_total,
      cocktails (name),
      sizes (name, volume_ml)
    )
  `,
    { count: "exact" }
  );

  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  if (page) {
    const from = (page - 1) * ORDER_PAGE_SIZE;
    const to = from + ORDER_PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Orders could not be loaded");
  }

  return { data, count };
}

/**
 * Fetch a single order by ID
 */
export async function getOrder(id) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      users(*),
      order_items (
        *, cocktails(*), sizes(*)
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Order not found");
  }

  return data;
}

/**
 * Fetch all orders created after a given date, including items, cocktails and sizes
 */
export async function getOrdersAfterDate(date) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      order_date,
      total_amount,
      is_paid,
      order_items (
        quantity,
        cocktails (name),
        sizes (volume_ml)
      )
    `
    )
    .gte("order_date", date)
    .lte("order_date", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Orders could not get loaded");
  }

  return data;
}

export async function getUpcomingOrdersWithin(days) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      delivery_date,
      total_amount,
      users (full_name, email),
      order_items (
        quantity,
        cocktails (name),
        sizes (name, volume_ml)
      )
    `
    )
    .gte("delivery_date", getToday())
    .lte("delivery_date", futureDate.toISOString())
    .not("status", "eq", "completed"); // 👈 excluye pedidos completados

  if (error) {
    console.error(error);
    throw new Error("Upcoming orders could not be loaded");
  }

  return data;
}

/**
 * Update an existing order
 */
export async function updateOrder(id, obj) {
  const { data, error } = await supabase
    .from("orders")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Order could not be updated");
  }

  return data;
}

/**
 * Delete an order by ID
 */
export async function deleteOrder(id) {
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Order could not be deleted");
  }
}
