import styled from "styled-components";
import { useRecentOrders } from "./useRecentOrders";
import { useRecentPaid } from "./useRecentPaid";
import Spinner from "../../ui/Spinner";
import Stats from "./Stats";
import SalesChart from "./SalesChart";
import TopCocktailsChart from "./TopCocktailsChart";
import TodayActivity from "../check-paid/UpcomingOrders";
import UpcomingOrders from "../check-paid/UpcomingOrders";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { orders, isLoading: isLoadingOrders, numDays } = useRecentOrders();
  const { paidOrders, isLoading: isLoadingPaid } = useRecentPaid();

  if (isLoadingOrders || isLoadingPaid) return <Spinner />;

  console.log("All orders:", orders);
  console.log("Paid orders:", paidOrders);

  return (
    <StyledDashboardLayout>
      <Stats orders={orders} paidOrders={paidOrders} numDays={numDays} />
      <UpcomingOrders />
      <TopCocktailsChart orders={orders} />
      <SalesChart orders={orders} numDays={numDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
