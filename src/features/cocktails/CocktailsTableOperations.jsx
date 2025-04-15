import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
import styled from "styled-components";

const CenteredTableOperations = styled(TableOperations)`
  justify-content: center;
`;

function CocktailsTableOperations() {
  return (
    <CenteredTableOperations>
      <Filter
        filterField="availability"
        options={[
          { value: "all", label: "All" },
          { value: "available", label: "Available" },
          { value: "non-available", label: "Not Available" },
        ]}
      />

      <Filter
        filterField="version"
        options={[
          { value: "all", label: "All Versions" },
          { value: "with-alcohol", label: "With Alcohol" },
          { value: "non-alcohol", label: "Virgin" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "Name (A-Z)" },
          { value: "name-desc", label: "Name (Z-A)" },
          { value: "alcohol_percentage-asc", label: "% Alcohol (Low first)" },
          { value: "alcohol_percentage-desc", label: "% Alcohol (High first)" },
        ]}
      />
    </CenteredTableOperations>
  );
}

export default CocktailsTableOperations;
