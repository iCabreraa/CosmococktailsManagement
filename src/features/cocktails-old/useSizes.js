import { useQuery } from "@tanstack/react-query";
import supabase from "../../services/supabase";

async function fetchSizes() {
  const { data, error } = await supabase.from("sizes").select("*");

  if (error) throw new Error("Sizes could not be loaded");

  return data;
}

export function useSizes() {
  const {
    data: sizes,
    isPending,
    error,
  } = useQuery({
    queryKey: ["sizes"],
    queryFn: fetchSizes,
  });

  return { sizes, isPending, error };
}
