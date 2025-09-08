// OrderTable.jsx
import OrderRow from "./OrderRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import useOrders from "./useOrders";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import Pagination from "../../ui/Pagination";
import { ORDER_PAGE_SIZE } from "../../utils/constants";

function OrderTable() {
  const { orders, isPending, count } = useOrders();

  if (isPending) return <Spinner />;
  if (!orders.length) return <Empty resourceName="orders" />;

  return (
    <Menus>
      <Table columns="1fr 2fr 1fr 1fr 2fr 3.2rem">
        <Table.Header>
          <div>Order Nº</div>
          <div>User</div>
          <div>Status</div>
          <div>Total</div>
          <div>Date</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={orders}
          render={order => <OrderRow key={order.id} order={order} />}
        />
      </Table>

      {/* Add pagination and other features */}
      <Table.Footer>
        <Pagination PAGE_SIZE={ORDER_PAGE_SIZE} count={count} />
      </Table.Footer>
    </Menus>
  );
}

export default OrderTable;
