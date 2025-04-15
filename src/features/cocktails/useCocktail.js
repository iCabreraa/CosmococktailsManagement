import { useQuery } from "@tanstack/react-query";
import supabase from "../../services/supabase";

async function getCocktail(id) {
  const { data, error } = await supabase
    .from("cocktails")
    .select(`*, cocktail_sizes(price, available, sizes(id, name, volume_ml))`)
    .eq("id", id)
    .single();

  if (error) throw new Error("Cocktail could not be loaded");
  return data;
}

export function useCocktail(id) {
  const {
    data: cocktail,
    isPending,
    error,
  } = useQuery({
    queryKey: ["cocktail", id],
    queryFn: () => getCocktail(id),
    enabled: Boolean(id),
  });

  return { cocktail, isPending, error };
}
