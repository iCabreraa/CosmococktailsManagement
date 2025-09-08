import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteCocktail as deleteCocktailApi } from "../../services/apiCocktails";

export function useDeleteCocktail() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteCocktail } = useMutation({
    mutationFn: deleteCocktailApi,
    onSuccess: () => {
      toast.success("Cocktail eliminado correctamente");
      queryClient.invalidateQueries("cocktails");
    },
    onError: error => {
      console.error(error);
      toast.error("Hubo un error al eliminar el cocktail");
    },
  });

  return { isDeleting, deleteCocktail };
}
