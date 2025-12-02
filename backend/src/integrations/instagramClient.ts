import axios, { AxiosInstance } from 'axios'

class InstagramClient {
  private client: AxiosInstance
  private accessToken: string
  private businessAccountId: string

  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || ''
    this.businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || ''

    this.client = axios.create({
      baseURL: 'https://graph.facebook.com/v18.0',
      timeout: 30000,
    })

    this.client.interceptors.request.use((config) => {
      config.params = {
        ...config.params,
        access_token: this.accessToken,
      }
      return config
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Instagram API Error:', error.response?.data || error.message)
        throw error
      }
    )
  }

  async getMediaInsights(mediaId: string, metrics: string[] = [
    'impressions',
    'reach',
    'engagement',
    'saved',
    'shares',
    'video_views',
    'total_interactions'
  ]) {
    const { data } = await this.client.get(`/${mediaId}/insights`, {
      params: {
        metric: metrics.join(','),
      },
    })
    return data
  }

  async createMediaContainer(params: {
    videoUrl: string
    caption: string
    shareToFeed?: boolean
  }) {
    const { data } = await this.client.post(`/${this.businessAccountId}/media`, {
      media_type: 'VIDEO',
      video_url: params.videoUrl,
      caption: params.caption,
      share_to_feed: params.shareToFeed !== false,
    })
    return data
  }

  async publishMedia(creationId: string) {
    const { data } = await this.client.post(`/${this.businessAccountId}/media_publish`, {
      creation_id: creationId,
    })
    return data
  }

  async searchHashtags(query: string) {
    const { data } = await this.client.get('/ig_hashtag_search', {
      params: {
        user_id: this.businessAccountId,
        q: query,
      },
    })
    return data
  }

  async getHashtagRecentMedia(hashtagId: string, fields: string[] = [
    'id',
    'caption',
    'like_count',
    'comments_count',
    'media_url',
    'timestamp'
  ]) {
    const { data } = await this.client.get(`/${hashtagId}/recent_media`, {
      params: {
        user_id: this.businessAccountId,
        fields: fields.join(','),
      },
    })
    return data
  }

  async getUserMedia(userId?: string, fields: string[] = [
    'id',
    'caption',
    'media_type',
    'media_url',
    'timestamp',
    'like_count',
    'comments_count'
  ]) {
    const targetUserId = userId || this.businessAccountId
    const { data } = await this.client.get(`/${targetUserId}/media`, {
      params: {
        fields: fields.join(','),
      },
    })
    return data
  }

  async getMedia(mediaId: string, fields: string[] = [
    'id',
    'caption',
    'media_type',
    'media_url',
    'permalink',
    'timestamp',
    'username'
  ]) {
    const { data } = await this.client.get(`/${mediaId}`, {
      params: {
        fields: fields.join(','),
      },
    })
    return data
  }

  async getAccountInfo(userId?: string) {
    const targetUserId = userId || this.businessAccountId
    const { data } = await this.client.get(`/${targetUserId}`, {
      params: {
        fields: 'id,username,name,profile_picture_url,followers_count,follows_count,media_count',
      },
    })
    return data
  }
}

export default new InstagramClient()

