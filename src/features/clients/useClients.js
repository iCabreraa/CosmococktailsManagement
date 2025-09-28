import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClients,
  getClientById,
  getClientByEmail,
  createOrUpdateClient,
  deleteClient,
  getClientStats,
} from "../../services/apiClients";

export function useClients() {
  const {
    isPending,
    data: clients,
    error,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  return { clients, isPending, error };
}

export function useClient(id) {
  const {
    isPending,
    data: client,
    error,
  } = useQuery({
    queryKey: ["client", id],
    queryFn: () => getClientById(id),
    enabled: !!id,
  });

  return { client, isPending, error };
}

export function useClientByEmail(email) {
  const {
    isPending,
    data: client,
    error,
  } = useQuery({
    queryKey: ["client", "email", email],
    queryFn: () => getClientByEmail(email),
    enabled: !!email,
  });

  return { client, isPending, error };
}

export function useCreateOrUpdateClient() {
  const queryClient = useQueryClient();

  const { isPending, mutate: createOrUpdate } = useMutation({
    mutationFn: createOrUpdateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return { isPending, createOrUpdate };
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  const { isPending, mutate: deleteClientMutation } = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return { isPending, deleteClient: deleteClientMutation };
}

export function useClientStats() {
  const {
    isPending,
    data: stats,
    error,
  } = useQuery({
    queryKey: ["client-stats"],
    queryFn: getClientStats,
  });

  return { stats, isPending, error };
}
