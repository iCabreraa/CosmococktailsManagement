import styled from "styled-components";
import { useUsers, useDeleteUser, useUpdateUserRole } from "./useUsers";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineShieldCheck,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
} from "react-icons/hi2";
import { useState } from "react";

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
  transition: background-color 0.2s;

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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const Avatar = styled.div`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background: var(--color-brand-500);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.4rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const UserName = styled.div`
  font-weight: 600;
  color: var(--color-grey-900);
`;

const UserEmail = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-600);
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius-sm);
  font-size: 1.2rem;
  font-weight: 500;
  text-transform: capitalize;

  ${props => {
    switch (props.$role) {
      case "super_admin":
        return `
          background: var(--color-red-100);
          color: var(--color-red-700);
        `;
      case "admin":
        return `
          background: var(--color-orange-100);
          color: var(--color-orange-700);
        `;
      case "manager":
        return `
          background: var(--color-blue-100);
          color: var(--color-blue-700);
        `;
      case "staff":
        return `
          background: var(--color-green-100);
          color: var(--color-green-700);
        `;
      case "customer":
        return `
          background: var(--color-grey-100);
          color: var(--color-grey-700);
        `;
      case "guest":
        return `
          background: var(--color-purple-100);
          color: var(--color-purple-700);
        `;
      default:
        return `
          background: var(--color-grey-100);
          color: var(--color-grey-700);
        `;
    }
  }}
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius-sm);
  font-size: 1.2rem;
  font-weight: 500;
  text-transform: capitalize;

  ${props => {
    switch (props.$status) {
      case "active":
        return `
          background: var(--color-green-100);
          color: var(--color-green-700);
        `;
      case "inactive":
        return `
          background: var(--color-grey-100);
          color: var(--color-grey-700);
        `;
      case "suspended":
        return `
          background: var(--color-red-100);
          color: var(--color-red-700);
        `;
      case "pending":
        return `
          background: var(--color-yellow-100);
          color: var(--color-yellow-700);
        `;
      case "banned":
        return `
          background: var(--color-red-100);
          color: var(--color-red-700);
        `;
      default:
        return `
          background: var(--color-grey-100);
          color: var(--color-grey-700);
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const ActionButton = styled.button`
  padding: 0.6rem;
  border: none;
  border-radius: var(--border-radius-sm);
  background: var(--color-grey-100);
  color: var(--color-grey-600);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--color-grey-200);
    color: var(--color-grey-700);
  }

  ${props =>
    props.$variant === "danger" &&
    `
    &:hover {
      background: var(--color-red-100);
      color: var(--color-red-700);
    }
  `}
`;

const LoadingRow = styled.tr`
  td {
    text-align: center;
    padding: 3rem;
    color: var(--color-grey-500);
  }
`;

const ErrorRow = styled.tr`
  td {
    text-align: center;
    padding: 3rem;
    color: var(--color-red-500);
  }
`;

const EmptyRow = styled.tr`
  td {
    text-align: center;
    padding: 3rem;
    color: var(--color-grey-500);
  }
`;

function UsersList({ filters = {} }) {
  const { data: usersData, isPending, error } = useUsers(filters);
  const users = usersData?.users || [];
  const deleteUserMutation = useDeleteUser();
  const updateRoleMutation = useUpdateUserRole();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async id => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      setDeletingId(id);
      try {
        await deleteUserMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateRoleMutation.mutateAsync({ id, role: newRole });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const getInitials = name => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isPending) {
    return (
      <Table>
        <TableBody>
          <LoadingRow>
            <TableCell colSpan="6">Cargando usuarios...</TableCell>
          </LoadingRow>
        </TableBody>
      </Table>
    );
  }

  if (error) {
    return (
      <Table>
        <TableBody>
          <ErrorRow>
            <TableCell colSpan="6">
              Error al cargar usuarios: {error.message}
            </TableCell>
          </ErrorRow>
        </TableBody>
      </Table>
    );
  }

  if (!users?.length) {
    return (
      <Table>
        <TableBody>
          <EmptyRow>
            <TableCell colSpan="6">No se encontraron usuarios</TableCell>
          </EmptyRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHeaderCell>Usuario</TableHeaderCell>
          <TableHeaderCell>Rol</TableHeaderCell>
          <TableHeaderCell>Estado</TableHeaderCell>
          <TableHeaderCell>Teléfono</TableHeaderCell>
          <TableHeaderCell>Fecha de registro</TableHeaderCell>
          <TableHeaderCell>Acciones</TableHeaderCell>
        </tr>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell>
              <UserInfo>
                <Avatar>{getInitials(user.full_name)}</Avatar>
                <UserDetails>
                  <UserName>{user.full_name || "Sin nombre"}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                </UserDetails>
              </UserInfo>
            </TableCell>
            <TableCell>
              <RoleBadge $role={user.role}>
                <HiOutlineShieldCheck />
                {user.role}
              </RoleBadge>
            </TableCell>
            <TableCell>
              <StatusBadge $status={user.status}>{user.status}</StatusBadge>
            </TableCell>
            <TableCell>
              {user.phone ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <HiOutlinePhone />
                  {user.phone}
                </div>
              ) : (
                <span style={{ color: "var(--color-grey-400)" }}>
                  No disponible
                </span>
              )}
            </TableCell>
            <TableCell>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <HiOutlineCalendar />
                {format(new Date(user.created_at), "dd MMM yyyy", {
                  locale: es,
                })}
              </div>
            </TableCell>
            <TableCell>
              <ActionButtons>
                <ActionButton title="Ver detalles">
                  <HiOutlineEye />
                </ActionButton>
                <ActionButton title="Editar">
                  <HiOutlinePencil />
                </ActionButton>
                <ActionButton
                  $variant="danger"
                  title="Eliminar"
                  onClick={() => handleDelete(user.id)}
                  disabled={deletingId === user.id}
                >
                  <HiOutlineTrash />
                </ActionButton>
              </ActionButtons>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default UsersList;
