import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { analyticsApi } from '../api/analyticsApi'
import type { AnalyticsRequest } from '../types/analytics'

export const useAnalyticsSummary = (request: AnalyticsRequest) => {
  return useQuery({
    queryKey: ['analytics', 'summary', request],
    queryFn: () => analyticsApi.getSummary(request),
    enabled: !!request.offerId,
  })
}

export const useAIInsights = (offerId: string) => {
  return useQuery({
    queryKey: ['analytics', 'insights', offerId],
    queryFn: () => analyticsApi.getInsights(offerId),
    enabled: !!offerId,
    // Cache insights for 1 hour
    staleTime: 60 * 60 * 1000,
  })
}

export const useRefreshMetrics = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (offerId: string) => analyticsApi.refreshMetrics(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}

