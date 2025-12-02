import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { templateApi } from '../api/templateApi'
import type { CreateTemplateFromPostRequest, VariableMapping } from '../types/template'

export const useTemplates = (offerId?: string) => {
  return useQuery({
    queryKey: offerId ? ['templates', { offerId }] : ['templates'],
    queryFn: () => templateApi.getTemplates(offerId),
  })
}

export const useTemplate = (id: string) => {
  return useQuery({
    queryKey: ['templates', id],
    queryFn: () => templateApi.getTemplate(id),
    enabled: !!id,
  })
}

export const useCreateTemplateFromPost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: CreateTemplateFromPostRequest) => templateApi.fromIGPost(request),
    onSuccess: (newTemplate) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      queryClient.setQueryData(['templates', newTemplate.id], newTemplate)
    },
  })
}

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<any> }) =>
      templateApi.updateTemplate(id, updates),
    onSuccess: (updatedTemplate) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      queryClient.setQueryData(['templates', updatedTemplate.id], updatedTemplate)
    },
  })
}

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => templateApi.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    },
  })
}

export const useSaveVariableMapping = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (mapping: VariableMapping) => templateApi.saveVariableMapping(mapping),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['templates', variables.templateId, 'variable-mappings'],
      })
    },
  })
}

export const useVariableMappings = (templateId: string) => {
  return useQuery({
    queryKey: ['templates', templateId, 'variable-mappings'],
    queryFn: () => templateApi.getVariableMappings(templateId),
    enabled: !!templateId,
  })
}
