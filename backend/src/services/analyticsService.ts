import prisma from '../lib/prisma'
import { ApiError } from '../middleware/errorHandler'
import * as kodeyService from './kodeyService'

export async function getSummary(request: any) {
  const { offerId, dateFrom, dateTo } = request

  if (!offerId) {
    throw new ApiError(400, 'offerId is required')
  }

  // Get all posts for the offer
  const posts = await prisma.instagramPost.findMany({
    where: {
      campaignScript: {
        campaign: {
          offerId,
        },
      },
      ...(dateFrom || dateTo ? {
        timestamp: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      } : {}),
    },
    include: {
      performanceMetrics: {
        orderBy: {
          timestamp: 'desc',
        },
        take: 1,
      },
      campaignScript: {
        include: {
          script: {
            include: {
              template: true,
            },
          },
        },
      },
    },
  })

  // Aggregate metrics
  const totalReach = posts.reduce((sum: number, post: any) => {
    const metrics = post.performanceMetrics[0]?.metrics as any
    return sum + (metrics?.reach || 0)
  }, 0)

  const totalEngagement = posts.reduce((sum: number, post: any) => {
    const metrics = post.performanceMetrics[0]?.metrics as any
    return sum + (metrics?.engagement || 0)
  }, 0)

  const avgEngagementRate = totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0

  return {
    offerId,
    dateFrom: dateFrom || null,
    dateTo: dateTo || null,
    totalPosts: posts.length,
    totalReach,
    totalEngagement,
    avgEngagementRate,
    topPerformers: [],
    byTemplate: [],
    byAngle: [],
    byHookType: [],
  }
}

export async function getInsights(offerId: string) {
  if (!offerId) {
    throw new ApiError(400, 'offerId is required')
  }

  // Get performance data
  const summary = await getSummary({ offerId })

  // Use Kodey.ai to generate insights
  const insights = await kodeyService.generateInsights(offerId, summary)

  return insights
}

export async function refreshMetrics(offerId: string) {
  // Trigger job to refresh metrics for all posts in this offer
  // This would be implemented with a background job
  return { success: true }
}

