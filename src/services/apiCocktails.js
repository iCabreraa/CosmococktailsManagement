import supabase, { supabaseUrl } from "./supabase";

export async function getCocktails() {
  const { data, error } = await supabase.from("cocktails").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cocktails could not be loaded");
  }

  return data;
}

export async function createEditCocktail(newCocktail, id) {
  const hasImagePath =
    typeof newCocktail.image_url === "string" &&
    newCocktail.image_url.startsWith(supabaseUrl);
  const imageName = `${Math.random()}-${
    newCocktail.image_url?.name
  }`.replaceAll("/", "");

  const imagePath = hasImagePath
    ? newCocktail.image_url
    : `${supabaseUrl}/storage/v1/object/public/cocktails/${imageName}`;

  let query;

  // Crear un nuevo cocktail
  if (!id) {
    query = supabase
      .from("cocktails")
      .insert([
        {
          ...newCocktail,
          image_url: imagePath,
        },
      ])
      .select();
  }

  // Editar cocktail existente
  if (id) {
    query = supabase
      .from("cocktails")
      .update({
        ...newCocktail,
        image_url: imagePath,
      })
      .eq("id", id)
      .select()
      .single();
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Cocktail could not be created/updated");
  }

  const cocktail = Array.isArray(data) ? data[0] : data;

  // Subir imagen sólo si es nueva
  if (!hasImagePath && newCocktail.image_url instanceof File) {
    const { error: storageError } = await supabase.storage
      .from("cocktails")
      .upload(imageName, newCocktail.image_url);

    if (storageError) {
      await supabase.from("cocktails").delete().eq("id", cocktail.id);
      console.error(storageError);
      throw new Error("Image upload failed");
    }
  }

  return cocktail;
}

export async function deleteCocktail(id) {
  const { error } = await supabase.from("cocktails").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cocktail could not be deleted");
  }
}
