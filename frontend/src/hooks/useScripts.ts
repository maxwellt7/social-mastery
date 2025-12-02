import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as scriptApi from '../api/scriptApi'

export function useScripts(params?: any) {
  return useQuery({
    queryKey: ['scripts', params],
    queryFn: () => scriptApi.listScripts(params),
  })
}

export function useScript(id: string | undefined) {
  return useQuery({
    queryKey: ['script', id],
    queryFn: () => scriptApi.getScript(id!),
    enabled: !!id,
  })
}

export function useGenerateScripts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: scriptApi.generateScripts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] })
    },
  })
}

export function useUpdateScript() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      scriptApi.updateScript(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['script', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['scripts'] })
    },
  })
}

export function useDeleteScript() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: scriptApi.deleteScript,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] })
    },
  })
}

