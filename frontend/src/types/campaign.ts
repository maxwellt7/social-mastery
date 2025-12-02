export interface Campaign {
  id: string
  offerId: string
  name: string
  objective: 'followers' | 'engagement' | 'leads' | 'sales'
  status: 'draft' | 'active' | 'completed' | 'paused'
  createdAt: string
  updatedAt: string
  scripts: CampaignScript[]
}

export interface CampaignScript {
  id: string
  campaignId: string
  scriptId: string
  scheduledTime?: string
  igPostId?: string
  postedAt?: string
  status: 'pending' | 'processing' | 'ready' | 'scheduled' | 'published' | 'failed'
  script?: Script
  videoAsset?: VideoAsset
}

export interface Script {
  id: string
  templateId: string
  offerId: string
  scriptText: string
  angle: 'pain' | 'pleasure' | 'objection' | 'contrarian' | 'authority'
  hookType: string
  targetAvatarSegment?: string
  status: 'draft' | 'sent_to_creatify' | 'video_ready' | 'posted'
  createdAt: string
  updatedAt: string
}

export interface VideoAsset {
  id: string
  scriptId: string
  creatifyJobId: string
  videoUrl?: string
  thumbnailUrl?: string
  duration?: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  errorMessage?: string
  createdAt: string
  completedAt?: string
}

export interface GenerateScriptsRequest {
  templateId: string
  offerId: string
  numVariants: number
  angles: Script['angle'][]
  variableMappings?: Record<string, string>
}

export interface CreateCampaignRequest {
  name: string
  offerId: string
  objective: Campaign['objective']
  scriptIds: string[]
}
