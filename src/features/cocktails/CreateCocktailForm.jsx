import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSizes } from "../cocktails-old/useSizes";
import { useCreateCocktail } from "./useCreateCocktail";
import { useEditCocktail } from "./useEditCocktail";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

function CreateCocktailForm({ cocktailToEdit = {}, onCloseModal }) {
  const { id: editId, cocktail_sizes, ...editValues } = cocktailToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { sizes } = useSizes();

  const [sizesData, setSizesData] = useState([]);

  useEffect(() => {
    if (isEditSession && cocktail_sizes) {
      setSizesData(
        cocktail_sizes.map((cs) => ({
          size_id: cs.sizes.id,
          price: cs.price,
          available: cs.available,
        }))
      );
    }
  }, [isEditSession, cocktail_sizes]);

  function handleSizeChange(size_id, field, value) {
    setSizesData((prev) => {
      const updated = prev.filter((s) => s.size_id !== size_id);
      const currentSize = prev.find((s) => s.size_id === size_id) || {
        size_id,
        price: 0,
        available: true,
      };
      updated.push({ ...currentSize, [field]: value });
      return updated;
    });
  }

  const { isCreating, createCocktail } = useCreateCocktail();
  const { isEditing, editCocktail } = useEditCocktail();

  const isWorking = isCreating || isEditing;

  function onSubmit(data) {
    const image_url =
      typeof data.image_url === "string" ? data.image_url : data.image_url[0];

    if (isEditSession) {
      editCocktail(
        { newCocktailData: { ...data, image_url }, id: editId, sizesData },
        { onSuccess: onCloseModal }
      );
    } else {
      createCocktail(
        { ...data, image_url, sizesData },
        { onSuccess: onCloseModal }
      );
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cocktail name">
        <Input disabled={isWorking} {...register("name", { required: true })} />
      </FormRow>

      <FormRow label="Description">
        <Textarea
          disabled={isWorking}
          {...register("description", { required: true })}
        />
      </FormRow>

      <FormRow label="Alcohol Percentage">
        <Input
          type="number"
          disabled={isWorking}
          {...register("alcohol_percentage", { required: true })}
        />
      </FormRow>

      <FormRow label="Cocktail photo">
        <FileInput
          disabled={isWorking}
          accept="image/*"
          {...register("image_url", { required: !isEditSession })}
        />
      </FormRow>

      <FormRow label="Version 00">
        <Input
          type="checkbox"
          disabled={isWorking}
          {...register("has_non_alcoholic_version")}
        />
      </FormRow>

      <FormRow label="Is Available">
        <Input
          type="checkbox"
          disabled={isWorking}
          {...register("is_available")}
        />
      </FormRow>

      <div>
        <h3>Tamaños, precios y disponibilidad:</h3>
        {sizes?.map((size) => {
          const sizeDetail = sizesData.find((s) => s.size_id === size.id) || {};
          return (
            <div key={size.id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!sizeDetail.price}
                  onChange={(e) =>
                    handleSizeChange(
                      size.id,
                      "price",
                      e.target.checked ? sizeDetail.price || 0 : 0
                    )
                  }
                />
                {size.name}
              </label>
              {!!sizeDetail.price && (
                <>
                  Precio:{" "}
                  <input
                    type="number"
                    value={sizeDetail.price}
                    onChange={(e) =>
                      handleSizeChange(
                        size.id,
                        "price",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                  Disponible:{" "}
                  <input
                    type="checkbox"
                    checked={sizeDetail.available}
                    onChange={(e) =>
                      handleSizeChange(size.id, "available", e.target.checked)
                    }
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      <FormRow>
        <Button variation="danger" type="reset" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit Cocktail" : "Add Cocktail"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCocktailForm;
