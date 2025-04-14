// useCreateCocktail.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCocktail } from "../../services/apiCocktails";
import toast from "react-hot-toast";

export function useCreateCocktail() {
  const queryClient = useQueryClient();

  const { mutate: createCocktail, isLoading: isCreating } = useMutation({
    mutationFn: (data) => createEditCocktail(data),
    onSuccess: () => {
      toast.success("Cocktail creado correctamente");
      queryClient.invalidateQueries(["cocktails"]);
    },
    onError: (error) => {
      console.error("Error completo:", error);
      toast.error(`Error al crear el cocktail: ${error.message}`);
    },
  });

  return { isCreating, createCocktail };
}
