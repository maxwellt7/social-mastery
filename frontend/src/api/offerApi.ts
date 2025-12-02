import apiClient from './client'
import type { Offer, OfferProfile, UploadPdfResponse, DirectorPlaybook } from '../types/offer'

export const offerApi = {
  // Upload PDF and create offer
  uploadPdf: async (file: File, offerName: string): Promise<UploadPdfResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('offerName', offerName)

    const { data } = await apiClient.post<UploadPdfResponse>('/offer/upload-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  // Get all offers
  getOffers: async (): Promise<Offer[]> => {
    const { data } = await apiClient.get<Offer[]>('/offer')
    return data
  },

  // Get single offer
  getOffer: async (id: string): Promise<Offer> => {
    const { data } = await apiClient.get<Offer>(`/offer/${id}`)
    return data
  },

  // Get offer profile
  getOfferProfile: async (id: string): Promise<OfferProfile> => {
    const { data } = await apiClient.get<OfferProfile>(`/offer/${id}/profile`)
    return data
  },

  // Update AI Director playbook
  updateAIDirector: async (id: string, performanceData: unknown): Promise<DirectorPlaybook> => {
    const { data } = await apiClient.post<DirectorPlaybook>(
      `/offer/${id}/update-ai-director`,
      performanceData
    )
    return data
  },

  // Get current playbook
  getPlaybook: async (offerId: string): Promise<DirectorPlaybook> => {
    const { data } = await apiClient.get<DirectorPlaybook>(`/offer/${offerId}/playbook`)
    return data
  },

  // Map variables for template
  mapVariables: async (
    offerId: string,
    templateId: string,
    placeholders: string[]
  ): Promise<Record<string, string>> => {
    const { data } = await apiClient.post<Record<string, string>>(`/offer/${offerId}/map-variables`, {
      templateId,
      placeholders,
    })
    return data
  },
}
