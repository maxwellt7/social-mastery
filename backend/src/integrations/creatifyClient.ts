import axios, { AxiosInstance } from 'axios'

class CreatifyClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.CREATIFY_BASE_URL || 'https://api.creatify.ai/api/v1',
      headers: {
        'X-API-ID': process.env.CREATIFY_API_ID,
        'X-API-KEY': process.env.CREATIFY_API_KEY,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Creatify API Error:', error.response?.data || error.message)
        throw error
      }
    )
  }

  async textToSpeech(text: string, voiceId: string = 'default', language: string = 'en-US') {
    const { data } = await this.client.post('/text-to-speech', {
      text,
      voice_id: voiceId,
      language,
    })
    return data
  }

  async createVideo(params: {
    script: string
    avatarId?: string
    voiceId?: string
    aspectRatio?: string
    duration?: number | string
  }) {
    const { data } = await this.client.post('/videos', {
      script: params.script,
      avatar_id: params.avatarId || 'default',
      voice_id: params.voiceId || 'default',
      aspect_ratio: params.aspectRatio || '9:16',
      duration: params.duration || 'auto',
    })
    return data
  }

  async getVideoStatus(jobId: string) {
    const { data } = await this.client.get(`/videos/${jobId}`)
    return data
  }

  async urlToVideo(url: string, style: string = 'dynamic', duration: number = 30) {
    const { data } = await this.client.post('/url-to-video', {
      url,
      style,
      duration,
    })
    return data
  }

  async listVoices() {
    const { data } = await this.client.get('/voices')
    return data
  }

  async listAvatars() {
    const { data } = await this.client.get('/avatars')
    return data
  }
}

export default new CreatifyClient()

