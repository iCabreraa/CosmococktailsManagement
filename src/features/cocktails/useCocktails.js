import { useQuery } from "@tanstack/react-query";
import { getCocktails } from "../../services/apiCocktails";

export function useCocktails() {
  const {
    isPending,
    data: cocktails,
    error,
  } = useQuery({
    queryKey: ["cocktails"],
    queryFn: getCocktails,
  });

  return { cocktails, isPending, error };
}
