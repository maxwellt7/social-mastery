import prisma from '../lib/prisma'
import { ApiError } from '../middleware/errorHandler'
import * as offerService from './offerService'
import * as kodeyService from './kodeyService'

export async function generateScripts(request: any) {
  const { templateId, offerId, numVariants, angles, variableMappings } = request

  // Get template, profile, and playbook
  const template = await prisma.template.findUnique({ where: { id: templateId } })
  if (!template) {
    throw new ApiError(404, 'Template not found')
  }

  const profile = await offerService.getOfferProfile(offerId)
  const playbook = await offerService.getCurrentPlaybook(offerId)

  // Generate scripts using Kodey.ai
  const scriptVariants = await kodeyService.generateScriptsFromTemplate(
    template,
    profile,
    playbook,
    request
  )

  // Save scripts to database
  const scripts = await Promise.all(
    scriptVariants.map((variant: any) =>
      prisma.script.create({
        data: {
          templateId,
          offerId,
          scriptText: variant.scriptText,
          angle: variant.angle,
          hookType: variant.hookType,
          status: 'draft',
        },
      })
    )
  )

  return scripts
}

export async function getScripts(offerId?: string) {
  const where: any = {}
  if (offerId) {
    where.offerId = offerId
  }

  return prisma.script.findMany({
    where,
    include: {
      template: true,
      videoAsset: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getScript(id: string) {
  const script = await prisma.script.findUnique({
    where: { id },
    include: {
      template: true,
      videoAsset: true,
    },
  })

  if (!script) {
    throw new ApiError(404, 'Script not found')
  }

  return script
}

export async function updateScript(id: string, updates: any) {
  return prisma.script.update({
    where: { id },
    data: updates,
  })
}

export async function getVideoByScript(scriptId: string) {
  return prisma.videoAsset.findUnique({
    where: { scriptId },
  })
}

