import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("cocktail_sizes")
        .select(
          `
          cocktail_id,
          sizes_id,
          price,
          available,
          stock_quantity,
          cocktails!inner(
            id,
            name
          ),
          sizes!inner(
            id,
            name,
            volume_ml
          )
        `
        )
        .order("cocktails(name), sizes(volume_ml)");

      if (error) {
        console.error("❌ Error fetching inventory:", error);
        throw error;
      }

      console.log("🔍 DATOS DE INVENTARIO RECIBIDOS:");
      console.log("Total items:", data.length);

      // Log detallado de cada item y validación
      data.forEach((item, index) => {
        console.log(`\n${index + 1}. Item completo:`, item);
        console.log(`   - cocktail_id: ${item.cocktail_id}`);
        console.log(`   - sizes_id: ${item.sizes_id}`);
        console.log(`   - cocktail:`, item.cocktails);
        console.log(`   - size:`, item.sizes);
        console.log(`   - stock_quantity: ${item.stock_quantity}`);

        // Validar que los IDs estén presentes
        if (!item.cocktail_id || !item.sizes_id) {
          console.error(`❌ ITEM ${index + 1} TIENE IDs FALTANTES:`, {
            cocktail_id: item.cocktail_id,
            sizes_id: item.sizes_id,
            cocktails_id: item.cocktails?.id,
            sizes_id_from_sizes: item.sizes?.id,
          });
        }
      });

      setInventory(data || []);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (itemId, newStock) => {
    try {
      setError(null);

      console.log("🔍 ITEM ID RECIBIDO:", itemId);
      console.log("🔍 NEW STOCK:", newStock);

      // Parsear el itemId usando el separador |||
      const parts = itemId.split("|||");

      if (parts.length !== 2) {
        throw new Error(
          `Formato de itemId inválido: ${itemId}. Esperado: cocktailId|||sizeId`
        );
      }

      const [cocktailId, sizeId] = parts;

      console.log("🔍 PARSED IDs:", {
        cocktailId,
        sizeId,
        originalItemId: itemId,
      });

      // Verificar que los IDs sean UUIDs válidos
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      if (!uuidRegex.test(cocktailId) || !uuidRegex.test(sizeId)) {
        console.error("❌ IDs inválidos detectados:");
        console.error("  - itemId completo:", itemId);
        console.error("  - cocktailId:", cocktailId);
        console.error("  - sizeId:", sizeId);
        console.error("  - ¿Es UUID cocktailId?:", uuidRegex.test(cocktailId));
        console.error("  - ¿Es UUID sizeId?:", uuidRegex.test(sizeId));
        throw new Error(
          `IDs inválidos: cocktail_id=${cocktailId}, sizes_id=${sizeId}`
        );
      }

      const { error } = await supabase
        .from("cocktail_sizes")
        .update({
          stock_quantity: newStock,
          available: newStock > 0,
        })
        .eq("cocktail_id", cocktailId)
        .eq("sizes_id", sizeId);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      // Actualizar el estado local - SOLO el item específico
      setInventory(prev =>
        prev.map(item => {
          if (item.cocktail_id === cocktailId && item.sizes_id === sizeId) {
            console.log("✅ Actualizando item específico:", {
              cocktail: item.cocktails?.name,
              size: item.sizes?.name,
              oldStock: item.stock_quantity,
              newStock: newStock,
            });
            return {
              ...item,
              stock_quantity: newStock,
              available: newStock > 0,
            };
          }
          return item;
        })
      );

      console.log("✅ Stock updated successfully");
      return true;
    } catch (err) {
      console.error("❌ Error updating stock:", err);
      setError(`Error actualizando stock: ${err.message}`);
      return false;
    }
  };

  const bulkUpdateStock = async updates => {
    try {
      setError(null);

      const updatePromises = updates.map(update =>
        supabase
          .from("cocktail_sizes")
          .update({
            stock_quantity: update.stock,
            available: update.stock > 0,
          })
          .eq("cocktail_id", update.cocktail_id)
          .eq("sizes_id", update.sizes_id)
      );

      const results = await Promise.all(updatePromises);

      // Verificar si hay errores
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error(`Error updating ${errors.length} items`);
      }

      // Actualizar el estado local
      setInventory(prev =>
        prev.map(item => {
          const update = updates.find(
            u =>
              u.cocktail_id === item.cocktail_id && u.sizes_id === item.sizes_id
          );
          return update
            ? {
                ...item,
                stock_quantity: update.stock,
                available: update.stock > 0,
              }
            : item;
        })
      );

      return true;
    } catch (err) {
      console.error("Error bulk updating stock:", err);
      setError(err.message);
      return false;
    }
  };

  const setAllStock = async stockValue => {
    try {
      setError(null);

      const updates = inventory.map(item => ({
        cocktail_id: item.cocktail_id,
        sizes_id: item.sizes_id,
        stock: stockValue,
      }));

      return await bulkUpdateStock(updates);
    } catch (err) {
      console.error("Error setting all stock:", err);
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    inventory,
    loading,
    error,
    fetchInventory,
    updateStock,
    bulkUpdateStock,
    setAllStock,
    refreshInventory: fetchInventory,
  };
};
