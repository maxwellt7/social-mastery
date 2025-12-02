import axios, { AxiosInstance } from 'axios'
import FormData from 'form-data'
import { logger } from '../utils/logger.js'
import fs from 'fs'

interface KodeyConfig {
  apiKey: string
  baseURL: string
}

interface CreateAgentRequest {
  name: string
  type: 'extraction' | 'analysis' | 'generation' | 'insights'
  instructions: string
  knowledge_base_ids?: string[]
  model?: string
  temperature?: number
}

interface Agent {
  agent_id: string
  name: string
  type: string
  status: string
  created_at: string
}

interface ExecuteAgentRequest {
  input: string | object
  context?: object
  stream?: boolean
}

interface ExecuteAgentResponse {
  execution_id: string
  output: string | object
  metadata?: object
  tokens_used?: number
}

interface KnowledgeBase {
  kb_id: string
  name: string
  description?: string
  status: string
}

interface DocumentUploadResponse {
  document_id: string
  kb_id: string
  filename: string
  status: string
  chunks?: number
}

interface QueryResult {
  content: string
  document_id: string
  similarity: number
  metadata?: object
}

interface Workflow {
  workflow_id: string
  name: string
  status: string
}

export class KodeyClient {
  private client: AxiosInstance
  private config: KodeyConfig

  constructor(config: KodeyConfig) {
    this.config = config
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        logger.error('Kodey API Error:', error.response?.data || error.message)
        throw error
      }
    )
  }

  // Agent Management
  async createAgent(request: CreateAgentRequest): Promise<Agent> {
    try {
      const response = await this.client.post<Agent>('/v1/agents', request)
      logger.info(`Kodey agent created: ${response.data.agent_id}`)
      return response.data
    } catch (error) {
      logger.error('Failed to create Kodey agent:', error)
      throw error
    }
  }

  async executeAgent(agentId: string, request: ExecuteAgentRequest): Promise<ExecuteAgentResponse> {
    try {
      const response = await this.client.post<ExecuteAgentResponse>(
        `/v1/agents/${agentId}/execute`,
        request
      )
      return response.data
    } catch (error) {
      logger.error(`Failed to execute agent ${agentId}:`, error)
      throw error
    }
  }

  // Knowledge Base Management
  async createKnowledgeBase(name: string, description?: string): Promise<KnowledgeBase> {
    try {
      const response = await this.client.post<KnowledgeBase>('/v1/knowledge-bases', {
        name,
        description,
        embedding_model: 'openai',
      })
      logger.info(`Knowledge base created: ${response.data.kb_id}`)
      return response.data
    } catch (error) {
      logger.error('Failed to create knowledge base:', error)
      throw error
    }
  }

  async uploadDocument(kbId: string, filePath: string, metadata?: object): Promise<DocumentUploadResponse> {
    try {
      const formData = new FormData()
      formData.append('file', fs.createReadStream(filePath))
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata))
      }

      const response = await this.client.post<DocumentUploadResponse>(
        `/v1/knowledge-bases/${kbId}/documents`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
        }
      )
      logger.info(`Document uploaded to KB ${kbId}: ${response.data.document_id}`)
      return response.data
    } catch (error) {
      logger.error(`Failed to upload document to KB ${kbId}:`, error)
      throw error
    }
  }

  async queryKnowledgeBase(kbId: string, query: string, topK: number = 5): Promise<QueryResult[]> {
    try {
      const response = await this.client.post<{ results: QueryResult[] }>(
        `/v1/knowledge-bases/${kbId}/query`,
        { query, top_k: topK }
      )
      return response.data.results
    } catch (error) {
      logger.error(`Failed to query KB ${kbId}:`, error)
      throw error
    }
  }

  // Workflow Management
  async createWorkflow(name: string, steps: any[]): Promise<Workflow> {
    try {
      const response = await this.client.post<Workflow>('/v1/workflows', {
        name,
        steps,
      })
      logger.info(`Workflow created: ${response.data.workflow_id}`)
      return response.data
    } catch (error) {
      logger.error('Failed to create workflow:', error)
      throw error
    }
  }

  async executeWorkflow(workflowId: string, input: object, webhookUrl?: string): Promise<any> {
    try {
      const response = await this.client.post(`/v1/workflows/${workflowId}/execute`, {
        input,
        webhook_url: webhookUrl,
      })
      return response.data
    } catch (error) {
      logger.error(`Failed to execute workflow ${workflowId}:`, error)
      throw error
    }
  }
}

// Export singleton instance
export const kodeyClient = new KodeyClient({
  apiKey: process.env.KODEY_API_KEY || '',
  baseURL: process.env.KODEY_BASE_URL || 'https://api.kodey.ai',
})

