import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
  getUserStats,
} from "../../services/apiUsers";

// Hook para obtener usuarios con filtros
export function useUsers(filters = {}) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para obtener un usuario específico
export function useUser(id) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook para estadísticas de usuarios
export function useUserStats() {
  return useQuery({
    queryKey: ["userStats"],
    queryFn: getUserStats,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para crear usuario
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
}

// Hook para actualizar usuario
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => updateUser(id, updates),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", data.id] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
}

// Hook para actualizar rol de usuario
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", data.id] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
}

// Hook para eliminar usuario
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
}
