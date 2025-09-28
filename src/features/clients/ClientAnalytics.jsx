import styled from "styled-components";
import { useClientStats } from "./useClients";
import {
  HiOutlineUsers,
  HiOutlineShoppingBag,
  HiOutlineCurrencyEuro,
} from "react-icons/hi2";

const AnalyticsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  text-align: center;
`;

const StatIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--color-brand-100);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: var(--color-brand-600);
`;

const StatValue = styled.div`
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--color-grey-900);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SegmentContainer = styled.div`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
`;

const SegmentTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-900);
  margin-bottom: 1.5rem;
`;

const SegmentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const SegmentItem = styled.div`
  padding: 1rem;
  background: var(--color-grey-50);
  border-radius: var(--border-radius-md);
  border-left: 4px solid ${props => props.color || "var(--color-brand-500)"};
`;

const SegmentName = styled.div`
  font-weight: 600;
  color: var(--color-grey-900);
  margin-bottom: 0.5rem;
`;

const SegmentCount = styled.div`
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

function ClientAnalytics() {
  const { stats, isPending, error } = useClientStats();

  if (isPending) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics: {error.message}</div>;

  const segments = [
    {
      name: "VIP Clients",
      count: Math.floor(stats?.totalClients * 0.05) || 0,
      color: "#10B981",
    },
    {
      name: "Frequent Buyers",
      count: Math.floor(stats?.totalClients * 0.15) || 0,
      color: "#3B82F6",
    },
    {
      name: "New Customers",
      count: Math.floor(stats?.totalClients * 0.25) || 0,
      color: "#F59E0B",
    },
    { name: "Guest Users", count: stats?.guestClients || 0, color: "#6B7280" },
    {
      name: "Inactive",
      count: Math.floor(stats?.totalClients * 0.2) || 0,
      color: "#EF4444",
    },
  ];

  return (
    <div>
      <AnalyticsContainer>
        <StatCard>
          <StatIcon>
            <HiOutlineUsers size={24} />
          </StatIcon>
          <StatValue>{stats?.totalClients || 0}</StatValue>
          <StatLabel>Total Clients</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <HiOutlineShoppingBag size={24} />
          </StatIcon>
          <StatValue>{stats?.recentClients || 0}</StatValue>
          <StatLabel>Recent (6 months)</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <HiOutlineCurrencyEuro size={24} />
          </StatIcon>
          <StatValue>€{stats?.averageOrderValue || 0}</StatValue>
          <StatLabel>Avg Order Value</StatLabel>
        </StatCard>
      </AnalyticsContainer>

      <SegmentContainer>
        <SegmentTitle>Client Segments</SegmentTitle>
        <SegmentList>
          {segments.map((segment, index) => (
            <SegmentItem key={index} color={segment.color}>
              <SegmentName>{segment.name}</SegmentName>
              <SegmentCount>{segment.count} clients</SegmentCount>
            </SegmentItem>
          ))}
        </SegmentList>
      </SegmentContainer>
    </div>
  );
}

export default ClientAnalytics;
