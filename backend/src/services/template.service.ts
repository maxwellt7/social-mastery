import { Request, Response } from 'express'
import prisma from '../utils/prisma.js'
import { kodeyClient } from '../integrations/kodey.client.js'
import { AppError } from '../middleware/errorHandler.js'
import { logger } from '../utils/logger.js'

export async function createFromIGPost(req: Request, res: Response) {
  const { offerId, postUrl, caption, transcript, metrics } = req.body

  if (!offerId || !postUrl || (!caption && !transcript)) {
    throw new AppError('Missing required fields', 400)
  }

  try {
    // Get or create template analysis agent
    const analysisAgent = await getOrCreateTemplateAnalysisAgent()

    // Analyze the post to extract structure
    const content = transcript || caption
    const agentResponse = await kodeyClient.executeAgent(analysisAgent.agent_id, {
      input: {
        content,
        metrics,
        platform: 'instagram',
      },
      context: {
        task: 'convert_to_template',
      },
    })

    const templateData = JSON.parse(agentResponse.output as string)

    // Create template in database
    const template = await prisma.template.create({
      data: {
        offerId,
        sourcePlatform: 'instagram',
        sourcePostUrl: postUrl,
        structuralDescription: templateData.structuralDescription,
        templateText: templateData.templateText,
        placeholdersJson: templateData.placeholders,
        funnelStage: templateData.funnelStage,
        pillar: templateData.pillar,
        performanceTag: 'test',
      },
    })

    res.status(201).json({
      success: true,
      data: template,
      message: 'Template created successfully from Instagram post',
    })
  } catch (error) {
    logger.error('Error creating template from IG post:', error)
    throw new AppError('Failed to create template', 500)
  }
}

async function getOrCreateTemplateAnalysisAgent() {
  const existingAgent = await prisma.aIAgent.findFirst({
    where: { type: 'analysis', name: 'Template Analysis Agent' },
  })

  if (existingAgent && existingAgent.kodeyAgentId) {
    return { agent_id: existingAgent.kodeyAgentId }
  }

  const agent = await kodeyClient.createAgent({
    name: 'Template Analysis Agent',
    type: 'analysis',
    instructions: `Analyze social media content and convert it into a reusable template.

Extract:
1. Structural Description: Describe the content structure (e.g., "3-act story with pattern interrupt hook")
2. Template Text: Replace specific details with placeholders like {PROBLEM}, {MECHANISM}, {RESULT}, {PROOF}, etc.
3. Placeholders: List all placeholders with their purpose
4. Funnel Stage: Classify as "cold", "warm", or "hot"
5. Pillar: Classify content type (proof, problem, mechanism, lifestyle, transformation, etc.)

Return JSON:
{
  "structuralDescription": "string",
  "templateText": "string with {PLACEHOLDERS}",
  "placeholders": [
    {"name": "PROBLEM", "description": "The pain point to address", "example": "..."},
    {"name": "MECHANISM", "description": "The unique solution", "example": "..."}
  ],
  "funnelStage": "cold|warm|hot",
  "pillar": "string"
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

export async function listTemplates(req: Request, res: Response) {
  const { offerId, funnelStage, pillar, performanceTag } = req.query

  const where: any = {}
  if (offerId) where.offerId = offerId
  if (funnelStage) where.funnelStage = funnelStage
  if (pillar) where.pillar = pillar
  if (performanceTag) where.performanceTag = performanceTag

  const templates = await prisma.template.findMany({
    where,
    include: {
      offer: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          scripts: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({
    success: true,
    data: templates,
  })
}

export async function getTemplate(req: Request, res: Response) {
  const { id } = req.params

  const template = await prisma.template.findUnique({
    where: { id },
    include: {
      offer: true,
      scripts: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!template) {
    throw new AppError('Template not found', 404)
  }

  res.json({
    success: true,
    data: template,
  })
}

export async function updateTemplate(req: Request, res: Response) {
  const { id } = req.params
  const { templateText, placeholdersJson, funnelStage, pillar, performanceTag } = req.body

  const template = await prisma.template.update({
    where: { id },
    data: {
      ...(templateText && { templateText }),
      ...(placeholdersJson && { placeholdersJson }),
      ...(funnelStage && { funnelStage }),
      ...(pillar && { pillar }),
      ...(performanceTag && { performanceTag }),
    },
  })

  res.json({
    success: true,
    data: template,
    message: 'Template updated successfully',
  })
}

export async function deleteTemplate(req: Request, res: Response) {
  const { id } = req.params

  await prisma.template.delete({
    where: { id },
  })

  res.json({
    success: true,
    message: 'Template deleted successfully',
  })
}

