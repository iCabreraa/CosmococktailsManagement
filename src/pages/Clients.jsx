import styled from "styled-components";
import { useState } from "react";
import Heading from "../ui/Heading";
import ClientsList from "../features/clients/ClientsList";
import ClientAnalytics from "../features/clients/ClientAnalytics";
import ClientSearch from "../features/clients/ClientSearch";
import ClientNotifications from "../features/clients/ClientNotifications";

const StyledClients = styled.div`
  padding: 2rem;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-grey-200);
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.4rem;
  font-weight: 500;
  color: ${props =>
    props.active ? "var(--color-brand-600)" : "var(--color-grey-600)"};
  border-bottom: 2px solid
    ${props => (props.active ? "var(--color-brand-500)" : "transparent")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: var(--color-brand-600);
  }
`;

function Clients() {
  const [activeTab, setActiveTab] = useState("list");
  const [filteredClients, setFilteredClients] = useState([]);

  return (
    <StyledClients>
      <Heading as="h1">Gestión de Clientes</Heading>

      <TabsContainer>
        <Tab active={activeTab === "list"} onClick={() => setActiveTab("list")}>
          Lista de Clientes
        </Tab>
        <Tab
          active={activeTab === "analytics"}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </Tab>
      </TabsContainer>

      {activeTab === "list" && (
        <>
          <ClientSearch
            clients={[]} // This will be populated by the actual clients data
            onFilteredClients={setFilteredClients}
          />
          <ClientsList filteredClients={filteredClients} />
        </>
      )}

      {activeTab === "analytics" && <ClientAnalytics />}

      <ClientNotifications />
    </StyledClients>
  );
}

export default Clients;
