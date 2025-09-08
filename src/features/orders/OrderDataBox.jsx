import styled from "styled-components";
import { format, isToday } from "date-fns";
import {
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineUser,
  HiOutlineCreditCard,
  HiOutlineHomeModern,
  HiOutlineChatBubbleBottomCenterText,
} from "react-icons/hi2";

import DataItem from "../../ui/DataItem";
import { formatDistanceFromNow, formatCurrency } from "../../utils/helpers";

const StyledOrderDataBox = styled.section`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const Header = styled.header`
  background-color: var(--color-brand-500);
  padding: 2rem 4rem;
  color: #e0e7ff;
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    height: 3.2rem;
    width: 3.2rem;
  }

  & div:first-child {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-weight: 600;
  }

  & span {
    font-family: "Sono";
    font-size: 2rem;
    margin-left: 4px;
  }
`;

const Section = styled.section`
  padding: 3.2rem 4rem 1.2rem;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  color: var(--color-grey-500);

  & p:first-of-type {
    font-weight: 500;
    color: var(--color-grey-700);
  }
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 3.2rem;
  border-radius: var(--border-radius-sm);
  margin-top: 2.4rem;

  background-color: ${props =>
    props.is_paid ? "var(--color-green-100)" : "var(--color-yellow-100)"};
  color: ${props =>
    props.is_paid ? "var(--color-green-700)" : "var(--color-yellow-700)"};

  & p:last-child {
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 600;
  }

  svg {
    height: 2.4rem;
    width: 2.4rem;
    color: currentColor !important;
  }
`;

const Footer = styled.footer`
  padding: 1.6rem 4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;
`;

function OrderDataBox({ order }) {
  const {
    id,
    created_at,
    order_date,
    delivery_date,
    status,
    total_amount,
    payment_method,
    is_paid,
    delivery_address,
    notes,
    users: { full_name, email, phone },
  } = order;

  const orderDate = order_date ? new Date(order_date) : null;
  const deliveryDate = delivery_date ? new Date(delivery_date) : null;
  const createdAt = created_at ? new Date(created_at) : null;

  const paymentMethods = { 1: "Card", 2: "Cash", 3: "Transfer" };

  return (
    <StyledOrderDataBox>
      <Header>
        <div>
          <HiOutlineCalendarDays />
          <p>
            Order Nº <span>{id.slice(0, 8)}</span>
          </p>
        </div>

        <p>
          {orderDate
            ? `Ordered ${
                isToday(orderDate) ? "Today" : formatDistanceFromNow(order_date)
              }`
            : "Order date not set"}{" "}
          —{" "}
          {deliveryDate
            ? `Delivery on ${format(deliveryDate, "EEE, MMM dd yyyy")}`
            : "Delivery date not set"}
        </p>
      </Header>

      <Section>
        <User>
          <HiOutlineUser />
          <p>{full_name}</p>
          <span>&bull;</span>
          <p>{email}</p>
          <span>&bull;</span>
          <p>{phone}</p>
        </User>

        <DataItem icon={<HiOutlineCheckCircle />} label="Status">
          {status}
        </DataItem>

        <DataItem icon={<HiOutlineCreditCard />} label="Payment method">
          {paymentMethods[payment_method]}
        </DataItem>

        <DataItem icon={<HiOutlineHomeModern />} label="Delivery address">
          {delivery_address}
        </DataItem>

        {notes && (
          <DataItem
            icon={<HiOutlineChatBubbleBottomCenterText />}
            label="Notes"
          >
            {notes}
          </DataItem>
        )}

        <Price $is_paid={is_paid}>
          <DataItem icon={<HiOutlineCurrencyDollar />} label="Total amount">
            {formatCurrency(total_amount)}
          </DataItem>
          <p>{is_paid ? "Paid" : "Payment pending"}</p>
        </Price>
      </Section>

      <Footer>
        <p>
          {createdAt
            ? `Order placed on ${format(createdAt, "EEE, MMM dd yyyy, p")}`
            : "Order creation date unknown"}
        </p>
      </Footer>
    </StyledOrderDataBox>
  );
}

export default OrderDataBox;
