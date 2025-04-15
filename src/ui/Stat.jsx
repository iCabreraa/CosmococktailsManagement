// src/ui/Stat.jsx
import styled from "styled-components";

const Box = styled.div`
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: flex-start;
  justify-content: center;
  min-width: 150px;
`;

const Label = styled.h6`
  font-size: 1.4rem;
  color: var(--color-grey-600);
  font-weight: 500;
`;

const Value = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-brand-600);
`;

function Stat({ title, value }) {
  return (
    <Box>
      <Label>{title}</Label>
      <Value>{value}</Value>
    </Box>
  );
}

export default Stat;
