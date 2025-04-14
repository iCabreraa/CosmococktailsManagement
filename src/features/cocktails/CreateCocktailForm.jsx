import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { useForm } from "react-hook-form";

import { useCreateCocktail } from "./useCreateCocktail";
import { useEditCocktail } from "./useEditCocktail";

// const Checkbox = ({ id }) => <Input type="checkbox" id={id} />;

function CreateCocktailForm({ cocktailToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cocktailToEdit;

  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;

  // Create and Edit cocktails hooks
  const { isCreating, createCocktail } = useCreateCocktail();
  const { isEditing, editCocktail } = useEditCocktail();

  const isWorking = isCreating || isEditing;

  function onSubmit(data) {
    const image_url =
      typeof data.image_url === "string" ? data.image_url : data.image_url[0];

    if (isEditSession)
      editCocktail(
        { newCocktailData: { ...data, image_url }, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      createCocktail(
        { ...data, image_url },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }
  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cocktail name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "Cocktail name is required",
          })}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <Textarea
          id="description"
          disabled={isWorking}
          defaultValue=""
          {...register("description", {
            required: "Cocktail description is required",
          })}
        />
      </FormRow>

      <FormRow
        label="Alcohol Percentage"
        error={errors?.alcohol_percentage?.message}
      >
        <Input
          type="number"
          id="alcohol_percentage"
          disabled={isWorking}
          // defaultValue={0}
          {...register("alcohol_percentage", {
            required: "Cocktail alcohol is required",
            validate: (value) =>
              (value >= 0 && value <= 50) || "Alcohol must be between 0 and 50",
          })}
        />
      </FormRow>

      <FormRow label="Cocktail photo">
        <FileInput
          id="image_url"
          disabled={isWorking}
          accept="image/*"
          {...register("image_url", {
            required: isEditSession ? false : "Cocktail Image is required",
          })}
        />
      </FormRow>

      {/* Agregar los campos de tipo checkbox */}
      <FormRow
        label="Version 00"
        error={errors?.has_non_alcoholic_version?.message}
      >
        <Input
          type="checkbox"
          id="has_non_alcoholic_version"
          disabled={isWorking}
          {...register("has_non_alcoholic_version")}
        />
      </FormRow>

      <FormRow label="Is Available" error={errors?.is_available?.message}>
        <Input
          type="checkbox"
          id="is_available"
          disabled={isWorking}
          {...register("is_available")}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="danger"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating}>
          {isEditSession ? "Edit Cocktail" : "Add Cocktail"}
        </Button>
      </FormRow>
    </Form>
  );
}

// Componentes auxiliares para Checkbox

export default CreateCocktailForm;
