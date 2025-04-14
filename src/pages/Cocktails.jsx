import AddCocktail from "../features/cocktails/AddCocktail";
import CocktailTable from "../features/cocktails/CocktailTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import CocktailTableOpetations from "../features/cocktails/CocktailsTableOperations";

function Cocktails() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All Cocktails</Heading>
        <CocktailTableOpetations />
      </Row>
      <Row type="vertical">
        <CocktailTable />

        <AddCocktail />
      </Row>
    </>
  );
}

export default Cocktails;
