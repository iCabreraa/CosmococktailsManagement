// OrderRow.jsx
import styled from "styled-components";
import { isToday } from "date-fns";
import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import { formatCurrency, formatDistanceFromNow } from "../../utils/helpers";
import Modal from "../../ui/Modal";
import { HiArrowUpOnSquare, HiEye, HiTrash } from "react-icons/hi2";
import Menus from "../../ui/Menus";
import { useNavigate } from "react-router-dom";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { deleteOrder } from "../../services/apiOrders";
import { useDeleteOrder } from "./useDeleteOrder";

const OrderNum = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
    cursor: pointer;
    color: var(--color-brand-600);
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

// OrderRow.jsx (ajustado)
function OrderRow({ order }) {
  const { isDeleting, deleteOrder } = useDeleteOrder();
  const navigate = useNavigate();

  const statusToTagName = {
    pending: "blue",
    completed: "green",
    cancelled: "red",
  };

  const user = order.users;

  return (
    <Table.Row>
      <OrderNum>#{order.id.slice(0, 8)}</OrderNum>

      <UserDetails>
        {user ? (
          <Modal>
            <Modal.Open opens="user-details">
              <span>{user.full_name}</span>
            </Modal.Open>
            <span>{user.email}</span>

            <Modal.Window name="user-details">
              <div style={{ padding: "2rem" }}>
                <h3>User Details</h3>
                <p>
                  <strong>Name:</strong> {user.full_name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone}
                </p>
              </div>
            </Modal.Window>
          </Modal>
        ) : (
          <span style={{ color: "var(--color-red-700)" }}>User not found</span>
        )}
      </UserDetails>

      <Tag type={statusToTagName[order.status]}>{order.status}</Tag>

      <Amount>{formatCurrency(order.total_amount)}</Amount>

      <span>
        {isToday(new Date(order.order_date))
          ? "Today"
          : formatDistanceFromNow(order.order_date)}
      </span>
      {/* 
      <Modal>
        <Modal.Open opens="order-items">
          <HiEye
            style={{ cursor: "pointer", color: "var(--color-brand-600)" }}
          />
        </Modal.Open>

        <Modal.Window name="order-items">
          <div style={{ padding: "2rem" }}>
            <h3>Order Items</h3>
            {order.order_items.map((item) => (
              <div key={item.id}>
                <strong>{item.quantity}x</strong> {item.cocktails.name} (
                {item.sizes.name}, {item.sizes.volume_ml}ml) —{" "}
                {formatCurrency(item.item_total)}
              </div>
            ))}
          </div>
        </Modal.Window>
      </Modal> */}

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={order.id} />
          <Menus.List id={order.id}>
            <Menus.Button
              icon={<HiEye />}
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              {" "}
              See Details{" "}
            </Menus.Button>

            {order.status === "pending" && (
              <Menus.Button
                icon={<HiArrowUpOnSquare />}
                onClick={() => navigate(`/checkPaid/${order.id}`)}
              >
                Check Paid
              </Menus.Button>
            )}

            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>Delete Order</Menus.Button>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>

        <Modal.Window name="delete">
          <ConfirmDelete
            resourceName="order"
            disabled={isDeleting}
            onConfirm={() => {
              deleteOrder(order.id);
            }}
          />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default OrderRow;
