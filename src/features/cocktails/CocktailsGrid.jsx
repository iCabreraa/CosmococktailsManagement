import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import CocktailCard from "./CocktailCard";
import { useCocktails } from "./useCocktails";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../ui/Pagination";
import { COCKTAIL_PAGE_SIZE } from "../../utils/constants";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 260px));
  justify-content: center;
  gap: 2.4rem;
  padding-bottom: 2rem;
`;

const StyledPagination = styled.div`
  margin-top: 2rem;
`;

function CocktailsGrid() {
  const { isPending, cocktails } = useCocktails();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const availabilityFilter = searchParams.get("availability") || "all";
  const alcoholFilter = searchParams.get("version") || "all";
  const sortBy = searchParams.get("sortBy") || "name-asc";

  if (isPending) return <Spinner />;

  let filteredCocktails = cocktails;

  if (availabilityFilter === "available")
    filteredCocktails = filteredCocktails.filter((c) => c.is_available);
  else if (availabilityFilter === "non-available")
    filteredCocktails = filteredCocktails.filter((c) => !c.is_available);

  if (alcoholFilter === "with-alcohol")
    filteredCocktails = filteredCocktails.filter(
      (c) => !c.has_non_alcoholic_version
    );
  else if (alcoholFilter === "non-alcohol")
    filteredCocktails = filteredCocktails.filter(
      (c) => c.has_non_alcoholic_version
    );

  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedCocktails = filteredCocktails.sort((a, b) => {
    switch (field) {
      case "name":
        return a.name.localeCompare(b.name) * modifier;
      case "alcohol_percentage":
        return (a.alcohol_percentage - b.alcohol_percentage) * modifier;
      default:
        return 0;
    }
  });

  const paginatedCocktails = sortedCocktails.slice(
    (currentPage - 1) * COCKTAIL_PAGE_SIZE,
    currentPage * COCKTAIL_PAGE_SIZE
  );

  return (
    <>
      <Grid>
        {paginatedCocktails.map((cocktail) => (
          <CocktailCard key={cocktail.id} cocktail={cocktail} />
        ))}
      </Grid>

      <StyledPagination>
        <Pagination
          PAGE_SIZE={COCKTAIL_PAGE_SIZE}
          count={sortedCocktails.length}
          currentPage={currentPage}
          onPageChange={(page) => {
            searchParams.set("page", page);
            setSearchParams(searchParams);
          }}
        />
      </StyledPagination>
    </>
  );
}

export default CocktailsGrid;
