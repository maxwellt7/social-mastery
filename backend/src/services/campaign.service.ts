import { Request, Response } from 'express'
import prisma from '../utils/prisma.js'
import { ApiError } from '../middleware/errorHandler.js'
import { logger } from '../utils/logger.js'
import { postSchedulerQueue } from '../jobs/postScheduler.job.js'

export async function createCampaign(req: Request, res: Response) {
  const { offerId, name, objective, scriptIds } = req.body

  if (!offerId || !name || !scriptIds || !Array.isArray(scriptIds)) {
    throw new ApiError('Missing required fields', 400)
  }

  try {
    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        offerId,
        name,
        objective,
        status: 'draft',
      },
    })

    // Add scripts to campaign
    const campaignScripts = await Promise.all(
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

    res.status(201).json({
      success: true,
      data: {
        campaign,
        scripts: campaignScripts,
      },
      message: 'Campaign created successfully',
    })
  } catch (error) {
    logger.error('Error creating campaign:', error)
    throw new ApiError('Failed to create campaign', 500)
  }
}

export async function listCampaigns(req: Request, res: Response) {
  const { offerId, status } = req.query

  const where: any = {}
  if (offerId) where.offerId = offerId
  if (status) where.status = status

  const campaigns = await prisma.campaign.findMany({
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
          campaignScripts: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({
    success: true,
    data: campaigns,
  })
}

export async function getCampaign(req: Request, res: Response) {
  const { id } = req.params

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      offer: true,
      campaignScripts: {
        include: {
          script: {
            include: {
              videoAssets: true,
            },
          },
          posts: true,
        },
      },
    },
  })

  if (!campaign) {
    throw new ApiError('Campaign not found', 404)
  }

  res.json({
    success: true,
    data: campaign,
  })
}

export async function updateCampaign(req: Request, res: Response) {
  const { id } = req.params
  const { name, objective, status, scheduleScripts } = req.body

  try {
    // Update campaign
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(objective && { objective }),
        ...(status && { status }),
      },
    })

    // If scheduling scripts, update campaign scripts with scheduled times
    if (scheduleScripts && Array.isArray(scheduleScripts)) {
      await Promise.all(
        scheduleScripts.map((item: any) =>
          prisma.campaignScript.update({
            where: { id: item.campaignScriptId },
            data: {
              scheduledTime: new Date(item.scheduledTime),
              caption: item.caption,
              hashtags: item.hashtags || [],
              status: 'scheduled',
            },
          })
        )
      )

      // Add jobs to scheduler queue
      await Promise.all(
        scheduleScripts.map((item: any) =>
          postSchedulerQueue.add(
            'schedule-post',
            {
              campaignScriptId: item.campaignScriptId,
            },
            {
              delay: new Date(item.scheduledTime).getTime() - Date.now(),
            }
          )
        )
      )
    }

    res.json({
      success: true,
      data: campaign,
      message: 'Campaign updated successfully',
    })
  } catch (error) {
    logger.error('Error updating campaign:', error)
    throw new ApiError('Failed to update campaign', 500)
  }
}

export async function deleteCampaign(req: Request, res: Response) {
  const { id } = req.params

  await prisma.campaign.delete({
    where: { id },
  })

  res.json({
    success: true,
    message: 'Campaign deleted successfully',
  })
}

