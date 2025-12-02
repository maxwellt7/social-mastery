import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { igApi } from '../api/igApi'
import type { IGSearchRequest, IGPublishRequest } from '../types/ig'

export const useSearchIGPosts = () => {
  return useMutation({
    mutationFn: (searchParams: IGSearchRequest) => igApi.searchHighPerformers(searchParams),
  })
}

export const useIGPost = (postId: string) => {
  return useQuery({
    queryKey: ['ig-posts', postId],
    queryFn: () => igApi.getPost(postId),
    enabled: !!postId,
  })
}

export const useIGPostMetrics = (postId: string) => {
  return useQuery({
    queryKey: ['ig-posts', postId, 'metrics'],
    queryFn: () => igApi.getPostMetrics(postId),
    enabled: !!postId,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  })
}

export const usePublishToIG = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (publishData: IGPublishRequest) => igApi.publish(publishData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ig-posts'] })
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export const usePublishedPosts = (offerId?: string) => {
  return useQuery({
    queryKey: offerId ? ['ig-posts', 'published', { offerId }] : ['ig-posts', 'published'],
    queryFn: () => igApi.getPublishedPosts(offerId),
  })
}

