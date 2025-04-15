// src/features/sizes/useSizes.js
import { useQuery } from "@tanstack/react-query";
import supabase from "../../services/supabase";

export async function getSizes() {
  const { data, error } = await supabase
    .from("sizes")
    .select("id, name, volume_ml")
    .order("volume_ml", { ascending: true });

  if (error) {
    console.error(error);
    throw new Error("Sizes could not be loaded");
  }

  return data;
}

export function useSizes() {
  const {
    data: sizes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sizes"],
    queryFn: getSizes,
  });

  return { sizes, isLoading, error };
}
