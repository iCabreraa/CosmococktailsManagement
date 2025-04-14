import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function CocktailsTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="available"
        options={[
          { value: "all", label: "All" },
          { value: "non-alcohol", label: "Non-Alcoholic" },
          { value: "with-alcohol", label: "Alcoholic" },
          { value: "available", label: "Available" },
          { value: "non-available", label: "Non Available" },
        ]}
      />
      <SortBy
        options={[
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
          {
            value: "has_non_alcoholic_version-asc",
            label: "Alcoholic first",
          },
          {
            value: "has_non_alcoholic_version-desc",
            label: "Non-Alcoholic first",
          },
          {
            value: "alcohol_percentage-asc",
            label: "Alcohol % (Low first)",
          },
          {
            value: "alcohol_percentage-desc",
            label: "Alcohol % (High first)",
          },
        ]}
      />
    </TableOperations>
  );
}

export default CocktailsTableOperations;
