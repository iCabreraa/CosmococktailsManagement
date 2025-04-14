import styled from "styled-components";
import { useState } from "react";
// import {formatCurrency} from "../../utils/helpers";
import CreateCocktailForm from "./CreateCocktailForm";
import { useDeleteCocktail } from "./useDeleteCocktail";

import {
  HiCheckCircle,
  HiPencil,
  HiSquare2Stack,
  HiTrash,
  HiXCircle,
} from "react-icons/hi2";
import { useCreateCocktail } from "./useCreateCocktail";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

// const TableRow = styled.div`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;
//   padding: 1.4rem 2.4rem;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }
// `;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cocktail = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Alcohol = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const NonAlcohol = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

const Avaiable = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

// For virgins and available status
const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: "Sono";
  font-weight: 500;
  color: ${(props) =>
    props.available ? "var(--color-green-700)" : "var(--color-red-700)"};
`;

function CocktailRow({ cocktail }) {
  const [showForm, setShowForm] = useState(false);
  const { isDeleting, deleteCocktail } = useDeleteCocktail();

  const { isCreating, createCocktail } = useCreateCocktail();

  const {
    id: cocktailId,
    name,
    description,
    image_url,
    alcohol_percentage,
    has_non_alcoholic_version,
    is_available,
  } = cocktail;

  function handleDuplicate() {
    createCocktail({
      name: `Copy of ${name}`,
      description,
      image_url,
      alcohol_percentage,
      has_non_alcoholic_version,
      is_available,
    });
  }
  return (
    <Table.Row role="row">
      <Img src={image_url} alt={name} />
      <Cocktail>{name}</Cocktail>
      <p>{description}</p>
      <Alcohol>{alcohol_percentage}% alcohol</Alcohol>
      <Status available={has_non_alcoholic_version}>
        {has_non_alcoholic_version ? (
          <>
            <HiCheckCircle style={{ color: "var(--color-green-700)" }} />
            Virgin
          </>
        ) : (
          <>
            <HiXCircle style={{ color: "var(--color-red-700)" }} />
            Non Virgin
          </>
        )}
      </Status>

      <Status available={is_available}>
        {is_available ? (
          <>
            <HiCheckCircle style={{ color: "var(--color-green-700)" }} />
            Available
          </>
        ) : (
          <>
            <HiXCircle style={{ color: "var(--color-red-700)" }} />
            Not Available
          </>
        )}
      </Status>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={cocktailId} />

            <Menus.List id={cocktailId}>
              <Menus.Button icon={<HiSquare2Stack />} onClick={handleDuplicate}>
                Duplicate
              </Menus.Button>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>
              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <CreateCocktailForm cocktailToEdit={cocktail} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="cocktails"
                disabled={isDeleting}
                onConfirm={() => deleteCocktail(cocktailId)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default CocktailRow;
