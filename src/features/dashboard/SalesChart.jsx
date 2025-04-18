import styled from "styled-components";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import { useDarkMode } from "../../context/DarkModeContext";

const StyledSalesChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function SalesChart({ orders, numDays }) {
  const { isDarkMode } = useDarkMode();

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), numDays - 1),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    const dailyOrders = orders.filter((order) =>
      isSameDay(new Date(order.order_date), date)
    );

    return {
      label: format(date, "MMM dd"),
      totalSales: dailyOrders.reduce((acc, cur) => acc + cur.total_amount, 0),
      paidSales: dailyOrders
        .filter((order) => order.is_paid)
        .reduce((acc, cur) => acc + cur.total_amount, 0),
    };
  });

  const colors = isDarkMode
    ? {
        totalSales: { stroke: "#4f46e5", fill: "#4f46e5" },
        paidSales: { stroke: "#22c55e", fill: "#22c55e" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalSales: { stroke: "#4f46e5", fill: "#c7d2fe" },
        paidSales: { stroke: "#16a34a", fill: "#dcfce7" },
        text: "#374151",
        background: "#fff",
      };

  return (
    <StyledSalesChart>
      <Heading as="h2">
        Sales from {format(allDates.at(0), "MMM dd yyyy")} &mdash;{" "}
        {format(allDates.at(-1), "MMM dd yyyy")}{" "}
      </Heading>{" "}
      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="€"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            dataKey="totalSales"
            type="monotone"
            stroke={colors.totalSales.stroke}
            fill={colors.totalSales.fill}
            strokeWidth={2}
            name="Total Sales"
            unit="€"
          />
          <Area
            dataKey="paidSales"
            type="monotone"
            stroke={colors.paidSales.stroke}
            fill={colors.paidSales.fill}
            strokeWidth={2}
            name="Paid Sales"
            unit="€"
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledSalesChart>
  );
}

export default SalesChart;
