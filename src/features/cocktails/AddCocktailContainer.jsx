import { useState } from "react";
import styled from "styled-components";
import AddCocktail from "./AddCocktail";

const Container = styled.div`
  margin: 2rem 0;
`;

const ToggleButton = styled.button`
  background-color: var(--color-brand-500);
  color: white;
  font-size: 2rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: var(--shadow-md);

  &:hover {
    background-color: var(--color-brand-600);
  }
`;

const CollapseWrapper = styled.div`
  margin-top: 2rem;
  max-height: ${({ $open }) => ($open ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

function AddCocktailContainer() {
  const [open, setOpen] = useState(false);

  return (
    <Container>
      <ToggleButton onClick={() => setOpen((o) => !o)}>
        {open ? "−" : "+"}
      </ToggleButton>

      <CollapseWrapper $open={open}>
        <AddCocktail />
      </CollapseWrapper>
    </Container>
  );
}

export default AddCocktailContainer;
