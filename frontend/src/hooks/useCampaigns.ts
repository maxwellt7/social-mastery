import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { campaignApi } from '../api/campaignApi'
import type { GenerateScriptsRequest, CreateCampaignRequest } from '../types/campaign'

export const useGenerateScripts = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: GenerateScriptsRequest) => campaignApi.generateScripts(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] })
    },
  })
}

export const useScripts = (offerId?: string) => {
  return useQuery({
    queryKey: offerId ? ['scripts', { offerId }] : ['scripts'],
    queryFn: () => campaignApi.getScripts(offerId),
  })
}

export const useScript = (id: string) => {
  return useQuery({
    queryKey: ['scripts', id],
    queryFn: () => campaignApi.getScript(id),
    enabled: !!id,
  })
}

export const useUpdateScript = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<any> }) =>
      campaignApi.updateScript(id, updates),
    onSuccess: (updatedScript) => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] })
      queryClient.setQueryData(['scripts', updatedScript.id], updatedScript)
    },
  })
}

export const useCreateVideo = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (scriptId: string) => campaignApi.createVideo(scriptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] })
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}

export const useVideoStatus = (videoAssetId: string) => {
  return useQuery({
    queryKey: ['videos', videoAssetId],
    queryFn: () => campaignApi.getVideoStatus(videoAssetId),
    enabled: !!videoAssetId,
    refetchInterval: (data) => {
      // Poll every 5 seconds if video is processing
      if (data?.status === 'pending' || data?.status === 'processing') {
        return 5000
      }
      return false
    },
  })
}

export const useVideoByScript = (scriptId: string) => {
  return useQuery({
    queryKey: ['scripts', scriptId, 'video'],
    queryFn: () => campaignApi.getVideoByScript(scriptId),
    enabled: !!scriptId,
  })
}

export const useCreateCampaign = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: CreateCampaignRequest) => campaignApi.createCampaign(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export const useCampaigns = (offerId?: string) => {
  return useQuery({
    queryKey: offerId ? ['campaigns', { offerId }] : ['campaigns'],
    queryFn: () => campaignApi.getCampaigns(offerId),
  })
}

export const useCampaign = (id: string) => {
  return useQuery({
    queryKey: ['campaigns', id],
    queryFn: () => campaignApi.getCampaign(id),
    enabled: !!id,
  })
}

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<any> }) =>
      campaignApi.updateCampaign(id, updates),
    onSuccess: (updatedCampaign) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.setQueryData(['campaigns', updatedCampaign.id], updatedCampaign)
    },
  })
}
