import Spinner from "../../ui/Spinner";
import CocktailRow from "./CocktailRow";
import { useCocktails } from "./useCocktails";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";

function CocktailTable() {
  const { isPending, cocktails } = useCocktails();
  const [searchParams] = useSearchParams();

  if (isPending) return <Spinner />;

  const filterValue = searchParams.get("available") || "all";

  let filteredCocktails = cocktails;

  // Filtrado correcto por versión alcohólica
  if (filterValue === "with-alcohol")
    filteredCocktails = cocktails.filter(
      (cocktail) => cocktail.has_non_alcoholic_version === false
    );

  if (filterValue === "non-alcohol")
    filteredCocktails = cocktails.filter(
      (cocktail) => cocktail.has_non_alcoholic_version === true
    );

  if (filterValue === "available")
    filteredCocktails = cocktails.filter(
      (cocktail) => cocktail.is_available === true
    );

  if (filterValue === "non-available")
    filteredCocktails = cocktails.filter(
      (cocktail) => cocktail.is_available === false
    );

  // Ordenamiento correcto (por nombre por defecto)
  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedCocktails = filteredCocktails.sort((a, b) => {
    if (field === "name") {
      return a.name.localeCompare(b.name) * modifier;
    } else if (field === "alcohol_percentage") {
      return (a.alcohol_percentage - b.alcohol_percentage) * modifier;
    } else if (field === "has_non_alcoholic_version") {
      return a.has_non_alcoholic_version === b.has_non_alcoholic_version
        ? 0
        : a.has_non_alcoholic_version
        ? -1 * modifier
        : 1 * modifier;
    } else {
      return 0;
    }
  });

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
          data={sortedCocktails}
          render={(cocktail) => (
            <CocktailRow key={cocktail.id} cocktail={cocktail} />
          )}
        />
      </Table>
    </Menus>
  );
}

export default CocktailTable;
