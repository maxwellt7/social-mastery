import { Request, Response } from 'express'
import prisma from '../utils/prisma.js'
import { kodeyClient } from '../integrations/kodey.client.js'
import { AppError } from '../middleware/errorHandler.js'
import { logger } from '../utils/logger.js'

export async function generateScripts(req: Request, res: Response) {
  const { templateId, offerId, numVariants = 3, angle, variableMappings } = req.body

  if (!templateId || !offerId) {
    throw new AppError('Template ID and Offer ID are required', 400)
  }

  try {
    // Get template and offer profile
    const [template, offerProfile, directorPlaybook] = await Promise.all([
      prisma.template.findUnique({ where: { id: templateId } }),
      prisma.offerProfile.findFirst({ where: { offerId } }),
      prisma.directorPlaybook.findFirst({
        where: { offerId },
        orderBy: { version: 'desc' },
      }),
    ])

    if (!template || !offerProfile || !directorPlaybook) {
      throw new AppError('Template, offer profile, or playbook not found', 404)
    }

    // Get or create script generation agent
    const scriptAgent = await getOrCreateScriptGenerationAgent()

    // Generate scripts
    const scripts = []
    for (let i = 0; i < numVariants; i++) {
      const agentResponse = await kodeyClient.executeAgent(scriptAgent.agent_id, {
        input: {
          template: template.templateText,
          placeholders: template.placeholdersJson,
          variableMappings: variableMappings || {},
          offerProfile: {
            bigIdea: offerProfile.bigIdea,
            mechanism: offerProfile.mechanism,
            avatar: offerProfile.avatarJson,
            voiceAndTone: offerProfile.voiceAndTone,
          },
          directorInstructions: directorPlaybook.instructionsText,
          directorConfig: directorPlaybook.configJson,
          angle: angle || 'pain',
          variant: i + 1,
        },
        context: {
          task: 'generate_script',
          templateId,
          offerId,
        },
      })

      const scriptData = JSON.parse(agentResponse.output as string)

      const script = await prisma.script.create({
        data: {
          templateId,
          offerId,
          scriptText: scriptData.script,
          angle: scriptData.angle,
          hookType: scriptData.hookType,
          targetAvatarSegment: scriptData.targetSegment,
          status: 'draft',
        },
      })

      scripts.push(script)
    }

    res.status(201).json({
      success: true,
      data: scripts,
      message: `Generated ${scripts.length} script variants`,
    })
  } catch (error) {
    logger.error('Error generating scripts:', error)
    throw new AppError('Failed to generate scripts', 500)
  }
}

async function getOrCreateScriptGenerationAgent() {
  const existingAgent = await prisma.aIAgent.findFirst({
    where: { type: 'generation', name: 'Script Generation Agent' },
  })

  if (existingAgent && existingAgent.kodeyAgentId) {
    return { agent_id: existingAgent.kodeyAgentId }
  }

  const agent = await kodeyClient.createAgent({
    name: 'Script Generation Agent',
    type: 'generation',
    instructions: `Generate social media scripts from templates.

Given:
- Template text with placeholders
- Placeholder definitions
- Variable mappings (optional)
- Offer profile
- AI Director instructions and config
- Desired angle (pain, pleasure, objection, contrarian)

Generate a compelling script that:
1. Replaces placeholders with offer-specific content
2. Follows the template structure
3. Matches the voice and tone
4. Emphasizes the specified angle
5. Includes a strong hook and clear CTA

Return JSON:
{
  "script": "full script text",
  "angle": "the angle used",
  "hookType": "question|statement|story|contrarian",
  "targetSegment": "description of who this resonates with"
}`,
    model: 'gpt-4',
    temperature: 0.8,
  })

  await prisma.aIAgent.create({
    data: {
      name: agent.name,
      type: agent.type,
      kodeyAgentId: agent.agent_id,
      instructions: agent.type,
      model: 'gpt-4',
      temperature: 0.8,
      status: 'active',
    },
  })

  return agent
}

export async function listScripts(req: Request, res: Response) {
  const { offerId, templateId, status, angle } = req.query

  const where: any = {}
  if (offerId) where.offerId = offerId
  if (templateId) where.templateId = templateId
  if (status) where.status = status
  if (angle) where.angle = angle

  const scripts = await prisma.script.findMany({
    where,
    include: {
      template: {
        select: {
          id: true,
          structuralDescription: true,
          pillar: true,
        },
      },
      videoAssets: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({
    success: true,
    data: scripts,
  })
}

export async function getScript(req: Request, res: Response) {
  const { id } = req.params

  const script = await prisma.script.findUnique({
    where: { id },
    include: {
      template: true,
      offer: true,
      videoAssets: true,
      campaignScripts: {
        include: {
          campaign: true,
        },
      },
    },
  })

  if (!script) {
    throw new AppError('Script not found', 404)
  }

  res.json({
    success: true,
    data: script,
  })
}

export async function updateScript(req: Request, res: Response) {
  const { id } = req.params
  const { scriptText, angle, hookType, status } = req.body

  const script = await prisma.script.update({
    where: { id },
    data: {
      ...(scriptText && { scriptText }),
      ...(angle && { angle }),
      ...(hookType && { hookType }),
      ...(status && { status }),
    },
  })

  res.json({
    success: true,
    data: script,
    message: 'Script updated successfully',
  })
}

export async function deleteScript(req: Request, res: Response) {
  const { id } = req.params

  await prisma.script.delete({
    where: { id },
  })

  res.json({
    success: true,
    message: 'Script deleted successfully',
  })
}

