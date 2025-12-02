import apiClient from './client'
import type { IGPost, IGSearchRequest, IGPublishRequest, IGPublishResponse } from '../types/ig'

export const igApi = {
  // Search high-performing Instagram content
  searchHighPerformers: async (searchParams: IGSearchRequest): Promise<IGPost[]> => {
    const { data } = await apiClient.post<IGPost[]>('/ig/search-high-performers', searchParams)
    return data
  },

  // Get post details
  getPost: async (postId: string): Promise<IGPost> => {
    const { data } = await apiClient.get<IGPost>(`/ig/posts/${postId}`)
    return data
  },

  // Get post metrics
  getPostMetrics: async (postId: string): Promise<IGPost['metrics']> => {
    const { data } = await apiClient.get<IGPost['metrics']>(`/ig/posts/${postId}/metrics`)
    return data
  },

  // Publish to Instagram
  publish: async (publishData: IGPublishRequest): Promise<IGPublishResponse> => {
    const { data } = await apiClient.post<IGPublishResponse>('/ig/publish', publishData)
    return data
  },

  // Get published posts
  getPublishedPosts: async (offerId?: string): Promise<IGPost[]> => {
    const params = offerId ? { offerId } : {}
    const { data } = await apiClient.get<IGPost[]>('/ig/posts', { params })
    return data
  },
}

