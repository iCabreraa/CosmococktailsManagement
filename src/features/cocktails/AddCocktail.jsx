import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useCreateCocktail } from "./useCreateCocktail";
import FileInput from "../../ui/FileInput";
import Button from "../../ui/Button";
import { useEffect, useState } from "react";
import { useSizes } from "../sizes/useSizes";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding: 3.2rem;
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-md);
`;

const FieldGroup = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 0.8rem;
  font-size: 1.4rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-100);
  color: var(--color-grey-900);
  width: 100%;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 1.3rem;
`;

const ToggleSwitch = styled.button`
  width: 40px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background-color: ${(props) =>
    props.$active ? "var(--color-green-300)" : "var(--color-red-300)"};
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: ${(props) => (props.$active ? "22px" : "3px")};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: white;
    transition: all 0.3s;
  }
`;

const SizesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1.4rem;

  th,
  td {
    border: 1px solid var(--color-grey-200);
    padding: 1rem;
    text-align: left;
  }

  th {
    background-color: var(--color-grey-100);
  }

  input {
    width: 80px;
    padding: 0.4rem;
    font-size: 1.4rem;
    border: 1px solid var(--color-grey-300);
    border-radius: var(--border-radius-sm);
    background-color: var(--color-grey-100);
    color: var(--color-grey-900);
  }
`;

function AddCocktail() {
  const { createCocktail, isCreating } = useCreateCocktail();
  const { sizes, isLoading: isLoadingSizes } = useSizes();
  const [selectedImage, setSelectedImage] = useState(null);
  const [virgin, setVirgin] = useState(false);
  const [available, setAvailable] = useState(true);
  const [sizesState, setSizesState] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    if (sizes) {
      setSizesState(
        sizes.map((s) => ({
          size_id: s.id,
          name: s.name,
          volume_ml: s.volume_ml,
          price: 0,
          available: true,
        }))
      );
    }
  }, [sizes]);

  function handleSizeChange(size_id, field, value) {
    setSizesState((prev) =>
      prev.map((s) => (s.size_id === size_id ? { ...s, [field]: value } : s))
    );
  }

  async function onSubmit(data) {
    const cocktailData = {
      name: data.name,
      description: data.description,
      alcohol_percentage: parseFloat(data.alcohol_percentage),
      has_non_alcoholic_version: virgin,
      is_available: available,
      image_url: selectedImage || "", // Se sobrescribe si hay imagen subida luego
    };

    createCocktail(
      {
        newCocktailData: cocktailData,
        sizesData: sizesState,
        imageFile: selectedImage,
      },
      {
        onSuccess: () => {
          reset();
          setSelectedImage(null);
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <div style={{ flex: 1 }}>
          <Label>Name</Label>
          <Input {...register("name", { required: true })} />
        </div>
        <div style={{ flex: 1 }}>
          <Label>Alcohol %</Label>
          <Input
            type="number"
            step="0.1"
            {...register("alcohol_percentage", { required: true })}
          />
        </div>
      </FieldGroup>

      <Label>Description</Label>
      <Input
        as="textarea"
        rows="3"
        {...register("description", { required: true })}
      />

      <FieldGroup>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span>Virgin version</span>
          <ToggleSwitch
            type="button"
            $active={virgin}
            onClick={() => setVirgin((v) => !v)}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span>Available</span>
          <ToggleSwitch
            type="button"
            $active={available}
            onClick={() => setAvailable((a) => !a)}
          />
        </div>
      </FieldGroup>

      <div>
        <Label>Image</Label>
        <FileInput
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files[0])}
        />
      </div>

      <div>
        <Label>Sizes, Prices & Availability</Label>
        {!isLoadingSizes && (
          <SizesTable>
            <thead>
              <tr>
                <th>Size</th>
                <th>Volume (ml)</th>
                <th>Price (€)</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {sizesState.map((size) => (
                <tr key={size.size_id}>
                  <td>{size.name}</td>
                  <td>{size.volume_ml} ml</td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={size.price}
                      onChange={(e) =>
                        handleSizeChange(
                          size.size_id,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td>
                    <ToggleSwitch
                      type="button"
                      $active={size.available}
                      onClick={() =>
                        handleSizeChange(
                          size.size_id,
                          "available",
                          !size.available
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </SizesTable>
        )}
      </div>

      <Button type="submit" disabled={isCreating || isSubmitting}>
        Add Cocktail
      </Button>
    </Form>
  );
}

export default AddCocktail;
