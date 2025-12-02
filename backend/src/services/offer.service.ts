import { Request, Response } from 'express'
import prisma from '../utils/prisma.js'
import { kodeyClient } from '../integrations/kodey.client.js'
import { generateEmbedding, generateStructuredOutput } from '../integrations/openai.client.js'
import { AppError } from '../middleware/errorHandler.js'
import { logger } from '../utils/logger.js'
import pdfParse from 'pdf-parse'
import fs from 'fs'
import path from 'path'

interface OfferProfileData {
  bigIdea: string
  mechanism: string
  avatar: {
    demographics: string
    psychographics: string
    painPoints: string[]
    desires: string[]
  }
  voiceAndTone: string
  constraints: string
  summary: string
}

export async function uploadPdf(req: Request, res: Response) {
  if (!req.file) {
    throw new AppError('No PDF file uploaded', 400)
  }

  const { name } = req.body
  if (!name) {
    throw new AppError('Offer name is required', 400)
  }

  try {
    // Create offer record
    const offer = await prisma.offer.create({
      data: {
        name,
        pdfUrl: req.file.path,
        status: 'processing',
      },
    })

    // Process PDF asynchronously
    processPdfAsync(offer.id, req.file.path)

    res.status(202).json({
      success: true,
      data: {
        offerId: offer.id,
        status: 'processing',
        message: 'PDF uploaded successfully. Processing in background.',
      },
    })
  } catch (error) {
    logger.error('Error uploading PDF:', error)
    throw new AppError('Failed to upload PDF', 500)
  }
}

async function processPdfAsync(offerId: string, pdfPath: string) {
  try {
    logger.info(`Processing PDF for offer ${offerId}`)

    // Extract text from PDF
    const dataBuffer = fs.readFileSync(pdfPath)
    const pdfData = await pdfParse(dataBuffer)
    const extractedText = pdfData.text

    logger.info(`Extracted ${extractedText.length} characters from PDF`)

    // Create knowledge base in Kodey.ai
    const kb = await kodeyClient.createKnowledgeBase(
      `Offer_${offerId}`,
      'Knowledge base for offer document'
    )

    // Upload PDF to Kodey.ai knowledge base
    await kodeyClient.uploadDocument(kb.kb_id, pdfPath, {
      offerId,
      type: 'offer_document',
    })

    // Create or get extraction agent
    let extractionAgent = await getOrCreateExtractionAgent(kb.kb_id)

    // Execute agent to extract offer profile
    const agentResponse = await kodeyClient.executeAgent(extractionAgent.agent_id, {
      input: extractedText,
      context: {
        task: 'extract_offer_profile',
        offerId,
      },
    })

    // Parse structured output
    const profileData = parseOfferProfile(agentResponse.output as string)

    // Generate embedding for offer profile
    const embedding = await generateEmbedding(profileData.summary)

    // Save offer profile to database
    await prisma.offerProfile.create({
      data: {
        offerId,
        bigIdea: profileData.bigIdea,
        mechanism: profileData.mechanism,
        avatarJson: profileData.avatar,
        voiceAndTone: profileData.voiceAndTone,
        constraints: profileData.constraints,
        summaryText: profileData.summary,
        embedding: `[${embedding.join(',')}]`, // Store as pgvector format
      },
    })

    // Create initial Director Playbook
    await prisma.directorPlaybook.create({
      data: {
        offerId,
        version: 1,
        instructionsText: generateInitialDirectorInstructions(profileData),
        configJson: {
          hookWeights: {
            question: 1.0,
            statement: 1.0,
            story: 1.0,
            contrarian: 1.0,
          },
          angleWeights: {
            pain: 1.0,
            pleasure: 1.0,
            objection: 1.0,
            mechanism: 1.0,
          },
        },
      },
    })

    // Update offer status
    await prisma.offer.update({
      where: { id: offerId },
      data: { status: 'ready' },
    })

    logger.info(`Successfully processed PDF for offer ${offerId}`)
  } catch (error) {
    logger.error(`Error processing PDF for offer ${offerId}:`, error)
    await prisma.offer.update({
      where: { id: offerId },
      data: { status: 'error' },
    })
  }
}

async function getOrCreateExtractionAgent(kbId: string) {
  // Check if extraction agent exists
  const existingAgent = await prisma.aIAgent.findFirst({
    where: { type: 'extraction', name: 'Offer Extraction Agent' },
  })

  if (existingAgent && existingAgent.kodeyAgentId) {
    return { agent_id: existingAgent.kodeyAgentId }
  }

  // Create new extraction agent
  const agent = await kodeyClient.createAgent({
    name: 'Offer Extraction Agent',
    type: 'extraction',
    instructions: `You are an expert marketing analyst. Extract the following from offer documents:
    
1. Big Idea: The core transformational promise
2. Mechanism: The unique method/system that delivers the transformation
3. Avatar: Detailed target customer profile including demographics, psychographics, pain points, and desires
4. Voice & Tone: The communication style (professional, casual, authoritative, friendly, etc.)
5. Constraints: Any limitations, regulations, or boundaries to respect
6. Summary: A comprehensive summary of the offer

Return the output as a structured JSON object with these fields:
{
  "bigIdea": "string",
  "mechanism": "string", 
  "avatar": {
    "demographics": "string",
    "psychographics": "string",
    "painPoints": ["string"],
    "desires": ["string"]
  },
  "voiceAndTone": "string",
  "constraints": "string",
  "summary": "string"
}`,
    knowledge_base_ids: [kbId],
    model: 'gpt-4',
    temperature: 0.7,
  })

  // Save to database
  await prisma.aIAgent.create({
    data: {
      name: agent.name,
      type: agent.type,
      kodeyAgentId: agent.agent_id,
      instructions: agent.type,
      model: 'gpt-4',
      temperature: 0.7,
      status: 'active',
    },
  })

  return agent
}

function parseOfferProfile(output: string): OfferProfileData {
  try {
    if (typeof output === 'string') {
      return JSON.parse(output)
    }
    return output as OfferProfileData
  } catch (error) {
    logger.error('Failed to parse offer profile:', error)
    throw new AppError('Failed to parse offer profile data', 500)
  }
}

function generateInitialDirectorInstructions(profile: OfferProfileData): string {
  return `# AI Marketing Director Instructions

## Offer Overview
${profile.summary}

## Big Idea
${profile.bigIdea}

## Mechanism
${profile.mechanism}

## Target Avatar
**Demographics:** ${profile.avatar.demographics}
**Psychographics:** ${profile.avatar.psychographics}

**Pain Points:**
${profile.avatar.painPoints.map(p => `- ${p}`).join('\n')}

**Desires:**
${profile.avatar.desires.map(d => `- ${d}`).join('\n')}

## Voice & Tone
${profile.voiceAndTone}

## Constraints
${profile.constraints}

## Content Generation Rules
1. Always align with the big idea and mechanism
2. Speak directly to the avatar's pain points and desires
3. Maintain the specified voice and tone
4. Respect all constraints
5. Focus on transformation and results
6. Use storytelling and social proof when appropriate
7. Create pattern interrupts to capture attention
8. End with clear, compelling calls to action
`
}

export async function getOffer(req: Request, res: Response) {
  const { id } = req.params

  const offer = await prisma.offer.findUnique({
    where: { id },
    include: {
      profile: true,
      playbooks: {
        orderBy: { version: 'desc' },
        take: 1,
      },
    },
  })

  if (!offer) {
    throw new AppError('Offer not found', 404)
  }

  res.json({
    success: true,
    data: offer,
  })
}

export async function getOfferProfile(req: Request, res: Response) {
  const { id } = req.params

  const profile = await prisma.offerProfile.findFirst({
    where: { offerId: id },
    include: {
      offer: true,
    },
  })

  if (!profile) {
    throw new AppError('Offer profile not found', 404)
  }

  res.json({
    success: true,
    data: profile,
  })
}

export async function updateAIDirector(req: Request, res: Response) {
  const { id } = req.params
  const { performanceData, insights } = req.body

  // Get current playbook
  const currentPlaybook = await prisma.directorPlaybook.findFirst({
    where: { offerId: id },
    orderBy: { version: 'desc' },
  })

  if (!currentPlaybook) {
    throw new AppError('No playbook found for this offer', 404)
  }

  // Use Kodey.ai to generate updated instructions based on performance
  const insightsAgent = await getOrCreateInsightsAgent()
  const agentResponse = await kodeyClient.executeAgent(insightsAgent.agent_id, {
    input: {
      currentInstructions: currentPlaybook.instructionsText,
      currentConfig: currentPlaybook.configJson,
      performanceData,
      insights,
    },
    context: {
      task: 'update_director_playbook',
    },
  })

  const updatedPlaybook = JSON.parse(agentResponse.output as string)

  // Create new playbook version
  const newPlaybook = await prisma.directorPlaybook.create({
    data: {
      offerId: id,
      version: currentPlaybook.version + 1,
      instructionsText: updatedPlaybook.instructions,
      configJson: updatedPlaybook.config,
    },
  })

  res.json({
    success: true,
    data: newPlaybook,
    message: 'AI Director updated successfully',
  })
}

async function getOrCreateInsightsAgent() {
  const existingAgent = await prisma.aIAgent.findFirst({
    where: { type: 'insights', name: 'Performance Insights Agent' },
  })

  if (existingAgent && existingAgent.kodeyAgentId) {
    return { agent_id: existingAgent.kodeyAgentId }
  }

  const agent = await kodeyClient.createAgent({
    name: 'Performance Insights Agent',
    type: 'insights',
    instructions: `Analyze content performance data and update the AI Marketing Director's playbook.
    
Given current instructions, config, performance data, and insights, generate:
1. Updated instructions that emphasize winning patterns
2. Updated config with adjusted weights for hooks and angles based on performance

Return as JSON:
{
  "instructions": "updated instructions text",
  "config": {
    "hookWeights": {},
    "angleWeights": {}
  }
}`,
    model: 'gpt-4',
    temperature: 0.7,
  })

  await prisma.aIAgent.create({
    data: {
      name: agent.name,
      type: agent.type,
      kodeyAgentId: agent.agent_id,
      instructions: agent.type,
      model: 'gpt-4',
      temperature: 0.7,
      status: 'active',
    },
  })

  return agent
}

export async function listOffers(req: Request, res: Response) {
  const offers = await prisma.offer.findMany({
    include: {
      profile: true,
      _count: {
        select: {
          templates: true,
          scripts: true,
          campaigns: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({
    success: true,
    data: offers,
  })
}

