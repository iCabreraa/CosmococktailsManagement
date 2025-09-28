import styled from "styled-components";
import { useClients } from "./useClients";
import Spinner from "../../ui/Spinner";
import Heading from "../../ui/Heading";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
} from "react-icons/hi2";

const ClientsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ClientCard = styled.div`
  background: var(--color-grey-0);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-grey-200);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const ClientHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ClientAvatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${props =>
    props.isGuest ? "var(--color-brand-500)" : "var(--color-grey-500)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
`;

const ClientInfo = styled.div`
  flex: 1;
`;

const ClientName = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-800);
  margin: 0;
`;

const ClientType = styled.span`
  font-size: 1rem;
  color: ${props =>
    props.isGuest ? "var(--color-brand-600)" : "var(--color-grey-600)"};
  background: ${props =>
    props.isGuest ? "var(--color-brand-100)" : "var(--color-grey-100)"};
  padding: 0.2rem 0.6rem;
  border-radius: var(--border-radius-sm);
  display: inline-block;
  margin-top: 0.2rem;
`;

const ClientDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--color-grey-600);
  font-size: 1.3rem;
`;

const DetailIcon = styled.div`
  color: var(--color-grey-500);
  width: 1.6rem;
  height: 1.6rem;
`;

const AddressInfo = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-grey-200);
`;

const AddressTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-grey-700);
  margin: 0 0 0.8rem 0;
`;

const AddressText = styled.p`
  color: var(--color-grey-600);
  font-size: 1.3rem;
  margin: 0;
  line-height: 1.4;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-grey-500);
`;

function ClientsList() {
  const { clients, isPending, error } = useClients();

  if (isPending) return <Spinner />;

  if (error) {
    return (
      <div>
        <Heading as="h1">Clientes</Heading>
        <p>Error loading clients: {error.message}</p>
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div>
        <Heading as="h1">Clientes</Heading>
        <EmptyState>
          <HiOutlineUser size={48} style={{ margin: "0 auto 1rem" }} />
          <p>No hay clientes registrados aún</p>
        </EmptyState>
      </div>
    );
  }

  return (
    <div>
      <Heading as="h1">Clientes ({clients.length})</Heading>
      <ClientsContainer>
        {clients.map(client => (
          <ClientCard key={client.id}>
            <ClientHeader>
              <ClientAvatar isGuest={client.is_guest}>
                {client.full_name
                  ? client.full_name.charAt(0).toUpperCase()
                  : "G"}
              </ClientAvatar>
              <ClientInfo>
                <ClientName>
                  {client.full_name || "Cliente sin nombre"}
                </ClientName>
                <ClientType isGuest={client.is_guest}>
                  {client.is_guest ? "Invitado" : "Registrado"}
                </ClientType>
              </ClientInfo>
            </ClientHeader>

            <ClientDetails>
              <DetailItem>
                <DetailIcon>
                  <HiOutlineEnvelope />
                </DetailIcon>
                <span>{client.email}</span>
              </DetailItem>

              {client.phone && (
                <DetailItem>
                  <DetailIcon>
                    <HiOutlinePhone />
                  </DetailIcon>
                  <span>{client.phone}</span>
                </DetailItem>
              )}

              {client.address && (
                <AddressInfo>
                  <AddressTitle>Dirección</AddressTitle>
                  <AddressText>
                    {client.address.street}
                    <br />
                    {client.address.city}, {client.address.postalCode}
                    <br />
                    {client.address.country}
                  </AddressText>
                </AddressInfo>
              )}
            </ClientDetails>
          </ClientCard>
        ))}
      </ClientsContainer>
    </div>
  );
}

export default ClientsList;
