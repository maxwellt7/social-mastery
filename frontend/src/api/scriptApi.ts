import client from './client'
import { Script } from '../types/script'

export const generateScripts = async (data: {
  templateId: string
  offerId: string
  numVariants?: number
  angle?: string
  variableMappings?: Record<string, string>
}): Promise<Script[]> => {
  const response = await client.post('/scripts/generate', data)
  return response.data
}

export const listScripts = async (params?: {
  offerId?: string
  templateId?: string
  status?: string
  angle?: string
}): Promise<Script[]> => {
  const response = await client.get('/scripts', { params })
  return response.data
}

export const getScript = async (id: string): Promise<Script> => {
  const response = await client.get(`/scripts/${id}`)
  return response.data
}

export const updateScript = async (id: string, data: Partial<Script>): Promise<Script> => {
  const response = await client.put(`/scripts/${id}`, data)
  return response.data
}

export const deleteScript = async (id: string): Promise<void> => {
  await client.delete(`/scripts/${id}`)
}

