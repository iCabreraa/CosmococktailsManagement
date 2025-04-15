import styled from "styled-components";
import { HiPencil, HiTrash } from "react-icons/hi2";
import { useDeleteCocktail } from "./useDeleteCocktail";
import Modal from "../../ui/Modal";
import CreateCocktailForm from "./CreateCocktailForm";
import ConfirmDelete from "../../ui/ConfirmDelete";

import { HiCheckCircle, HiXCircle, HiOutlineBeaker } from "react-icons/hi2";
import { Link } from "react-router-dom";

// Estilos reutilizables de tarjeta coherentes con la app
const Card = styled.div`
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-4px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 1.6rem;
  flex-grow: 1;
`;

const Title = styled.h3`
  font-size: 1.8rem;
  color: var(--color-grey-800);
  margin-bottom: 0.8rem;
`;

const Description = styled.p`
  font-size: 1.4rem;
  color: var(--color-grey-600);
  margin-bottom: 1.2rem;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* número de líneas visibles */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 6.2rem; /* ajusta según la altura deseada */
`;

const Info = styled.div`
  font-size: 1.3rem;
  color: var(--color-brand-600);
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1.6rem 1.6rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-grey-600);
  transition: color 0.3s;

  &:hover {
    color: var(--color-brand-600);
  }
`;

const Tag = styled.span`
  font-size: 1.2rem;
  padding: 0.4rem 1rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-grey-0);
  background-color: ${({ type }) => {
    switch (type) {
      case "available":
        return "var(--color-green-700)";
      case "non-available":
        return "var(--color-red-800)";
      case "virgin":
        return "var(--color-indigo-700)";
      case "non-virgin":
        return "var(--color-yellow-700)";
      case "alcohol":
        return "var(--color-brand-600)";
      default:
        return "var(--color-grey-500)";
    }
  }};
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.2rem;
`;

const TagContainer = styled.div`
  margin-top: 1rem;
`;

function CocktailCard({ cocktail }) {
  const { deleteCocktail, isDeleting } = useDeleteCocktail();

  const {
    id,
    name,
    description,
    image_url,
    alcohol_percentage,
    has_non_alcoholic_version,
    is_available,
  } = cocktail;

  return (
    // <Card>
    //   <Image src={image_url} alt={name} />
    //   <Content>
    //     <Title>{name}</Title>
    //     <Description>{description}</Description>
    //     <TagRow>
    //       <Tag type="alcohol">
    //         <HiOutlineBeaker size={16} /> {alcohol_percentage}% Alcohol
    //       </Tag>
    //       <Tag type={has_non_alcoholic_version ? "virgin" : "non-virgin"}>
    //         {has_non_alcoholic_version ? "🌿 Virgin" : "🍸 Non Virgin"}
    //       </Tag>
    //       <Tag type={is_available ? "available" : "non-available"}>
    //         {is_available ? (
    //           <>
    //             <HiCheckCircle size={16} /> Available
    //           </>
    //         ) : (
    //           <>
    //             <HiXCircle size={16} /> Not Available
    //           </>
    //         )}
    //       </Tag>
    //     </TagRow>
    //   </Content>
    <Link to={`/cocktails/${id}`} style={{ textDecoration: "none" }}>
      <Card>
        <Image src={image_url} alt={name} />
        <Content>
          <Title>{name}</Title>
          <Description>{description}</Description>
          <TagRow>
            <Tag type="alcohol">
              <HiOutlineBeaker size={16} /> {alcohol_percentage}% Alcohol
            </Tag>
            <Tag type={has_non_alcoholic_version ? "virgin" : "non-virgin"}>
              {has_non_alcoholic_version ? "🌿 Virgin" : "🍸 Non Virgin"}
            </Tag>
            <Tag type={is_available ? "available" : "non-available"}>
              {is_available ? (
                <>
                  <HiCheckCircle size={16} /> Available
                </>
              ) : (
                <>
                  <HiXCircle size={16} /> Not Available
                </>
              )}
            </Tag>
          </TagRow>
        </Content>
        <Actions>
          <Modal>
            <Modal.Open opens="edit-form">
              <ActionButton>
                <HiPencil size={20} />
              </ActionButton>
            </Modal.Open>

            <Modal.Window name="edit-form">
              <CreateCocktailForm cocktailToEdit={cocktail} />
            </Modal.Window>
          </Modal>

          <Modal>
            <Modal.Open opens="delete-confirm">
              <ActionButton disabled={isDeleting}>
                <HiTrash size={20} />
              </ActionButton>
            </Modal.Open>

            <Modal.Window name="delete-confirm">
              <ConfirmDelete
                resourceName="cocktail"
                disabled={isDeleting}
                onConfirm={() => deleteCocktail(id)}
              />
            </Modal.Window>
          </Modal>
        </Actions>
      </Card>
    </Link>
  );
}

export default CocktailCard;
