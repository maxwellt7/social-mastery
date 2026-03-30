import prisma from '../lib/prisma'
import { ApiError } from '../middleware/errorHandler'

export async function createCampaign(request: any) {
  const { name, offerId, objective, scriptIds } = request

  const campaign = await prisma.campaign.create({
    data: {
      name,
      offerId,
      objective,
      status: 'draft',
    },
  })

  // Associate scripts with campaign
  await Promise.all(
    scriptIds.map((scriptId: string) =>
      prisma.campaignScript.create({
        data: {
          campaignId: campaign.id,
          scriptId,
          status: 'pending',
        },
      })
    )
  )

  return getCampaign(campaign.id)
}

export async function getCampaigns(offerId?: string) {
  const where: any = {}
  if (offerId) {
    where.offerId = offerId
  }

  return prisma.campaign.findMany({
    where,
    include: {
      campaignScripts: {
        include: {
          script: {
            include: {
              videoAsset: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getCampaign(id: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      campaignScripts: {
        include: {
          script: {
            include: {
              videoAsset: true,
            },
          },
        },
      },
    },
  })

  if (!campaign) {
    throw new ApiError(404, 'Campaign not found')
  }

  return campaign
}

export async function updateCampaign(id: string, updates: any) {
  return prisma.campaign.update({
    where: { id },
    data: updates,
  })
}

