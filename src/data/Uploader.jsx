import { useState } from "react";
import supabase from "../services/supabase";
import Button from "../ui/Button";

import { v4 as uuidv4 } from "uuid";

import { users } from "./data-users";
import { cocktails } from "./data-cocktails";
import { sizes } from "./data-sizes";
import { cocktail_sizes } from "./data-cocktail_sizes";
import { orders } from "./data-orders";
import { order_items } from "./data-order_items";

async function deleteAll() {
  const zeroUUID = "00000000-0000-0000-0000-000000000000";
  await supabase.from("order_items").delete().neq("id", zeroUUID);
  await supabase.from("orders").delete().neq("id", zeroUUID);
  await supabase.from("cocktail_sizes").delete().neq("id", zeroUUID);
  await supabase.from("sizes").delete().neq("id", zeroUUID);
  await supabase.from("cocktails").delete().neq("id", zeroUUID);
  await supabase.from("users").delete().neq("id", zeroUUID);
}

async function uploadAll() {
  await deleteAll();

  const { data: insertedUsers, error: userError } = await supabase
    .from("users")
    .insert(users)
    .select();
  if (userError) console.error("Usuarios:", userError);

  const { data: insertedCocktails, error: cocktailError } = await supabase
    .from("cocktails")
    .insert(cocktails)
    .select();
  if (cocktailError) console.error("Cocktails:", cocktailError);

  const { data: insertedSizes, error: sizeError } = await supabase
    .from("sizes")
    .insert(sizes)
    .select();
  if (sizeError) console.error("Sizes:", sizeError);

  const finalCocktailSizes = cocktail_sizes
    .map((cs) => {
      const cocktail = insertedCocktails.find(
        (c) => c.name === cs.cocktail_name
      );
      const size = insertedSizes.find((s) => s.name === cs.size_name);
      if (!cocktail || !size) return null;
      return {
        cocktail_id: cocktail.id,
        size_id: size.id,
        price: cs.price,
      };
    })
    .filter(Boolean);

  const { error: cocktailSizesError } = await supabase
    .from("cocktail_sizes")
    .insert(finalCocktailSizes);
  if (cocktailSizesError) console.error("Cocktail_sizes:", cocktailSizesError);

  const finalOrders = orders
    .map((order) => {
      const user = insertedUsers.find((u) => u.email === order.user_email);
      if (!user) return null;

      const total_amount = order_items
        .filter((item) => item.order_ref === order.order_ref)
        .reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

      return {
        order_ref: order.order_ref,
        user_id: user.id,
        status: order.status,
        total_amount,
        order_date: order.order_date,

        delivery_date: order.delivery_date,
        delivery_address: order.delivery_address,
        payment_method: order.payment_method,
        is_paid: order.is_paid,
        notes: order.notes || null,
      };
    })
    .filter(Boolean);

  const { data: insertedOrders, error: ordersError } = await supabase
    .from("orders")
    .insert(finalOrders)
    .select();
  if (ordersError) console.error("Orders:", ordersError);

  const finalOrderItems = order_items
    .map((oi) => {
      const order = insertedOrders.find((o) => o.order_ref === oi.order_ref);
      const cocktail = insertedCocktails.find(
        (c) => c.name === oi.cocktail_name
      );
      const size = insertedSizes.find((s) => s.name === oi.size_name);
      if (!order || !cocktail || !size) return null;

      return {
        order_id: order.id,
        cocktail_id: cocktail.id,
        size_id: size.id,
        quantity: oi.quantity,
        unit_price: oi.unit_price,
        item_total: oi.quantity * oi.unit_price,
      };
    })
    .filter(Boolean);

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(finalOrderItems);
  if (orderItemsError) console.error("Order_items:", orderItemsError);
}

function Uploader() {
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    setLoading(true);
    try {
      await uploadAll();
      alert("Datos subidos correctamente");
    } catch (error) {
      console.error("Error subiendo datos:", error);
      alert("Error subiendo datos, revisa consola");
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        padding: 8,
        borderRadius: 5,
        backgroundColor: "#eef",
        textAlign: "center",
      }}
    >
      <Button disabled={loading} onClick={handleUpload}>
        {loading ? "Subiendo..." : "Subir datos de prueba"}
      </Button>
    </div>
  );
}

export default Uploader;
