import { Queue, Worker } from 'bullmq'
import redis from '../utils/redis.js'
import prisma from '../utils/prisma.js'
import { instagramClient } from '../integrations/instagram.client.js'
import { logger } from '../utils/logger.js'

export const postSchedulerQueue = new Queue('post-scheduler', {
  connection: redis,
})

export const postSchedulerWorker = new Worker(
  'post-scheduler',
  async (job) => {
    const { campaignScriptId } = job.data

    try {
      logger.info(`Publishing scheduled post for campaign script ${campaignScriptId}`)

      // Get campaign script with video
      const campaignScript = await prisma.campaignScript.findUnique({
        where: { id: campaignScriptId },
        include: {
          script: {
            include: {
              videoAsset: true,
            },
          },
          campaign: {
            include: {
              offer: true,
            },
          },
        },
      })

      if (!campaignScript) {
        throw new Error('Campaign script not found')
      }

      if (!campaignScript.script.videoAsset || campaignScript.script.videoAsset.status !== 'completed') {
        throw new Error('No completed video found for script')
      }

      const videoUrl = campaignScript.script.videoAsset.videoUrl
      if (!videoUrl) {
        throw new Error('Video URL not available')
      }

      // Get Instagram user ID (this should be configured per offer/user)
      const igUserId = process.env.INSTAGRAM_USER_ID
      if (!igUserId) {
        throw new Error('Instagram User ID not configured')
      }

      // Create media container
      const containerId = await instagramClient.createMediaContainer(
        igUserId,
        videoUrl,
        campaignScript.caption || campaignScript.script.scriptText,
        true
      )

      // Poll for container status
      let attempts = 0
      const maxAttempts = 30
      let status = 'IN_PROGRESS'

      while (status === 'IN_PROGRESS' && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        status = await instagramClient.getContainerStatus(containerId)
        attempts++
      }

      if (status !== 'FINISHED') {
        throw new Error(`Media container processing failed with status: ${status}`)
      }

      // Publish media
      const mediaId = await instagramClient.publishMedia(igUserId, containerId)

      // Get media details
      const mediaDetails = await instagramClient.getMedia(mediaId, [
        'id',
        'permalink',
        'media_type',
        'timestamp',
      ])

      // Create Instagram post record
      const instagramPost = await prisma.instagramPost.create({
        data: {
          campaignScriptId,
          instagramPostId: mediaId,
          caption: campaignScript.caption || campaignScript.script.scriptText,
          mediaType: mediaDetails.media_type,
          mediaUrl: videoUrl,
          permalink: mediaDetails.permalink,
          timestamp: new Date(mediaDetails.timestamp),
        },
      })

      // Update campaign script status
      await prisma.campaignScript.update({
        where: { id: campaignScriptId },
        data: {
          igPostId: mediaId,
          postedAt: new Date(),
          status: 'posted',
        },
      })

      // Update script status
      await prisma.script.update({
        where: { id: campaignScript.scriptId },
        data: { status: 'posted' },
      })

      logger.info(`Successfully published post ${mediaId} for campaign script ${campaignScriptId}`)

      // Schedule metrics collection for this post
      await metricsCollectorQueue.add(
        'collect-metrics',
        { instagramPostId: instagramPost.id, igPostId: mediaId },
        {
          repeat: {
            pattern: '0 */6 * * *', // Every 6 hours
          },
        }
      )

      return { success: true, mediaId, postId: instagramPost.id }
    } catch (error) {
      logger.error(`Error publishing scheduled post for campaign script ${campaignScriptId}:`, error)

      // Update campaign script with error
      await prisma.campaignScript.update({
        where: { id: campaignScriptId },
        data: {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      })

      throw error
    }
  },
  {
    connection: redis,
    concurrency: 3,
  }
)

// Import metrics collector queue (defined below)
import { metricsCollectorQueue } from './metricsCollector.job.js'

postSchedulerWorker.on('completed', (job) => {
  logger.info(`Post scheduler job ${job.id} completed successfully`)
})

postSchedulerWorker.on('failed', (job, err) => {
  logger.error(`Post scheduler job ${job?.id} failed:`, err)
})

logger.info('Post scheduler worker started')

