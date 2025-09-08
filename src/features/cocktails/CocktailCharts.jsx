import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useCocktailSalesData } from "./useCocktailSalesData";
import SpinnerMini from "../../ui/SpinnerMini";
import Filter from "../../ui/Filter";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// 🔧 Detecta el modo (claro u oscuro) leyendo el body
function getCurrentMode() {
  if (typeof document !== "undefined") {
    return document.body.classList.contains("dark-mode") ? "dark" : "light";
  }
  return "light";
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  margin-top: 4rem;
  padding-top: 4rem;
  border-top: 1px solid var(--color-grey-200);
`;

const ChartRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ChartBox = styled.div`
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.6rem;
  border: 1px solid var(--color-grey-200);
`;

const Title = styled.h4`
  font-size: 1.6rem;
  color: var(--color-grey-700);
  font-weight: 600;
`;

const tooltipStyle = mode => ({
  backgroundColor:
    mode === "dark" ? "var(--color-grey-800)" : "var(--color-grey-100)",
  border: `1px solid var(--color-grey-300)`,
  color: mode === "dark" ? "var(--color-grey-100)" : "var(--color-grey-900)",
  borderRadius: "6px",
  fontSize: "1.3rem",
});

const filterOptions = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981"];

function CocktailCharts({ cocktailId, days }) {
  const mode = getCurrentMode();
  const { data, isLoading } = useCocktailSalesData(cocktailId, days);

  if (isLoading) return <SpinnerMini />;

  const pieData = Object.entries(data.sizeCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const lineData = Object.entries(data.dailySales)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Section>
      <ChartRow>
        <ChartBox>
          <Title>Sales by Size</Title>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    stroke="var(--color-grey-800)"
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle(mode)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <Title>Daily Sales</Title>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-grey-300)"
              />
              <XAxis
                dataKey="date"
                stroke="var(--color-grey-500)"
                fontSize={12}
              />
              <YAxis
                stroke="var(--color-grey-500)"
                fontSize={12}
                allowDecimals={false}
              />
              <Tooltip contentStyle={tooltipStyle(mode)} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#60a5fa"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartRow>
    </Section>
  );
}

export default CocktailCharts;
