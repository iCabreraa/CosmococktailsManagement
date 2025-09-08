import { useCocktails } from "../cocktails/useCocktails";
import { useSearchParams } from "react-router-dom";
import Spinner from "../../ui/Spinner";
import CocktailRow from "./CocktailRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Pagination from "../../ui/Pagination";
import { COCKTAIL_PAGE_SIZE } from "../../utils/constants";

function CocktailTable() {
  const { isPending, cocktails } = useCocktails();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const availabilityFilter = searchParams.get("availability") || "all";
  const alcoholFilter = searchParams.get("version") || "all";
  const priceFilter = searchParams.get("price") || "all";
  const sizeFilter = searchParams.get("size") || "all";

  if (isPending) return <Spinner />;

  // Aplicando filtros correctamente
  let filteredCocktails = cocktails;

  if (availabilityFilter === "available")
    filteredCocktails = filteredCocktails.filter(
      cocktail => cocktail.is_available
    );
  else if (availabilityFilter === "non-available")
    filteredCocktails = filteredCocktails.filter(
      cocktail => !cocktail.is_available
    );

  if (alcoholFilter === "with-alcohol")
    filteredCocktails = filteredCocktails.filter(
      cocktail => !cocktail.has_non_alcoholic_version
    );
  else if (alcoholFilter === "non-alcohol")
    filteredCocktails = filteredCocktails.filter(
      cocktail => cocktail.has_non_alcoholic_version
    );

  // if (priceFilter !== "all") {
  //   filteredCocktails = filteredCocktails.filter((cocktail) =>
  //     cocktail.cocktail_sizes.some((cs) => {
  //       if (priceFilter === "low") return cs.price < 10;
  //       if (priceFilter === "medium") return cs.price >= 10 && cs.price <= 20;
  //       if (priceFilter === "high") return cs.price > 20;
  //     })
  //   );
  // }

  // if (sizeFilter !== "all") {
  //   filteredCocktails = filteredCocktails.filter((cocktail) =>
  //     cocktail.cocktail_sizes.some(
  //       (cs) => cs.sizes.volume_ml === parseInt(sizeFilter)
  //     )
  //   );
  // }

  // Ordenamiento (ya estaba correcto)
  const sortBy = searchParams.get("sortBy") || "name-asc";
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
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cocktail</div>
          <div>Description</div>
          <div>Alcohol</div>
          <div>Version 00</div>
          <div>Available</div>
          <div>Actions</div>
        </Table.Header>

        <Table.Body
          data={paginatedCocktails}
          render={cocktail => (
            <CocktailRow key={cocktail.id} cocktail={cocktail} />
          )}
        />
      </Table>

      <Pagination
        count={sortedCocktails.length}
        currentPage={currentPage}
        onPageChange={page => {
          searchParams.set("page", page);
          setSearchParams(searchParams);
        }}
      />
    </Menus>
  );
}

export default CocktailTable;
