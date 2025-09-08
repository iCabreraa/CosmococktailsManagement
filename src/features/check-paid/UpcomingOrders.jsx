import styled from "styled-components";
import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import Spinner from "../../ui/Spinner";
import { useUpcomingOrders } from "./useUpcomingOrders";
import OrderItem from "./OrderItem";
import { motion, AnimatePresence } from "framer-motion";
import { getDateColor } from "../../utils/getDateColor";

const StyledToday = styled(motion.div)`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  grid-column: 1 / span 2;
`;

const OrderList = styled.ul`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 30rem;

  &::-webkit-scrollbar {
    width: 0 !important;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--color-grey-500);
  padding: 4rem 0;
  line-height: 1.4;
`;

function UpcomingOrders() {
  const { isLoading, upcomingOrders, numDays } = useUpcomingOrders();

  return (
    <AnimatePresence mode="wait">
      <StyledToday
        key={numDays}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.3 }}
      >
        <Row type="horizontal">
          <Heading
            as="h2"
            style={{
              color: upcomingOrders?.some(
                o => getDateColor(o.delivery_date) === "red"
              )
                ? "var(--color-red-700)"
                : undefined,
            }}
          >
            Upcoming Orders (next {numDays} day{numDays > 1 ? "s" : ""})
          </Heading>
        </Row>
        {isLoading ? (
          <Spinner />
        ) : upcomingOrders?.length > 0 ? (
          <OrderList>
            {[...upcomingOrders]
              .filter(order => new Date(order.delivery_date) >= new Date())
              .sort(
                (a, b) =>
                  new Date(a.delivery_date).getTime() -
                  new Date(b.delivery_date).getTime()
              )
              .map(order => (
                <OrderItem order={order} key={order.id} />
              ))}
          </OrderList>
        ) : (
          <NoActivity>
            🎉 All caught up! <br />
            No orders pending delivery.
          </NoActivity>
        )}
      </StyledToday>
    </AnimatePresence>
  );
}

export default UpcomingOrders;
