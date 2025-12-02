export interface IGPost {
  id: string
  instagramId: string
  caption: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  mediaUrl: string
  thumbnail?: string
  permalink: string
  timestamp: string
  metrics: IGPostMetrics
  transcript?: string
}

export interface IGPostMetrics {
  likes: number
  comments: number
  shares?: number
  saves?: number
  plays?: number
  reach?: number
  impressions?: number
  engagement?: number
}

export interface IGSearchRequest {
  keywords?: string[]
  hashtags?: string[]
  competitorProfiles?: string[]
  minLikes?: number
  minSaves?: number
  contentType?: 'reels' | 'posts' | 'all'
  dateFrom?: string
  dateTo?: string
}

export interface IGPublishRequest {
  videoUrl: string
  caption: string
  hashtags: string[]
  scheduledTime?: string
  shareToFeed: boolean
}

export interface IGPublishResponse {
  id: string
  instagramPostId: string
  permalink: string
  scheduledTime?: string
  status: 'scheduled' | 'published' | 'failed'
}

