import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import CocktailCard from "./CocktailCard";
import { useCocktails } from "./useCocktails";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../ui/Pagination";

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

const TopControls = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
`;

const PageSizeSelect = styled.select`
  padding: 0.6rem 1rem;
  font-size: 1.4rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  color: var(--color-grey-900);
`;

const EmptyCard = styled.div`
  width: 260px;
  height: 380px;
  border-radius: var(--border-radius-lg);
  background: transparent;
`;

function CocktailsGrid() {
  const { isPending, cocktails } = useCocktails();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const availabilityFilter = searchParams.get("availability") || "all";
  const alcoholFilter = searchParams.get("version") || "all";
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const pageSize = parseInt(searchParams.get("pageSize")) || 8;

  if (isPending) return <Spinner />;

  let filteredCocktails = cocktails;

  if (availabilityFilter === "available")
    filteredCocktails = filteredCocktails.filter(c => c.is_available);
  else if (availabilityFilter === "non-available")
    filteredCocktails = filteredCocktails.filter(c => !c.is_available);

  if (alcoholFilter === "with-alcohol")
    filteredCocktails = filteredCocktails.filter(
      c => !c.has_non_alcoholic_version
    );
  else if (alcoholFilter === "non-alcohol")
    filteredCocktails = filteredCocktails.filter(
      c => c.has_non_alcoholic_version
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
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const emptySlots = pageSize - paginatedCocktails.length;

  function handlePageSizeChange(e) {
    const newSize = e.target.value;
    searchParams.set("pageSize", newSize);
    searchParams.set("page", 1); // Reiniciar a la primera página
    setSearchParams(searchParams);
  }

  return (
    <>
      <TopControls>
        <PageSizeSelect value={pageSize} onChange={handlePageSizeChange}>
          <option value="4">Show 4</option>
          <option value="8">Show 8</option>
          <option value="16">Show 16</option>
          <option value="32">Show 32</option>
        </PageSizeSelect>
      </TopControls>

      <Grid>
        {paginatedCocktails.map(cocktail => (
          <CocktailCard key={cocktail.id} cocktail={cocktail} />
        ))}
        {Array.from({ length: emptySlots }, (_, i) => (
          <EmptyCard key={`empty-${i}`} />
        ))}
      </Grid>

      <StyledPagination>
        <Pagination
          PAGE_SIZE={pageSize}
          count={sortedCocktails.length}
          currentPage={currentPage}
          onPageChange={page => {
            searchParams.set("page", page);
            setSearchParams(searchParams);
          }}
        />
      </StyledPagination>
    </>
  );
}

export default CocktailsGrid;
