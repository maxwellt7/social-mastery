import { Queue, Worker } from 'bullmq'
import redis from '../utils/redis.js'
import prisma from '../utils/prisma.js'
import { creatifyClient } from '../integrations/creatify.client.js'
import { logger } from '../utils/logger.js'

export const videoGenerationQueue = new Queue('video-generation', {
  connection: redis,
})

export const videoGenerationWorker = new Worker(
  'video-generation',
  async (job) => {
    const { videoAssetId, creatifyJobId } = job.data

    try {
      logger.info(`Polling video status for job ${creatifyJobId}`)

      // Get status from Creatify
      const status = await creatifyClient.getVideoStatus(creatifyJobId)

      // Update database
      await prisma.videoAsset.update({
        where: { id: videoAssetId },
        data: {
          status: status.status,
          videoUrl: status.video_url,
          thumbnailUrl: status.thumbnail_url,
          duration: status.video_url ? undefined : null,
          errorMessage: status.error,
        },
      })

      if (status.status === 'completed') {
        logger.info(`Video generation completed for job ${creatifyJobId}`)

        // Update script status
        const videoAsset = await prisma.videoAsset.findUnique({
          where: { id: videoAssetId },
        })

        if (videoAsset) {
          await prisma.script.update({
            where: { id: videoAsset.scriptId },
            data: { status: 'video_ready' },
          })
        }

        return { success: true, status: 'completed' }
      } else if (status.status === 'failed') {
        logger.error(`Video generation failed for job ${creatifyJobId}: ${status.error}`)
        return { success: false, status: 'failed', error: status.error }
      } else {
        // Still processing, retry
        throw new Error('Video still processing')
      }
    } catch (error) {
      logger.error(`Error polling video status for job ${creatifyJobId}:`, error)
      throw error
    }
  },
  {
    connection: redis,
    concurrency: 5,
  }
)

videoGenerationWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed successfully`)
})

videoGenerationWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed:`, err)
})

logger.info('Video generation worker started')

