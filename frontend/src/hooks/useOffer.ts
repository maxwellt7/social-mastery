import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { offerApi } from '../api/offerApi'
import type { UploadPdfResponse } from '../types/offer'

export const useOffers = () => {
  return useQuery({
    queryKey: ['offers'],
    queryFn: offerApi.getOffers,
  })
}

export const useOffer = (id: string) => {
  return useQuery({
    queryKey: ['offers', id],
    queryFn: () => offerApi.getOffer(id),
    enabled: !!id,
  })
}

export const useOfferProfile = (id: string) => {
  return useQuery({
    queryKey: ['offers', id, 'profile'],
    queryFn: () => offerApi.getOfferProfile(id),
    enabled: !!id,
  })
}

export const useUploadPdf = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ file, offerName }: { file: File; offerName: string }) =>
      offerApi.uploadPdf(file, offerName),
    onSuccess: (data: UploadPdfResponse) => {
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      queryClient.setQueryData(['offers', data.offer.id], data.offer)
      queryClient.setQueryData(['offers', data.offer.id, 'profile'], data.profile)
    },
  })
}

export const usePlaybook = (offerId: string) => {
  return useQuery({
    queryKey: ['offers', offerId, 'playbook'],
    queryFn: () => offerApi.getPlaybook(offerId),
    enabled: !!offerId,
  })
}

export const useUpdateAIDirector = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ offerId, performanceData }: { offerId: string; performanceData: unknown }) =>
      offerApi.updateAIDirector(offerId, performanceData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['offers', variables.offerId, 'playbook'] })
    },
  })
}

export const useMapVariables = () => {
  return useMutation({
    mutationFn: ({
      offerId,
      templateId,
      placeholders,
    }: {
      offerId: string
      templateId: string
      placeholders: string[]
    }) => offerApi.mapVariables(offerId, templateId, placeholders),
  })
}
