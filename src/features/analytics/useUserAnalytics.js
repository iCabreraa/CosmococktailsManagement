import { useQuery } from "@tanstack/react-query";
import {
  getUserAnalytics,
  getUserEngagement,
  getUserSegmentation,
  getUserTrends,
} from "../../services/apiUserAnalytics";

// Hook para analytics básicos
export function useUserAnalytics() {
  return useQuery({
    queryKey: ["userAnalytics"],
    queryFn: getUserAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 10 * 60 * 1000, // Refetch cada 10 minutos
  });
}

// Hook para engagement de usuarios
export function useUserEngagement() {
  return useQuery({
    queryKey: ["userEngagement"],
    queryFn: getUserEngagement,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para segmentación de usuarios
export function useUserSegmentation() {
  return useQuery({
    queryKey: ["userSegmentation"],
    queryFn: getUserSegmentation,
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
}

// Hook para tendencias temporales
export function useUserTrends() {
  return useQuery({
    queryKey: ["userTrends"],
    queryFn: getUserTrends,
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
}
