import prisma from '../lib/prisma'
import { ApiError } from '../middleware/errorHandler'
import * as kodeyService from './kodeyService'

export async function createFromIGPost(request: any) {
  const { postUrl, caption, transcript, offerId, metrics } = request

  // Use Kodey.ai to analyze the post structure
  const analysis = await kodeyService.analyzeIGPost(caption, transcript)

  const template = await prisma.template.create({
    data: {
      offerId,
      sourcePlatform: 'instagram',
      sourcePostId: extractPostIdFromUrl(postUrl),
      sourcePostUrl: postUrl,
      structuralDescription: analysis.structuralDescription,
      templateText: caption,
      placeholders: analysis.placeholders,
      funnelStage: analysis.funnelStage,
      pillar: analysis.pillar,
    },
  })

  return template
}

export async function getTemplates(offerId?: string) {
  const where: any = {}
  if (offerId) {
    where.offerId = offerId
  }

  return prisma.template.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getTemplate(id: string) {
  const template = await prisma.template.findUnique({
    where: { id },
  })

  if (!template) {
    throw new ApiError(404, 'Template not found')
  }

  return template
}

export async function updateTemplate(id: string, updates: any) {
  return prisma.template.update({
    where: { id },
    data: updates,
  })
}

export async function deleteTemplate(id: string) {
  await prisma.template.delete({
    where: { id },
  })
}

export async function saveVariableMapping(mapping: any) {
  return prisma.variableMapping.create({
    data: mapping,
  })
}

export async function getVariableMappings(templateId: string) {
  return prisma.variableMapping.findMany({
    where: { templateId },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

function extractPostIdFromUrl(url: string): string {
  // Extract Instagram post ID from URL
  const match = url.match(/\/p\/([A-Za-z0-9_-]+)/)
  return match ? match[1] : url
}

