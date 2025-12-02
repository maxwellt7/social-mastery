import OpenAI from 'openai'
import { logger } from '../utils/logger.js'

export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openaiClient.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    })
    return response.data[0].embedding
  } catch (error) {
    logger.error('Failed to generate embedding:', error)
    throw error
  }
}

export async function generateCompletion(
  prompt: string,
  systemPrompt?: string,
  temperature: number = 0.7,
  maxTokens: number = 2000
): Promise<string> {
  try {
    const messages: any[] = []
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }
    messages.push({ role: 'user', content: prompt })

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature,
      max_tokens: maxTokens,
    })

    return response.choices[0].message.content || ''
  } catch (error) {
    logger.error('Failed to generate completion:', error)
    throw error
  }
}

export async function generateStructuredOutput(
  prompt: string,
  systemPrompt: string,
  responseFormat: any
): Promise<any> {
  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const content = response.choices[0].message.content || '{}'
    return JSON.parse(content)
  } catch (error) {
    logger.error('Failed to generate structured output:', error)
    throw error
  }
}

