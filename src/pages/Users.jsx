import styled from "styled-components";
import Heading from "../ui/Heading";
import UsersList from "../features/users/UsersList";
import UserAnalyticsDashboard from "../features/analytics/UserAnalyticsDashboard";
import { useUserStats } from "../features/users/useUsers";
import { useState } from "react";
import {
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
} from "react-icons/hi2";

const Container = styled.div`
  padding: 2rem;
  max-width: 120rem;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`;

const Title = styled(Heading)`
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--color-grey-900);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: var(--color-grey-0);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-grey-200);
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
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

const StatTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-700);
  margin: 0;
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin-bottom: 0.5rem;
`;

const StatDescription = styled.p`
  font-size: 1.3rem;
  color: var(--color-grey-600);
  margin: 0;
`;

const FiltersContainer = styled.div`
  background: var(--color-grey-0);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-grey-200);
  margin-bottom: 2rem;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 2rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const FilterSelect = styled.select`
  padding: 1rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background: white;
  font-size: 1.4rem;
  color: var(--color-grey-700);

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }
`;

const FilterInput = styled.input`
  padding: 1rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background: white;
  font-size: 1.4rem;
  color: var(--color-grey-700);

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TabButton = styled.button`
  padding: 1rem 2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background: ${props => (props.$active ? "var(--color-brand-500)" : "white")};
  color: ${props => (props.$active ? "white" : "var(--color-grey-700)")};
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.$active ? "var(--color-brand-600)" : "var(--color-grey-50)"};
  }
`;

const RoleBreakdown = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const RoleItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.2rem;
  background: var(--color-grey-50);
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
`;

const RoleName = styled.span`
  font-weight: 500;
  color: var(--color-grey-700);
  text-transform: capitalize;
`;

const RoleCount = styled.span`
  font-weight: 600;
  color: var(--color-grey-900);
`;

function Users() {
  const { data: stats, isPending: statsLoading } = useUserStats();
  const [activeTab, setActiveTab] = useState("list");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    search: "",
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Container>
      <Header>
        <Title>Gestión de Usuarios</Title>
      </Header>

      <TabsContainer>
        <TabButton
          $active={activeTab === "list"}
          onClick={() => setActiveTab("list")}
        >
          Lista de Usuarios
        </TabButton>
        <TabButton
          $active={activeTab === "analytics"}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics Avanzados
        </TabButton>
      </TabsContainer>

      {activeTab === "analytics" && <UserAnalyticsDashboard />}

      {activeTab === "list" && !statsLoading && stats && (
        <StatsGrid>
          <StatCard>
            <StatHeader>
              <StatIcon>
                <HiOutlineUsers />
              </StatIcon>
              <StatTitle>Total de Usuarios</StatTitle>
            </StatHeader>
            <StatValue>{stats.total}</StatValue>
            <StatDescription>
              Usuarios registrados en el sistema
            </StatDescription>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon>
                <HiOutlineUserGroup />
              </StatIcon>
              <StatTitle>Usuarios Recientes</StatTitle>
            </StatHeader>
            <StatValue>{stats.recent}</StatValue>
            <StatDescription>Últimos 30 días</StatDescription>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon>
                <HiOutlineShieldCheck />
              </StatIcon>
              <StatTitle>Distribución por Rol</StatTitle>
            </StatHeader>
            <RoleBreakdown>
              {Object.entries(stats.byRole).map(([role, count]) => (
                <RoleItem key={role}>
                  <RoleName>{role}</RoleName>
                  <RoleCount>{count}</RoleCount>
                </RoleItem>
              ))}
            </RoleBreakdown>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon>
                <HiOutlineChartBar />
              </StatIcon>
              <StatTitle>Estados de Usuario</StatTitle>
            </StatHeader>
            <RoleBreakdown>
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <RoleItem key={status}>
                  <RoleName>{status}</RoleName>
                  <RoleCount>{count}</RoleCount>
                </RoleItem>
              ))}
            </RoleBreakdown>
          </StatCard>
        </StatsGrid>
      )}

      <FiltersContainer>
        <FiltersGrid>
          <FilterGroup>
            <FilterLabel>Filtrar por rol</FilterLabel>
            <FilterSelect
              value={filters.role}
              onChange={e => handleFilterChange("role", e.target.value)}
            >
              <option value="">Todos los roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
              <option value="guest">Guest</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Filtrar por estado</FilterLabel>
            <FilterSelect
              value={filters.status}
              onChange={e => handleFilterChange("status", e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="suspended">Suspendido</option>
              <option value="pending">Pendiente</option>
              <option value="banned">Baneado</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Buscar usuario</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Nombre o email..."
              value={filters.search}
              onChange={e => handleFilterChange("search", e.target.value)}
            />
          </FilterGroup>
        </FiltersGrid>
      </FiltersContainer>

      {activeTab === "list" && <UsersList filters={filters} />}
    </Container>
  );
}

export default Users;
