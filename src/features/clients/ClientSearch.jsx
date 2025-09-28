import styled from "styled-components";
import { useState, useMemo } from "react";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineAdjustmentsHorizontal,
  HiXMark,
} from "react-icons/hi2";

const SearchContainer = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SearchHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 1.5rem;
`;

const SearchTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin-right: auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-md);
  font-size: 1.4rem;
  margin-bottom: 1.5rem;

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }
`;

const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-grey-700);
`;

const FilterSelect = styled.select`
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-size: 1.3rem;
  background: white;

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
  }
`;

const FilterChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1rem;
`;

const FilterChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-brand-100);
  color: var(--color-brand-700);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-full);
  font-size: 1.2rem;
`;

const ClearFiltersButton = styled.button`
  background: var(--color-grey-100);
  color: var(--color-grey-700);
  border: 1px solid var(--color-grey-300);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-grey-200);
  }
`;

const ResultsCount = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-600);
  margin-top: 1rem;
`;

function ClientSearch({ clients, onFilteredClients }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    segment: "all",
    status: "all",
    dateRange: "all",
  });

  const filteredClients = useMemo(() => {
    let filtered = clients || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        client =>
          client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone?.includes(searchTerm)
      );
    }

    // Segment filter
    if (filters.segment !== "all") {
      filtered = filtered.filter(client => {
        switch (filters.segment) {
          case "vip":
            return client.total_orders > 10 || client.total_spent > 500;
          case "frequent":
            return client.total_orders >= 3 && client.total_orders <= 10;
          case "new":
            return client.is_new_customer;
          case "guest":
            return client.is_guest;
          case "inactive":
            return client.days_since_last_order > 180;
          default:
            return true;
        }
      });
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(client => {
        switch (filters.status) {
          case "active":
            return client.days_since_last_order <= 30;
          case "inactive":
            return client.days_since_last_order > 30;
          default:
            return true;
        }
      });
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      filtered = filtered.filter(client => {
        const clientDate = new Date(client.created_at);
        switch (filters.dateRange) {
          case "today":
            return clientDate.toDateString() === now.toDateString();
          case "week":
            return now - clientDate <= 7 * 24 * 60 * 60 * 1000;
          case "month":
            return now - clientDate <= 30 * 24 * 60 * 60 * 1000;
          case "year":
            return now - clientDate <= 365 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [clients, searchTerm, filters]);

  // Notify parent component of filtered results
  useMemo(() => {
    onFilteredClients(filteredClients);
  }, [filteredClients, onFilteredClients]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      segment: "all",
      status: "all",
      dateRange: "all",
    });
  };

  const activeFiltersCount = Object.values(filters).filter(
    value => value !== "all"
  ).length;

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchTitle>Buscar Clientes</SearchTitle>
        {activeFiltersCount > 0 && (
          <ClearFiltersButton onClick={clearFilters}>
            <HiXMark size={16} />
            Limpiar Filtros ({activeFiltersCount})
          </ClearFiltersButton>
        )}
      </SearchHeader>

      <SearchInput
        type="text"
        placeholder="Buscar por nombre, email o teléfono..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <FilterContainer>
        <FilterGroup>
          <FilterLabel>Segmento</FilterLabel>
          <FilterSelect
            value={filters.segment}
            onChange={e =>
              setFilters(prev => ({ ...prev, segment: e.target.value }))
            }
          >
            <option value="all">Todos los segmentos</option>
            <option value="vip">VIP Clients</option>
            <option value="frequent">Frequent Buyers</option>
            <option value="new">New Customers</option>
            <option value="guest">Guest Users</option>
            <option value="inactive">Inactive</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Estado</FilterLabel>
          <FilterSelect
            value={filters.status}
            onChange={e =>
              setFilters(prev => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Fecha de Registro</FilterLabel>
          <FilterSelect
            value={filters.dateRange}
            onChange={e =>
              setFilters(prev => ({ ...prev, dateRange: e.target.value }))
            }
          >
            <option value="all">Todas las fechas</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </FilterSelect>
        </FilterGroup>
      </FilterContainer>

      {activeFiltersCount > 0 && (
        <FilterChips>
          {filters.segment !== "all" && (
            <FilterChip>
              <HiOutlineAdjustmentsHorizontal size={14} />
              Segmento: {filters.segment}
            </FilterChip>
          )}
          {filters.status !== "all" && (
            <FilterChip>
              <HiOutlineAdjustmentsHorizontal size={14} />
              Estado: {filters.status}
            </FilterChip>
          )}
          {filters.dateRange !== "all" && (
            <FilterChip>
              <HiOutlineAdjustmentsHorizontal size={14} />
              Fecha: {filters.dateRange}
            </FilterChip>
          )}
        </FilterChips>
      )}

      <ResultsCount>
        Mostrando {filteredClients.length} de {clients?.length || 0} clientes
      </ResultsCount>
    </SearchContainer>
  );
}

export default ClientSearch;
