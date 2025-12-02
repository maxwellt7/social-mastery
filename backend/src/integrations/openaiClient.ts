import OpenAI from 'openai'

class OpenAIClient {
  private client: OpenAI

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async chat(messages: Array<{ role: string; content: string }>, options?: {
    model?: string
    temperature?: number
    maxTokens?: number
  }) {
    const completion = await this.client.chat.completions.create({
      model: options?.model || 'gpt-4-turbo-preview',
      messages: messages as any,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens,
    })

    return completion.choices[0].message.content
  }

  async createEmbedding(text: string, model: string = 'text-embedding-3-small') {
    const response = await this.client.embeddings.create({
      model,
      input: text,
    })

    return response.data[0].embedding
  }

  async createEmbeddings(texts: string[], model: string = 'text-embedding-3-small') {
    const response = await this.client.embeddings.create({
      model,
      input: texts,
    })

    return response.data.map(item => item.embedding)
  }

  async analyzeImage(imageUrl: string, prompt: string) {
    const completion = await this.client.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } },
          ] as any,
        },
      ],
      max_tokens: 1000,
    })

    return completion.choices[0].message.content
  }

  async transcribeAudio(audioFile: Buffer, filename: string) {
    const transcription = await this.client.audio.transcriptions.create({
      file: new File([audioFile], filename),
      model: 'whisper-1',
    })

    return transcription.text
  }
}

export default new OpenAIClient()

