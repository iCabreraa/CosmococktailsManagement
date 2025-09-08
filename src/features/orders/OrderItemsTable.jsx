import Table from "../../ui/Table";
import { formatCurrency } from "../../utils/helpers";

function OrderItemsTable({ items }) {
  return (
    <Table columns="3fr 1fr 1fr 1fr">
      <Table.Header>
        <div>Item</div>
        <div>Size</div>
        <div>Quantity</div>
        <div>Total</div>
      </Table.Header>

      <Table.Body
        data={items}
        render={item => (
          <Table.Row key={item.id}>
            <div>{item.cocktails.name}</div>
            <div>
              {item.sizes.name} ({item.sizes.volume_ml}ml)
            </div>
            <div>{item.quantity}</div>
            <div>{formatCurrency(item.item_total)}</div>
          </Table.Row>
        )}
      />
    </Table>
  );
}

export default OrderItemsTable;
