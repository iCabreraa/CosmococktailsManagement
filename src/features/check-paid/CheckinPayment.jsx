import styled from "styled-components";

import OrderDataBox from "../orders/OrderDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import CheckBox from "../../ui/Checkbox";
import Spinner from "../../ui/Spinner";

import { useMoveBack } from "../../hooks/useMoveBack";
import useOrder from "../orders/useOrder";
import { useEffect, useState } from "react";
import { useCheckin } from "./useCheckin";
import { formatCurrency } from "../../utils/helpers";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinPayment() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const { order, isPending } = useOrder();

  console.log("Checking Payment ", order);
  // const { id: orderId, users, total_amount } = order;

  useEffect(() => {
    if (order) {
      setConfirmPaid(order.is_paid ?? false);
    }
  }, [order]);

  const moveBack = useMoveBack();
  const { checkin, isCheckingIn } = useCheckin();

  if (isPending) return <Spinner />;

  function handleCheckin() {
    if (!confirmPaid) return;
    checkin(order.id);
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Confirm Payment for Order #{order.id}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <OrderDataBox order={order} />

      <Box>
        {order.is_paid === false && (
          <CheckBox
            checked={confirmPaid}
            onChange={() => setConfirmPaid(confirm => !confirm)}
            disabled={confirmPaid || isCheckingIn}
            id="confirm"
          >
            I confirm that {order.users?.full_name} has paid the total amount of{" "}
            {formatCurrency(order.total_amount)}
          </CheckBox>
        )}
      </Box>

      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
          Confirm Payment
        </Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinPayment;
