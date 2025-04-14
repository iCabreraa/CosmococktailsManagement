import styled from "styled-components";
import Heading from "../../ui/Heading";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useDarkMode } from "../../context/DarkModeContext";

const ChartBox = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 3.2rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;

// === Colores predefinidos para cócteles ===
const colorsLight = [
  "#f97316",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
  "#eab308",
  "#6366f1",
];

const colorsDark = [
  "#c2410c",
  "#047857",
  "#1d4ed8",
  "#7e22ce",
  "#b91c1c",
  "#0f766e",
  "#a16207",
  "#4f46e5",
];

// === Prepara los datos ===
function prepareCocktailData(orders, isDarkMode) {
  const cocktailMap = {};

  orders?.forEach((order) => {
    order.order_items?.forEach((item) => {
      const cocktailName = item.cocktails?.name;
      const size = item.sizes?.volume_ml || 0;
      const key = `${cocktailName} - ${size}ml`;

      if (cocktailMap[key]) {
        cocktailMap[key].value += item.quantity;
      } else {
        cocktailMap[key] = {
          label: key,
          value: item.quantity,
        };
      }
    });
  });

  // Ordenamos de mayor a menor y cortamos a top 5
  const sorted = Object.values(cocktailMap)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return sorted.map((item, i) => ({
    ...item,
    color: isDarkMode
      ? colorsDark[i % colorsDark.length]
      : colorsLight[i % colorsLight.length],
  }));
}

function TopCocktailsChart({ orders }) {
  const { isDarkMode } = useDarkMode();
  const data = prepareCocktailData(orders, isDarkMode);

  return (
    <ChartBox>
      <Heading as="h2">Top Selling Cocktails</Heading>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            nameKey="label"
            dataKey="value"
            innerRadius={85}
            outerRadius={110}
            cx="40%"
            cy="50%"
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} stroke={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="middle"
            align="right"
            width="30%"
            layout="vertical"
            iconSize={15}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default TopCocktailsChart;
