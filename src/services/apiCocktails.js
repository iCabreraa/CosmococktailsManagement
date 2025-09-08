// src/features/cocktails/api/apiCocktails.js
import supabase from "./supabase";

// ✅ Subir imagen solo si es nueva
async function uploadImageIfNeeded(imageFile) {
  if (!imageFile) return undefined;
  if (typeof imageFile === "string") return imageFile;

  const fileExt = imageFile.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `cocktails/${fileName}`;

  const BUCKET_NAME = "cocktails";

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, imageFile);

  if (uploadError) {
    console.error("❌ Error uploading image:", uploadError.message);
    throw new Error("Image upload failed");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return publicUrl;
}

// ✅ Obtener todos los cócteles con tamaños anidados
export async function getCocktails() {
  const { data, error } = await supabase.from("cocktails").select(`
      *,
      cocktail_sizes(
        id,
        price,
        available,
        size_id,
        sizes (
          id,
          name,
          volume_ml
        )
      )
    `);

  if (error) throw new Error("❌ Error loading cocktails: " + error.message);
  return data;
}

// ✅ Obtener un cóctel individual
export async function getCocktailById(id) {
  const { data, error } = await supabase
    .from("cocktails")
    .select(
      `
      *,
      cocktail_sizes(
        id,
        price,
        available,
        size_id,
        sizes (
          id,
          name,
          volume_ml
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) throw new Error("❌ Error loading cocktail: " + error.message);
  return data;
}

// ✅ Crear o editar cóctel con tamaños
export async function createEditCocktail({
  newCocktailData,
  id,
  sizesData,
  imageFile,
}) {
  if (!newCocktailData || Object.keys(newCocktailData).length === 0)
    throw new Error("No cocktail data provided");

  let cocktail;

  // ✅ Subir imagen solo si hay archivo nuevo
  let imageUrl = undefined;
  if (imageFile !== undefined) {
    imageUrl = await uploadImageIfNeeded(imageFile);
  }

  const payload = {
    ...newCocktailData,
    ...(imageUrl && { image_url: imageUrl }),
  };

  // ✅ Crear nuevo cóctel
  if (!id) {
    const { data, error } = await supabase
      .from("cocktails")
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error("❌ Error creating cocktail: " + error.message);
    cocktail = data;
  }

  // ✅ Actualizar cóctel existente
  else {
    const { data, error } = await supabase
      .from("cocktails")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error("❌ Error updating cocktail: " + error.message);
    cocktail = data;

    // ✅ Eliminar tamaños antiguos
    await supabase.from("cocktail_sizes").delete().eq("cocktail_id", id);
  }

  // ✅ Insertar nuevos tamaños
  if (Array.isArray(sizesData) && sizesData.length > 0) {
    const formatted = sizesData
      .filter(s => s.size_id && typeof s.price === "number")
      .map(s => ({
        cocktail_id: cocktail.id,
        size_id: s.size_id,
        price: s.price,
        available: s.available ?? true,
      }));

    if (formatted.length > 0) {
      const { error } = await supabase.from("cocktail_sizes").insert(formatted);

      if (error) throw new Error("❌ Error inserting sizes: " + error.message);
    }
  }

  return cocktail;
}

// ✅ Eliminar cóctel y sus tamaños
export async function deleteCocktail(id) {
  const { error: sizesError } = await supabase
    .from("cocktail_sizes")
    .delete()
    .eq("cocktail_id", id);

  if (sizesError)
    throw new Error("❌ Error deleting cocktail sizes: " + sizesError.message);

  const { error } = await supabase.from("cocktails").delete().eq("id", id);
  if (error) throw new Error("❌ Error deleting cocktail: " + error.message);
}
