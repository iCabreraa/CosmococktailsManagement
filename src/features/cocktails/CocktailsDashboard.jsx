import styled from "styled-components";
import { useCocktails } from "./useCocktails";
import Spinner from "../../ui/Spinner";
import Heading from "../../ui/Heading";

// Estilos básicos del dashboard reutilizando tu estilo actual
const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.4rem;
  margin-bottom: 3rem;
`;

const DashboardCard = styled.div`
  padding: 1.6rem;
  background: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);
  text-align: center;
`;

const CardTitle = styled.h3`
  font-size: 1.6rem;
  color: var(--color-grey-700);
`;

const CardData = styled.p`
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--color-brand-600);
`;

function CocktailsDashboard() {
  const { cocktails, isPending } = useCocktails();

  if (isPending) return <Spinner />;

  const totalCocktails = cocktails.length;
  const availableCocktails = cocktails.filter(
    cocktail => cocktail.is_available
  ).length;
  const nonAlcoholicVersions = cocktails.filter(
    cocktail => cocktail.has_non_alcoholic_version
  ).length;

  return (
    <>
      <Heading as="h1">Cocktails Dashboard</Heading>
      <DashboardContainer>
        <DashboardCard>
          <CardTitle>Total Cocktails</CardTitle>
          <CardData>{totalCocktails}</CardData>
        </DashboardCard>

        <DashboardCard>
          <CardTitle>Available Cocktails</CardTitle>
          <CardData>{availableCocktails}</CardData>
        </DashboardCard>

        <DashboardCard>
          <CardTitle>With Virgin Version</CardTitle>
          <CardData>{nonAlcoholicVersions}</CardData>
        </DashboardCard>
      </DashboardContainer>
    </>
  );
}

export default CocktailsDashboard;
