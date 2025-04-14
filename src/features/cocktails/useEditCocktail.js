import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createEditCocktail } from "../../services/apiCocktails";

export function useEditCocktail() {
  const queryCLient = useQueryClient();

  const { mutate: editCocktail, isLoading: isEditing } = useMutation({
    mutationFn: ({ newCocktailData, id }) =>
      createEditCocktail(newCocktailData, id),
    onSuccess: () => {
      toast.success("Cocktail successfully edited");
      queryCLient.invalidateQueries({
        queryKey: ["cocktails"],
        invalidateQueries: true,
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Hubo un error al crear el cocktail");
    },
  });

  return { isEditing, editCocktail };
}
