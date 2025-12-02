export interface Template {
  id: string
  offerId: string
  sourcePlatform: 'instagram' | 'tiktok'
  sourcePostId: string
  sourcePostUrl?: string
  structuralDescription: string
  templateText: string
  placeholders: TemplatePlaceholder[]
  funnelStage: 'cold' | 'warm' | 'hot'
  pillar: string
  performanceTag?: 'winner' | 'test' | 'loser'
  createdAt: string
  updatedAt: string
}

export interface TemplatePlaceholder {
  key: string
  description: string
  example?: string
  suggestedValue?: string
}

export interface CreateTemplateFromPostRequest {
  postUrl: string
  caption: string
  transcript?: string
  offerId: string
  metrics?: {
    likes: number
    comments: number
    shares: number
    saves: number
  }
}

export interface VariableMapping {
  templateId: string
  mappings: Record<string, string>
  isGlobal: boolean
}
