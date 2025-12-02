import apiClient from './client'
import type { Template, CreateTemplateFromPostRequest, VariableMapping } from '../types/template'

export const templateApi = {
  // Create template from Instagram post
  fromIGPost: async (request: CreateTemplateFromPostRequest): Promise<Template> => {
    const { data } = await apiClient.post<Template>('/templates/from-ig-post', request)
    return data
  },

  // Get all templates
  getTemplates: async (offerId?: string): Promise<Template[]> => {
    const params = offerId ? { offerId } : {}
    const { data } = await apiClient.get<Template[]>('/templates', { params })
    return data
  },

  // Get single template
  getTemplate: async (id: string): Promise<Template> => {
    const { data } = await apiClient.get<Template>(`/templates/${id}`)
    return data
  },

  // Update template
  updateTemplate: async (id: string, updates: Partial<Template>): Promise<Template> => {
    const { data } = await apiClient.patch<Template>(`/templates/${id}`, updates)
    return data
  },

  // Delete template
  deleteTemplate: async (id: string): Promise<void> => {
    await apiClient.delete(`/templates/${id}`)
  },

  // Save variable mapping
  saveVariableMapping: async (mapping: VariableMapping): Promise<VariableMapping> => {
    const { data } = await apiClient.post<VariableMapping>('/templates/variable-mapping', mapping)
    return data
  },

  // Get variable mappings
  getVariableMappings: async (templateId: string): Promise<VariableMapping[]> => {
    const { data } = await apiClient.get<VariableMapping[]>(
      `/templates/${templateId}/variable-mappings`
    )
    return data
  },
}
