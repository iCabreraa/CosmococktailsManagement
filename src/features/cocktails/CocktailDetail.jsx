import { useForm } from "react-hook-form";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCocktail } from "./useCocktail";
import Spinner from "../../ui/Spinner";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import CocktailStats from "./CocktailStats";
import CocktailCharts from "./CocktailCharts";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import { useEffect, useState } from "react";
import { useEditCocktail } from "./useEditCocktail";
import { useDeleteCocktail } from "./useDeleteCocktail";
import { FcBarChart } from "react-icons/fc";
import { ImStatsDots } from "react-icons/im";

const Container = styled.div`
  padding: 4rem;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 3.2rem;
  align-items: center;
`;

const EditableInput = styled.input`
  font-size: 2rem;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-300);
  width: 100%;
  background-color: var(--color-grey-100);
  color: var(--color-grey-900);
`;

const EditableTextarea = styled.textarea`
  font-size: 1.4rem;
  padding: 0.6rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-300);
  width: 100%;
  resize: vertical;
  background-color: var(--color-grey-100);
  color: var(--color-grey-900);
`;

const EditActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Img = styled.img`
  width: 100%;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  object-fit: cover;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const SubTitle = styled.p`
  font-size: 1.5rem;
  color: var(--color-grey-600);
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1.6rem;
`;

const SizesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
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

const ToggleSwitch = styled.button`
  width: 40px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background-color: ${props =>
    props.$active ? "var(--color-green-200)" : "var(--color-red-200)"};
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: ${props => (props.$active ? "22px" : "3px")};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: white;
    transition: all 0.3s;
  }
`;

const StatsSection = styled.section`
  border-top: 2px solid var(--color-grey-200);
  padding-top: 4rem;
  margin-top: 4rem;
  background-color: var(--color-grey-50);
  border-radius: var(--border-radius-md);
`;

const StatsTitle = styled.h3`
  font-size: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-brand-600);
  margin-bottom: 2rem;
`;

function CocktailDetail() {
  const { cocktailId } = useParams();
  const { cocktail, isPending } = useCocktail(cocktailId);
  const { editCocktail, isEditing: isSubmitting } = useEditCocktail();
  const { deleteCocktail, isDeleting } = useDeleteCocktail();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [sizesState, setSizesState] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [virgin, setVirgin] = useState(false);
  const [available, setAvailable] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const days = searchParams.get("days") || "30";
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  function handleDaysChange(e) {
    const value = e.target.value;
    setIsStatsLoading(true);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("days", value);
      return newParams;
    });

    setTimeout(() => setIsStatsLoading(false), 400); // Simula transición suave
  }

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { isDirty },
  } = useForm();

  useEffect(() => {
    if (cocktail) {
      reset({
        name: cocktail.name,
        description: cocktail.description,
        alcohol_percentage: cocktail.alcohol_percentage,
        has_non_alcoholic_version: cocktail.has_non_alcoholic_version,
        is_available: cocktail.is_available,
      });
      setVirgin(cocktail.has_non_alcoholic_version);
      setAvailable(cocktail.is_available);

      setSizesState(
        cocktail.cocktail_sizes.map(s => ({
          size_id: s.sizes.id,
          name: s.sizes.name,
          volume_ml: s.sizes.volume_ml,
          price: s.price,
          available: s.available,
        }))
      );
    }
  }, [cocktail, reset]);

  function handleSizeChange(size_id, field, value) {
    setSizesState(prev =>
      prev.map(s => (s.size_id === size_id ? { ...s, [field]: value } : s))
    );
  }

  function onSubmit(data) {
    const image_url = selectedImage || cocktail.image_url;
    const payload = {
      name: data.name ?? cocktail.name,
      description: data.description ?? cocktail.description,
      alcohol_percentage:
        typeof data.alcohol_percentage === "number"
          ? data.alcohol_percentage
          : cocktail.alcohol_percentage,
      has_non_alcoholic_version: virgin,
      is_available: available,
    };

    editCocktail(
      {
        newCocktailData: payload,
        id: cocktailId,
        sizesData: sizesState.map(({ size_id, price, available }) => ({
          size_id,
          price,
          available,
        })),
        imageFile: selectedImage,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setSelectedImage(null);
        },
      }
    );
  }

  function handleDelete() {
    deleteCocktail(cocktailId, {
      onSuccess: () => {
        navigate("/cocktails");
      },
    });
  }

  if (isPending) return <Spinner />;

  const { image_url, name, description, alcohol_percentage, is_available } =
    cocktail;

  function resetToInitialState() {
    reset({
      name: cocktail.name,
      description: cocktail.description,
      alcohol_percentage: cocktail.alcohol_percentage,
      has_non_alcoholic_version: cocktail.has_non_alcoholic_version,
      is_available: cocktail.is_available,
    });

    setVirgin(cocktail.has_non_alcoholic_version);
    setAvailable(cocktail.is_available);
    setSelectedImage(null);

    setSizesState(
      cocktail.cocktail_sizes.map(s => ({
        size_id: s.sizes.id,
        name: s.sizes.name,
        volume_ml: s.sizes.volume_ml,
        price: s.price,
        available: s.available,
      }))
    );
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Header>
          <div>
            <Img
              src={
                selectedImage ? URL.createObjectURL(selectedImage) : image_url
              }
              alt={name}
              onError={e =>
                (e.target.src = "/cocktails/default/pina-colada.png")
              }
            />
            {isEditing && (
              <FileInput
                accept="image/*"
                onChange={e => setSelectedImage(e.target.files[0])}
              />
            )}
          </div>

          <Info>
            {isEditing ? (
              <>
                <EditableInput {...register("name", { required: true })} />
                <EditableTextarea
                  {...register("description", { required: true })}
                />
                <EditableInput
                  type="number"
                  step="0.1"
                  {...register("alcohol_percentage", { required: true })}
                />

                <TagContainer>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                    }}
                  >
                    <span>Virgin version</span>
                    <ToggleSwitch
                      type="button"
                      $active={virgin}
                      onClick={() => setVirgin(v => !v)}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                    }}
                  >
                    <span>Available</span>
                    <ToggleSwitch
                      type="button"
                      $active={available}
                      onClick={() => setAvailable(a => !a)}
                    />
                  </div>
                </TagContainer>

                <EditActions>
                  <Button
                    type="button"
                    variation="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      resetToInitialState();
                    }}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" disabled={isSubmitting}>
                    Save
                  </Button>
                </EditActions>
              </>
            ) : (
              <>
                <Heading as="h1">{name}</Heading>
                <SubTitle>{description}</SubTitle>
                <TagContainer>
                  <Tag color="blue">{alcohol_percentage}% Alcohol</Tag>
                  <Tag color={virgin ? "indigo" : "yellow"}>
                    {virgin ? "Virgin version" : "Only alcoholic"}
                  </Tag>
                  <Tag color={is_available ? "green" : "red"}>
                    {is_available ? "Available" : "Not available"}
                  </Tag>
                </TagContainer>
              </>
            )}
          </Info>

          <Actions>
            {!isEditing && (
              <>
                <Button type="button" onClick={() => setIsEditing(true)}>
                  <HiPencil size={20} />
                </Button>
                <Modal>
                  <Modal.Open opens="delete-confirm">
                    <Button variation="danger">
                      <HiTrash size={24} />
                    </Button>
                  </Modal.Open>
                  <Modal.Window name="delete-confirm">
                    <ConfirmDelete
                      resourceName="cocktail"
                      disabled={isDeleting}
                      onConfirm={handleDelete}
                    />
                  </Modal.Window>
                </Modal>
              </>
            )}
          </Actions>
        </Header>
      </form>

      <section>
        <Heading as="h3">Sizes, Prices & Availability</Heading>
        {sizesState?.length > 0 ? (
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
              {sizesState.map(size => (
                <tr key={size.size_id}>
                  <td>{size.name}</td>
                  <td>{size.volume_ml} ml</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={size.price}
                        onChange={e =>
                          handleSizeChange(
                            size.size_id,
                            "price",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    ) : (
                      `€${size.price.toFixed(2)}`
                    )}
                  </td>
                  <td>
                    {isEditing ? (
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
                    ) : (
                      <Tag color={size.available ? "green" : "red"}>
                        {size.available ? "Yes" : "No"}
                      </Tag>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </SizesTable>
        ) : (
          <p style={{ fontSize: "1.4rem", color: "var(--color-grey-500)" }}>
            No size information available for this cocktail.
          </p>
        )}
      </section>

      <StatsSection>
        <StatsTitle>
          <FcBarChart size={28} />
          Statistics & Insights
        </StatsTitle>
        <div style={{ minHeight: "12rem", marginBottom: "2rem" }}>
          {isStatsLoading ? (
            <Spinner />
          ) : (
            <CocktailStats cocktailId={cocktailId} days={days} />
          )}
        </div>

        <div style={{ minHeight: "28rem" }}>
          {isStatsLoading ? (
            <Spinner />
          ) : (
            <CocktailCharts key={days} cocktailId={cocktailId} days={days} />
          )}
        </div>
      </StatsSection>
    </Container>
  );
}

export default CocktailDetail;
