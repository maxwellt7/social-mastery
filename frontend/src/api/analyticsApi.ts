import apiClient from './client'
import type { AnalyticsSummary, AIInsights, AnalyticsRequest } from '../types/analytics'

export const analyticsApi = {
  // Get analytics summary
  getSummary: async (request: AnalyticsRequest): Promise<AnalyticsSummary> => {
    const { data } = await apiClient.get<AnalyticsSummary>('/analytics/summary', {
      params: request,
    })
    return data
  },

  // Get AI-generated insights
  getInsights: async (offerId: string): Promise<AIInsights> => {
    const { data } = await apiClient.post<AIInsights>('/analytics/insights', { offerId })
    return data
  },

  // Refresh metrics (trigger collection)
  refreshMetrics: async (offerId: string): Promise<{ success: boolean }> => {
    const { data } = await apiClient.post<{ success: boolean }>('/analytics/refresh', { offerId })
    return data
  },
}

