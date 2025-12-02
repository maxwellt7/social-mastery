import axios, { AxiosInstance } from 'axios'
import { logger } from '../utils/logger.js'

interface InstagramConfig {
  accessToken: string
  baseURL: string
}

interface MediaContainer {
  id: string
}

interface PublishResponse {
  id: string
}

interface MediaInsight {
  name: string
  period: string
  values: Array<{ value: number }>
}

interface MediaInsightsResponse {
  data: MediaInsight[]
}

interface HashtagSearchResponse {
  data: Array<{ id: string }>
}

interface RecentMediaItem {
  id: string
  caption?: string
  media_type: string
  media_url: string
  permalink: string
  timestamp: string
  like_count?: number
  comments_count?: number
}

interface RecentMediaResponse {
  data: RecentMediaItem[]
  paging?: {
    cursors?: {
      before: string
      after: string
    }
    next?: string
  }
}

export class InstagramClient {
  private client: AxiosInstance
  private config: InstagramConfig

  constructor(config: InstagramConfig) {
    this.config = config
    this.client = axios.create({
      baseURL: config.baseURL,
      params: {
        access_token: config.accessToken,
      },
      timeout: 30000,
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        logger.error('Instagram API Error:', error.response?.data || error.message)
        throw error
      }
    )
  }

  updateAccessToken(accessToken: string) {
    this.config.accessToken = accessToken
    this.client.defaults.params.access_token = accessToken
  }

  // Get Instagram Business Account ID
  async getBusinessAccount(pageId: string): Promise<string> {
    try {
      const response = await this.client.get(`/${pageId}`, {
        params: {
          fields: 'instagram_business_account',
        },
      })
      return response.data.instagram_business_account.id
    } catch (error) {
      logger.error('Failed to get Instagram business account:', error)
      throw error
    }
  }

  // Upload Video (Create Container)
  async createMediaContainer(
    igUserId: string,
    videoUrl: string,
    caption: string,
    shareToFeed: boolean = true
  ): Promise<string> {
    try {
      const response = await this.client.post<MediaContainer>(`/${igUserId}/media`, {
        video_url: videoUrl,
        caption,
        media_type: 'REELS',
        share_to_feed: shareToFeed,
      })
      logger.info(`Media container created: ${response.data.id}`)
      return response.data.id
    } catch (error) {
      logger.error('Failed to create media container:', error)
      throw error
    }
  }

  // Publish Media
  async publishMedia(igUserId: string, containerId: string): Promise<string> {
    try {
      const response = await this.client.post<PublishResponse>(`/${igUserId}/media_publish`, {
        creation_id: containerId,
      })
      logger.info(`Media published: ${response.data.id}`)
      return response.data.id
    } catch (error) {
      logger.error('Failed to publish media:', error)
      throw error
    }
  }

  // Get Media Insights
  async getMediaInsights(mediaId: string, metrics: string[]): Promise<MediaInsightsResponse> {
    try {
      const response = await this.client.get<MediaInsightsResponse>(`/${mediaId}/insights`, {
        params: {
          metric: metrics.join(','),
        },
      })
      return response.data
    } catch (error) {
      logger.error(`Failed to get insights for media ${mediaId}:`, error)
      throw error
    }
  }

  // Search Hashtags
  async searchHashtag(igUserId: string, hashtag: string): Promise<string | null> {
    try {
      const response = await this.client.get<HashtagSearchResponse>('/ig_hashtag_search', {
        params: {
          user_id: igUserId,
          q: hashtag,
        },
      })
      return response.data.data[0]?.id || null
    } catch (error) {
      logger.error(`Failed to search hashtag ${hashtag}:`, error)
      throw error
    }
  }

  // Get Recent Media for Hashtag
  async getHashtagRecentMedia(
    hashtagId: string,
    igUserId: string,
    limit: number = 25
  ): Promise<RecentMediaItem[]> {
    try {
      const response = await this.client.get<RecentMediaResponse>(`/${hashtagId}/recent_media`, {
        params: {
          user_id: igUserId,
          fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
          limit,
        },
      })
      return response.data.data
    } catch (error) {
      logger.error(`Failed to get recent media for hashtag ${hashtagId}:`, error)
      throw error
    }
  }

  // Get Media Details
  async getMedia(mediaId: string, fields?: string[]): Promise<any> {
    try {
      const response = await this.client.get(`/${mediaId}`, {
        params: {
          fields: fields?.join(',') || 'id,caption,media_type,media_url,permalink,timestamp',
        },
      })
      return response.data
    } catch (error) {
      logger.error(`Failed to get media ${mediaId}:`, error)
      throw error
    }
  }

  // Check Container Status (for video processing)
  async getContainerStatus(containerId: string): Promise<string> {
    try {
      const response = await this.client.get(`/${containerId}`, {
        params: {
          fields: 'status_code',
        },
      })
      return response.data.status_code
    } catch (error) {
      logger.error(`Failed to get container status ${containerId}:`, error)
      throw error
    }
  }
}

// Export singleton instance (will be initialized with actual token at runtime)
export const instagramClient = new InstagramClient({
  accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
  baseURL: 'https://graph.facebook.com/v18.0',
})

