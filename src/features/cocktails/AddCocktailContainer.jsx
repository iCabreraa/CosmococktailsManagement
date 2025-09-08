import styled from "styled-components";
import Modal from "../../ui/Modal";
import AddCocktail from "./AddCocktail";
import { HiPlus } from "react-icons/hi2";

const FloatingButton = styled.button`
  position: fixed;
  top: 10rem;
  right: 2.4rem;
  z-index: 999;
  background-color: var(--color-brand-500);
  color: white;
  border: none;
  border-radius: 50%;
  width: 46px;
  height: 46px;
  font-size: 2.8rem;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.3s,
    transform 0.2s;

  &:hover {
    background-color: var(--color-brand-600);
    transform: scale(1.08);
  }

  &:focus {
    outline: none;
  }
`;

function AddCocktailContainer() {
  return (
    <Modal>
      <Modal.Open opens="add-cocktail">
        <FloatingButton>
          <HiPlus />
        </FloatingButton>
      </Modal.Open>

      <Modal.Window name="add-cocktail">
        <AddCocktail />
      </Modal.Window>
    </Modal>
  );
}

export default AddCocktailContainer;
