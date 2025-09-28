import styled from "styled-components";
import {
  useUserAnalytics,
  useUserEngagement,
  useUserSegmentation,
  useUserTrends,
} from "./useUserAnalytics";
import {
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlineClock,
  HiOutlineCurrencyEuro,
  HiOutlineShoppingBag,
  HiOutlineExclamationTriangle,
  HiOutlineStar,
} from "react-icons/hi2";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Card = styled.div`
  background: var(--color-grey-0);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-grey-200);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CardIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: var(--border-radius-md);
  background: var(--color-brand-100);
  color: var(--color-brand-600);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const CardTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin: 0;
`;

const CardValue = styled.div`
  font-size: 3.2rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  font-size: 1.4rem;
  color: var(--color-grey-600);
  margin: 0;
`;

const TrendIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 500;
  margin-top: 0.5rem;

  ${props =>
    props.$positive
      ? `
    color: var(--color-green-600);
  `
      : `
    color: var(--color-red-600);
  `}
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
`;

const TableHeader = styled.thead`
  background: var(--color-grey-50);
`;

const TableHeaderCell = styled.th`
  padding: 1.2rem 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-grey-700);
  border-bottom: 1px solid var(--color-grey-200);
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--color-grey-200);

  &:hover {
    background: var(--color-grey-50);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: var(--color-grey-700);
`;

const LoadingCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--color-grey-500);
  font-size: 1.4rem;
`;

const ErrorCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--color-red-500);
  font-size: 1.4rem;
`;

const ChartContainer = styled.div`
  background: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
`;

const ChartTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

function UserAnalyticsDashboard() {
  const {
    data: analytics,
    isPending: analyticsLoading,
    error: analyticsError,
  } = useUserAnalytics();
  const {
    data: engagement,
    isPending: engagementLoading,
    error: engagementError,
  } = useUserEngagement();
  const {
    data: segmentation,
    isPending: segmentationLoading,
    error: segmentationError,
  } = useUserSegmentation();
  const {
    data: trends,
    isPending: trendsLoading,
    error: trendsError,
  } = useUserTrends();

  if (
    analyticsLoading ||
    engagementLoading ||
    segmentationLoading ||
    trendsLoading
  ) {
    return <LoadingCard>Cargando analytics...</LoadingCard>;
  }

  if (analyticsError || engagementError || segmentationError || trendsError) {
    return <ErrorCard>Error al cargar analytics</ErrorCard>;
  }

  return (
    <div>
      <Section>
        <SectionTitle>Métricas Principales</SectionTitle>
        <Dashboard>
          <Card>
            <CardHeader>
              <CardIcon>
                <HiOutlineUsers />
              </CardIcon>
              <CardTitle>Total de Usuarios</CardTitle>
            </CardHeader>
            <CardValue>{analytics?.totalUsers || 0}</CardValue>
            <CardDescription>
              Usuarios registrados en el sistema
            </CardDescription>
            {analytics?.userGrowth !== undefined && (
              <TrendIndicator $positive={analytics.userGrowth >= 0}>
                {analytics.userGrowth >= 0 ? (
                  <HiOutlineArrowUp />
                ) : (
                  <HiOutlineArrowDown />
                )}
                {Math.abs(analytics.userGrowth)}% vs mes anterior
              </TrendIndicator>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardIcon>
                <HiOutlineChartBar />
              </CardIcon>
              <CardTitle>Usuarios Activos</CardTitle>
            </CardHeader>
            <CardValue>{analytics?.activeUsers || 0}</CardValue>
            <CardDescription>Usuarios con estado activo</CardDescription>
          </Card>

          <Card>
            <CardHeader>
              <CardIcon>
                <HiOutlineArrowUp />
              </CardIcon>
              <CardTitle>Nuevos este Mes</CardTitle>
            </CardHeader>
            <CardValue>{analytics?.newUsersThisMonth || 0}</CardValue>
            <CardDescription>Usuarios registrados este mes</CardDescription>
          </Card>

          <Card>
            <CardHeader>
              <CardIcon>
                <HiOutlineClock />
              </CardIcon>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardValue>{analytics?.recentActivity || 0}</CardValue>
            <CardDescription>Usuarios activos últimos 7 días</CardDescription>
          </Card>

          <Card>
            <CardHeader>
              <CardIcon>
                <HiOutlineCurrencyEuro />
              </CardIcon>
              <CardTitle>Valor Promedio</CardTitle>
            </CardHeader>
            <CardValue>€{engagement?.averageOrderValue || 0}</CardValue>
            <CardDescription>Valor promedio por pedido</CardDescription>
          </Card>

          <Card>
            <CardHeader>
              <CardIcon>
                <HiOutlineShoppingBag />
              </CardIcon>
              <CardTitle>Pedidos por Usuario</CardTitle>
            </CardHeader>
            <CardValue>{engagement?.averageOrdersPerUser || 0}</CardValue>
            <CardDescription>Promedio de pedidos por usuario</CardDescription>
          </Card>
        </Dashboard>
      </Section>

      <Section>
        <SectionTitle>Segmentación de Usuarios</SectionTitle>
        <Dashboard>
          <Card>
            <CardHeader>
              <CardIcon>
                <HiOutlineStar />
              </CardIcon>
              <CardTitle>Usuarios de Alto Valor</CardTitle>
            </CardHeader>
            <CardValue>{segmentation?.segments?.highValue || 0}</CardValue>
            <CardDescription>Usuarios con más de €100 gastados</CardDescription>
          </Card>

          <Card>
            <CardHeader>
              <CardIcon>
                <HiOutlineExclamationTriangle />
              </CardIcon>
              <CardTitle>Usuarios en Riesgo</CardTitle>
            </CardHeader>
            <CardValue>{segmentation?.atRiskUsers?.length || 0}</CardValue>
            <CardDescription>Inactivos por más de 30 días</CardDescription>
          </Card>

          <Card>
            <CardHeader>
              <CardIcon>
                <HiOutlineArrowUp />
              </CardIcon>
              <CardTitle>Usuarios Nuevos</CardTitle>
            </CardHeader>
            <CardValue>{segmentation?.newUsers?.length || 0}</CardValue>
            <CardDescription>Registrados últimos 30 días</CardDescription>
          </Card>

          <Card>
            <CardHeader>
              <CardIcon>
                <HiOutlineChartBar />
              </CardIcon>
              <CardTitle>Tasa de Retención</CardTitle>
            </CardHeader>
            <CardValue>{engagement?.userRetention || 0}%</CardValue>
            <CardDescription>Usuarios con múltiples pedidos</CardDescription>
          </Card>
        </Dashboard>
      </Section>

      {/* Gráficos Visuales */}
      <Section>
        <SectionTitle>Análisis Visual</SectionTitle>

        <ChartGrid>
          {/* Gráfico de Distribución por Roles */}
          <ChartContainer>
            <ChartTitle>
              <HiOutlineUsers />
              Distribución por Roles
            </ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.roleDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {Array.isArray(analytics?.roleDistribution)
                    ? analytics.roleDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))
                    : null}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Gráfico de Crecimiento de Usuarios */}
          <ChartContainer>
            <ChartTitle>
              <HiOutlineChartBar />
              Crecimiento de Usuarios
            </ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends?.monthlyGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartGrid>

        {/* Gráfico de Actividad Diaria */}
        <ChartContainer>
          <ChartTitle>
            <HiOutlineClock />
            Actividad Diaria (Últimos 30 días)
          </ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends?.dailyActivity || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#10B981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Gráfico de Engagement */}
        <ChartGrid>
          <ChartContainer>
            <ChartTitle>
              <HiOutlineShoppingBag />
              Distribución de Pedidos por Usuario
            </ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagement?.orderDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer>
            <ChartTitle>
              <HiOutlineCurrencyEuro />
              Valor Promedio por Usuario
            </ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagement?.valueDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={value => [`€${value}`, "Valor Promedio"]} />
                <Bar dataKey="averageValue" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartGrid>
      </Section>

      {segmentation?.highValueUsers?.length > 0 && (
        <Section>
          <SectionTitle>Top Usuarios de Alto Valor</SectionTitle>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Usuario</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Pedidos</TableHeaderCell>
                <TableHeaderCell>Total Gastado</TableHeaderCell>
                <TableHeaderCell>Último Pedido</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {segmentation.highValueUsers.slice(0, 10).map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.ordersCount}</TableCell>
                  <TableCell>€{user.totalSpent}</TableCell>
                  <TableCell>
                    {user.lastOrder
                      ? new Date(user.lastOrder).toLocaleDateString("es-ES")
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      )}

      {segmentation?.atRiskUsers?.length > 0 && (
        <Section>
          <SectionTitle>Usuarios en Riesgo de Abandono</SectionTitle>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Usuario</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Último Login</TableHeaderCell>
                <TableHeaderCell>Días Inactivo</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {segmentation.atRiskUsers.slice(0, 10).map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString("es-ES")
                      : "Nunca"}
                  </TableCell>
                  <TableCell>{user.daysSinceLogin || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      )}
    </div>
  );
}

export default UserAnalyticsDashboard;
