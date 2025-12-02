import axios, { AxiosInstance } from 'axios'

class KodeyClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.KODEY_BASE_URL || 'https://api.kodey.ai/v1',
      headers: {
        'Authorization': `Bearer ${process.env.KODEY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000, // Longer timeout for AI processing
    })
    
    console.log(`🔗 Kodey.ai client initialized: ${process.env.KODEY_BASE_URL || 'https://api.kodey.ai/v1'}`)

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Kodey.ai API Error:', error.response?.data || error.message)
        throw error
      }
    )
  }

  async createAgent(params: {
    name: string
    description: string
    capabilities: string[]
    instructions: string
  }) {
    const { data } = await this.client.post('/agents', params)
    return data
  }

  async executeAgent(agentId: string, input: any, context?: any, parameters?: any) {
    const { data } = await this.client.post(`/agents/${agentId}/execute`, {
      input,
      context,
      parameters,
    })
    return data
  }

  async uploadToKnowledgeBase(file: Buffer, filename: string, metadata?: any) {
    const formData = new FormData()
    formData.append('file', new Blob([file]), filename)
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata))
    }

    const { data } = await this.client.post('/knowledge-base/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  }

  async createWorkflow(params: {
    name: string
    steps: Array<{
      agent_id: string
      action: string
      inputs?: string[]
      outputs?: string[]
    }>
  }) {
    const { data } = await this.client.post('/workflows', params)
    return data
  }

  async executeWorkflow(workflowId: string, inputs: any, parameters?: any) {
    const { data } = await this.client.post(`/workflows/${workflowId}/execute`, {
      inputs,
      parameters,
    })
    return data
  }

  async listAgents() {
    const { data } = await this.client.get('/agents')
    return data
  }

  async getAgent(agentId: string) {
    const { data } = await this.client.get(`/agents/${agentId}`)
    return data
  }

  async deleteAgent(agentId: string) {
    const { data } = await this.client.delete(`/agents/${agentId}`)
    return data
  }
}

export default new KodeyClient()

