import { Request, Response } from 'express'
import { instagramClient } from '../integrations/instagram.client.js'
import { AppError } from '../middleware/errorHandler.js'
import { logger } from '../utils/logger.js'
import prisma from '../utils/prisma.js'

export async function searchHighPerformers(req: Request, res: Response) {
  const { hashtags, minLikes, minSaves, limit = 25, igUserId } = req.body

  if (!hashtags || !Array.isArray(hashtags) || hashtags.length === 0) {
    throw new AppError('Hashtags are required', 400)
  }

  if (!igUserId) {
    throw new AppError('Instagram User ID is required', 400)
  }

  try {
    const results: any[] = []

    for (const hashtag of hashtags) {
      // Search for hashtag
      const hashtagId = await instagramClient.searchHashtag(igUserId, hashtag)
      
      if (!hashtagId) {
        logger.warn(`Hashtag not found: ${hashtag}`)
        continue
      }

      // Get recent media for hashtag
      const media = await instagramClient.getHashtagRecentMedia(hashtagId, igUserId, limit)

      // Filter by performance metrics
      const filtered = media.filter((item) => {
        const likes = item.like_count || 0
        return likes >= (minLikes || 0)
      })

      results.push(...filtered)
    }

    // Sort by engagement
    results.sort((a, b) => {
      const engagementA = (a.like_count || 0) + (a.comments_count || 0)
      const engagementB = (b.like_count || 0) + (b.comments_count || 0)
      return engagementB - engagementA
    })

    res.json({
      success: true,
      data: results.slice(0, limit),
      count: results.length,
    })
  } catch (error) {
    logger.error('Error searching high performers:', error)
    throw new AppError('Failed to search Instagram content', 500)
  }
}

export async function publishPost(req: Request, res: Response) {
  const { igUserId, videoUrl, caption, shareToFeed = true } = req.body

  if (!igUserId || !videoUrl || !caption) {
    throw new AppError('Missing required fields', 400)
  }

  try {
    // Create media container
    const containerId = await instagramClient.createMediaContainer(
      igUserId,
      videoUrl,
      caption,
      shareToFeed
    )

    // Poll for container status
    let attempts = 0
    const maxAttempts = 30
    let status = 'IN_PROGRESS'

    while (status === 'IN_PROGRESS' && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds
      status = await instagramClient.getContainerStatus(containerId)
      attempts++
    }

    if (status !== 'FINISHED') {
      throw new AppError(`Media container processing failed with status: ${status}`, 500)
    }

    // Publish media
    const mediaId = await instagramClient.publishMedia(igUserId, containerId)

    res.json({
      success: true,
      data: {
        mediaId,
        containerId,
        status: 'published',
      },
      message: 'Post published successfully to Instagram',
    })
  } catch (error) {
    logger.error('Error publishing to Instagram:', error)
    throw new AppError('Failed to publish post', 500)
  }
}

export async function getPostMetrics(req: Request, res: Response) {
  const { id: mediaId } = req.params

  try {
    const metrics = [
      'impressions',
      'reach',
      'likes',
      'comments',
      'saves',
      'shares',
      'plays',
      'total_interactions',
    ]

    const insights = await instagramClient.getMediaInsights(mediaId, metrics)

    // Transform insights into a more usable format
    const metricsData: any = {}
    insights.data.forEach((insight) => {
      metricsData[insight.name] = insight.values[0]?.value || 0
    })

    res.json({
      success: true,
      data: metricsData,
    })
  } catch (error) {
    logger.error(`Error fetching metrics for media ${mediaId}:`, error)
    throw new AppError('Failed to fetch post metrics', 500)
  }
}

