import apiClient from './client'
import type {
  Campaign,
  Script,
  VideoAsset,
  GenerateScriptsRequest,
  CreateCampaignRequest,
} from '../types/campaign'

export const campaignApi = {
  // Generate scripts from template
  generateScripts: async (request: GenerateScriptsRequest): Promise<Script[]> => {
    const { data } = await apiClient.post<Script[]>('/scripts/generate', request)
    return data
  },

  // Get scripts
  getScripts: async (offerId?: string): Promise<Script[]> => {
    const params = offerId ? { offerId } : {}
    const { data } = await apiClient.get<Script[]>('/scripts', { params })
    return data
  },

  // Get single script
  getScript: async (id: string): Promise<Script> => {
    const { data } = await apiClient.get<Script>(`/scripts/${id}`)
    return data
  },

  // Update script
  updateScript: async (id: string, updates: Partial<Script>): Promise<Script> => {
    const { data } = await apiClient.patch<Script>(`/scripts/${id}`, updates)
    return data
  },

  // Create video from script
  createVideo: async (scriptId: string): Promise<VideoAsset> => {
    const { data } = await apiClient.post<VideoAsset>('/creatify/create-video', { scriptId })
    return data
  },

  // Get video status
  getVideoStatus: async (videoAssetId: string): Promise<VideoAsset> => {
    const { data } = await apiClient.get<VideoAsset>(`/creatify/video-status/${videoAssetId}`)
    return data
  },

  // Get video by script
  getVideoByScript: async (scriptId: string): Promise<VideoAsset | null> => {
    const { data } = await apiClient.get<VideoAsset | null>(`/scripts/${scriptId}/video`)
    return data
  },

  // Create campaign
  createCampaign: async (request: CreateCampaignRequest): Promise<Campaign> => {
    const { data } = await apiClient.post<Campaign>('/campaigns', request)
    return data
  },

  // Get campaigns
  getCampaigns: async (offerId?: string): Promise<Campaign[]> => {
    const params = offerId ? { offerId } : {}
    const { data } = await apiClient.get<Campaign[]>('/campaigns', { params })
    return data
  },

  // Get single campaign
  getCampaign: async (id: string): Promise<Campaign> => {
    const { data } = await apiClient.get<Campaign>(`/campaigns/${id}`)
    return data
  },

  // Update campaign
  updateCampaign: async (id: string, updates: Partial<Campaign>): Promise<Campaign> => {
    const { data } = await apiClient.patch<Campaign>(`/campaigns/${id}`, updates)
    return data
  },
}
