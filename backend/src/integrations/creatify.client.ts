import axios, { AxiosInstance } from 'axios'
import { logger } from '../utils/logger.js'

interface CreatifyConfig {
  apiId: string
  apiKey: string
  baseURL: string
}

interface CreateVideoRequest {
  script: string
  voice_id?: string
  avatar_id?: string
  aspect_ratio?: '16:9' | '9:16' | '1:1'
  style?: string
  background?: string
}

interface VideoJobResponse {
  job_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  video_url?: string
  thumbnail_url?: string
  progress?: number
  error?: string
  created_at?: string
}

interface Avatar {
  id: string
  name: string
  thumbnail: string
  gender: string
  style: string
}

interface Voice {
  id: string
  name: string
  language: string
  gender: string
  preview_url: string
}

export class CreatifyClient {
  private client: AxiosInstance
  private config: CreatifyConfig

  constructor(config: CreatifyConfig) {
    this.config = config
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        'X-API-ID': config.apiId,
        'X-API-KEY': config.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        logger.error('Creatify API Error:', error.response?.data || error.message)
        throw error
      }
    )
  }

  async createVideo(request: CreateVideoRequest): Promise<VideoJobResponse> {
    try {
      const response = await this.client.post<VideoJobResponse>('/v1/videos', request)
      logger.info(`Creatify video job created: ${response.data.job_id}`)
      return response.data
    } catch (error) {
      logger.error('Failed to create Creatify video:', error)
      throw error
    }
  }

  async getVideoStatus(jobId: string): Promise<VideoJobResponse> {
    try {
      const response = await this.client.get<VideoJobResponse>(`/v1/videos/${jobId}`)
      return response.data
    } catch (error) {
      logger.error(`Failed to get video status for job ${jobId}:`, error)
      throw error
    }
  }

  async listAvatars(): Promise<Avatar[]> {
    try {
      const response = await this.client.get<{ avatars: Avatar[] }>('/v1/avatars')
      return response.data.avatars
    } catch (error) {
      logger.error('Failed to list Creatify avatars:', error)
      throw error
    }
  }

  async listVoices(): Promise<Voice[]> {
    try {
      const response = await this.client.get<{ voices: Voice[] }>('/v1/voices')
      return response.data.voices
    } catch (error) {
      logger.error('Failed to list Creatify voices:', error)
      throw error
    }
  }

  async textToSpeech(text: string, voiceId: string, speed: number = 1.0): Promise<string> {
    try {
      const response = await this.client.post<{ audio_url: string }>('/v1/text-to-speech', {
        text,
        voice_id: voiceId,
        speed,
      })
      return response.data.audio_url
    } catch (error) {
      logger.error('Failed to convert text to speech:', error)
      throw error
    }
  }
}

// Export singleton instance
export const creatifyClient = new CreatifyClient({
  apiId: process.env.CREATIFY_API_ID || '',
  apiKey: process.env.CREATIFY_API_KEY || '',
  baseURL: process.env.CREATIFY_BASE_URL || 'https://api.creatify.ai',
})

