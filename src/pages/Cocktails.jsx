import AddCocktail from "../features/cocktails/AddCocktail";
import CocktailTable from "../features/cocktails-old/CocktailTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import CocktailTableOpetations from "../features/cocktails/CocktailsTableOperations";
import CocktailsDashboard from "../features/cocktails/CocktailsDashboard";
import CocktailsGrid from "../features/cocktails/CocktailsGrid";
import AddCocktailContainer from "../features/cocktails/AddCocktailContainer";

function Cocktails() {
  return (
    <>
      <Row type="vertical">
        <CocktailsDashboard />
      </Row>

      <Row type="vertical">
        {/* <CocktailTable /> */}
        <CocktailTableOpetations />
        <CocktailsGrid />

        <AddCocktailContainer />
      </Row>
    </>
  );
}

export default Cocktails;
