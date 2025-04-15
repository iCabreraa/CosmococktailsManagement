import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createEditCocktail } from "../../services/apiCocktails";

export function useEditCocktail() {
  const queryClient = useQueryClient();

  const { mutate: editCocktail, isLoading: isEditing } = useMutation({
    mutationFn: (data) => createEditCocktail(data), // ✅ Esto soluciona el error
    onSuccess: () => {
      toast.success("Cocktail successfully edited");
      queryClient.invalidateQueries(["cocktails"]);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Hubo un error al editar el cocktail");
    },
  });

  return { isEditing, editCocktail };
}
