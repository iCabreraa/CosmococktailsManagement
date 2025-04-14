import OrderTable from "../features/orders/OrderTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import OrderTableOperations from "../features/orders/OrderTableOperations";

function Orders() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All Orders</Heading>
        <OrderTableOperations />
      </Row>

      <OrderTable />
    </>
  );
}

export default Orders;
