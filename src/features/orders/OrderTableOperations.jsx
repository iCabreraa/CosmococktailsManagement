import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";

function OrderTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: "pending", label: "Pending" },
          { value: "completed", label: "Completed" },
          { value: "canceled", label: "Canceled" },
        ]}
      />

      <SortBy
        options={[
          { value: "order_date-desc", label: "Sort by date (recent first)" },
          { value: "order_date-asc", label: "Sort by date (earlier first)" },
          {
            value: "total_amount-desc",
            label: "Sort by amount (high first)",
          },
          { value: "total_amount-asc", label: "Sort by amount (low first)" },
        ]}
      />
    </TableOperations>
  );
}

export default OrderTableOperations;
