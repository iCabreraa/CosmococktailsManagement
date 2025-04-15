import styled from "styled-components";

const Switch = styled.button`
  width: 40px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background-color: ${(props) =>
    props.$active ? "var(--color-green-200)" : "var(--color-red-200)"};
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

function ToggleSwitch({ active, onToggle }) {
  return <Switch type="button" $active={active} onClick={onToggle} />;
}

export default ToggleSwitch;
