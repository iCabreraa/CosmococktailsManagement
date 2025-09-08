import styled, { keyframes, css } from "styled-components";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { getDateColor } from "../../utils/getDateColor";

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const StyledItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.6rem;
  border-left: 5px solid ${({ $color }) => `var(--color-${$color}-700)`};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  transition:
    background-color 0.2s,
    transform 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
    transform: scale(1.02);
  }
`;

const Info = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-700);
`;

const Price = styled.div`
  font-weight: 600;
  font-size: 1.6rem;
`;

const DateTag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.8rem;
  font-size: 1.2rem;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background-color: ${({ $color }) => `var(--color-${$color}-200)`};
  animation: ${({ $color }) =>
    $color === "red" &&
    css`
      ${pulse} 1.6s infinite ease-in-out
    `};
`;

function OrderItem({ order }) {
  const deliveryFormatted = format(new Date(order.delivery_date), "dd/MM/yyyy");
  const color = getDateColor(order.delivery_date);

  return (
    <Link to={`/orders/${order.id}`}>
      <StyledItem $color={color}>
        <Info>
          {order.users?.full_name} — {order.order_items?.length} item(s) —{" "}
          {deliveryFormatted}
          <DateTag $color={color} />
        </Info>

        <Price>€{order.total_amount?.toFixed(2)}</Price>
      </StyledItem>
    </Link>
  );
}

export default OrderItem;
