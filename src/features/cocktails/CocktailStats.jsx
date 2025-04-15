// src/features/cocktails/CocktailStats.jsx
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import Heading from "../../ui/Heading";
import Stat from "../../ui/Stat";
import Stats from "../../ui/Stats";
import { useRecentCocktailStats } from "./useRecentCocktailStats";
import SpinnerMini from "../../ui/SpinnerMini";
import Filter from "../../ui/Filter";

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const filterOptions = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

function CocktailStats({ cocktailId, days }) {
  //   const [searchParams] = useSearchParams();
  //   const days = searchParams.get("days") || "30";

  const {
    data: stats,
    isLoading,
    error,
  } = useRecentCocktailStats(cocktailId, days);

  if (isLoading) return <SpinnerMini />;
  if (error)
    return (
      <p style={{ fontSize: "1.4rem", color: "var(--color-red-700)" }}>
        Error loading stats: {error.message}
      </p>
    );

  return (
    <Container>
      <Heading as="h3">Sales Stats (Last {days} days)</Heading>

      <Filter filterField="days" options={filterOptions} />

      <Stats>
        <Stat title="Clients" value={stats?.numClients ?? 0} />
        <Stat title="Total Orders" value={stats?.numOrders ?? 0} />
        <Stat
          title="Revenue"
          value={
            stats?.totalRevenue != null
              ? `€${stats.totalRevenue.toFixed(2)}`
              : "€0.00"
          }
        />
        <Stat title="Top Size" value={stats?.topSize || "–"} />
      </Stats>
    </Container>
  );
}

export default CocktailStats;
