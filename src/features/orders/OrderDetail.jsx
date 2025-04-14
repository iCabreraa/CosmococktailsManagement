import styled from "styled-components";
import OrderDataBox from "./OrderDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import { useMoveBack } from "../../hooks/useMoveBack";
import useOrder from "./useOrder";
import Spinner from "../../ui/Spinner";
import OrderItemsTable from "./OrderItemsTable";
import { useNavigate } from "react-router-dom";
import { deleteOrder } from "../../services/apiOrders";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Modal from "../../ui/Modal";
import { useDeleteOrder } from "./useDeleteOrder";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

const statusToTagName = {
  pending: "blue",
  completed: "green",
  canceled: "red",
};

function OrderDetail() {
  const { order, isPending } = useOrder();
  const { isDeleting, deleteOrder } = useDeleteOrder();
  const moveBack = useMoveBack();
  const navigate = useNavigate();

  if (isPending) return <Spinner />;

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Order #{order.id.slice(0, 8)}</Heading>
          <Tag type={statusToTagName[order.status]}>{order.status}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <OrderDataBox order={order} />

      <Heading as="h3">Order Items</Heading>
      <OrderItemsTable items={order.order_items} />

      <ButtonGroup>
        {order.status === "pending" && (
          <Button onClick={() => navigate(`/checkPaid/${order.id}`)}>
            Check in
          </Button>
        )}

        <Modal>
          <Modal.Open opens="delete">
            <Button variation="danger">Delete Order</Button>
          </Modal.Open>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="order"
              disabled={isDeleting}
              onConfirm={() => {
                deleteOrder(order.id, {
                  onSettled: () => navigate(-1),
                });
              }}
            />
          </Modal.Window>
        </Modal>

        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default OrderDetail;
