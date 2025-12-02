export interface Script {
  id: string
  templateId: string
  offerId: string
  scriptText: string
  angle: string
  hookType?: string
  targetAvatarSegment?: string
  status: 'draft' | 'sent_to_creatify' | 'video_ready' | 'posted'
  createdAt: string
  updatedAt: string
  videoAssets?: VideoAsset[]
}

export interface VideoAsset {
  id: string
  scriptId: string
  creatifyJobId?: string
  videoUrl?: string
  thumbnailUrl?: string
  duration?: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

